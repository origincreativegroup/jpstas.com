import { component$ } from '@builder.io/qwik';

export const QuoteBlock = component$(({ quote, author, role }: { quote: string; author?: string; role?: string }) => {
  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-10 lg:p-16">
      {/* Animated gradient orb */}
      <div class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl animate-float" />
      
      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="flex flex-col items-center gap-6">
          {/* Quote icon */}
          <div class="relative group">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          </div>

          <blockquote class="text-2xl lg:text-3xl italic text-charcoal/90 text-center leading-relaxed font-medium">
            "{quote}"
          </blockquote>
          
          {(author || role) && (
            <div class="flex items-center gap-3 text-charcoal/60 font-semibold">
              <div class="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary" />
              <span>{author}{role ? `, ${role}` : ''}</span>
              <div class="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

