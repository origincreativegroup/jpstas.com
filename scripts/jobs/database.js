import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { escapeSqlString, toSqlTimestamp, unique } from './utils.js';

const execFileAsync = promisify(execFile);

async function runSql(dbPath, statements) {
  const sql = Array.isArray(statements) ? statements.join('\n') : statements;
  await execFileAsync('sqlite3', ['-batch', dbPath, sql], { encoding: 'utf8' });
}

async function queryJson(dbPath, statement) {
  const { stdout } = await execFileAsync(
    'sqlite3',
    ['-batch', dbPath, '.mode', 'json', statement],
    { encoding: 'utf8' }
  );
  if (!stdout?.trim()) {
    return [];
  }
  try {
    return JSON.parse(stdout);
  } catch (error) {
    console.warn('Failed to parse sqlite output', stdout);
    throw error;
  }
}

export async function prepareDatabase(dbPath) {
  await mkdir(dirname(dbPath), { recursive: true });
  const createStatements = [
    'PRAGMA journal_mode=WAL;',
    'CREATE TABLE IF NOT EXISTS job_postings (' +
      'id TEXT PRIMARY KEY,' +
      'source TEXT NOT NULL,' +
      'external_id TEXT,' +
      'title TEXT NOT NULL,' +
      'company TEXT,' +
      'location TEXT,' +
      'description TEXT,' +
      'url TEXT NOT NULL,' +
      'listed_at TEXT,' +
      'tags TEXT,' +
      'raw TEXT,' +
      'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' +
      ');',
    'CREATE TABLE IF NOT EXISTS job_keywords (' +
      'job_id TEXT NOT NULL,' +
      'keyword TEXT NOT NULL,' +
      'PRIMARY KEY (job_id, keyword),' +
      'FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE' +
      ');',
    'CREATE INDEX IF NOT EXISTS idx_job_listed_at ON job_postings(listed_at);',
    'CREATE INDEX IF NOT EXISTS idx_job_company ON job_postings(company);',
    'CREATE INDEX IF NOT EXISTS idx_job_keywords ON job_keywords(keyword);',
  ];
  await runSql(dbPath, createStatements);
}

export async function fetchExistingJobIds(dbPath, jobIds) {
  if (!jobIds.length) {
    return new Set();
  }
  const values = jobIds.map((id) => escapeSqlString(id));
  const statement = `SELECT id FROM job_postings WHERE id IN (${values.join(',')});`;
  const rows = await queryJson(dbPath, statement);
  return new Set(rows.map((row) => row.id));
}

export async function upsertJobs(dbPath, jobs) {
  if (!jobs.length) {
    return { inserted: 0, updated: 0 };
  }
  const existingIds = await fetchExistingJobIds(dbPath, jobs.map((job) => job.id));
  const statements = ['BEGIN TRANSACTION;'];
  for (const job of jobs) {
    const values = {
      id: escapeSqlString(job.id),
      source: escapeSqlString(job.source),
      externalId: escapeSqlString(job.externalId || null),
      title: escapeSqlString(job.title),
      company: escapeSqlString(job.company || null),
      location: escapeSqlString(job.location || null),
      description: escapeSqlString(job.description || null),
      url: escapeSqlString(job.url),
      listedAt: toSqlTimestamp(job.listedAt),
      tags: escapeSqlString(JSON.stringify(unique(job.tags || []))),
      raw: escapeSqlString(job.raw ? JSON.stringify(job.raw) : null),
    };
    statements.push(
      'INSERT INTO job_postings (id, source, external_id, title, company, location, description, url, listed_at, tags, raw) VALUES (' +
        [
          values.id,
          values.source,
          values.externalId,
          values.title,
          values.company,
          values.location,
          values.description,
          values.url,
          values.listedAt,
          values.tags,
          values.raw,
        ].join(',') +
        ') ON CONFLICT(id) DO UPDATE SET ' +
        'source=excluded.source,' +
        'external_id=excluded.external_id,' +
        'title=excluded.title,' +
        'company=excluded.company,' +
        'location=excluded.location,' +
        'description=excluded.description,' +
        'url=excluded.url,' +
        'listed_at=COALESCE(excluded.listed_at, job_postings.listed_at),' +
        'tags=excluded.tags,' +
        'raw=COALESCE(excluded.raw, job_postings.raw),' +
        'updated_at=CURRENT_TIMESTAMP;'
    );
    statements.push(`DELETE FROM job_keywords WHERE job_id = ${values.id};`);
    for (const keyword of unique(job.keywords || [])) {
      const keywordValue = escapeSqlString(keyword.toLowerCase());
      statements.push(
        `INSERT OR IGNORE INTO job_keywords (job_id, keyword) VALUES (${values.id}, ${keywordValue});`
      );
    }
  }
  statements.push('COMMIT;');
  await runSql(dbPath, statements);

  let inserted = 0;
  let updated = 0;
  const seen = new Set(existingIds);
  for (const job of jobs) {
    if (seen.has(job.id)) {
      updated += 1;
    } else {
      inserted += 1;
      seen.add(job.id);
    }
  }
  return { inserted, updated };
}
