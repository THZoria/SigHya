import type { Manga } from '../types/manga';

/**
 * Generates an ICS (iCalendar) file content from manga data
 * Creates calendar events for manga release dates
 * 
 * @param mangas - Array of manga objects with release date information
 * @returns ICS file content as a string
 * 
 * @example
 * const icsContent = generateICS(mangaList);
 * // Creates downloadable calendar file with manga release dates
 */
export const generateICS = (mangas: Manga[]): string => {
  // Initialize ICS file header
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SigHya//FR'
  ].join('\n');
  
  // Process each manga to create calendar events
  mangas.forEach(manga => {
    // Parse release date components
    const [day, month, year] = manga.date_sortie.split('/').map(Number);
    const startDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    
    // Calculate end date (next day) for all-day events
    const nextDay = new Date(year, month - 1, day + 1);
    const endDate = `${nextDay.getFullYear()}${(nextDay.getMonth() + 1).toString().padStart(2, '0')}${nextDay.getDate().toString().padStart(2, '0')}`;
    
    // Create event description with manga details
    const description = `📖 ${manga.nom_manga}\\n💰 Prix: ${manga.prix}\\n🏢 Éditeur: ${manga.editeur || 'Non spécifié'}${manga.lien_acheter ? `\\n🛒 Acheter: ${manga.lien_acheter}` : ''}`;

    // Generate unique identifier for the calendar event
    const uid = Math.random().toString(36).substring(2, 12) + '@sighya.fr';
    
    // Create timestamp for when the event was created
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Add event to ICS content
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
  
  // Close ICS file
  ics += '\nEND:VCALENDAR';
  return ics;
};

/**
 * Generates a filename for the ICS file based on manga name
 * Sanitizes the manga name to create a valid filename
 * 
 * @param manga - Manga object containing the name
 * @returns Sanitized filename with .ics extension
 * 
 * @example
 * const filename = getICSFilename(manga); // Returns: "one_piece_tome_123.ics"
 */
export const getICSFilename = (manga: Manga): string => {
  return `${manga.nom_manga.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
};