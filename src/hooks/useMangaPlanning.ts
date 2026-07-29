import { useEffect, useMemo, useRef, useState } from 'react'
import { MAX_RETRIES } from '../constants/manga'
import type { Manga } from '../types/manga'

const PLANNING_URL =
  'https://raw.githubusercontent.com/THZoria/MangaPlanner/refs/heads/main/planning.json'

const isValidManga = (
  value: unknown,
): value is Omit<Manga, 'id'> & { id?: string | number | null } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const manga = value as Record<string, unknown>
  return (
    typeof manga.nom_manga === 'string' &&
    typeof manga.date_sortie === 'string' &&
    typeof manga.prix === 'string' &&
    (typeof manga.editeur === 'string' || manga.editeur === null) &&
    (typeof manga.lien_acheter === 'string' || manga.lien_acheter === null) &&
    typeof manga.image === 'string'
  )
}

const normalizeMangas = (payload: unknown): Manga[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid planning payload')
  }

  return payload.filter(isValidManga).map((entry, index) => ({
    id: String(entry.id ?? `${entry.nom_manga}-${index}`),
    nom_manga: entry.nom_manga,
    date_sortie: entry.date_sortie,
    prix: entry.prix,
    editeur: entry.editeur,
    lien_acheter: entry.lien_acheter,
    image: entry.image,
  }))
}

export const useMangaPlanning = () => {
  const [mangas, setMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const retryCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const fetchMangas = async () => {
      try {
        setLoading(true)
        const response = await fetch(PLANNING_URL, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch planning data (${response.status})`)
        }

        const payload = await response.json()
        const normalized = normalizeMangas(payload)

        if (normalized.length === 0) {
          throw new Error('Planning data is empty')
        }

        if (!cancelled) {
          setMangas(normalized)
          setError(null)
          retryCountRef.current = 0
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        if (!cancelled) {
          setError('Erreur lors du chargement du planning manga.')
        }

        if (retryCountRef.current < MAX_RETRIES && !cancelled) {
          const delay = 2 ** retryCountRef.current * 1000
          retryCountRef.current += 1
          timerRef.current = setTimeout(fetchMangas, delay)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMangas()

    return () => {
      cancelled = true
      controller.abort()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const result = useMemo(
    () => ({
      mangas,
      loading,
      error,
    }),
    [mangas, loading, error],
  )

  return result
}
