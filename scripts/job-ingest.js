#!/usr/bin/env node
import { readJsonFile, resolveRelativePath, unique, buildJobId, sleep } from './jobs/utils.js';
import { prepareDatabase, upsertJobs } from './jobs/database.js';
import { fetchIndeedJobs } from './jobs/providers/indeed.js';
import { fetchLinkedInJobs } from './jobs/providers/linkedin.js';

const PROVIDERS = {
  indeed: fetchIndeedJobs,
  linkedin: fetchLinkedInJobs,
};

function formatLabel(query, keyword, location, provider) {
  const labelParts = [query.label || keyword || 'query'];
  if (location) labelParts.push(location);
  labelParts.push(provider);
  return labelParts.join(' • ');
}

function buildProviderOptions(query, keyword, location, providerName, defaults) {
  const { filters = {}, tags = [] } = query;
  const base = {
    keyword,
    location,
    limit: query.limit ?? defaults.limitPerProvider,
    postedWithinDays: filters.postedWithinDays ?? defaults.postedWithinDays,
    remote: filters.remote ?? false,
    tags,
    maxPages: filters.maxPages ?? defaults.maxPages,
    requestDelayMs: defaults.requestDelayMs,
    saveRawHtml: defaults.saveRawHtml,
  };
  if (providerName === 'indeed') {
    base.maxPages = 1;
  }
  return base;
}

function enrichJob(job, query, keyword, location) {
  const tagSet = unique([...(job.tags || []), ...(query.tags || []), keyword, location].filter(Boolean));
  const keywordSet = unique([...(job.keywords || []), ...(query.tags || []), keyword, location].filter(Boolean));
  return {
    ...job,
    id: job.id || buildJobId(job),
    tags: tagSet,
    keywords: keywordSet,
  };
}

async function processQuery(context) {
  const { query, keyword, location, providerName, defaults, dbPath } = context;
  const provider = PROVIDERS[providerName];
  if (!provider) {
    console.warn(`Provider ${providerName} is not supported.`);
    return { inserted: 0, updated: 0, total: 0 };
  }
  const options = buildProviderOptions(query, keyword, location, providerName, defaults);
  const label = formatLabel(query, keyword, location, providerName);
  console.log(`\n→ ${label}`);
  try {
    const jobs = await provider(options);
    if (!jobs.length) {
      console.log('   No results returned.');
      return { inserted: 0, updated: 0, total: 0 };
    }
    const normalizedJobs = jobs.map((job) => enrichJob(job, query, keyword, location));
    const { inserted, updated } = await upsertJobs(dbPath, normalizedJobs);
    console.log(
      `   Processed ${normalizedJobs.length} job(s). inserted=${inserted} updated=${updated}`
    );
    return { inserted, updated, total: normalizedJobs.length };
  } catch (error) {
    console.error(`   Failed to crawl ${providerName}:`, error.message);
    return { inserted: 0, updated: 0, total: 0 };
  }
}

async function main() {
  const defaults = {
    limitPerProvider: 40,
    postedWithinDays: 7,
    requestDelayMs: 1500,
    maxPages: 3,
    saveRawHtml: false,
  };
  const configUrl = new URL('./jobs/config.json', import.meta.url);
  const config = await readJsonFile(configUrl);
  Object.assign(defaults, config.defaults || {});
  const dbPath = resolveRelativePath(import.meta.url, `./${config.database?.path || 'tmp/job-postings.sqlite'}`);

  await prepareDatabase(dbPath);

  const summary = {
    total: 0,
    inserted: 0,
    updated: 0,
    perProvider: {},
  };

  for (const query of config.queries || []) {
    for (const keyword of query.keywords || []) {
      for (const location of query.locations || ['']) {
        for (const providerName of query.providers || Object.keys(PROVIDERS)) {
          const result = await processQuery({
            query,
            keyword,
            location,
            providerName,
            defaults,
            dbPath,
          });
          summary.total += result.total;
          summary.inserted += result.inserted;
          summary.updated += result.updated;
          if (!summary.perProvider[providerName]) {
            summary.perProvider[providerName] = { total: 0, inserted: 0, updated: 0 };
          }
          summary.perProvider[providerName].total += result.total;
          summary.perProvider[providerName].inserted += result.inserted;
          summary.perProvider[providerName].updated += result.updated;
          await sleep(defaults.requestDelayMs);
        }
      }
    }
  }

  console.log('\nSummary');
  console.log('=======');
  for (const [provider, stats] of Object.entries(summary.perProvider)) {
    console.log(
      `${provider}: total=${stats.total} inserted=${stats.inserted} updated=${stats.updated}`
    );
  }
  console.log(
    `Overall: total=${summary.total} inserted=${summary.inserted} updated=${summary.updated}`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Job ingestion failed', error);
    process.exitCode = 1;
  });
}
