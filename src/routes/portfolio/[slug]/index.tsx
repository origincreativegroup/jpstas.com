import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';
import { CaseStudyPage } from '~/components/CaseStudyPage';

// List of all portfolio case study slugs for static generation
const PORTFOLIO_SLUGS = [
  'brand-evolution',
  'caribbeanpools-redesign',
  'generative-ai',
  'mixed-media',
  'motion-systems',
  'drone-media',
  'print-studio',
];

export const useStudy = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const map: Record<string, any> = {
    'brand-evolution': await import('~/data/brand-evolution.json'),
    'caribbeanpools-redesign': await import('~/data/caribbeanpools.json'),
    'generative-ai': await import('~/data/generative-ai.json'),
    'mixed-media': await import('~/data/mixed.json'),
    'motion-systems': await import('~/data/motion.json'),
    'drone-media': await import('~/data/dronemedia.json'),
    'print-studio': await import('~/data/printstudio.json'),
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

