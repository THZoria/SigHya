import { config } from './config'
import { startFeedScheduler } from './feeds/scheduler'
import { handleApiRequest } from './http/api'
import { handleStaticRequest } from './http/static'

async function main(): Promise<void> {
  await startFeedScheduler()

  const server = Bun.serve({
    port: config.port,
    hostname: config.host,
    async fetch(request) {
      const api = await handleApiRequest(request)
      if (api) return api
      if (config.isProduction) return handleStaticRequest(request)
      return new Response(null, { status: 404 })
    },
    error(error) {
      console.error('[server]', error)
      return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    },
  })

  console.info(
    `[server] http://${server.hostname}:${server.port} (${config.isProduction ? 'prod' : 'dev'})`,
  )
}

main().catch((error) => {
  console.error('[server] boot failed', error)
  process.exit(1)
})
