export const decodeHTMLEntities = (text: string): string => {
    const entities = {
      '&quot;': '"',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&#039;': "'",
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
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
  
    return text.replace(/&[a-z0-9]+;/gi, (entity) => {
      return entities[entity as keyof typeof entities] || entity;
    });
  };