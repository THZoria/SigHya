import { config, isDevBrowserHost } from '../config'

interface RateBucket {
  count: number
  windowStart: number
}

const buckets = new Map<string, RateBucket>()
const REFERRER_EXEMPT = new Set(['/api/health'])

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}

export const redirectHome = (extra?: Record<string, string>): Response =>
  new Response(null, {
    status: 302,
    headers: { Location: '/', ...SECURITY_HEADERS, ...extra },
  })

const clientIp = (request: Request): string => {
  if (!config.trustProxy) return 'direct'

  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwarded) return forwarded

  return request.headers.get('x-real-ip')?.trim() || 'direct'
}

const pruneBuckets = (now: number): void => {
  if (buckets.size < 2_000) return
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= config.rateLimitWindowMs) buckets.delete(key)
  }
}

const rateLimit = (request: Request, pathname: string): Response | null => {
  const now = Date.now()
  pruneBuckets(now)

  const key = `${clientIp(request)}:${pathname.startsWith('/api/feeds') ? 'feeds' : 'api'}`
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart >= config.rateLimitWindowMs) {
    buckets.set(key, { count: 1, windowStart: now })
    return null
  }

  bucket.count += 1
  if (bucket.count <= config.rateLimitMax) return null

  const retryAfter = Math.max(
    1,
    Math.ceil((bucket.windowStart + config.rateLimitWindowMs - now) / 1000),
  )

  return redirectHome({
    'Retry-After': String(retryAfter),
    'X-RateLimit-Limit': String(config.rateLimitMax),
    'X-RateLimit-Remaining': '0',
  })
}

const hostOf = (value: string): string | null => {
  try {
    return new URL(value).host.toLowerCase()
  } catch {
    return null
  }
}

const isAllowedHost = (host: string, requestHost: string): boolean => {
  const normalized = host.toLowerCase()
  if (normalized === requestHost.toLowerCase()) return true
  if (config.allowedHosts.has(normalized)) return true
  return !config.isProduction && isDevBrowserHost(normalized)
}

const sameSite = (request: Request, pathname: string): Response | null => {
  if (REFERRER_EXEMPT.has(pathname) || !config.enforceSameSite) return null

  const requestHost = new URL(request.url).host
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (origin) {
    const host = hostOf(origin)
    return host && isAllowedHost(host, requestHost) ? null : redirectHome()
  }

  if (referer) {
    const host = hostOf(referer)
    return host && isAllowedHost(host, requestHost) ? null : redirectHome()
  }

  return config.isProduction ? redirectHome() : null
}

export const withApiSecurityHeaders = (response: Response, request: Request): Response => {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value)

  const ip = clientIp(request)
  const bucket = buckets.get(`${ip}:feeds`) ?? buckets.get(`${ip}:api`)
  if (bucket) {
    headers.set('X-RateLimit-Limit', String(config.rateLimitMax))
    headers.set('X-RateLimit-Remaining', String(Math.max(0, config.rateLimitMax - bucket.count)))
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export const enforceApiSecurity = (request: Request, pathname: string): Response | null =>
  rateLimit(request, pathname) ?? sameSite(request, pathname)
