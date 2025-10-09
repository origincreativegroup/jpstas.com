export type Metric = { label: string; value: string };
export type Step = { title: string; description?: string; icon?: string };
export type Media = { src: string; alt?: string; type?: 'image' | 'video' | 'gif' };
export type Testimonial = { quote: string; author?: string; role?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  hero?: Media;
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

