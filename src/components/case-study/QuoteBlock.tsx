import { component$ } from '@builder.io/qwik';

export const QuoteBlock = component$(({ quote, author, role }: { quote: string; author?: string; role?: string }) => {
  return (
    <section class="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 shadow-sm p-8">
      <blockquote class="text-2xl italic text-gray-800 text-center leading-relaxed">
        "{quote}"
      </blockquote>
      {(author || role) && (
        <div class="mt-4 text-center text-gray-600 font-medium">
          — {author}{role ? `, ${role}` : ''}
        </div>
      )}
    </section>
  );
});

