import type { Manga } from '../types/manga'
import { getMangaDateRange } from './mangaDates'

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
  let ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SigHya//FR'].join('\n')

  mangas.forEach((manga) => {
    const range = getMangaDateRange(manga.date_sortie)
    if (!range) {
      return
    }

    const startDate = `${range.start.getFullYear()}${(range.start.getMonth() + 1).toString().padStart(2, '0')}${range.start.getDate().toString().padStart(2, '0')}`
    const endDate = `${range.end.getFullYear()}${(range.end.getMonth() + 1).toString().padStart(2, '0')}${range.end.getDate().toString().padStart(2, '0')}`

    const description = `📖 ${manga.nom_manga}\\n💰 Prix: ${manga.prix}\\n🏢 Éditeur: ${manga.editeur || 'Non spécifié'}${manga.lien_acheter ? `\\n🛒 Acheter: ${manga.lien_acheter}` : ''}`
    const uid = `${Math.random().toString(36).substring(2, 12)}@sighya.fr`
    const now = `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`

    ics +=
      '\n' +
      [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `SUMMARY:${manga.nom_manga}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${startDate}`,
        `DTEND;VALUE=DATE:${endDate}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT',
      ].join('\n')
  })

  ics += '\nEND:VCALENDAR'
  return ics
}

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
  return `${manga.nom_manga.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
}

/**
 * Downloads an ICS file for manga calendar integration
 * Creates and triggers download of calendar file in browser
 *
 * @param mangas - Array of manga objects to include in calendar
 * @param filename - Optional custom filename (defaults to first manga name)
 *
 * @example
 * downloadICSFile([manga1, manga2], 'my_manga_calendar.ics');
 */
export const downloadICSFile = (mangas: Manga[], filename?: string): void => {
  try {
    if (mangas.length === 0) {
      throw new Error('No manga available for ICS export')
    }

    const icsContent = generateICS(mangas)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const downloadFilename = filename || getICSFilename(mangas[0])

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', downloadFilename)
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (_error) {}
}
