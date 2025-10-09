import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  const isMenuOpen = useSignal(false);

  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral/20">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" class="flex items-center space-x-2 group">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
              <span class="text-white font-bold text-sm">JS</span>
            </div>
            <span class="text-xl font-semibold text-charcoal group-hover:text-primary transition-colors">
              John P. Stas
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center space-x-8">
            <Link href="/about" class="text-charcoal hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/portfolio" class="text-charcoal hover:text-primary transition-colors font-medium">
              Work
            </Link>
            <Link href="/resume" class="text-charcoal hover:text-primary transition-colors font-medium">
              Resume
            </Link>
            <Link 
              href="/contact" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            class="md:hidden p-2 rounded-lg hover:bg-neutral/10 transition-colors"
            onClick$={() => isMenuOpen.value = !isMenuOpen.value}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen.value ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen.value && (
          <div class="md:hidden py-4 border-t border-neutral/20">
            <div class="flex flex-col space-y-4">
              <Link href="/about" class="text-charcoal hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link href="/portfolio" class="text-charcoal hover:text-primary transition-colors font-medium">
                Work
              </Link>
              <Link href="/resume" class="text-charcoal hover:text-primary transition-colors font-medium">
                Resume
              </Link>
              <Link 
                href="/contact" 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium text-center"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});

