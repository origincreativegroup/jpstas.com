import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export const Header = component$(() => {
  const isMenuOpen = useSignal(false);
  const isScrolled = useSignal(false);
  const location = useLocation();

  // Scroll detection
  useVisibleTask$(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const isActive = (path: string) => {
    return location.url.pathname === path || location.url.pathname.startsWith(path + '/');
  };

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-50 border-b border-[#d0c3a31f] transition-all duration-300 ${
        isScrolled.value
          ? 'bg-[#191d1cee] backdrop-blur-xl shadow-xl'
          : 'bg-[#181c27]/80 backdrop-blur-sm'
      }`}
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="w-10 h-10 bg-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                <span class="text-surface-deep font-bold text-base">JS</span>
              </div>
            </div>
            <span class="text-xl font-bold text-cream group-hover:text-gold transition-colors hidden sm:block">
              John P. Stas
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/about" 
              class={`relative px-3 py-2 font-semibold text-sm tracking-[0.2em] uppercase transition-all ${
                isActive('/about') 
                  ? 'text-gold' 
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              About
              {isActive('/about') && (
                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </Link>
            <Link 
              href="/portfolio" 
              class={`relative px-3 py-2 font-semibold text-sm tracking-[0.2em] uppercase transition-all ${
                isActive('/portfolio') 
                  ? 'text-gold' 
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              Work
              {isActive('/portfolio') && (
                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </Link>
            <Link 
              href="/resume" 
              class={`relative px-3 py-2 font-semibold text-sm tracking-[0.2em] uppercase transition-all ${
                isActive('/resume') 
                  ? 'text-gold' 
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              Resume
              {isActive('/resume') && (
                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </Link>
            <Link
              href="/contact"
              class="px-6 py-2.5 bg-gold text-surface-deep rounded-2xl hover:shadow-glow transition-all duration-300 font-semibold transform hover:-translate-y-0.5 tracking-[0.25em] uppercase"
              aria-label="Contact John P. Stas"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            class="md:hidden p-2.5 rounded-xl border border-[#d0c3a32b] bg-[#181c27]/70 hover:bg-[#191d1c] hover:shadow-lg transition-all"
            onClick$={() => isMenuOpen.value = !isMenuOpen.value}
            aria-label={isMenuOpen.value ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen.value}
            aria-controls="mobile-menu"
          >
            <svg class="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div id="mobile-menu" class="md:hidden py-6 border-t border-[#d0c3a31f] animate-slideDown bg-[#181c27]/90">
            <div class="flex flex-col space-y-3">
              <Link 
                href="/about" 
                class={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/about') 
                    ? 'bg-gold/20 text-gold' 
                    : 'text-cream hover:bg-white/5'
                }`}
                onClick$={() => isMenuOpen.value = false}
              >
                About
              </Link>
              <Link 
                href="/portfolio" 
                class={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/portfolio') 
                    ? 'bg-gold/20 text-gold' 
                    : 'text-cream hover:bg-white/5'
                }`}
                onClick$={() => isMenuOpen.value = false}
              >
                Work
              </Link>
              <Link 
                href="/resume" 
                class={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/resume') 
                    ? 'bg-gold/20 text-gold' 
                    : 'text-cream hover:bg-white/5'
                }`}
                onClick$={() => isMenuOpen.value = false}
              >
                Resume
              </Link>
              <Link
                href="/contact"
                class="px-4 py-3 bg-gold text-surface-deep rounded-xl hover:shadow-glow transition-all font-semibold text-center uppercase tracking-[0.25em]"
                onClick$={() => isMenuOpen.value = false}
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

