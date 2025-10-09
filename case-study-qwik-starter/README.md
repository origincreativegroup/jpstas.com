# Case Study Qwik Starter

Qwik + Qwik City implementation of your case study template.
- Components mirror your wire maps.
- JSON-driven data (local demo) with dynamic route `/case-studies/[slug]`.

## Quickstart
1. `pnpm i` (or `npm i`, `yarn`)
2. `pnpm dev` → open http://localhost:5173
3. Home page renders `formstack.json`. Visit:
   - `/case-studies/formstack-integration`
   - `/case-studies/caribbeanpools-redesign`
   - `/case-studies/deckhand-prototype`

## Integrate with jpstas.com
- Copy `src/components/*` and `src/CaseStudyPage.tsx`.
- Use `routeLoader$` to fetch from your CMS/Drive (swap the naive import map).
- Replace `global.css` with Tailwind if desired; class names already align.
