import { component$, useSignal } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';

export const ProcessStepper = component$(({ data }: { data: CaseStudy }) => {
  const hoveredNode = useSignal<number | null>(null);

  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-8 lg:p-12">
      {/* Animated gradient orbs */}
      <div class="absolute top-20 right-0 w-72 h-72 bg-gradient-to-bl from-secondary/10 to-transparent rounded-full blur-3xl animate-float" style="animation-delay: 1s" />
      <div class="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl animate-float" />

      <div class="relative z-10">
        {/* Header */}
        <div class="mb-12 text-center">
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="relative group">
              <div class="w-14 h-14 bg-gradient-to-br from-secondary to-teal-aqua rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-secondary to-teal-aqua rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
            </div>
            <div class="text-left">
              <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mb-1">
                My Approach
              </h2>
              <p class="text-sm text-charcoal/50 uppercase tracking-wider font-semibold">Process & Methodology</p>
            </div>
          </div>
        </div>

        {/* Mind Map Style Process Nodes */}
        <div class="relative min-h-[600px] flex items-center justify-center">
          {/* SVG Connection Lines */}
          <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0">
            {data.process.map((_, i) => {
              if (i === data.process.length - 1) return null;
              const isEven = i % 2 === 0;
              return (
                <path
                  key={i}
                  d={`M ${isEven ? '50%' : '30%'} ${20 + i * 100} Q 50% ${60 + i * 100} ${isEven ? '30%' : '70%'} ${120 + i * 100}`}
                  stroke="url(#gradient)"
                  stroke-width="2"
                  fill="none"
                  opacity="0.3"
                  stroke-dasharray="5,5"
                  class="animate-pulse-slow"
                />
              );
            })}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00BF5F;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#55A3CF;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Process Nodes in Mind Map Layout */}
          <div class="relative w-full grid gap-8">
            {data.process.map((s, i) => {
              const isEven = i % 2 === 0;
              const isCenter = i === 0 || i === data.process.length - 1;
              
              return (
                <div 
                  key={i}
                  class={`relative ${
                    isCenter ? 'mx-auto max-w-2xl' : isEven ? 'mr-auto max-w-md lg:max-w-lg' : 'ml-auto max-w-md lg:max-w-lg'
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                  onMouseEnter$={() => hoveredNode.value = i}
                  onMouseLeave$={() => hoveredNode.value = null}
                >
                  <div class={`group relative rounded-2xl bg-gradient-to-br from-white to-neutral/20 border-2 p-6 lg:p-8 shadow-lg transition-all duration-300 ${
                    hoveredNode.value === i
                      ? 'border-secondary shadow-2xl scale-105 -translate-y-2'
                      : 'border-neutral/20 hover:border-secondary/30 hover:shadow-xl'
                  }`}>
                    {/* Node number badge */}
                    <div class="absolute -top-4 -left-4 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span class="text-xl lg:text-2xl font-bold text-white">{i + 1}</span>
                    </div>

                    {/* Content */}
                    <div class="pl-8 lg:pl-12">
                      <h3 class="text-xl lg:text-2xl font-bold text-charcoal mb-3 flex items-center gap-2">
                        {s.title}
                        <svg class={`w-5 h-5 text-secondary transition-all duration-300 ${
                          hoveredNode.value === i ? 'opacity-100 translate-x-1' : 'opacity-0'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </h3>
                      {s.description && (
                        <p class="text-charcoal/70 leading-relaxed lg:text-lg">
                          {s.description}
                        </p>
                      )}
                    </div>

                    {/* Connecting dots */}
                    {i < data.process.length - 1 && (
                      <div class={`absolute ${isEven ? '-right-2' : '-left-2'} bottom-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-primary animate-pulse`} />
                    )}

                    {/* Glow effect on hover */}
                    <div class={`absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 transition-opacity duration-300 ${
                      hoveredNode.value === i ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion indicator */}
        <div class="mt-12 flex justify-center">
          <div class="relative group">
            <div class="rounded-2xl bg-gradient-to-r from-secondary to-primary p-[2px]">
              <div class="rounded-2xl bg-white px-8 py-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Delivered Successfully
                </span>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </div>
        </div>
      </div>
    </section>
  );
});
