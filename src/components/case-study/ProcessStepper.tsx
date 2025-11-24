import { component$, useSignal } from '@builder.io/qwik';
import type { CaseStudy, Media } from '~/types/case-study';

// Bento grid layout for 5 items:
// Row 1: 6 cols + 3 cols + 3 cols (3 items)
// Row 2: 6 cols + 6 cols (2 items)
const getBentoLayout = (index: number) => {
  if (index === 0) {
    // First item: large card (6 cols)
    return 'col-span-1 md:col-span-4 xl:col-span-6 row-span-1 md:row-span-2';
  } else if (index === 1 || index === 2) {
    // Second and third items: medium cards (3 cols each)
    return 'col-span-1 md:col-span-4 xl:col-span-3 row-span-1 md:row-span-2';
  } else {
    // Fourth and fifth items: large cards (6 cols each)
    return 'col-span-1 md:col-span-4 xl:col-span-6 row-span-1 md:row-span-2';
  }
};

export const ProcessStepper = component$(({ data }: { data: CaseStudy }) => {
  const hoveredNode = useSignal<number | null>(null);

  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-6 lg:p-10">
      <div class="relative z-10">
        {/* Header */}
        <div class="mb-12 text-center">
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="relative group">
              <div class="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div class="text-left">
              <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mb-1">
                My Approach
              </h2>
              <p class="text-sm text-charcoal/50 uppercase tracking-wider font-semibold">Process & Methodology</p>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div class="grid grid-cols-1 gap-4 md:auto-rows-[280px] md:grid-cols-4 xl:auto-rows-[300px] xl:grid-cols-12">
          {data.process.map((s, i) => {
            const galleryMedia = data.solution?.gallery || [];
            const mediaIndex = i % galleryMedia.length;
            const currentMedia = galleryMedia[mediaIndex];
            
            return (
              <div
                key={i}
                class={`group relative rounded-2xl bg-white border-2 p-6 lg:p-8 shadow-lg transition-all duration-300 overflow-hidden ${
                  hoveredNode.value === i
                    ? 'border-secondary shadow-2xl scale-[1.02] -translate-y-1'
                    : 'border-neutral/20 hover:border-secondary/30 hover:shadow-xl'
                } ${getBentoLayout(i)}`}
                style={{ animationDelay: `${i * 100}ms` }}
                onMouseEnter$={() => hoveredNode.value = i}
                onMouseLeave$={() => hoveredNode.value = null}
              >
                {/* Node number badge */}
                <div class="absolute -top-3 -left-3 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span class="text-xl lg:text-2xl font-bold text-white">{i + 1}</span>
                </div>

                {/* Content - flex column for better layout */}
                <div class="h-full flex flex-col">
                  {/* Title */}
                  <div class="mb-4 pl-10 lg:pl-12">
                    <h3 class="text-lg lg:text-xl xl:text-2xl font-bold text-charcoal mb-2 flex items-center gap-2">
                      {s.title}
                      <svg class={`w-4 h-4 lg:w-5 lg:h-5 text-secondary transition-all duration-300 ${
                        hoveredNode.value === i ? 'opacity-100 translate-x-1' : 'opacity-0'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </h3>
                  </div>

                  {/* Description */}
                  {s.description && (
                    <div class="flex-1 pl-10 lg:pl-12 mb-4">
                      <p class="text-sm lg:text-base text-charcoal/70 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  )}

                  {/* Process step visualization */}
                  <div class="pl-10 lg:pl-12 mt-auto">
                    <div class="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                      {currentMedia?.src ? (
                        currentMedia.type === 'video' ? (
                          <div class="relative w-full h-full">
                            <img
                              src={currentMedia.poster || `https://placehold.co/300x300/2E3192/FFFFFF?text=Video`}
                              alt={currentMedia.alt || `Process: ${s.title}`}
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              width="300"
                              height="300"
                            />
                            <div class="absolute inset-0 flex items-center justify-center bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 flex items-center justify-center">
                                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-charcoal ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={currentMedia.src}
                            alt={currentMedia.alt || `Process: ${s.title}`}
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            width="300"
                            height="300"
                          />
                        )
                      ) : (
                        <img
                          src={`https://placehold.co/300x300/${i % 3 === 0 ? '2E3192' : i % 3 === 1 ? '6B5D3F' : 'D4A14A'}/FFFFFF?text=Step+${i + 1}`}
                          alt={`Process: ${s.title}`}
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          width="300"
                          height="300"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion indicator */}
        <div class="mt-12 flex justify-center">
          <div class="relative group">
            <div class="rounded-2xl bg-secondary p-[2px]">
              <div class="rounded-2xl bg-white px-8 py-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg font-bold text-secondary">
                  Delivered Successfully
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
