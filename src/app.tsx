import { component$ } from '@builder.io/qwik';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

export const App = component$(() => {
  return (
    <div class="min-h-screen flex flex-col">
      <Header />
      <main class="flex-grow pt-20">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
});
