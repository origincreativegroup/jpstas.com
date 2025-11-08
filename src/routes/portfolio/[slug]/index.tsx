import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';
import { CaseStudyPage } from '~/components/CaseStudyPage';

// List of all portfolio case study slugs for static generation
const PORTFOLIO_SLUGS = [
  'brand-evolution',
  'customer-experience-systems',
  'in-house-print-studio',
  'media-campaigns',
  'website-redesign',
];

export const useStudy = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const map: Record<string, any> = {
    'brand-evolution': await import('~/data/portfolio/brand-evolution.json'),
    'customer-experience-systems': await import('~/data/portfolio/customer-experience-systems.json'),
    'in-house-print-studio': await import('~/data/portfolio/in-house-print-studio.json'),
    'media-campaigns': await import('~/data/portfolio/media-campaigns.json'),
    'website-redesign': await import('~/data/portfolio/website-redesign.json'),
  };
  const mod = map[slug];
  if (!mod) throw new Error('Case study not found');
  return mod.default || mod;
});

// Tell Qwik which portfolio pages to statically generate
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: PORTFOLIO_SLUGS.map((slug) => ({ slug })),
  };
};

export default component$(() => {
  const study = useStudy();
  return <CaseStudyPage data={study.value as any} />;
});

export const head: DocumentHead = ({ resolveValue }) => {
  const study = resolveValue(useStudy);
  return {
    title: `${study.title} - John P. Stas Portfolio`,
    meta: [
      {
        name: 'description',
        content: study.tagline,
      },
    ],
  };
};

