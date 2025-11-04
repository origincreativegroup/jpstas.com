import { fetchWithRetries, decodeHtmlEntities, stripTags, normalizeWhitespace, parseRelativeDate } from '../utils.js';

function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml))) {
    const itemXml = match[1];
    const getTag = (tag) => {
      const tagRegex = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i');
      const tagMatch = tagRegex.exec(itemXml);
      if (!tagMatch) return '';
      return decodeHtmlEntities(tagMatch[1].replace(/<!\[CDATA\[|\]\]>/g, ''));
    };
    const title = normalizeWhitespace(stripTags(getTag('title')));
    const link = normalizeWhitespace(getTag('link'));
    const description = getTag('description');
    const pubDate = normalizeWhitespace(getTag('pubDate'));
    items.push({ title, link, description, pubDate, raw: itemXml });
  }
  return items;
}

function parseDescriptionMeta(description) {
  const companyMatch = description.match(/Company:\s*([^<]+)<br\s*\/?/i);
  const locationMatch = description.match(/Location:\s*([^<]+)<br\s*\/?/i);
  const snippetMatch = description.match(/Description:\s*([\s\S]+)/i);
  const company = companyMatch ? normalizeWhitespace(companyMatch[1]) : '';
  const location = locationMatch ? normalizeWhitespace(locationMatch[1]) : '';
  const snippet = snippetMatch ? normalizeWhitespace(stripTags(snippetMatch[1])) : '';
  return { company, location, snippet };
}

function buildIndeedRssUrl({ keyword, location, remote, postedWithinDays }) {
  const url = new URL('https://rss.indeed.com/rss');
  if (keyword) {
    url.searchParams.set('q', keyword);
  }
  if (location) {
    url.searchParams.set('l', location);
  }
  if (remote) {
    url.searchParams.set('remotejob', '1');
  }
  if (postedWithinDays) {
    url.searchParams.set('fromage', String(postedWithinDays));
  }
  url.searchParams.set('sort', 'date');
  return url.toString();
}

export async function fetchIndeedJobs(options) {
  const {
    keyword,
    location,
    limit = 40,
    postedWithinDays,
    remote,
    tags = [],
    saveRawHtml = false,
  } = options;

  const feedUrl = buildIndeedRssUrl({ keyword, location, remote, postedWithinDays });
  const response = await fetchWithRetries(feedUrl, {
    headers: {
      accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
    },
  });
  const xml = await response.text();
  const items = parseRssItems(xml).slice(0, limit);
  const results = [];
  for (const item of items) {
    const { company, location: parsedLocation, snippet } = parseDescriptionMeta(item.description);
    let externalId = '';
    try {
      const jobUrl = new URL(item.link);
      externalId = jobUrl.searchParams.get('jk') || jobUrl.searchParams.get('vjk') || '';
    } catch (error) {
      externalId = '';
    }
    const listedAt = parseRelativeDate(item.pubDate) || item.pubDate || null;
    const job = {
      source: 'indeed',
      externalId,
      title: item.title,
      company: company || '',
      location: parsedLocation || location || '',
      description: snippet,
      url: item.link,
      listedAt,
      tags,
      keywords: [keyword, company, parsedLocation].filter(Boolean),
      raw: saveRawHtml ? { feedUrl, xml: item.raw } : { feedUrl },
    };
    results.push(job);
  }
  return results;
}
