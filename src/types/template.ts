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
  // New comprehensive templates
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    description: 'Showcase online stores with conversion metrics and feature highlights',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'E-commerce Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'overview',
        type: 'text',
        title: 'Platform Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'before-after',
        type: 'split',
        title: 'Before & After',
        layout: 'split-left',
        order: 2,
      },
      {
        id: 'features',
        type: 'features',
        title: 'Key Features',
        layout: 'contained',
        order: 3,
      },
      {
        id: 'metrics',
        type: 'stats',
        title: 'Conversion Metrics',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Product Showcase',
        layout: 'full-width',
        order: 5,
      },
      {
        id: 'tech-stack',
        type: 'grid',
        title: 'Technology Stack',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'testimonial',
        type: 'testimonial',
        title: 'Client Feedback',
        layout: 'contained',
        order: 7,
      },
    ],
  },
  {
    id: 'media-production',
    name: 'Media Production',
    description: 'Video-heavy layout with drone footage galleries and production timeline',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero-video',
        type: 'video',
        title: 'Hero Video',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'intro',
        type: 'text',
        title: 'Production Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'timeline',
        type: 'timeline',
        title: 'Production Timeline',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'media-gallery',
        type: 'gallery',
        title: 'Footage Gallery',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'equipment',
        type: 'grid',
        title: 'Equipment & Tech',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'impact',
        type: 'stats',
        title: 'Impact & Reach',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'behind-scenes',
        type: 'split',
        title: 'Behind the Scenes',
        layout: 'split-right',
        order: 6,
      },
    ],
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'Feature highlights, demo videos, and tech architecture visualization',
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
        id: 'problem-solution',
        type: 'split',
        title: 'Problem & Solution',
        layout: 'split-left',
        order: 1,
      },
      {
        id: 'features',
        type: 'features',
        title: 'Core Features',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'screenshots',
        type: 'gallery',
        title: 'Product Screenshots',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'demo-video',
        type: 'video',
        title: 'Product Demo',
        layout: 'full-width',
        order: 4,
      },
      {
        id: 'tech-architecture',
        type: 'process',
        title: 'Technical Architecture',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'metrics',
        type: 'stats',
        title: 'Performance Metrics',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Try It Now',
        layout: 'full-width',
        order: 7,
      },
    ],
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    description: 'Performance metrics, visual assets gallery, and campaign timeline',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Campaign Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'campaign-overview',
        type: 'text',
        title: 'Campaign Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'timeline',
        type: 'timeline',
        title: 'Campaign Timeline',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'visuals',
        type: 'gallery',
        title: 'Campaign Visuals',
        layout: 'full-width',
        order: 3,
      },
      {
        id: 'performance',
        type: 'stats',
        title: 'Performance Metrics',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'channels',
        type: 'grid',
        title: 'Marketing Channels',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'roi',
        type: 'split',
        title: 'ROI & Results',
        layout: 'split-right',
        order: 6,
      },
      {
        id: 'testimonial',
        type: 'testimonial',
        title: 'Client Success',
        layout: 'contained',
        order: 7,
      },
    ],
  },
  {
    id: 'systems-integration',
    name: 'Systems Integration',
    description: 'Process flow diagrams, efficiency metrics, and technical architecture',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Integration Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'challenge',
        type: 'text',
        title: 'The Challenge',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'process-flow',
        type: 'process',
        title: 'Process Flow',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'before-after',
        type: 'split',
        title: 'Before & After',
        layout: 'split-left',
        order: 3,
      },
      {
        id: 'architecture',
        type: 'grid',
        title: 'System Architecture',
        layout: 'full-width',
        order: 4,
      },
      {
        id: 'efficiency',
        type: 'stats',
        title: 'Efficiency Gains',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'tech-stack',
        type: 'features',
        title: 'Technologies Used',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'timeline',
        type: 'timeline',
        title: 'Implementation Timeline',
        layout: 'contained',
        order: 7,
      },
    ],
  },
  {
    id: 'print-production',
    name: 'Print & Production',
    description: 'Photo galleries, cost savings infographics, and workflow visualization',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Production Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'overview',
        type: 'text',
        title: 'Studio Overview',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Work Showcase',
        layout: 'full-width',
        order: 2,
      },
      {
        id: 'workflow',
        type: 'process',
        title: 'Production Workflow',
        layout: 'contained',
        order: 3,
      },
      {
        id: 'cost-savings',
        type: 'stats',
        title: 'Cost Savings',
        layout: 'contained',
        order: 4,
      },
      {
        id: 'equipment',
        type: 'grid',
        title: 'Equipment & Tools',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'comparison',
        type: 'split',
        title: 'Quality Comparison',
        layout: 'split-right',
        order: 6,
      },
      {
        id: 'impact',
        type: 'quote',
        title: 'Client Impact',
        layout: 'contained',
        order: 7,
      },
    ],
  },
  {
    id: 'automation-ai',
    name: 'Automation & AI',
    description: 'Workflow diagrams, efficiency gains, and technology integration',
    category: 'case-study',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'AI Solution Hero',
        layout: 'full-width',
        order: 0,
      },
      {
        id: 'problem',
        type: 'text',
        title: 'The Problem',
        layout: 'contained',
        order: 1,
      },
      {
        id: 'workflow',
        type: 'process',
        title: 'Automation Workflow',
        layout: 'contained',
        order: 2,
      },
      {
        id: 'ai-features',
        type: 'features',
        title: 'AI Capabilities',
        layout: 'contained',
        order: 3,
      },
      {
        id: 'before-after',
        type: 'split',
        title: 'Before & After',
        layout: 'split-left',
        order: 4,
      },
      {
        id: 'efficiency',
        type: 'stats',
        title: 'Efficiency Gains',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'tech-integration',
        type: 'grid',
        title: 'Technology Integration',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'demo',
        type: 'video',
        title: 'Demo & Walkthrough',
        layout: 'full-width',
        order: 7,
      },
    ],
  },
  {
    id: 'multi-project',
    name: 'Multi-Project Showcase',
    description: 'Grid-based layout for displaying multiple related projects',
    category: 'project-showcase',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Portfolio Hero',
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
        id: 'featured',
        type: 'grid',
        title: 'Featured Projects',
        layout: 'full-width',
        order: 2,
      },
      {
        id: 'skills',
        type: 'features',
        title: 'Skills & Expertise',
        layout: 'contained',
        order: 3,
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Work Gallery',
        layout: 'full-width',
        order: 4,
      },
      {
        id: 'achievements',
        type: 'stats',
        title: 'Achievements',
        layout: 'contained',
        order: 5,
      },
      {
        id: 'testimonials',
        type: 'testimonial',
        title: 'Client Testimonials',
        layout: 'contained',
        order: 6,
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Work Together',
        layout: 'full-width',
        order: 7,
      },
    ],
  },
];

