import { component$ } from '@builder.io/qwik';
import type { CaseStudy } from '~/types/case-study';
import { ImageGallery } from '~/components/ImageGallery';
import { ComparisonSlider } from '~/components/ComparisonSlider';
import { CloudflareStreamPlayer } from '~/components/CloudflareStreamPlayer';
import { VideoPlayer } from '~/components/VideoPlayer';

export const SolutionGrid = component$(({ data }: { data: CaseStudy }) => {
  const g = data.solution;
  return (
    <section class="relative overflow-hidden rounded-3xl bg-white shadow-xl p-8 lg:p-12">
      <div class="relative z-10">
        {/* Header */}
        <div class="mb-10">
          <div class="flex items-start gap-4 mb-6">
            <div class="relative group">
              <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 class="text-3xl lg:text-4xl font-bold text-charcoal mb-2">
                The Solution
              </h2>
              <p class="text-sm text-charcoal/50 uppercase tracking-wider font-semibold">Design & Implementation</p>
            </div>
          </div>
          
          <p class="text-lg lg:text-xl text-charcoal/80 leading-relaxed">
            {g.approach}
          </p>
        </div>

        {/* Key Features - Animated cards */}
        {g.bullets && (
          <div class="grid sm:grid-cols-2 gap-4 mb-12">
            {g.bullets.map((b, index) => (
              <div
                key={b}
                class="group relative overflow-hidden rounded-2xl bg-white border border-neutral/20 p-6 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="text-charcoal/80 leading-relaxed font-medium flex-1">{b}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Before/After Comparison */}
        {g.beforeAfter && (
          <div class="my-12">
            <div class="flex items-center justify-center gap-3 mb-8">
              <div class="w-2 h-8 bg-primary rounded-full" />
              <h3 class="text-2xl lg:text-3xl font-bold text-charcoal">Transformation</h3>
              <div class="w-2 h-8 bg-secondary rounded-full" />
            </div>
            <ComparisonSlider
              beforeImage={g.beforeAfter.before.src}
              afterImage={g.beforeAfter.after.src}
              beforeLabel={g.beforeAfter.before.alt || 'Before'}
              afterLabel={g.beforeAfter.after.alt || 'After'}
            />
          </div>
        )}

        {/* Videos Section */}
        {g.gallery && g.gallery.some((m) => m.type === 'video') && (
          <div class="mt-12">
            <div class="flex items-center justify-center gap-3 mb-8">
              <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl lg:text-3xl font-bold text-charcoal">Featured Videos</h3>
            </div>
            <div class="grid gap-8">
              {g.gallery
                .filter((m) => m.type === 'video')
                .map((video) => {
                  // Check if it's a Cloudflare Stream video ID (32 char hex)
                  const isCloudflareStream = video.src.match(/^[a-f0-9]{32}$/i);
                  
                  return (
                    <div key={video.src} class="w-full">
                      {isCloudflareStream ? (
                        <CloudflareStreamPlayer
                          videoId={video.src}
                          poster={video.poster}
                          title={video.caption}
                        />
                      ) : (
                        <VideoPlayer
                          src={video.src}
                          poster={video.poster}
                          title={video.caption}
                        />
                      )}
                      {video.caption && !isCloudflareStream && (
                        <p class="text-sm text-charcoal/60 mt-4 text-center italic">{video.caption}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {g.gallery && g.gallery.filter((m) => m.type !== 'video').length > 0 && (
          <div class="mt-12">
            <div class="flex items-center justify-center gap-3 mb-8">
              <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-2xl lg:text-3xl font-bold text-charcoal">Visual Gallery</h3>
            </div>
            <ImageGallery
              images={g.gallery
                .filter((m) => m.type !== 'video')
                .map((m, i) => ({
                  src: m.src,
                  alt: m.alt || `Gallery image ${i + 1}`,
                  caption: m.caption,
                }))}
            />
          </div>
        )}
      </div>
    </section>
  );
});

