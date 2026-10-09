import { config } from '../config'
import { markFeedCacheStale, readFeedCache, writeFeedCache } from './cache'
import { feedRegistry } from './registry'
import type { FeedDefinition, FeedStatus } from './types'

const lastErrors = new Map<string, string | null>()

export const refreshFeed = async (feed: FeedDefinition): Promise<FeedStatus> => {
  try {
    const data = await feed.fetch()
    const envelope = await writeFeedCache(feed.id, feed.sourceUrl, data)
    lastErrors.set(feed.id, null)
    console.info(`[feeds] refreshed ${feed.id}`)

    return {
      id: feed.id,
      sourceUrl: feed.sourceUrl,
      fetchedAt: envelope.fetchedAt,
      stale: false,
      hasCache: true,
      lastError: null,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    lastErrors.set(feed.id, message)
    const stale = await markFeedCacheStale(feed.id)
    console.warn(`[feeds] ${feed.id} failed: ${message}`)

    return {
      id: feed.id,
      sourceUrl: feed.sourceUrl,
      fetchedAt: stale?.fetchedAt ?? null,
      stale: Boolean(stale),
      hasCache: Boolean(stale),
      lastError: message,
    }
  }
}

export const refreshAllFeeds = async (): Promise<FeedStatus[]> => {
  const results = await Promise.all(feedRegistry.map((feed) => refreshFeed(feed)))
  const ok = results.filter((r) => !r.lastError).length
  console.info(`[feeds] refresh ${ok}/${results.length}`)
  return results
}

export const getAllFeedStatuses = (): Promise<FeedStatus[]> =>
  Promise.all(
    feedRegistry.map(async (feed) => {
      const cache = await readFeedCache(feed.id)
      return {
        id: feed.id,
        sourceUrl: feed.sourceUrl,
        fetchedAt: cache?.fetchedAt ?? null,
        stale: cache?.stale ?? false,
        hasCache: Boolean(cache),
        lastError: lastErrors.get(feed.id) ?? null,
      }
    }),
  )

export const startFeedScheduler = async (): Promise<void> => {
  await refreshAllFeeds()

  const timer = setInterval(() => {
    void refreshAllFeeds()
  }, config.refreshIntervalMs)

  if (typeof timer === 'object' && 'unref' in timer) timer.unref()
  console.info(`[feeds] scheduler every ${config.refreshIntervalMs}ms`)
}
