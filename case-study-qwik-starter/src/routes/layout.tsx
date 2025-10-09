import { component$, Slot } from '@builder.io/qwik';
import '~/global.css';

export default component$(() => {
  return (
    <div class="mx-auto max-w-6xl p-4 md:p-8 bg-gray-100 min-h-screen">
      <Slot />
    </div>
  );
});
