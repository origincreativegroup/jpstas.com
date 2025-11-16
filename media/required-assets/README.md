# Media Drop Folder

This directory mirrors the deliverables described in `docs/media/MEDIA_ASSETS_REQUIRED.md`. Drop finalized assets into the matching folders before uploading to R2 (`https://media.jpstas.com/...`). Each folder name maps directly to the consuming UI section so nothing gets misplaced.

## Folder Map

- `homepage/hero-carousel/` – 3 JPGs (`brand-evolution-hero`, `drone-hero`, `generative-ai-hero`). 4:3 @ 2400×1800 (min 1200×900). Upload to R2 as `homepage/hero-carousel/<file>.jpg`.
- `homepage/bento-grid/` – 6 JPG cards (`brand-evolution-hero`, `generative-ai-card`, `caribbeanpools-website-redesign-homepage-drone-banner`, `mixed-media-card`, `motion-card`, `print-card`). 4:3 @ 1600×1200 (min 800×600).
- `case-studies/heroes/` – 8 hero JPGs (`brand-evolution-hero`, `drone-hero`, `generative-ai-hero`, `mixed-media-hero`, `motion-hero`, `print-hero`, `caribbeanpools-website-redesign-homepage-drone-banner`, `hp-latex-315-printer-large-format-printing`). Flexible ratio @ 2000×1500 (min 1000×750).
- `case-studies/galleries/<slug>/` – Gallery drops for each case study. Use the slug folders already created (`brand-evolution`, `drone-media`, `generative-ai`, `mixed-media`, `motion-systems`, `print-systems`, `caribbeanpools-redesign`, `print-studio`). Square 2400×2400 or landscape 2400×1600 (min 1200px longest side).
- `videos/files/` – Any MP4 assets (1920×1080 min).
- `videos/posters/` – JPG poster frames for each video (1600×1200 recommended).

## Naming Cheatsheet

Follow the conventions from the media requirements doc:

- Hero: `{project-slug}-hero.jpg`
- Card: `{project-slug}-card.jpg`
- Gallery: `{project-slug}-{descriptor}.jpg`
- Video: `{project-slug}-{descriptor}.mp4`
- Poster: `{project-slug}-{descriptor}-poster.jpg`

## Next Steps

1. Copy or export assets into the matching folder.
2. Run `npm run r2:upload <local-path> <remote-path>` to push each file to R2 using the same relative path (e.g. `portfolio/brand-evolution/brand-logo-evolution.jpg`).
3. Update the corresponding JSON entries under `src/data`/`src/content` with the final `https://media.jpstas.com/...` URLs and descriptive `alt` text.

Everything stays organized here before upload, so you can drag/drop confidently without re-checking the requirements doc each time.

