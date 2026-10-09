import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { config } from '../config'
import type { FeedCacheEnvelope } from './types'

const pathFor = (feedId: string) => join(config.cacheDir, `${feedId}.json`)

const writeAtomic = async (feedId: string, envelope: FeedCacheEnvelope): Promise<void> => {
  await mkdir(config.cacheDir, { recursive: true })
  const target = pathFor(feedId)
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`
  await writeFile(tmp, JSON.stringify(envelope), 'utf-8')
  await rename(tmp, target)
}

export const readFeedCache = async <T>(feedId: string): Promise<FeedCacheEnvelope<T> | null> => {
  try {
    const parsed = JSON.parse(await readFile(pathFor(feedId), 'utf-8')) as FeedCacheEnvelope<T>
    if (!parsed || typeof parsed !== 'object' || parsed.data === undefined) return null
    return parsed
  } catch {
    return null
  }
}

export const writeFeedCache = async <T>(
  feedId: string,
  sourceUrl: string,
  data: T,
): Promise<FeedCacheEnvelope<T>> => {
  const envelope: FeedCacheEnvelope<T> = {
    id: feedId,
    sourceUrl,
    fetchedAt: new Date().toISOString(),
    stale: false,
    data,
  }
  await writeAtomic(feedId, envelope)
  return envelope
}

export const markFeedCacheStale = async <T>(
  feedId: string,
): Promise<FeedCacheEnvelope<T> | null> => {
  const existing = await readFeedCache<T>(feedId)
  if (!existing) return null
  const envelope = { ...existing, stale: true }
  await writeAtomic(feedId, envelope)
  return envelope
}
