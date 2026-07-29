import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Manga } from '../types/manga';
import { MAX_RETRIES } from '../constants/manga';

const PLANNING_URL = 'https://raw.githubusercontent.com/THZoria/MangaPlanner/refs/heads/main/planning.json';

const isValidManga = (value: unknown): value is Omit<Manga, 'id'> & { id?: string | number | null } => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const manga = value as Record<string, unknown>;
  return (
    typeof manga.nom_manga === 'string' &&
    typeof manga.date_sortie === 'string' &&
    typeof manga.prix === 'string' &&
    (typeof manga.editeur === 'string' || manga.editeur === null) &&
    (typeof manga.lien_acheter === 'string' || manga.lien_acheter === null) &&
    typeof manga.image === 'string'
  );
};

const normalizeMangas = (payload: unknown): Manga[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid planning payload');
  }

  return payload
    .filter(isValidManga)
    .map((entry, index) => ({
      id: String(entry.id ?? `${entry.nom_manga}-${index}`),
      nom_manga: entry.nom_manga,
      date_sortie: entry.date_sortie,
      prix: entry.prix,
      editeur: entry.editeur,
      lien_acheter: entry.lien_acheter,
      image: entry.image,
    }));
};

export const useMangaPlanning = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadMangas = useCallback(async (signal: AbortSignal) => {
    const response = await fetch(PLANNING_URL, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch planning data (${response.status})`);
    }

    const payload = await response.json();
    const normalized = normalizeMangas(payload);

    if (normalized.length === 0) {
      throw new Error('Planning data is empty');
    }

    return normalized;
  }, []);

  const retryWithDelay = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      window.setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setLoading(true);
      }, Math.pow(2, retryCount) * 1000);
    }
  }, [retryCount]);

  useEffect(() => {
    const controller = new AbortController();

    loadMangas(controller.signal)
      .then(data => {
        setMangas(data);
        setError(null);
      })
      .catch(err => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching planning data:', err);
        setError('Erreur lors du chargement du planning manga.');
        retryWithDelay();
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [loadMangas, retryCount, retryWithDelay]);

  const result = useMemo(() => ({
    mangas,
    loading,
    error,
  }), [mangas, loading, error]);

  return result;
};
