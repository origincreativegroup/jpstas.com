import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export function SEO({
  title,
  description,
  keywords = 'portfolio, web developer, designer, creative technologist',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
}: SEOProps) {
  const fullTitle = `${title} | John P. Stas`;
  const siteUrl = 'https://jpstas-portfolio.pages.dev';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);
    if (keywords) {
      updateMeta('keywords', keywords);
    }

    // Open Graph tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:url', window.location.href, true);
    updateMeta('og:image', `${siteUrl}${ogImage}`, true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', `${siteUrl}${ogImage}`);
  }, [fullTitle, description, keywords, ogImage, ogType, siteUrl]);

  return null;
}
