import { component$, Slot } from '@builder.io/qwik';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Skip to main content link for keyboard navigation accessibility */}
      <a href="#main-content" class="skip-to-main">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" class="flex-grow pt-20" role="main" tabIndex={-1}>
        <Slot />
      </main>
      <Footer />
    </div>
  );
});

