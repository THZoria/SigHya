import { readFeedCache } from '../feeds/cache'
import { getFeedDefinition } from '../feeds/registry'
import { getAllFeedStatuses } from '../feeds/scheduler'
import { enforceApiSecurity, redirectHome, withApiSecurityHeaders } from './security'

const json = (body: unknown, status = 200): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export const handleApiRequest = async (request: Request): Promise<Response | null> => {
  const url = new URL(request.url)
  if (!url.pathname.startsWith('/api/')) return null

  if (request.method !== 'GET' && request.method !== 'HEAD') return redirectHome()

  const blocked = enforceApiSecurity(request, url.pathname)
  if (blocked) return blocked

  if (url.pathname === '/api/health') {
    return withApiSecurityHeaders(
      json({ status: 'ok', uptime: process.uptime(), feeds: await getAllFeedStatuses() }),
      request,
    )
  }

  if (url.pathname === '/api/feeds') {
    return withApiSecurityHeaders(json({ feeds: await getAllFeedStatuses() }), request)
  }

  const match = url.pathname.match(/^\/api\/feeds\/([a-z0-9-]+)$/i)
  if (!match) return redirectHome()

  const feedId = match[1]
  if (!getFeedDefinition(feedId)) return redirectHome()

  const cache = await readFeedCache(feedId)
  if (!cache) return redirectHome()

  return withApiSecurityHeaders(
    json({
      id: cache.id,
      sourceUrl: cache.sourceUrl,
      fetchedAt: cache.fetchedAt,
      stale: cache.stale,
      data: cache.data,
    }),
    request,
  )
}
