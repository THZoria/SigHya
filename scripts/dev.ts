const children: ReturnType<typeof Bun.spawn>[] = []
const apiPort = process.env.PORT || '3000'

const shutdown = (code = 0) => {
  for (const child of children) {
    try {
      child.kill()
    } catch {
      /* already dead */
    }
  }
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

const waitForApi = async (timeoutMs = 60_000): Promise<void> => {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      if ((await fetch(`http://127.0.0.1:${apiPort}/api/health`)).ok) return
    } catch {
      /* retry */
    }
    await Bun.sleep(200)
  }
  throw new Error(`API not ready on :${apiPort}`)
}

children.push(
  Bun.spawn({
    cmd: ['bun', '--hot', 'server/index.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
    env: { ...process.env, NODE_ENV: 'development', PORT: apiPort },
  }),
)

try {
  await waitForApi()
  console.info(`[dev] API :${apiPort} → starting Vite`)
} catch (error) {
  console.error('[dev]', error instanceof Error ? error.message : error)
  shutdown(1)
}

children.push(
  Bun.spawn({
    cmd: ['bunx', 'vite'],
    stdout: 'inherit',
    stderr: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  }),
)

const failed = (await Promise.all(children.map((child) => child.exited))).some((code) => code !== 0)
shutdown(failed ? 1 : 0)
