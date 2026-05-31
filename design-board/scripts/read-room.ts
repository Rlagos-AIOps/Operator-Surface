/**
 * Headless tldraw sync reader — connects to the live team room through the
 * tldraw SDK (`@tldraw/sync-core` `TLSyncClient` + `ClientWebSocketAdapter`),
 * waits for the initial snapshot, prints a structured summary of the canvas,
 * then exits. SDK-native, no browser / no Interceptor.
 *
 * Dev utility — not wired into the build.
 *
 *   bun scripts/read-room.ts [roomId] [wssBase]
 *   bun scripts/read-room.ts operator-surface-room wss://operator-surface-board.akhaus.workers.dev
 */
import { TLSyncClient, ClientWebSocketAdapter } from '@tldraw/sync-core'
import { createTLSchema, defaultShapeSchemas } from '@tldraw/tlschema'
import { Store } from '@tldraw/store'
import { atom } from '@tldraw/state'

// Headless shims — ClientWebSocketAdapter's ReconnectManager listens to
// window 'online'/'offline' and document 'visibilitychange'. Provide inert
// browser globals so the SDK runs under bun without a DOM.
const g: any = globalThis
if (typeof g.window === 'undefined') {
	g.window = Object.assign(new EventTarget(), { navigator: { onLine: true }, devicePixelRatio: 1 })
}
if (typeof g.devicePixelRatio === 'undefined') g.devicePixelRatio = 1
if (typeof g.document === 'undefined') {
	g.document = Object.assign(new EventTarget(), { visibilityState: 'visible', hidden: false })
}
if (typeof g.navigator === 'undefined') g.navigator = { onLine: true }
if (typeof g.requestAnimationFrame === 'undefined') {
	g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(Date.now()), 16) as unknown as number
	g.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as ReturnType<typeof setTimeout>)
}
g.window.requestAnimationFrame ??= g.requestAnimationFrame
g.window.cancelAnimationFrame ??= g.cancelAnimationFrame

const ROOM = process.argv[2] || 'operator-surface-room'
const BASE = process.argv[3] || 'wss://operator-surface-board.akhaus.workers.dev'
// The worker's handleConnect requires ?sessionId=; useSync appends it, the raw
// ClientWebSocketAdapter does not — so we add it ourselves.
const SESSION = `reader-${Date.now()}`
const URI = `${BASE}/api/connect/${ROOM}?sessionId=${SESSION}`

// Same schema the server (TldrawDurableObject) uses — default shapes only.
const schema = createTLSchema({ shapes: { ...defaultShapeSchemas } })

const store = new Store<any>({
	schema,
	props: {
		defaultName: 'reader',
		assets: { upload: async () => ({ src: '' }), resolve: (a: any) => a?.props?.src ?? null },
		onMount: () => () => {},
	},
})

// Walk tldraw richText (ProseMirror-ish JSON) into plain text.
function plain(rt: any): string {
	if (!rt) return ''
	let out = ''
	const walk = (n: any) => {
		if (!n) return
		if (typeof n.text === 'string') out += n.text
		if (Array.isArray(n.content)) {
			n.content.forEach(walk)
			if (n.type === 'paragraph') out += '\n'
		}
	}
	walk(rt)
	return out.replace(/\n{2,}/g, '\n').trim()
}

function dump() {
	const recs: any[] = store.allRecords()
	const shapes = recs.filter((r) => r.typeName === 'shape')
	const assets = new Map(recs.filter((r) => r.typeName === 'asset').map((a) => [a.id, a]))
	const byId = new Map(shapes.map((s) => [s.id, s]))
	const frameLabel = (pid: string) => {
		const f: any = byId.get(pid)
		if (f?.type === 'frame') return `"${f.props.name}"`
		return typeof pid === 'string' && pid.startsWith('page:') ? '(page)' : String(pid)
	}

	console.log(`\n=== ROOM ${ROOM} — ${recs.length} records, ${shapes.length} shapes ===\n`)

	const frames = shapes.filter((s) => s.type === 'frame').sort((a, b) => a.x - b.x)
	console.log(`FRAMES (${frames.length}):`)
	for (const f of frames)
		console.log(`  [${f.id}] "${f.props.name}"  @(${Math.round(f.x)},${Math.round(f.y)})  ${Math.round(f.props.w)}x${Math.round(f.props.h)}`)

	console.log(`\nSHAPES BY PARENT (type @pos — content):`)
	for (const s of shapes.sort((a, b) => (a.parentId + '').localeCompare(b.parentId + '') || a.y - b.y)) {
		if (s.type === 'frame') continue
		let content = ''
		if (s.props?.richText) content = plain(s.props.richText)
		else if (typeof s.props?.text === 'string') content = s.props.text
		else if (s.type === 'image' && s.props?.assetId) {
			const a: any = assets.get(s.props.assetId)
			content = `[image ${a?.props?.name || s.props.assetId}]`
		} else if (s.type === 'geo') content = `[geo ${s.props?.geo}]`
		content = content.replace(/\n/g, ' / ').slice(0, 160)
		console.log(`  ${frameLabel(s.parentId)} · ${s.type} @(${Math.round(s.x)},${Math.round(s.y)})${content ? ` — ${content}` : ''}`)
	}
	console.log(`\n=== end ===`)
}

let done = false
const finish = (code: number) => {
	if (done) return
	done = true
	setTimeout(() => process.exit(code), 50)
}

console.error(`[connecting] ${URI}`)
// eslint-disable-next-line no-new
new TLSyncClient({
	store,
	socket: new ClientWebSocketAdapter(() => URI),
	presence: atom('presence', null),
	onLoad: () => {
		console.error('[loaded]')
		dump()
		finish(0)
	},
	onSyncError: (reason: any) => {
		console.error('[sync error]', reason)
		finish(1)
	},
	onAfterConnect: (_c: any, info: any) => {
		console.error('[connected] readonly =', info?.isReadonly)
	},
})

setTimeout(() => {
	console.error('[timeout 25s — never loaded]')
	finish(2)
}, 25000)
