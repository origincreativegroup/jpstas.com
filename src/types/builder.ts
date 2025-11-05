/**
 * TypeScript types for Builder.io content models
 *
 * These types match the data structure of content in Builder.io
 * and provide type safety throughout the application.
 */

/**
 * Homepage content model
 */
export interface HomepageContent {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  featuredProjects: FeaturedProject[];
  metrics: Metric[];
}

export interface FeaturedProject {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
}

export interface Metric {
  label: string;
  value: string;
}

/**
 * Portfolio project content model
 */
export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  hero: MediaAsset;
  cardImage: MediaAsset;
  metrics: Metric[];
  meta: ProjectMeta;
  context: ProjectContext;
  solution: ProjectSolution;
  impact: Metric[];
  process: ProcessStep[];
  reflection: ProjectReflection;
  related: RelatedProject[];
}

export interface MediaAsset {
  src: string;
  alt: string;
  type?: 'image' | 'video';
  poster?: string;
  caption?: string;
}

export interface ProjectMeta {
  tags: string[];
  tools: string[];
  year: string;
  client: string;
}

export interface ProjectContext {
  problem: string;
  constraints: string[];
  quote?: string;
}

export interface ProjectSolution {
  approach: string;
  bullets: string[];
  gallery: MediaAsset[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProjectReflection {
  learning: string;
  reuse: string[];
}

export interface RelatedProject {
  title: string;
  href: string;
}

/**
 * About page content model
 */
export interface AboutContent {
  title: string;
  subtitle: string;
  bio: string;
  image: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

/**
 * Site settings content model
 */
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  author: {
    name: string;
    email: string;
    social: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  navigation: NavigationItem[];
  footer: {
    copyright: string;
    links: NavigationItem[];
  };
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Builder.io API response wrapper
 */
export interface BuilderContent<T = any> {
  id: string;
  name: string;
  data: T;
  published: 'draft' | 'published';
  firstPublished: number;
  lastUpdated: number;
  rev: string;
}
