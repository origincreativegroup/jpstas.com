import { fetchWithRetries, normalizeWhitespace, stripTags, parseRelativeDate, decodeHtmlEntities, sleep } from '../utils.js';

function buildLinkedInUrl({ keyword, location, start, postedWithinDays, remote }) {
  const url = new URL('https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search');
  if (keyword) {
    url.searchParams.set('keywords', keyword);
  }
  if (location) {
    url.searchParams.set('location', location);
  }
  if (postedWithinDays) {
    const seconds = Math.max(1, Number(postedWithinDays) * 24 * 60 * 60);
    url.searchParams.set('f_TPR', `r${seconds}`);
  }
  if (remote) {
    url.searchParams.set('f_WT', '2');
  }
  url.searchParams.set('start', String(start || 0));
  url.searchParams.set('position', '1');
  url.searchParams.set('pageNum', '0');
  url.searchParams.set('refresh', 'true');
  return url.toString();
}

function extractAttr(source, attr) {
  const regex = new RegExp(`${attr}="([^"]*)"`);
  const match = regex.exec(source);
  return match ? decodeHtmlEntities(match[1]) : '';
}

function extractText(source, tag, className) {
  const regex = new RegExp(`<${tag}[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const match = regex.exec(source);
  return match ? normalizeWhitespace(stripTags(decodeHtmlEntities(match[1]))) : '';
}

function extractAllTexts(source, tag, className) {
  const regex = new RegExp(`<${tag}[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\/${tag}>`, 'gi');
  const values = [];
  let match;
  while ((match = regex.exec(source))) {
    values.push(normalizeWhitespace(stripTags(decodeHtmlEntities(match[1]))));
  }
  return values;
}

function parseLinkedInListings(html) {
  const items = [];
  const itemRegex = /<li[^>]*class="[^"]*base-card[^"]*job-search-card[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = itemRegex.exec(html))) {
    const itemHtml = match[1];
    const urn = extractAttr(match[0], 'data-entity-urn');
    const externalId = urn?.split(':').pop() || '';
    const urlMatch = match[0].match(/<a[^>]*class="[^"]*base-card__full-link[^"]*"[^>]*href="([^"]+)"/i);
    const rawUrl = urlMatch ? decodeHtmlEntities(urlMatch[1]) : '';
    const title = extractText(itemHtml, 'h3', 'base-search-card__title');
    const company = extractText(itemHtml, 'h4', 'base-search-card__subtitle');
    const location = extractText(itemHtml, 'span', 'job-search-card__location');
    const snippet = extractText(itemHtml, 'p', 'job-search-card__snippet');
    const listedAtText = extractText(itemHtml, 'time', 'job-search-card__listdate');
    const listedAt = parseRelativeDate(listedAtText) || extractAttr(itemHtml, 'datetime') || null;
    const insights = extractAllTexts(itemHtml, 'li', 'job-card-container__metadata-item');
    const benefits = extractAllTexts(itemHtml, 'span', 'result-benefits__text');

    let cleanUrl = rawUrl;
    try {
      if (rawUrl) {
        const normalized = new URL(rawUrl);
        normalized.searchParams.delete('refId');
        normalized.searchParams.delete('trackingId');
        cleanUrl = normalized.toString();
      }
    } catch (error) {
      cleanUrl = rawUrl;
    }

    items.push({
      externalId,
      url: cleanUrl,
      title,
      company,
      location,
      snippet,
      listedAt,
      insights,
      benefits,
      raw: itemHtml,
    });
  }
  return items;
}

export async function fetchLinkedInJobs(options) {
  const {
    keyword,
    location,
    limit = 40,
    postedWithinDays,
    remote,
    tags = [],
    maxPages = 3,
    requestDelayMs = 1500,
    saveRawHtml = false,
  } = options;

  const results = [];
  const pageSize = 25;
  for (let page = 0; page < maxPages && results.length < limit; page += 1) {
    const start = page * pageSize;
    const url = buildLinkedInUrl({ keyword, location, start, postedWithinDays, remote });
    const response = await fetchWithRetries(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const html = await response.text();
    const items = parseLinkedInListings(html);
    if (!items.length) {
      break;
    }
    for (const item of items) {
      results.push({
        source: 'linkedin',
        externalId: item.externalId,
        title: item.title,
        company: item.company,
        location: item.location || location || '',
        description: item.snippet,
        url: item.url,
        listedAt: item.listedAt,
        tags,
        keywords: [keyword, item.company, item.location, ...item.insights, ...item.benefits].filter(Boolean),
        raw: saveRawHtml
          ? {
              url,
              html: item.raw,
              insights: item.insights,
              benefits: item.benefits,
            }
          : { url },
      });
      if (results.length >= limit) {
        break;
      }
    }
    if (items.length < pageSize || results.length >= limit) {
      break;
    }
    await sleep(requestDelayMs);
  }
  return results.slice(0, limit);
}
