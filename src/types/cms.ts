// CMS Types for all pages
export interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaPrimary: {
    text: string;
    link: string;
  };
  ctaSecondary?: {
    text: string;
    link: string;
  };
  backgroundImage?: {
    url: string;
    alt: string;
  };
  overlay?: {
    enabled: boolean;
    opacity: number;
    color: string;
  };
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle?: string;
  bio: string;
  headshot?: {
    url: string;
    alt: string;
    caption?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
    current?: boolean;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    period: string;
    description?: string;
  }>;
  achievements?: Array<{
    title: string;
    description: string;
    year?: string;
  }>;
}

export interface ContactSection {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    location?: string;
  };
  formSettings: {
    enabled: boolean;
    fields: Array<{
      name: string;
      type: 'text' | 'email' | 'textarea' | 'select';
      required: boolean;
      placeholder?: string;
      options?: string[];
    }>;
  };
}

export interface ResumeSection {
  id: string;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    description?: string;
  }>;
  skills: string[];
}

export interface PortfolioSection {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  featuredProjects: string[]; // Project IDs
  layout: 'grid' | 'masonry' | 'carousel';
  filters: {
    enabled: boolean;
    categories: string[];
    tags: string[];
  };
}

export interface PageContent {
  id: string;
  page: 'home' | 'about' | 'contact' | 'portfolio' | 'resume';
  hero?: HeroSection;
  about?: AboutSection;
  contact?: ContactSection;
  resume?: ResumeSection;
  portfolio?: PortfolioSection;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  lastUpdated: string;
  published: boolean;
}

export interface CMSSettings {
  siteName: string;
  siteDescription: string;
  logo?: {
    url: string;
    alt: string;
  };
  favicon?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  analytics?: {
    googleAnalytics?: string;
    googleTagManager?: string;
  };
}

export interface CMSError {
  field: string;
  message: string;
  code: string;
}

export interface CMSResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: CMSError[];
}
