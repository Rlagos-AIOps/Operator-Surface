import { type Editor, createShapeId, toRichText } from 'tldraw'

// Seeds the AI Ops OS design board with three working sections the first time
// the canvas is empty. Agents and the team build from this structure.
// Uses tldraw's fixed palette (this is an ideation board, not pixel-brand).

type NoteColor = 'green' | 'yellow' | 'blue' | 'grey'

interface Card {
	title: string
	body: string
}

const FRAME_W = 920
const FRAME_H = 1560
const FRAME_GAP = 140
const NOTE_W = 264
const COL_GAP = 24
const ROW_H = 250
const PAD_X = 40
const HEADER_Y = 28
const FIRST_ROW_Y = 120

const SHIPPED: Card[] = [
	{ title: 'Sidebar', body: 'Nav rail + agent status → routes, runtime status' },
	{ title: 'Top bar', body: 'Search · filter · agent-live → search, filter state' },
	{ title: 'Metric card', body: 'Pipeline / ROI / response → telemetry' },
	{ title: 'Lead queue', body: 'Triaged leads + intent chips → triage agent feed' },
	{ title: 'Intent chip', body: 'HIGH / MID / COLD score → agent intent score' },
	{ title: 'Speech bubbles', body: 'Human / agent / reasoning → thread + reasoning' },
	{ title: 'Thread view', body: 'Conversation + stage → thread store' },
	{ title: 'Composer', body: 'Draft + approve / revise / reject → send-reply + audit log' },
	{ title: 'Tokens', body: 'Color / type / radii / shadow → @theme (single source)' },
]

const MOOD: Card[] = [
	{ title: 'mode.com', body: 'Retro-modern, close-to-the-metal reference' },
	{ title: 'Drop inspo', body: 'Editorial dashboards, data-dense operator UIs' },
	{ title: 'Drop inspo', body: 'Agent / approval UX patterns' },
	{ title: 'Mockup', body: 'Sketch a new screen here for the team' },
]

const BUILD: Card[] = [
	{ title: 'Daily brief', body: 'TO DESIGN → agent drops draft here' },
	{ title: 'Decision trace', body: 'TO DESIGN → agent drops draft here' },
	{ title: 'Approval queue', body: 'TO DESIGN → agent drops draft here' },
	{ title: 'Pipeline', body: 'Draft → In review → Approved → Wired into the Next app' },
]

function addSection(
	editor: Editor,
	index: number,
	name: string,
	subtitle: string,
	cards: Card[],
	color: NoteColor,
	perRow = 3
) {
	const frameId = createShapeId()
	const fx = index * (FRAME_W + FRAME_GAP)

	editor.createShape({
		type: 'frame',
		id: frameId,
		x: fx,
		y: 0,
		props: { w: FRAME_W, h: FRAME_H, name },
	})

	editor.createShape({
		type: 'text',
		id: createShapeId(),
		parentId: frameId,
		x: PAD_X,
		y: HEADER_Y,
		props: { richText: toRichText(subtitle), size: 'm', color: 'black' },
	})

	cards.forEach((c, i) => {
		const col = i % perRow
		const row = Math.floor(i / perRow)
		editor.createShape({
			type: 'note',
			id: createShapeId(),
			parentId: frameId,
			x: PAD_X + col * (NOTE_W + COL_GAP),
			y: FIRST_ROW_Y + row * ROW_H,
			props: {
				richText: toRichText(`${c.title}\n\n${c.body}`),
				color,
				size: 's',
			},
		})
	})
}

export function seedBoardIfEmpty(editor: Editor) {
	// Only seed a blank canvas — never clobber existing work.
	if (editor.getCurrentPageShapes().length > 0) return

	addSection(editor, 0, '1 · Shipped components', 'Prototyped + verified — wire-ready', SHIPPED, 'green')
	addSection(editor, 1, '2 · Mood board', 'Inspo & mockups — drop references here', MOOD, 'yellow')
	addSection(editor, 2, '3 · Build / review', 'Agents drop final drafts → team approves → wired', BUILD, 'blue')

	editor.zoomToFit()
}
