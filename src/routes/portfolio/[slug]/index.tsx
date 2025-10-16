import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';
import { CaseStudyPage } from '~/components/CaseStudyPage';

// List of all portfolio case study slugs for static generation
const PORTFOLIO_SLUGS = [
  'formstack-integration',
  'caribbeanpools-redesign',
  'deckhand-prototype',
  'print-studio',
  'brand-evolution',
  'caribbean-drone',
  'personal-drone',
  'email-marketing',
  'ivr-system',
  'mindforge',
];

export const useStudy = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const map: Record<string, any> = {
    'formstack-integration': await import('~/data/formstack.json'),
    'caribbeanpools-redesign': await import('~/data/caribbeanpools.json'),
    'deckhand-prototype': await import('~/data/deckhand.json'),
    'print-studio': await import('~/data/printstudio.json'),
    'brand-evolution': await import('~/data/brand-evolution.json'),
    'caribbean-drone': await import('~/data/caribbean-drone.json'),
    'personal-drone': await import('~/data/personal-drone.json'),
    'email-marketing': await import('~/data/email-marketing.json'),
    'ivr-system': await import('~/data/ivr-system.json'),
    'mindforge': await import('~/data/mindforge.json'),
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

