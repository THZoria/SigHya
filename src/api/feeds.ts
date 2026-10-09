export interface FeedResponse<T> {
  id: string
  sourceUrl: string
  fetchedAt: string
  stale: boolean
  data: T
}

export const fetchFeed = async <T>(
  feedId: string,
  signal?: AbortSignal,
): Promise<FeedResponse<T>> => {
  const response = await fetch(`/api/feeds/${feedId}`, {
    signal,
    redirect: 'manual',
    headers: { Accept: 'application/json' },
  })

  if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
    throw new Error(`Feed "${feedId}" unavailable (redirected)`)
  }

  if (!response.ok) {
    throw new Error(`Feed "${feedId}" unavailable (HTTP ${response.status})`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Feed "${feedId}" returned a non-JSON response`)
  }

  const payload = (await response.json()) as FeedResponse<T>
  if (!payload || payload.data === undefined) {
    throw new Error(`Feed "${feedId}" returned an invalid payload`)
  }

  return payload
}
