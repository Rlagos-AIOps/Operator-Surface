import { ExecutionContext } from '@cloudflare/workers-types'
import { WorkerEntrypoint } from 'cloudflare:workers'
import { AutoRouter, cors, error, IRequest } from 'itty-router'
import { Environment } from './environment'
import { stream } from './routes/stream'
import { handleAssetDownload, handleAssetUpload } from './assetUploads'

const { preflight, corsify } = cors({ origin: '*' })

const router = AutoRouter<IRequest, [env: Environment, ctx: ExecutionContext]>({
	before: [preflight],
	finally: [corsify],
	catch: (e) => {
		console.error(e)
		return error(e)
	},
})
	.post('/stream', stream)
	.post('/api/uploads/:uploadId', handleAssetUpload)
	.get('/api/uploads/:uploadId', handleAssetDownload)

export default class extends WorkerEntrypoint<Environment> {
	override fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)
		// WebSocket sync upgrades go straight to the room DO, bypassing the CORS
		// pipeline (you can't modify headers on a 101 switching-protocols response).
		if (url.pathname.startsWith('/api/connect/')) {
			const roomId = url.pathname.slice('/api/connect/'.length)
			const id = this.env.TLDRAW_DURABLE_OBJECT.idFromName(roomId)
			return this.env.TLDRAW_DURABLE_OBJECT.get(id).fetch(request)
		}
		return router.fetch(request, this.env, this.ctx)
	}
}

// Make the durable object available to the cloudflare worker
export { AgentDurableObject } from './do/AgentDurableObject'
export { TldrawDurableObject } from './TldrawDurableObject'
