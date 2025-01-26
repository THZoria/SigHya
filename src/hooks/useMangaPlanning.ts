import { useState, useEffect } from 'react';
import type { Manga } from '../types/manga';
import { MAX_RETRIES } from '../constants/manga';

const corsProxy = 'https://api.allorigins.win/raw?url=';

export const useMangaPlanning = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadLocalMangas = async () => {
    try {
      console.log('=== Chargement des données locales ===');
      const response = await fetch('/planning.json');
      if (!response.ok) throw new Error('Failed to load local manga data');
      const data = await response.json();
      console.log('Données locales chargées:', data);
      setMangas(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading local manga data:', err);
      setError('Erreur lors du chargement des données locales.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadMangas = async () => {
      try {
        console.log('=== Début du chargement des mangas ===');
        console.log('Tentative de chargement depuis Nautiljon...');

        const url = encodeURIComponent('https://www.nautiljon.com/planning/manga/');
        const response = await fetch(`${corsProxy}${url}`, {
          headers: {
            'Accept': '*/*',
          }
        });

        if (!response.ok) {
          console.warn('Erreur lors de la requête Nautiljon:', response.status);
          console.warn('Failed to fetch from Nautiljon, falling back to local data');
          return loadLocalMangas();
        }
        
        const text = await response.text();
        console.log('Réponse reçue de Nautiljon, longueur:', text.length);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const table = doc.querySelector('#planning tbody');
        
        if (!table) {
          console.warn('Table de planning non trouvée dans la réponse HTML');
          console.warn('Planning table not found, falling back to local data');
          return loadLocalMangas();
        }

        const mangas: Manga[] = [];
        const rows = table.querySelectorAll('tr');
        console.log(`Nombre de lignes trouvées: ${rows.length}`);

        console.log('=== Mangas trouvés ===');
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          console.log(`Ligne ${index + 1}: ${cells.length} cellules`);
          if (cells.length >= 6) {
            const mangaCell = cells[2];
            const links = mangaCell.querySelectorAll('a');
            const lastLink = links[links.length - 1];
            const mangaName = lastLink ? lastLink.textContent?.trim() : '';
            const id = lastLink?.getAttribute('href')?.split(',').pop()?.split('.')[0] || String(index);
            console.log(`${index + 1}. Titre: "${mangaName}", ID: ${id}`);
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
        console.log('=== Fin des mangas ===');
        console.log(`Total des mangas chargés: ${mangas.length}`);

        setMangas(mangas);
      } catch (err) {
        console.error('Erreur détaillée:', err);
        console.warn('Error fetching from Nautiljon, falling back to local data:', err);
        return loadLocalMangas();
      } finally {
        setLoading(false);
      }
    };

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