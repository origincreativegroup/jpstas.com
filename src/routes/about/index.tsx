import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { DashboardPanel } from '~/components/dashboard/DashboardPanel';
import aboutData from '../../data/site/about.json';

const colorHexMap: Record<string, string> = {
  primary: '#b98f45',
  secondary: '#454529',
  highlight: '#6c3727',
};

const bgClassMap: Record<string, string> = {
  primary: 'bg-gold',
  secondary: 'bg-surface-olive',
  highlight: 'bg-rust',
};

const textClassMap: Record<string, string> = {
  primary: 'text-gold',
  secondary: 'text-surface-olive',
  highlight: 'text-rust',
};

const getColorHex = (token?: string) => (token ? colorHexMap[token] ?? '#b98f45' : '#b98f45');
const getBgClass = (token?: string) => (token ? bgClassMap[token] ?? 'bg-gold' : 'bg-gold');
const getTextClass = (token?: string) => (token ? textClassMap[token] ?? 'text-gold' : 'text-gold');

export default component$(() => {
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
    <div class="min-h-screen bg-surface-deep text-cream py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <section class="scroll-reveal">
          <div class="inline-block mb-4 px-4 py-2 rounded-full bg-gold/15">
            <span class="text-sm font-semibold text-gold uppercase tracking-[0.3em]">Get to know me</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-cream">
            {aboutData.heading}
          </h1>
          <p class="text-xl lg:text-2xl text-cream/75 leading-relaxed">
            {aboutData.subheading}
          </p>
        </section>

        {/* Bio with Image */}
        <section class="scroll-reveal">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Profile Image */}
            <div class="lg:col-span-2">
              <div class="relative group">
                <div class="aspect-square rounded-3xl overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.4)]">
                  <img
                    src={aboutData.src}
                    alt={aboutData.alt}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width="600"
                    height="600"
                  />
                </div>
                {/* Decorative elements */}
                <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/15 rounded-full blur-3xl -z-10" />
                <div class="absolute -top-4 -left-4 w-24 h-24 bg-surface-olive/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            {/* Bio Text */}
            <div class="lg:col-span-3 rounded-3xl border border-cream/10 bg-surface-mid/70 p-8 lg:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
              <h2 class="text-3xl lg:text-4xl font-bold mb-6 text-cream flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-surface-deep">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                {aboutData.background.title}
              </h2>
              <div class="space-y-6 text-lg text-cream/80 leading-relaxed">
                {aboutData.background.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Dashboard */}
        <section class="scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-8 text-cream text-center">Skills & Expertise</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aboutData.skills.map((skill, index) => (
              <div key={index} class="mb-6">
                <DashboardPanel
                  title={skill.category}
                  collapsible={true}
                  defaultExpanded={index < 2}
                >
                  <div class="space-y-3">
                    {skill.items.map((item, itemIndex) => (
                      <div key={itemIndex} class="flex items-center justify-between p-3 rounded-lg border border-cream/10 bg-surface-mid/60">
                        <div class="flex items-center gap-3">
                          <div class={`w-2 h-2 rounded-full ${getBgClass(skill.iconColor)}`} />
                          <span class="text-cream font-medium">{item}</span>
                        </div>
                        <div class={`w-3 h-3 rounded-full ${getBgClass(skill.iconColor)} opacity-60`} />
                      </div>
                    ))}
                  </div>
                </DashboardPanel>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section class="scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-12 text-cream text-center">Experience</h2>
          
          <div class="relative space-y-8">
            {/* Vertical Line */}
            <div class="absolute left-4 lg:left-8 top-0 bottom-0 w-1 bg-gold" />
            
            {aboutData.experience.map((exp, index) => (
              <div key={index} class="relative pl-12 lg:pl-20 group">
                <div class={`absolute left-0 lg:left-4 top-0 flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full ${getBgClass(exp.color)} shadow-lg transition-transform group-hover:scale-110`}>
                  <svg class="w-4 h-4 lg:w-6 lg:h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="rounded-2xl border border-cream/10 bg-surface-mid/70 p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1">
                  <div class={`text-sm font-semibold ${getTextClass(exp.color)} opacity-80 mb-2 uppercase tracking-wide`}>{exp.period}</div>
                  <h3 class="text-xl lg:text-2xl font-bold mb-3 text-cream">{exp.role}</h3>
                  <p class="text-cream/80 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section class="rounded-3xl border border-cream/10 bg-surface-mid/80 p-12 text-center shadow-[0_25px_60px_rgba(0,0,0,0.45)] scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-cream">{aboutData.cta.title}</h2>
          <p class="text-xl text-cream/75 mb-8 max-w-2xl mx-auto">
            {aboutData.cta.description}
          </p>
          <Link
            href={aboutData.cta.buttonLink}
            class="inline-flex items-center gap-3 px-8 py-4 bg-gold text-surface-deep rounded-xl hover:bg-gold/90 transition-all duration-300 text-lg font-semibold"
          >
            {aboutData.cta.buttonText}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'About - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Learn more about John P. Stas - background, skills, experience, and approach to design, development, and process innovation.',
    },
  ],
};

