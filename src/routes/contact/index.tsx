import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const submitted = useSignal(false);
  const isSubmitting = useSignal(false);

  // Scroll reveal animation
  useVisibleTask$(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  });
  
  return (
    <div class="min-h-screen bg-white py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section class="text-center mb-16 scroll-reveal">
          <div class="inline-block mb-4 px-4 py-2 bg-secondary/10 rounded-full">
            <span class="text-sm font-semibold text-secondary uppercase tracking-wide">Get In Touch</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-primary">
            Let's Connect
          </h1>
          <p class="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div class="scroll-reveal">
            <div class="rounded-3xl glass p-8 lg:p-10 h-full">
              <h2 class="text-3xl font-bold mb-8 text-text-primary flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                Contact Info
              </h2>
              
              <div class="space-y-6">
                <div class="group flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-1">Email</h3>
                    <a href="mailto:johnpstas@gmail.com" class="text-primary hover:text-secondary transition-colors font-medium">
                      johnpstas@gmail.com
                    </a>
                  </div>
                </div>
                
                <div class="group flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/5 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-1">LinkedIn</h3>
                    <a 
                      href="https://www.linkedin.com/in/john-stas-22b01054/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-secondary hover:text-highlight transition-colors font-medium"
                    >
                      /in/john-stas-22b01054
                    </a>
                  </div>
                </div>
                
                <div class="group flex items-start gap-4 p-4 rounded-xl hover:bg-charcoal/5 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-charcoal/20 to-charcoal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-charcoal" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-1">GitHub</h3>
                    <a 
                      href="https://github.com/origincreativegroup" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-charcoal hover:text-primary transition-colors font-medium"
                    >
                      @origincreativegroup
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-10 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                <div class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="font-bold text-text-primary mb-1">Response Time</h3>
                    <p class="text-text-primary text-sm leading-relaxed">
                      I typically respond within 24-48 hours. For urgent inquiries, 
                      please indicate "URGENT" in the subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div class="scroll-reveal" style="animation-delay: 100ms">
            {submitted.value ? (
              <div class="rounded-3xl glass p-8 lg:p-12 text-center h-full flex flex-col items-center justify-center">
                <div class="w-20 h-20 bg-gradient-to-br from-secondary to-teal-aqua rounded-full flex items-center justify-center mb-6 animate-scaleIn">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-3xl font-bold mb-3 text-text-primary">Message Sent!</h3>
                <p class="text-lg text-text-secondary mb-6">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick$={() => (submitted.value = false)}
                  class="px-6 py-3 glass rounded-xl text-primary font-semibold hover:shadow-lg transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div class="rounded-3xl glass p-8 lg:p-10">
                <form
                  preventdefault:submit
                  onSubmit$={async () => {
                    isSubmitting.value = true;
                    // Simulate form submission
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    submitted.value = true;
                    isSubmitting.value = false;
                  }}
                  class="space-y-6"
                >
                  <div>
                    <label for="name" class="block font-semibold mb-2 text-text-primary">
                      Name <span class="text-error" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      class="w-full px-4 py-3 border-2 border-text-secondary/40 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label for="email" class="block font-semibold mb-2 text-text-primary">
                      Email <span class="text-error" aria-label="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      class="w-full px-4 py-3 border-2 border-text-secondary/40 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label for="subject" class="block font-semibold mb-2 text-text-primary">
                      Subject <span class="text-error" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      aria-required="true"
                      class="w-full px-4 py-3 border-2 border-text-secondary/40 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label for="message" class="block font-semibold mb-2 text-text-primary">
                      Message <span class="text-error" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      aria-required="true"
                      rows={6}
                      class="w-full px-4 py-3 border-2 border-text-secondary/40 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-all bg-white"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting.value}
                    class="group w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-glow-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting.value ? (
                      <>
                        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with John P. Stas to discuss your next project or opportunity.',
    },
  ],
};

