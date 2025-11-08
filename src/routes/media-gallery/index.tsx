import { component$, useSignal, useVisibleTask$, useComputed$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';

const allVideos = [
  { id: 'af4889355cd0d36bac6722871cb2bcb3', title: 'FPV Drone Flythrough', aspectRatio: '16:9', tags: ['Drone', 'Marketing'] },
  { id: '0bb120ea124abda2d3354c5dad0b880c', title: 'Landscape Showcase', aspectRatio: '16:9', tags: ['Drone', 'Marketing'] },
  { id: 'a7b4704011cd40317258841cc0023c28', title: 'Vertical Reel 1', aspectRatio: '9:16', tags: ['Social Media'] },
  { id: '8f28e754f322f9bb29b2f859aca18aab', title: 'Vertical Reel 2', aspectRatio: '9:16', tags: ['Social Media'] },
  { id: 'bb1312445f67fec7e49286451a690633', title: 'Vertical Reel 3', aspectRatio: '16:9', tags: ['Social Media'] },
  { id: 'ba5df5ea0f92a63484e37c63830515b9', title: 'Vertical Reel 4', aspectRatio: '9:16', tags: ['Social Media'] },
  { id: 'c2e470e8a64b8413f604a603f1e9c296', title: 'Square Social Reel 1', aspectRatio: '9:16', tags: ['Social Media'] },
  { id: 'fdd0526f3b9b76810612b54a8c1de83f', title: 'Square Social Reel 2', aspectRatio: '9:16', tags: ['Social Media'] },
  { id: 'b9fa9a08728b71df64b01762b6b1c2fb', title: 'Square Social Reel 3', aspectRatio: '1:1', tags: ['Social Media', 'Educational'] },
  { id: '1f2e57edaffa92198f1f6eccbdffa385', title: 'Square Social Reel 4', aspectRatio: '1:1', tags: ['Social Media', 'Training'] },
];

const allTags = ['All', 'Social Media', 'Educational', 'Training', 'Drone', 'Marketing'];

export default component$(() => {
  const selectedTag = useSignal('All');

  const filteredVideos = useComputed$(() => {
    if (selectedTag.value === 'All') {
      return allVideos;
    }
    return allVideos.filter((video) => video.tags.includes(selectedTag.value));
  });

  const getPaddingBottom = (aspectRatio: string) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

  // Scroll reveal animation
  useVisibleTask$(() => {
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

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  return (
    <div class="min-h-screen bg-white">
      {/* Hero Section */}
      <section class="relative pt-32 pb-20 px-6 bg-gradient-to-b from-white via-neutral/10 to-white overflow-hidden">
        <div class="container-custom mx-auto max-w-7xl">
          <div class="text-center mb-16 scroll-reveal">
            <Link
              href="/"
              class="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors mb-6"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-charcoal via-primary to-charcoal bg-clip-text text-transparent">
              Media Gallery
            </h1>
            <p class="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of cinematic work, from aerial cinematography to brand storytelling
            </p>
          </div>

          {/* Filter Buttons */}
          <div class="flex flex-wrap justify-center gap-4 mb-12 scroll-reveal">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick$={() => (selectedTag.value = tag)}
                class={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedTag.value === tag
                    ? 'bg-primary text-white shadow-lg'
                    : 'glass text-charcoal hover:shadow-md border border-neutral/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div class="grid grid-cols-1 md:grid-cols-6 gap-6 scroll-reveal">
            {filteredVideos.value.map((video) => (
              <div
                key={video.id}
                class={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  video.aspectRatio === '16:9' ? 'md:col-span-3' :
                  video.aspectRatio === '9:16' ? 'md:col-span-2' :
                  'md:col-span-2'
                }`}
              >
                <div class="relative w-full" style={{ paddingBottom: getPaddingBottom(video.aspectRatio) }}>
                  <iframe
                    src={`https://customer-h044ipu9nb6m47zm.cloudflarestream.com/${video.id}/iframe`}
                    class="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullscreen
                    title={video.title}
                  />
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-white font-semibold">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Media Gallery - Jon Stas',
  meta: [
    {
      name: 'description',
      content: 'Explore our complete collection of cinematic work, from aerial cinematography to brand storytelling.',
    },
  ],
};
