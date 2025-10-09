import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { CaseStudyPage } from '~/CaseStudyPage';
import data from '~/data/formstack.json';
import styles from '~/global.css?inline';

export default component$(() => {
  useStylesScoped$(styles);
  return <CaseStudyPage data={data as any} />;
});
