import { type Editor, AssetRecordType, createShapeId, toRichText } from 'tldraw'

// Seeds the AI Ops OS design board the first time the canvas is empty:
//  1 · Shipped components — image gallery of the real prototype (for critique)
//  2 · Mood board — inspo/mockup drop zone
//  3 · Build / review — agents drop final drafts, team approves
// Component PNGs are served from /components/*.png (design-board/public).

type NoteColor = 'green' | 'yellow' | 'blue' | 'grey'

interface Card {
	title: string
	body: string
}

interface ImgSpec {
	file: string
	label: string
	iw: number // intrinsic width (css px)
	ih: number // intrinsic height
	dw: number // display width on canvas
}

const FRAME_H = 1560
const PAD_X = 40
const HEADER_Y = 28

// ---- Section 1: image gallery ----------------------------------------------
const HERO: ImgSpec = { file: 'operator-surface.png', label: 'Operator surface — full', iw: 1320, ih: 880, dw: 980 }
const COMPONENTS: ImgSpec[] = [
	{ file: 'sidebar.png', label: 'Sidebar', iw: 260, ih: 760, dw: 150 },
	{ file: 'topbar.png', label: 'Top bar', iw: 1080, ih: 69, dw: 480 },
	{ file: 'metrics.png', label: 'Metric cards', iw: 1080, ih: 161, dw: 480 },
	{ file: 'queue.png', label: 'Lead queue', iw: 420, ih: 540, dw: 300 },
	{ file: 'thread.png', label: 'Thread view', iw: 760, ih: 460, dw: 440 },
	{ file: 'composer.png', label: 'Composer', iw: 760, ih: 195, dw: 480 },
	{ file: 'bubbles.png', label: 'Speech bubbles', iw: 620, ih: 264, dw: 420 },
	{ file: 'chips.png', label: 'Intent chips', iw: 420, ih: 73, dw: 320 },
]

function addLabel(editor: Editor, frameId: string, x: number, y: number, text: string) {
	editor.createShape({
		type: 'text',
		id: createShapeId(),
		parentId: frameId,
		x,
		y,
		props: { richText: toRichText(text), size: 's', color: 'black' },
	})
}

function addImage(editor: Editor, frameId: string, x: number, y: number, img: ImgSpec) {
	const assetId = AssetRecordType.createId()
	const dh = Math.round((img.dw * img.ih) / img.iw)
	editor.createAssets([
		{
			id: assetId,
			typeName: 'asset',
			type: 'image',
			meta: {},
			props: {
				name: img.file,
				src: `/components/${img.file}`,
				w: img.iw,
				h: img.ih,
				mimeType: 'image/png',
				isAnimated: false,
			},
		},
	])
	editor.createShape({
		type: 'image',
		id: createShapeId(),
		parentId: frameId,
		x,
		y,
		props: { assetId, w: img.dw, h: dh },
	})
	return dh
}

function addGallerySection(editor: Editor, fx: number) {
	const frameId = createShapeId()
	const FRAME_W = 1100
	const GALLERY_H = 2720
	editor.createShape({
		type: 'frame',
		id: frameId,
		x: fx,
		y: 0,
		props: { w: FRAME_W, h: GALLERY_H, name: '1 · Shipped components' },
	})
	addLabel(editor, frameId, PAD_X, HEADER_Y, 'Real prototype assets — drop comments to critique')

	// Hero
	addLabel(editor, frameId, PAD_X, 96, HERO.label)
	const heroH = addImage(editor, frameId, PAD_X, 124, HERO)

	// Components — masonry across 2 columns
	const colX = [PAD_X, 580]
	const colY = [124 + heroH + 60, 124 + heroH + 60]
	const LABEL_GAP = 26
	const ITEM_GAP = 48
	for (const img of COMPONENTS) {
		const c = colY[0] <= colY[1] ? 0 : 1
		addLabel(editor, frameId, colX[c], colY[c], img.label)
		const dh = addImage(editor, frameId, colX[c], colY[c] + LABEL_GAP, img)
		colY[c] += LABEL_GAP + dh + ITEM_GAP
	}
}

// ---- Sections 2 & 3: note zones --------------------------------------------
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

function addNoteSection(
	editor: Editor,
	fx: number,
	name: string,
	subtitle: string,
	cards: Card[],
	color: NoteColor
) {
	const frameId = createShapeId()
	const FRAME_W = 920
	editor.createShape({
		type: 'frame',
		id: frameId,
		x: fx,
		y: 0,
		props: { w: FRAME_W, h: FRAME_H, name },
	})
	addLabel(editor, frameId, PAD_X, HEADER_Y, subtitle)
	const NOTE_W = 264
	cards.forEach((card, i) => {
		const col = i % 3
		const row = Math.floor(i / 3)
		editor.createShape({
			type: 'note',
			id: createShapeId(),
			parentId: frameId,
			x: PAD_X + col * (NOTE_W + 24),
			y: 110 + row * 250,
			props: { richText: toRichText(`${card.title}\n\n${card.body}`), color, size: 's' },
		})
	})
}

export function seedBoardIfEmpty(editor: Editor) {
	if (editor.getCurrentPageShapes().length > 0) return

	addGallerySection(editor, 0)
	addNoteSection(editor, 1240, '2 · Mood board', 'Inspo & mockups — drop references here', MOOD, 'yellow')
	addNoteSection(editor, 2300, '3 · Build / review', 'Agents drop final drafts → team approves → wired', BUILD, 'blue')

	editor.zoomToFit()
}
