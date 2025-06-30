import { useState, useEffect } from 'react';
import type { Manga } from '../types/manga';
import { MAX_RETRIES } from '../constants/manga';

/**
 * CORS proxy URL for fetching external data
 */
const corsProxy = 'https://api.allorigins.win/raw?url=';

/**
 * Custom hook for managing manga planning data
 * Fetches manga data from Nautiljon with fallback to local data
 * Includes retry logic and error handling
 * 
 * @returns Object containing mangas array, loading state, and error state
 * 
 * @example
 * const { mangas, loading, error } = useMangaPlanning();
 */
export const useMangaPlanning = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Loads manga data from local JSON file as fallback
   */
  const loadLocalMangas = async () => {
    try {
      console.log('=== Loading local data ===');
      const response = await fetch('/planning.json');
      if (!response.ok) throw new Error('Failed to load local manga data');
      const data = await response.json();
      console.log('Local data loaded:', data);
      setMangas(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading local manga data:', err);
      setError('Erreur lors du chargement des données locales.');
      setLoading(false);
    }
  };

  useEffect(() => {
    /**
     * Main function to load manga data from Nautiljon
     * Falls back to local data if external fetch fails
     */
    const loadMangas = async () => {
      try {
        console.log('=== Starting manga loading ===');
        console.log('Attempting to load from Nautiljon...');

        const url = encodeURIComponent('https://www.nautiljon.com/planning/manga/');
        const response = await fetch(`${corsProxy}${url}`, {
          headers: {
            'Accept': '*/*',
          }
        });

        if (!response.ok) {
          console.warn('Error during Nautiljon request:', response.status);
          console.warn('Failed to fetch from Nautiljon, falling back to local data');
          return loadLocalMangas();
        }
        
        const text = await response.text();
        console.log('Response received from Nautiljon, length:', text.length);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const table = doc.querySelector('#planning tbody');
        
        if (!table) {
          console.warn('Planning table not found in HTML response');
          console.warn('Planning table not found, falling back to local data');
          return loadLocalMangas();
        }

        const mangas: Manga[] = [];
        const rows = table.querySelectorAll('tr');
        console.log(`Number of rows found: ${rows.length}`);

        console.log('=== Found mangas ===');
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          console.log(`Row ${index + 1}: ${cells.length} cells`);
          if (cells.length >= 6) {
            const mangaCell = cells[2];
            const links = mangaCell.querySelectorAll('a');
            const lastLink = links[links.length - 1];
            const mangaName = lastLink ? lastLink.textContent?.trim() : '';
            const id = lastLink?.getAttribute('href')?.split(',').pop()?.split('.')[0] || `manga-${index}`;
            console.log(`${index + 1}. Title: "${mangaName}", ID: ${id}`);
            const imageElement = cells[1].querySelector('img');
            const imageSrc = imageElement?.getAttribute('src') || '';
            const lienAcheter = cells[5].querySelector('a')?.getAttribute('href') || null;

            mangas.push({
              id,
              date_sortie: cells[0].textContent?.trim() || '',
              image: `https://www.nautiljon.com${imageSrc}`,
              nom_manga: mangaName,
              prix: cells[3].textContent?.trim() || '',
              editeur: cells[4].querySelector('a')?.textContent?.trim() || null,
              lien_acheter: lienAcheter ? `https://www.nautiljon.com${lienAcheter}` : null
            });
          }
        });
        console.log('=== End of mangas ===');
        console.log(`Total mangas loaded: ${mangas.length}`);

        setMangas(mangas);
      } catch (err) {
        console.error('Detailed error:', err);
        console.warn('Error fetching from Nautiljon, falling back to local data:', err);
        return loadLocalMangas();
      } finally {
        setLoading(false);
      }
    };

    /**
     * Retry function with exponential backoff
     */
    const retryWithDelay = () => {
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadMangas();
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      }
    };

    loadMangas().catch(() => {
      retryWithDelay();
    });
  }, []);

  return { mangas, loading, error };
};