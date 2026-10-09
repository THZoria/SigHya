import { join } from 'node:path'

const rootDir = join(import.meta.dir, '..')
const isProduction = process.env.NODE_ENV === 'production'

const envFlag = (key: string): boolean | undefined => {
  const value = process.env[key]
  if (value === '1' || value === 'true') return true
  if (value === '0' || value === 'false') return false
  return undefined
}

const parseAllowedHosts = (): Set<string> => {
  const hosts = new Set<string>()
  for (const entry of (process.env.ALLOWED_HOSTS || process.env.ALLOWED_ORIGINS || '').split(',')) {
    const trimmed = entry.trim()
    if (!trimmed) continue
    try {
      hosts.add(
        trimmed.includes('://') ? new URL(trimmed).host.toLowerCase() : trimmed.toLowerCase(),
      )
    } catch {
      /* ignore malformed entries */
    }
  }
  return hosts
}

export const isDevBrowserHost = (host: string): boolean => {
  const hostname =
    host
      .toLowerCase()
      .replace(/^\[|\]$/g, '')
      .split(':')[0] ?? host
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local')
  ) {
    return true
  }

  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false
  const [a, b] = hostname.split('.').map(Number)
  return a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31)
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  isProduction,
  rootDir,
  distDir: rootDir,
  cacheDir: join(rootDir, 'cache', 'feeds'),
  refreshIntervalMs: Number(process.env.FEED_REFRESH_MS) || 60 * 60 * 1000,
  fetchTimeoutMs: Number(process.env.FEED_FETCH_TIMEOUT_MS) || 20_000,
  userAgent: 'SigHyaFeedBot/2.5 (+https://sighya.fr)',
  rateLimitMax: Number(process.env.API_RATE_LIMIT_MAX) || 60,
  rateLimitWindowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS) || 60_000,
  trustProxy: envFlag('TRUST_PROXY') ?? false,
  enforceSameSite: envFlag('API_ENFORCE_SAME_SITE') ?? isProduction,
  allowedHosts: parseAllowedHosts(),
} as const
