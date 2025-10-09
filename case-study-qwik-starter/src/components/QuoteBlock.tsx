import { component$ } from '@builder.io/qwik';

export const QuoteBlock = component$(({ quote, author, role }: { quote: string; author?: string; role?: string }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <blockquote class="italic text-gray-700">“{quote}”</blockquote>
      {(author || role) && (
        <div class="mt-2 text-sm text-gray-500">— {author}{role ? `, ${role}` : ''}</div>
      )}
    </section>
  );
});
