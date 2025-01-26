import type { Manga } from '../types/manga';

export const generateICS = (mangas: Manga[]): string => {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SigHya//FR'
  ].join('\n');
  
  mangas.forEach(manga => {
    const [day, month, year] = manga.date_sortie.split('/').map(Number);
    const startDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    // Calculer la date du lendemain
    const nextDay = new Date(year, month - 1, day + 1);
    const endDate = `${nextDay.getFullYear()}${(nextDay.getMonth() + 1).toString().padStart(2, '0')}${nextDay.getDate().toString().padStart(2, '0')}`;
    const description = `📖 ${manga.nom_manga}\\n💰 Prix: ${manga.prix}\\n🏢 Éditeur: ${manga.editeur || 'Non spécifié'}${manga.lien_acheter ? `\\n🛒 Acheter: ${manga.lien_acheter}` : ''}`;

    // Générer un UID aléatoire de 10 caractères
    const uid = Math.random().toString(36).substring(2, 12) + '@sighya.fr';
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    ics += '\n' + [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `SUMMARY:${manga.nom_manga}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT'
    ].join('\n');
  });
  
  ics += '\nEND:VCALENDAR';
  return ics;
};

export const getICSFilename = (manga: Manga): string => {
  return `${manga.nom_manga.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
};