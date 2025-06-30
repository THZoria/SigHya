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
 * decodeHTMLEntities('L&#039;équipe') // Returns: 'L'équipe'
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
  
    // First, handle numeric entities (like &#039;)
    let decodedText = text.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });
    
    // Then, handle named entities
    decodedText = decodedText.replace(/&[a-z]+;/gi, (entity) => {
      return entities[entity] || entity;
    });
    
    return decodedText;
  };