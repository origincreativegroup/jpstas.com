<!-- 36e93a05-2d17-4930-8e16-92851d3b25b2 8f946b13-c4d9-4e28-97ba-3b4f956e2368 -->
# CMS Cleanup and Media How‑To

## Scope

- Remove CMS attempt artifacts while keeping R2 and Cloudflare Stream intact.
- Add a short how‑to for placing images/videos in the correct spots using existing data shapes and components.

## Files to Change/Delete

- Delete: `workers/cms-media-api.ts`
- Delete: `workers/wrangler.toml`
- Edit: `package.json` → remove scripts `cms:deploy`, `cms:dev`
- Keep: `docs/cms/` folder (retain CMS notes)
- Add: `docs/HOWTO_ADD_MEDIA.md` with step‑by‑step guide

## References in Code

- Cloudflare Stream player: `src/components/CloudflareStreamPlayer.tsx` (expects `videoId`)
- Video fallback: `src/components/VideoPlayer.tsx`
- Gallery + video routing: `src/components/case-study/SolutionGrid.tsx`
- Media shape: `src/types/case-study.ts` (`Media` supports `type`, `src`, `poster`, `caption`)
- R2 upload helper: `scripts/upload-to-r2.js` (outputs public URL under `https://media.jpstas.com/...`)

## Edits (concise)

- In `package.json` remove:
- "cms:deploy": "cd workers && npx wrangler deploy"
- "cms:dev": "cd workers && npx wrangler dev"

## New doc contents (essentials to include)

- R2 image flow: upload → copy public URL → add to `CaseStudy.solution.gallery` item with `{ type: 'image', src, alt, caption? }`
- Cloudflare Stream video flow: upload to Stream → copy 32‑char video ID → add to gallery item `{ type: 'video', src: '<VIDEO_ID>', poster? (R2 URL or Stream thumbnail), caption? }`; non‑ID URLs will render via `<VideoPlayer>` instead.
- Hero/before‑after usage: set `hero` and `beforeAfter` using `Media` objects with R2 URLs.
- Quick examples and validation checklist (run `npm run dev`, verify gallery/Stream rendering, optional `npm run r2:audit`).

### To-dos

- [ ] Delete workers/cms-media-api.ts and workers/wrangler.toml
- [ ] Remove cms:deploy and cms:dev from package.json
- [ ] Optionally delete docs/cms/ folder (if approved)
- [ ] Create docs/HOWTO_ADD_MEDIA.md with R2 + Stream steps