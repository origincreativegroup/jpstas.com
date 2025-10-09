import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { CaseStudyPage } from '~/components/CaseStudyPage';

export const useStudy = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const map: Record<string, any> = {
    'formstack-integration': await import('~/data/formstack.json'),
    'caribbeanpools-redesign': await import('~/data/caribbeanpools.json'),
    'deckhand-prototype': await import('~/data/deckhand.json'),
    'print-studio': await import('~/data/printstudio.json'),
    'brand-evolution': await import('~/data/brand-evolution.json'),
    'drone-media': await import('~/data/drone-media.json'),
    'email-marketing': await import('~/data/email-marketing.json'),
    'ivr-system': await import('~/data/ivr-system.json'),
    'mindforge': await import('~/data/mindforge.json'),
    'shopcaribbeanpools': await import('~/data/shopcaribbeanpools.json'),
  };
  const mod = map[slug];
  if (!mod) throw new Error('Case study not found');
  return mod.default || mod;
});

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

