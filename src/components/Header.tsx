import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <nav class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <Link href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            John P. Stas
          </Link>
          
          <ul class="flex gap-8 items-center">
            <li>
              <Link href="/about" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/portfolio" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/resume" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Resume
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
});

