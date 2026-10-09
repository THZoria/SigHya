import { fetchRemoteJson, fetchRemoteText } from './http'
import { type NewsItem, parseRssFeed } from './parsers/rss'
import type { FeedDefinition } from './types'

export interface MangaPlanningItem {
  id: string
  nom_manga: string
  date_sortie: string
  prix: string
  editeur: string | null
  lien_acheter: string | null
  image: string
}

const NEWS_URL = 'https://hacktuality.com/rss.xml'
const MANGA_URL =
  'https://raw.githubusercontent.com/THZoria/MangaPlanner/refs/heads/main/planning.json'
const NX_URL = 'https://nxhub.pw/data/projects.json'
const PS5_URL =
  'https://raw.githubusercontent.com/amoamare/Console-Service-Tool/master/Resources/ErrorCodes.json'

const isMangaItem = (value: unknown): value is MangaPlanningItem => {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.nom_manga === 'string' &&
    typeof item.date_sortie === 'string' &&
    typeof item.prix === 'string' &&
    (typeof item.editeur === 'string' || item.editeur === null) &&
    (typeof item.lien_acheter === 'string' || item.lien_acheter === null) &&
    typeof item.image === 'string'
  )
}

const normalizeMangaPlanning = (payload: unknown): MangaPlanningItem[] => {
  if (!Array.isArray(payload)) throw new Error('Manga planning payload is not an array')

  const items = payload.filter(isMangaItem).map((entry, index) => ({
    id: String((entry as { id?: string | number }).id ?? `${entry.nom_manga}-${index}`),
    nom_manga: entry.nom_manga,
    date_sortie: entry.date_sortie,
    prix: entry.prix,
    editeur: entry.editeur,
    lien_acheter: entry.lien_acheter,
    image: entry.image,
  }))

  if (items.length === 0) throw new Error('Manga planning payload is empty')
  return items
}

export const feedRegistry: FeedDefinition[] = [
  {
    id: 'news',
    sourceUrl: NEWS_URL,
    fetch: async (): Promise<NewsItem[]> => parseRssFeed(await fetchRemoteText(NEWS_URL), 6),
  },
  {
    id: 'manga',
    sourceUrl: MANGA_URL,
    fetch: async (): Promise<MangaPlanningItem[]> =>
      normalizeMangaPlanning(await fetchRemoteJson<unknown>(MANGA_URL)),
  },
  {
    id: 'nx-projects',
    sourceUrl: NX_URL,
    fetch: async () => {
      const payload = await fetchRemoteJson<unknown>(NX_URL)
      if (payload == null) throw new Error('NX projects payload is empty')
      return payload
    },
  },
  {
    id: 'ps5-errors',
    sourceUrl: PS5_URL,
    fetch: async () => {
      const payload = await fetchRemoteJson<unknown>(PS5_URL)
      const codes = (payload as { PlayStation5?: { ErrorCodes?: unknown } })?.PlayStation5
        ?.ErrorCodes
      if (!Array.isArray(codes) || codes.length === 0) {
        throw new Error('PS5 error codes payload is invalid')
      }
      return payload
    },
  },
]

export const getFeedDefinition = (id: string): FeedDefinition | undefined =>
  feedRegistry.find((feed) => feed.id === id)
