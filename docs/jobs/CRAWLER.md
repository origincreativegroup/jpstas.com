# Job crawler architecture

This crawler focuses on getting clean, deduplicated job postings that can be ingested by the local AI pipeline without relying on proprietary SDKs or brittle browser automation. The implementation is split into three layers:

1. **Provider adapters** live in [`scripts/jobs/providers`](../../scripts/jobs/providers) and know how to talk to a specific job network. For this iteration there are adapters for Indeed and LinkedIn.
   - The **Indeed** adapter leans on the public RSS feed (`https://rss.indeed.com/rss`) to avoid brittle HTML scraping. Each `<item>` is parsed, JSON-LD style metadata (company, location, description) is extracted, and the feed metadata is preserved alongside the posting for provenance.
   - The **LinkedIn** adapter uses the guest job-search endpoint (`jobs-guest/jobs/api/seeMoreJobPostings/search`) that powers the public infinite scroll. The HTML fragment is parsed with lightweight regex helpers to grab identifiers, metadata items, remote perks, and timestamps without a headless browser. Pagination, duplicate URL normalisation, and remote filters are handled in code.
2. **Persistence helpers** in [`scripts/jobs/database.js`](../../scripts/jobs/database.js) wrap the system `sqlite3` CLI. Tables are created lazily and all writes run inside a single transaction using UPSERT semantics so reruns simply refresh metadata. Keywords are exploded into a secondary table to support downstream semantic search or embedding pipelines.
3. **The orchestration CLI** [`scripts/job-ingest.js`](../../scripts/job-ingest.js) loads [`scripts/jobs/config.json`](../../scripts/jobs/config.json), iterates through keyword / location permutations, and coordinates provider calls with back-off, deduplication, and summary reporting. Each query can tag its results, force remote-only searches, or tune freshness windows, giving the local AI plenty of metadata to reason about.

## Running the crawler

```bash
node scripts/job-ingest.js
```

The CLI reads configuration, ensures the SQLite database exists (defaults to `tmp/job-postings.sqlite`), and then prints a provider-by-provider summary showing how many rows were inserted or updated. The database can be inspected with the bundled sqlite3 binary:

```bash
sqlite3 tmp/job-postings.sqlite ".mode table" "SELECT title, company, listed_at FROM job_postings ORDER BY listed_at DESC LIMIT 10;"
```

## Configuration knobs

Configuration lives in [`scripts/jobs/config.json`](../../scripts/jobs/config.json). Each `query` block accepts:

- `keywords`: search phrases (quoted phrases are passed through verbatim).
- `locations`: permutations to sweep. For LinkedIn these map to the public location selector; for Indeed they map to RSS feed filters.
- `providers`: which adapters to execute.
- `tags`: labels merged into every posting to make downstream clustering easier.
- `filters.remote`: toggles remote-friendly filters on providers that support them.
- `filters.postedWithinDays`: freshness window.
- `filters.maxPages`: LinkedIn pagination depth.

Global defaults control pacing (`requestDelayMs`), limit per provider, raw HTML preservation, and the output database path.

## Ideas for future enrichment

- Add adapters for Lever, Greenhouse, Workday JSON feeds, and RemoteOK to cover startups and fully remote companies.
- Plug the ingested postings into an embedding pipeline (OpenAI `text-embedding-3-large`, local BGE models, etc.) and persist vectors into a companion table for semantic ranking.
- Implement anomaly detection: track company hiring spikes or new job titles via the timestamped history already persisted.
- Attach a light-weight dedupe heuristic that compares TF-IDF vectors on description snippets before writing to SQLite to avoid redundant posts syndicated across boards.
