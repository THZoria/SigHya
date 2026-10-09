import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const prodDir = join(root, '.prod')

const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf-8')) as {
  name: string
  version: string
  description?: string
  license?: string
}

console.info('[build] cleaning .prod/')
await rm(prodDir, { recursive: true, force: true })
await rm(join(root, 'dist'), { recursive: true, force: true })
await rm(join(root, 'release'), { recursive: true, force: true })

console.info('[build] vite + package')
const vite = Bun.spawn({
  cmd: ['bunx', 'vite', 'build'],
  cwd: root,
  stdout: 'inherit',
  stderr: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
})

const code = await vite.exited
if (code !== 0) process.exit(code)

if (!(await stat(join(prodDir, 'index.html')).catch(() => null))?.isFile()) {
  console.error('[build] missing .prod/index.html')
  process.exit(1)
}

await cp(join(root, 'server'), join(prodDir, 'server'), { recursive: true })
await cp(join(root, 'ecosystem.config.cjs'), join(prodDir, 'ecosystem.config.cjs'))
await mkdir(join(prodDir, 'cache', 'feeds'), { recursive: true })
await mkdir(join(prodDir, 'logs'), { recursive: true })

await writeFile(
  join(prodDir, 'package.json'),
  `${JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      type: 'module',
      description: pkg.description,
      license: pkg.license,
      scripts: { start: 'NODE_ENV=production bun server/index.ts' },
      dependencies: {},
    },
    null,
    2,
  )}\n`,
)

for (const file of ['index.html', 'server/index.ts', 'ecosystem.config.cjs', 'package.json']) {
  if (!(await stat(join(prodDir, file)).catch(() => null))) {
    console.error(`[build] missing ${file}`)
    process.exit(1)
  }
}

console.info('[build] OK → cd .prod && pm2 start ecosystem.config.cjs')
