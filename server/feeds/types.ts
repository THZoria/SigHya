export interface FeedCacheEnvelope<T = unknown> {
  id: string
  sourceUrl: string
  fetchedAt: string
  stale: boolean
  data: T
}

export interface FeedStatus {
  id: string
  sourceUrl: string
  fetchedAt: string | null
  stale: boolean
  hasCache: boolean
  lastError: string | null
}

export interface FeedDefinition<T = unknown> {
  id: string
  sourceUrl: string
  fetch: () => Promise<T>
}
