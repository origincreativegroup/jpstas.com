import { MediaFile } from './media';

/**
 * Portfolio Template Types
 * Defines reusable templates for case studies and projects
 */

export type TemplateCategory = 
  | 'case-study'
  | 'project-showcase' 
  | 'experiment'
  | 'blog-post'
  | 'landing-page';

export type SectionType =
  | 'hero'
  | 'text'
  | 'image'
  | 'video'
  | 'gallery'
  | 'grid'
  | 'split'
  | 'stats'
  | 'testimonial'
  | 'cta'
  | 'timeline'
  | 'process'
  | 'features'
  | 'code'
  | 'quote';

export interface TemplateSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: any; // Flexible content structure
  media?: MediaFile[];
  layout?: 'default' | 'full-width' | 'contained' | 'split-left' | 'split-right';
  background?: {
    type: 'color' | 'gradient' | 'image' | 'video';
    value: string;
    opacity?: number;
  };
  padding?: {
    top: number;
    bottom: number;
  };
  order: number;
  settings?: {
    [key: string]: any;
  };
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  sections: TemplateSection[];
  defaultSettings?: {
    typography?: {
      headingFont?: string;
      bodyFont?: string;
    };
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
  };
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
}

export interface PortfolioProject {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary?: string;
  role?: string;
  client?: string;
  duration?: string;
  year?: string;
  tags?: string[];
  sections: TemplateSection[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  orderIndex?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Template Library - Pre-defined Templates
 */

export const DEFAULT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'case-study-detailed',
    name: 'Detailed Case Study',
    description: 'Complete case study with challenge, solution, and results',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'overview',
        type: 'text',
        title: 'Project Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'challenge',
        type: 'split',
        title: 'The Challenge',
        layout: 'split-left',
        order: 2,
      },
      {
        id: 'solution',
        type: 'text',
        title: 'The Solution',
        layout: 'contained',
        order: 3,
      },
      {
        id: 'process',
        type: 'process',
        title: 'Design Process',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'visuals',
        type: 'gallery',
        title: 'Visual Showcase',
        layout: 'full-width',
        order: 5,
      },
      {
        id: 'results',
        type: 'stats',
        title: 'Results & Impact',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Next Project',
        layout: 'full-width',
        order: 7,
      },
    ],
  },
  {
    id: 'project-minimal',
    name: 'Minimal Project',
    description: 'Clean and simple project showcase',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Project Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'description',
        type: 'text',
        title: 'Description',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Project Gallery',
        layout: 'full-width',
        order: 2,
      },
      {
        id: 'info',
        type: 'split',
        title: 'Project Info',
        layout: 'split-right',
        order: 3,
      },
    ],
  },
  {
    id: 'visual-portfolio',
    name: 'Visual Portfolio',
    description: 'Image-heavy portfolio with minimal text',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero-image',
        type: 'image',
        title: 'Hero Image',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'intro',
        type: 'text',
        title: 'Introduction',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'grid-1',
        type: 'grid',
        title: 'Image Grid 1',
        layout: 'full-width',
        order: 2,
      },
      {
        id: 'video',
        type: 'video',
        title: 'Video Showcase',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'grid-2',
        type: 'grid',
        title: 'Image Grid 2',
        layout: 'full-width',
        order: 4,
      },
    ],
  },
  {
    id: 'experiment-log',
    name: 'Experiment Log',
    description: 'Document experiments and explorations',
    category: 'experiment',
    sections: [
      {
        id: 'title',
        type: 'hero',
        title: 'Experiment Title',
        layout: 'contained',
        order: 0,
      },
      {
        id: 'hypothesis',
        type: 'text',
        title: 'Hypothesis',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'method',
        type: 'text',
        title: 'Method',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'results',
        type: 'split',
        title: 'Results',
        layout: 'split-left',
        order: 3,
      },
      {
        id: 'code',
        type: 'code',
        title: 'Code Snippet',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'conclusion',
        type: 'text',
        title: 'Conclusion',
        layout: 'contained',
        order: 5,
      },
    ],
  },
  {
    id: 'feature-focused',
    name: 'Feature Focused',
    description: 'Highlight key features and functionality',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Product Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'overview',
        type: 'text',
        title: 'Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'features',
        type: 'features',
        title: 'Key Features',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'demo',
        type: 'video',
        title: 'Demo Video',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'testimonial',
        type: 'testimonial',
        title: 'User Feedback',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Try It Out',
        layout: 'full-width',
        order: 5,
      },
    ],
  },
  {
    id: 'timeline-story',
    name: 'Timeline Story',
    description: 'Tell your project story chronologically',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Story Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'intro',
        type: 'text',
        title: 'Introduction',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'timeline',
        type: 'timeline',
        title: 'Project Timeline',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Visual Journey',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'outcome',
        type: 'stats',
        title: 'Final Outcome',
        layout: 'contained',
        order: 4,
      },
    ],
  },
];

