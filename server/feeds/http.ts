import { config } from '../config'

export const fetchRemoteText = async (url: string): Promise<string> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.fetchTimeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: '*/*', 'User-Agent': config.userAgent },
      redirect: 'follow',
    })
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
    return await response.text()
  } finally {
    clearTimeout(timer)
  }
}

export const fetchRemoteJson = async <T>(url: string): Promise<T> =>
  JSON.parse(await fetchRemoteText(url)) as T
