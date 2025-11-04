import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function normalizeWhitespace(value) {
  return value ? value.replace(/\s+/g, ' ').trim() : '';
}

export function decodeHtmlEntities(value) {
  if (!value) return '';
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

export function stripTags(value) {
  return normalizeWhitespace(value?.replace(/<[^>]+>/g, ''));
}

export function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export async function fetchWithRetries(url, options = {}) {
  const { retries = 3, backoffMs = 1500 } = options;
  let attempt = 0;
  let error;
  const requestInit = {
    redirect: 'follow',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ...options.headers,
    },
    ...options,
  };
  while (attempt <= retries) {
    try {
      const response = await fetch(url, requestInit);
      if (!response.ok) {
        error = new Error(`Request failed with status ${response.status}`);
        if (response.status >= 500 && attempt < retries) {
          await sleep(backoffMs * (attempt + 1));
          attempt += 1;
          continue;
        }
        throw error;
      }
      return response;
    } catch (err) {
      error = err;
      if (attempt >= retries) {
        throw error;
      }
      await sleep(backoffMs * (attempt + 1));
      attempt += 1;
    }
  }
  throw error;
}

export function parseRelativeDate(relativeText) {
  if (!relativeText) return null;
  const text = relativeText.toLowerCase();
  const now = new Date();
  if (text.includes('today') || text.includes('just posted')) {
    return now.toISOString();
  }
  const match = text.match(/(\d+)[^\d]+(hour|hr|day|week|month|minute)/i);
  if (match) {
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const result = new Date(now);
    switch (unit) {
      case 'minute':
        result.setMinutes(result.getMinutes() - value);
        break;
      case 'hour':
      case 'hr':
        result.setHours(result.getHours() - value);
        break;
      case 'day':
        result.setDate(result.getDate() - value);
        break;
      case 'week':
        result.setDate(result.getDate() - value * 7);
        break;
      case 'month':
        result.setMonth(result.getMonth() - value);
        break;
      default:
        break;
    }
    return result.toISOString();
  }
  if (text.includes('30+')) {
    const result = new Date(now);
    result.setDate(result.getDate() - 30);
    return result.toISOString();
  }
  const parsed = Date.parse(relativeText);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }
  return null;
}

export function buildJobId(job) {
  const hash = createHash('sha256');
  hash.update(job.source || '');
  hash.update('|');
  hash.update(job.externalId || '');
  hash.update('|');
  hash.update(job.url || '');
  hash.update('|');
  hash.update(job.title || '');
  hash.update('|');
  hash.update(job.company || '');
  return hash.digest('hex');
}

export function escapeSqlString(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function toSqlTimestamp(value) {
  if (!value) return 'NULL';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'NULL';
  }
  return escapeSqlString(date.toISOString());
}

export async function readJsonFile(filePathUrl) {
  const filePath = fileURLToPath(filePathUrl);
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export function resolveRelativePath(baseUrl, relativePath) {
  const absolute = resolve(dirname(fileURLToPath(baseUrl)), relativePath);
  return absolute;
}

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}
