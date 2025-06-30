/**
 * Decodes HTML entities in text strings
 * Converts HTML entity codes back to their corresponding characters
 * 
 * @param text - The text containing HTML entities to decode
 * @returns The decoded text with HTML entities replaced by their characters
 * 
 * @example
 * decodeHTMLEntities('Hello &amp; World') // Returns: 'Hello & World'
 * decodeHTMLEntities('Caf&eacute;') // Returns: 'Café'
 */
export const decodeHTMLEntities = (text: string): string => {
    // Mapping of common HTML entities to their character equivalents
    const entities: Record<string, string> = {
      // Basic HTML entities
      '&quot;': '"',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&#039;': "'",
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      
      // French accented characters
      '&eacute;': 'é',
      '&egrave;': 'è',
      '&agrave;': 'à',
      '&ugrave;': 'ù',
      '&ecirc;': 'ê',
      '&acirc;': 'â',
      '&icirc;': 'î',
      '&ocirc;': 'ô',
      '&ucirc;': 'û',
      '&euml;': 'ë',
      '&iuml;': 'ï',
      '&ouml;': 'ö',
      '&uuml;': 'ü',
      '&ccedil;': 'ç',
    };
  
    // Replace HTML entities with their character equivalents
    return text.replace(/&[a-z0-9]+;/gi, (entity) => {
      return entities[entity] || entity;
    });
  };