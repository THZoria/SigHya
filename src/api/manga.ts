interface Manga {
  id: string;
  nom_manga: string;
  date_sortie: string;
  prix: string;
  editeur: string | null;
  lien_acheter: string | null;
  image: string;
}

// Fetch manga release schedule from Nautiljon
export const fetchMangaPlanning = async (): Promise<Manga[]> => {
  try {
    const response = await fetch('https://www.nautiljon.com/planning/manga/');
    if (!response.ok) throw new Error('Failed to fetch manga planning');
    
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    const table = doc.querySelector('#planning tbody');
    if (!table) throw new Error('Planning table not found');

    const mangas: Manga[] = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 6) {
        const lastLink = cells[2].querySelector('a:last-child');
        const id = lastLink?.getAttribute('href')?.split(',').pop()?.split('.')[0] || String(index);
        const image = cells[1].querySelector('img')?.src || '';
        const lienAcheter = cells[5].querySelector('a')?.href || null;

        mangas.push({
          id,
          date_sortie: cells[0].textContent?.trim() || '',
          image: image.replace('http://localhost:5173', 'https://www.nautiljon.com'),
          nom_manga: lastLink?.textContent?.trim() || '',
          prix: cells[3].textContent?.trim() || '',
          editeur: cells[4].querySelector('a')?.textContent?.trim() || null,
          lien_acheter: lienAcheter ? (lienAcheter.startsWith('http') ? lienAcheter : `https://www.nautiljon.com${lienAcheter}`) : null
        });
      }
    });

    return mangas;
  } catch (error) {
    console.error('Error fetching manga planning:', error);
    throw error;
  }
};