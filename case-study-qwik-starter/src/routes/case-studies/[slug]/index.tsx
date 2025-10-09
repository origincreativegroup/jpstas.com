import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { CaseStudyPage } from '~/CaseStudyPage';

export const useStudy = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const map: Record<string, any> = {
    'formstack-integration': await import('~/data/formstack.json'),
    'caribbeanpools-redesign': await import('~/data/caribbeanpools.json'),
    'deckhand-prototype': await import('~/data/deckhand.json'),
  };
  const mod = map[slug];
  if (!mod) throw new Error('Not found');
  return mod.default || mod;
});

export default component$(() => {
  const study = useStudy();
  return <CaseStudyPage data={study.value as any} />;
});
