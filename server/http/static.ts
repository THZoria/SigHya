import { join, normalize } from 'node:path'
import { config } from '../config'

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
}

const PRIVATE_PREFIXES = ['/server/', '/cache/', '/logs/', '/node_modules/']
const PRIVATE_FILES = new Set(['/package.json', '/ecosystem.config.cjs', '/readme.md'])

const extname = (path: string): string => {
  const idx = path.lastIndexOf('.')
  return idx >= 0 ? path.slice(idx).toLowerCase() : ''
}

const isPrivatePath = (pathname: string): boolean => {
  const path = pathname.toLowerCase()
  return PRIVATE_FILES.has(path) || PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

const resolveSafePath = (pathname: string): string | null => {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '')
  const candidate = normalize(join(config.distDir, relative || 'index.html'))
  return candidate.startsWith(config.distDir) ? candidate : null
}

export const handleStaticRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url)

  if (isPrivatePath(pathname)) return new Response('Not Found', { status: 404 })

  const safePath = resolveSafePath(pathname)
  if (!safePath) return new Response('Forbidden', { status: 403 })

  let file = Bun.file(safePath)

  if (!(await file.exists())) {
    if (extname(pathname)) return new Response('Not Found', { status: 404 })

    file = Bun.file(join(config.distDir, 'index.html'))
    if (!(await file.exists())) {
      return new Response('Frontend build missing. Run `bun run build` first.', { status: 503 })
    }
  }

  return new Response(file, {
    headers: {
      'Content-Type': CONTENT_TYPES[extname(file.name)] || file.type || 'application/octet-stream',
      'Cache-Control': pathname.includes('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
    },
  })
}
