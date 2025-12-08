export type Metric = { label: string; value: string; description?: string };
export type Step = { title: string; description?: string; icon?: string };
export type Media = { 
  src: string; 
  alt?: string; 
  type?: 'image' | 'video' | 'gif';
  poster?: string; // Thumbnail for videos
  caption?: string; // Caption for images/videos
  aspectRatio?: string; // Aspect ratio for videos (e.g., "9:16" for portrait, "16:9" for landscape)
};
export type Testimonial = { quote: string; author?: string; role?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  hero?: Media;
  cardImage?: Media; // Optimized image for portfolio cards/listings (different aspect ratio)
  metrics: Metric[];
  meta?: { tags?: string[]; tools?: string[]; year?: string; client?: string };
  context: { problem: string; constraints?: string[]; quote?: string };
  solution: {
    approach: string;
    bullets?: string[];
    gallery?: Media[];
    beforeAfter?: { before: Media; after: Media };
  };
  impact: Metric[];
  process: Step[];
  reflection?: { learning: string; reuse?: string[] };
  related?: { title: string; href: string }[];
};

