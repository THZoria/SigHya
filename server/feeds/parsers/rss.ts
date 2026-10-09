export interface NewsItem {
  title: string
  description: string
  link: string
  guid: string
  pubDate: string
  author?: string
  enclosure?: { url: string; type: string }
  image?: string
}

const HTML_ENTITIES: Record<string, string> = {
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
}

const decodeHTMLEntities = (text: string): string =>
  text
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number.parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&[a-z]+;/gi, (entity) => HTML_ENTITIES[entity] || entity)

const toSafeUrl = (value: string): string => {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

const stripCdata = (value: string): string =>
  value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, '$1').trim()

const extractTag = (block: string, tag: string): string => {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? stripCdata(match[1]) : ''
}

const extractAttr = (block: string, tag: string, attr: string): string => {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*/?>`, 'i'))
  return match?.[1]?.trim() ?? ''
}

export const parseRssFeed = (xmlText: string, limit = 6): NewsItem[] => {
  if (!xmlText.includes('<item')) throw new Error('RSS document contains no items')

  const blocks = xmlText.match(/<item\b[\s\S]*?<\/item>/gi) ?? []
  const items: NewsItem[] = []

  for (const [index, block] of blocks.entries()) {
    if (items.length >= limit) break

    const title = decodeHTMLEntities(extractTag(block, 'title'))
    const description = decodeHTMLEntities(extractTag(block, 'description'))
    const link = toSafeUrl(decodeHTMLEntities(extractTag(block, 'link')))
    const guid = decodeHTMLEntities(extractTag(block, 'guid')) || `item-${index}`
    const pubDate = extractTag(block, 'pubDate')
    const authorRaw = extractTag(block, 'author') || extractTag(block, 'dc:creator')
    const enclosureUrl = toSafeUrl(decodeHTMLEntities(extractAttr(block, 'enclosure', 'url')))
    const enclosureType = extractAttr(block, 'enclosure', 'type')
    const image = toSafeUrl(decodeHTMLEntities(extractTag(block, 'image'))) || undefined

    if (!title && !link) continue

    items.push({
      title,
      description,
      link,
      guid,
      pubDate,
      author: authorRaw ? decodeHTMLEntities(authorRaw) : undefined,
      enclosure: enclosureUrl ? { url: enclosureUrl, type: enclosureType } : undefined,
      image,
    })
  }

  if (items.length === 0) throw new Error('RSS parser produced zero items')
  return items
}
