# How to Add Images & Videos (R2 + Cloudflare Stream)

This site uses:
- R2 for images and general media (`https://media.jpstas.com/...`)
- Cloudflare Stream for videos (embedded via 32‑char video IDs)

Below shows where to place media URLs/IDs inside the codebase.

## 1) Upload images to R2

1. Run the helper script:
   ```bash
   npm run r2:upload ./path/to/local-image.jpg portfolio/my-case/image-01.jpg
   ```
   - Public URL will be printed and copied to clipboard, like:
     `https://media.jpstas.com/portfolio/my-case/image-01.jpg`

2. Use that URL in `Media` objects. The `Media` shape is defined in `src/types/case-study.ts`.
   - For gallery images, add items to `CaseStudy.solution.gallery` with:
     ```json
     { "type": "image", "src": "https://media.jpstas.com/portfolio/my-case/image-01.jpg", "alt": "Short description", "caption": "Optional caption" }
     ```

3. Hero and Before/After also accept `Media`:
   - `hero`: `{ src, alt?, type?: 'image' }`
   - `beforeAfter`: `{ before: Media, after: Media }`

## 2) Add videos

You can embed Cloudflare Stream or link any direct video URL.

- Cloudflare Stream (preferred): use the 32‑char video ID
  - Example gallery item:
    ```json
    { "type": "video", "src": "2f6b0f6a9b2a4d0f8ad1c9a6e5b4c3d2", "poster": "https://media.jpstas.com/portfolio/my-case/video-cover.jpg", "caption": "Optional caption" }
    ```
  - The UI auto-detects a 32‑char hex ID and renders `CloudflareStreamPlayer`.
  - Poster can be an R2 image or Stream’s default thumbnail is used if omitted.

- Direct video URL: use a full URL as `src`
  - Example:
    ```json
    { "type": "video", "src": "https://media.jpstas.com/videos/demo.mp4", "poster": "https://media.jpstas.com/portfolio/my-case/demo-cover.jpg" }
    ```
  - The UI will render `VideoPlayer` for non‑ID `src` values.

## 3) Where this renders

- Gallery and videos are rendered in `src/components/case-study/SolutionGrid.tsx`.
- `ImageGallery` displays non‑video items.
- `CloudflareStreamPlayer` or `VideoPlayer` renders items with `type: 'video'`.

## 4) Quick checklist

- Uploaded to R2 and copied the `https://media.jpstas.com/...` URL
- For Stream videos, used the 32‑char ID in `src`
- Set `alt` for images; optional `caption` and `poster`
- Updated your case study data to include the new `Media` entries
- Test locally:
  ```bash
  npm run dev
  ```
- Optional audit for old URLs:
  ```bash
  npm run r2:audit
  ```

That’s it. Your images/videos will appear in the correct sections automatically.
