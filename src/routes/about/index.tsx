import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { DashboardPanel } from '~/components/dashboard/DashboardPanel';
import { ProgressRing } from '~/components/dashboard/ProgressRing';
import aboutData from '../../data/site/about.json';

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
    <div class="min-h-screen bg-white py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section class="mb-16 scroll-reveal">
          <div class="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span class="text-sm font-semibold text-primary uppercase tracking-wide">Get to know me</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 text-primary">
            {aboutData.heading}
          </h1>
          <p class="text-xl lg:text-2xl text-text-secondary leading-relaxed">
            {aboutData.subheading}
          </p>
        </section>

        {/* Bio with Image */}
        <section class="mb-16 scroll-reveal">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Profile Image */}
            <div class="lg:col-span-2">
              <div class="relative group">
                <div class="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={aboutData.src}
                    alt={aboutData.alt}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width="600"
                    height="600"
                  />
                </div>
                {/* Decorative elements */}
                <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
                <div class="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            {/* Bio Text */}
            <div class="lg:col-span-3 rounded-3xl glass p-8 lg:p-12">
              <h2 class="text-3xl lg:text-4xl font-bold mb-6 text-text-primary flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                {aboutData.background.title}
              </h2>
              <div class="space-y-6 text-lg text-text-primary leading-relaxed">
                {aboutData.background.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Dashboard */}
        <section class="mb-16 scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-8 text-text-primary text-center">Skills & Expertise</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aboutData.skills.map((skill, index) => (
              <div key={index} class="mb-6">
                <DashboardPanel
                  title={skill.category}
                  collapsible={true}
                  defaultExpanded={index < 2}
                >
                <div class="space-y-6">
                  {/* Skill Level Indicators */}
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <ProgressRing 
                        percentage={skill.category === 'Design & UX' ? 95 : 
                                   skill.category === 'Development' ? 85 : 
                                   skill.category === 'Operations' ? 90 : 80}
                        size={60}
                        strokeWidth={4}
                        color={skill.iconColor === 'primary' ? '#2E3192' : 
                               skill.iconColor === 'secondary' ? '#6B5D3F' : 
                               skill.iconColor === 'highlight' ? '#D4A14A' : '#6B7280'}
                      />
                      <p class="text-sm font-medium text-text-secondary mt-2">Proficiency</p>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-text-primary">
                        {skill.items.length}+
                      </div>
                      <p class="text-sm font-medium text-text-secondary">Skills</p>
                    </div>
                  </div>
                  
                  {/* Skills List */}
                  <div class="space-y-3">
                    {skill.items.map((item, itemIndex) => (
                      <div key={itemIndex} class="flex items-center justify-between p-3 rounded-lg bg-white/50">
                        <div class="flex items-center gap-3">
                          <div class={`w-2 h-2 rounded-full bg-${skill.iconColor}`} />
                          <span class="text-text-primary font-medium">{item}</span>
                        </div>
                        <div class={`w-3 h-3 rounded-full bg-${skill.iconColor} opacity-60`} />
                      </div>
                    ))}
                  </div>
                </div>
                </DashboardPanel>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section class="mb-16 scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-12 text-text-primary text-center">Experience</h2>
          
          <div class="relative space-y-8">
            {/* Vertical Line */}
            <div class="absolute left-4 lg:left-8 top-0 bottom-0 w-1 bg-primary" />
            
            {aboutData.experience.map((exp, index) => (
              <div key={index} class="relative pl-12 lg:pl-20 group">
                <div class={`absolute left-0 lg:left-4 top-0 flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-${exp.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <svg class="w-4 h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="glass rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                  <div class={`text-sm font-semibold text-${exp.color}/80 mb-2 uppercase tracking-wide`}>{exp.period}</div>
                  <h3 class="text-xl lg:text-2xl font-bold mb-3 text-text-primary">{exp.role}</h3>
                  <p class="text-text-primary leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section class="rounded-3xl bg-neutral p-12 text-center scroll-reveal">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-primary">{aboutData.cta.title}</h2>
          <p class="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            {aboutData.cta.description}
          </p>
          <Link
            href={aboutData.cta.buttonLink}
            class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-300 text-lg font-semibold"
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

