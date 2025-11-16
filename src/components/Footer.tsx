import { component$, $, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const Footer = component$(() => {
  const currentYear = new Date().getFullYear();
  const showBackToTop = useSignal(false);

  useVisibleTask$(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 500;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToTop = $(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  return (
    <>
      <footer class="relative overflow-hidden bg-surface-deep text-cream">
        {/* Background Pattern */}
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, #d0c3a3 1px, transparent 1px); background-size: 32px 32px;" />
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div class="lg:col-span-2">
              <Link href="/" class="flex items-center gap-4 mb-6 group">
                <div class="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <span class="text-surface-deep font-bold text-lg">JS</span>
                </div>
                <span class="text-2xl font-bold text-cream tracking-[0.35em] uppercase">John P. Stas</span>
              </Link>
              <p class="text-cream/80 mb-6 max-w-md leading-relaxed text-lg">
                Creative Technologist, Designer & Process Innovator transforming business challenges into elegant solutions.
              </p>
              <div class="flex gap-3">
                <a 
                  href="https://www.linkedin.com/in/john-stas-22b01054/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group w-12 h-12 glass-dark rounded-xl flex items-center justify-center hover:bg-gold transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg class="w-5 h-5 text-cream group-hover:text-surface-deep" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/origincreativegroup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group w-12 h-12 glass-dark rounded-xl flex items-center justify-center hover:bg-surface-olive transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg class="w-5 h-5 text-cream" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:johnpstas@gmail.com" 
                  class="group w-12 h-12 glass-dark rounded-xl flex items-center justify-center hover:bg-rust transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <svg class="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div>
              <h4 class="text-xl font-bold mb-6 text-cream tracking-[0.35em] uppercase">Navigation</h4>
              <ul class="space-y-3">
                <li>
                  <Link href="/about" class="text-cream hover:text-gold transition-colors flex items-center gap-3 group font-medium uppercase tracking-[0.2em]">
                    <span class="w-2 h-[2px] rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" class="text-cream hover:text-gold transition-colors flex items-center gap-3 group font-medium uppercase tracking-[0.2em]">
                    <span class="w-2 h-[2px] rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/resume" class="text-cream hover:text-gold transition-colors flex items-center gap-3 group font-medium uppercase tracking-[0.2em]">
                    <span class="w-2 h-[2px] rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    Resume
                  </Link>
                </li>
                <li>
                  <Link href="/contact" class="text-cream hover:text-gold transition-colors flex items-center gap-3 group font-medium uppercase tracking-[0.2em]">
                    <span class="w-2 h-[2px] rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 class="text-xl font-bold mb-6 text-cream tracking-[0.35em] uppercase">Expertise</h4>
              <ul class="space-y-3">
                <li class="text-cream flex items-center gap-2 font-medium uppercase tracking-[0.2em]">
                  <span class="text-gold">●</span> Design & UX
                </li>
                <li class="text-cream flex items-center gap-2 font-medium uppercase tracking-[0.2em]">
                  <span class="text-surface-olive">●</span> Development
                </li>
                <li class="text-cream flex items-center gap-2 font-medium uppercase tracking-[0.2em]">
                  <span class="text-rust">●</span> Process Innovation
                </li>
                <li class="text-cream flex items-center gap-2 font-medium uppercase tracking-[0.2em]">
                  <span class="text-gold">●</span> Consulting
                </li>
              </ul>
            </div>
          </div>
          
          <div class="mt-16 pt-8 border-t border-[#d0c3a320] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-cream/70 text-sm font-medium">
              &copy; {currentYear} John P. Stas. All rights reserved.
            </p>
            <p class="text-cream/70 text-sm flex items-center gap-2 font-medium uppercase tracking-[0.25em]">
              Built with
              <span class="text-gold font-semibold">Qwik</span>
              &
              <span class="text-surface-olive font-semibold">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop.value && (
        <button
          onClick$={scrollToTop}
          class="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gold text-surface-deep rounded-xl shadow-glow hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-fadeIn"
          aria-label="Back to top"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
});

