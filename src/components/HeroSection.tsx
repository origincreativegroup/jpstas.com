import { useEffect, useRef, useState } from 'react';

export interface HeroContent {
  badge?: string;
  heading: string;
  subheading?: string;
  description?: string;
  cta?: {
    primary?: { label: string; link: string };
    secondary?: { label: string; link: string };
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    fallbackImage?: string;
    alt?: string;
  };
  overlay?: {
    enabled: boolean;
    opacity?: number;
    color?: string;
  };
  layout?: 'full' | 'split' | 'overlay';
  parallax?: boolean;
}

interface HeroSectionProps {
  content: HeroContent;
  className?: string;
}

export default function HeroSection({ content, className = '' }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    badge,
    heading,
    subheading,
    description,
    cta,
    media,
    overlay = { enabled: true, opacity: 0.5, color: '#1a1a2e' },
    layout = 'overlay',
    parallax = false,
  } = content;

  // Parallax effect
  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  // Auto-play video on mount
  useEffect(() => {
    if (videoRef.current && media?.type === 'video') {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, [media?.type]);

  const parallaxOffset = parallax ? scrollY * 0.5 : 0;

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Media */}
      {media && (
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
          }}
        >
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt={media.alt || ''}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={media.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={media.fallbackImage}
              />
              {/* Fallback image if video fails */}
              {media.fallbackImage && (
                <img
                  src={media.fallbackImage}
                  alt={media.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                />
              )}
            </>
          )}

          {/* Overlay */}
          {overlay.enabled && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: overlay.color || '#1a1a2e',
                opacity: overlay.opacity || 0.5,
              }}
            />
          )}
        </div>
      )}

      {/* Diagonal Stripes Pattern (if no media) */}
      {!media && (
        <div className="diagonal-stripes absolute inset-0 opacity-5 z-0"></div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
        {layout === 'split' ? (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white">
              {badge && (
                <div className="inline-block rounded-2xl px-3 py-1 text-xs font-semibold bg-accent text-brand mb-5">
                  {badge}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                {heading}
              </h1>
              {subheading && (
                <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6">{subheading}</h2>
              )}
              {description && (
                <p className="text-lg max-w-2xl text-brand-light mb-8">{description}</p>
              )}
              {cta && (
                <div className="flex gap-4 flex-wrap">
                  {cta.primary && (
                    <a
                      href={cta.primary.link}
                      className="px-5 py-3 rounded-xl bg-accent text-brand font-semibold hover:bg-accent-dark transition-colors inline-block"
                    >
                      {cta.primary.label}
                    </a>
                  )}
                  {cta.secondary && (
                    <a
                      href={cta.secondary.link}
                      className="px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:bg-brand-light transition-colors inline-block"
                    >
                      {cta.secondary.label}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Media (for split layout without background) */}
            {!media && <div className="hidden lg:block"></div>}
          </div>
        ) : (
          /* Full or Overlay Layout */
          <div className="text-white text-center lg:text-left max-w-4xl">
            {badge && (
              <div className="inline-block rounded-2xl px-3 py-1 text-xs font-semibold bg-accent text-brand mb-5">
                {badge}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              {heading}
            </h1>
            {subheading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-6">
                {subheading}
              </h2>
            )}
            {description && (
              <p className="text-lg md:text-xl max-w-2xl text-brand-light mb-8 mx-auto lg:mx-0">
                {description}
              </p>
            )}
            {cta && (
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                {cta.primary && (
                  <a
                    href={cta.primary.link}
                    className="px-5 py-3 rounded-xl bg-accent text-brand font-semibold hover:bg-accent-dark transition-colors inline-block"
                  >
                    {cta.primary.label}
                  </a>
                )}
                {cta.secondary && (
                  <a
                    href={cta.secondary.link}
                    className="px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:bg-brand-light transition-colors inline-block"
                  >
                    {cta.secondary.label}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
