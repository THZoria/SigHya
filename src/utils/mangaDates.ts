import type { Manga } from '../types/manga';

interface ParsedReleaseDate {
  sortTime: number;
  precision: 'day' | 'month';
  startDate: Date;
}

const isValidDate = (date: Date): boolean => !Number.isNaN(date.getTime());

export const parseMangaReleaseDate = (value: string): ParsedReleaseDate | null => {
  const trimmed = value.trim();

  const dayMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dayMatch) {
    const [, day, month, year] = dayMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isValidDate(parsed)) {
      return null;
    }

    return {
      sortTime: parsed.getTime(),
      precision: 'day',
      startDate: parsed,
    };
  }

  const monthMatch = trimmed.match(/^(\d{2})\/(\d{4})$/);
  if (monthMatch) {
    const [, month, year] = monthMatch;
    const parsed = new Date(Number(year), Number(month) - 1, 1);
    if (!isValidDate(parsed)) {
      return null;
    }

    return {
      sortTime: parsed.getTime(),
      precision: 'month',
      startDate: parsed,
    };
  }

  return null;
};

export const getMangaDateRange = (value: string): { start: Date; end: Date } | null => {
  const parsed = parseMangaReleaseDate(value);
  if (!parsed) {
    return null;
  }

  if (parsed.precision === 'month') {
    return {
      start: parsed.startDate,
      end: new Date(parsed.startDate.getFullYear(), parsed.startDate.getMonth() + 1, 1),
    };
  }

  return {
    start: parsed.startDate,
    end: new Date(parsed.startDate.getFullYear(), parsed.startDate.getMonth(), parsed.startDate.getDate() + 1),
  };
};

export const doesMangaMatchIsoDate = (manga: Manga, isoDate: string): boolean => {
  const range = getMangaDateRange(manga.date_sortie);
  if (!range) {
    return false;
  }

  const selectedDate = new Date(`${isoDate}T00:00:00`);
  if (!isValidDate(selectedDate)) {
    return false;
  }

  return selectedDate >= range.start && selectedDate < range.end;
};

export const isMangaInDateWindow = (manga: Manga, start: Date, endExclusive: Date): boolean => {
  const range = getMangaDateRange(manga.date_sortie);
  if (!range) {
    return false;
  }

  return range.start < endExclusive && range.end > start;
};

export const getMangaSortTime = (value: string): number => {
  return parseMangaReleaseDate(value)?.sortTime ?? Number.MAX_SAFE_INTEGER;
};

export const parseEuroPrice = (value: string): number => {
  const normalized = value.replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
};
