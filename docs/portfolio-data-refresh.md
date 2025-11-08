# Portfolio Case Study Data Refresh

This project now sources featured case studies from the Markdown content stored in the `jpstas_portfolio_assets_FINAL_with_portfolio` repository. Follow the steps below whenever you need to update or regenerate the JSON consumed by the site.

## Prerequisites
- The external content repo is available locally at `/Users/origin/GitHub/jspow/jpstas_portfolio_assets_FINAL_with_portfolio`.
- Asset metadata lives in `assets/assets.manifest.json` within that repo.
- You have Node.js installed and can run project scripts.

## Regeneration Workflow
1. **Update Markdown & Assets**  
   Edit the Markdown files in `content/portfolio/`. Keep the metadata block (`**Role:**`, `**Summary:**`, etc.) intact—`generate-portfolio-data.js` parses those fields.

2. **Verify Asset Manifest Entries**  
   Ensure every `{{ASSET:...}}` placeholder used in the Markdown has a corresponding entry in `assets/assets.manifest.json`. The generator reads alt text, captions, and bucket paths from that file.

3. **Generate JSON**  
   From the `jpstas.com` project root run:
   ```bash
   node scripts/generate-portfolio-data.js
   ```
   This script produces fresh JSON files in `src/data/portfolio/` and normalizes tags, tools, media galleries, and metrics.

4. **Review Generated Data**  
   Spot-check the JSON output for each case study, focusing on:
   - `hero` and `cardImage` URLs
   - Metrics/impact labels and values
   - Process steps and solution bullet formatting

5. **Sync Builder Content (Optional)**  
   If you publish to Builder.io, re-import the data with:
   ```bash
   node scripts/import-content-only.js
   ```
   or run the full setup via `node scripts/import-all-content.js`.

6. **Run Local Validation**  
   - Optional: `npm run build.types` (may surface unrelated type warnings)
   - Load `/portfolio` and individual `/portfolio/<slug>` pages in `npm run dev` to check rendering.

## Notes
- Backups of the previous JSON live under `archive/` with timestamped folders.
- The site now reads case studies exclusively from `src/data/portfolio/`; legacy entries in `src/data/` have been removed.
- Non-featured case studies (e.g. legacy projects) still live in their original JSON files until corresponding Markdown sources are added.
