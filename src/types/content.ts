import { HeroContent } from '@/components/HeroSection';

// Home Page Content
export interface HomePageContent {
  hero: HeroContent;
  featuredProjectIds?: string[];
}

// About Page Content
export interface AboutPageContent {
  hero?: {
    title: string;
    subtitle?: string;
  };
  sections: AboutSection[];
}

export interface AboutSection {
  id: string;
  type: 'text' | 'grid' | 'timeline';
  title?: string;
  content?: string; // Rich text HTML
  items?: AboutSectionItem[];
  order: number;
}

export interface AboutSectionItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

// Contact Page Content
export interface ContactPageContent {
  hero?: {
    title: string;
    subtitle?: string;
  };
  contactInfo: ContactInfo[];
  formSettings?: {
    enabled: boolean;
    submitEndpoint?: string;
    successMessage?: string;
    errorMessage?: string;
  };
}

export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'website' | 'social';
  label: string;
  value: string;
  link: string;
  icon: string;
  order: number;
}

// Global Settings
export interface GlobalSettings {
  site: {
    title: string;
    description: string;
    logo?: {
      text: string;
      url?: string;
    };
  };
  navigation: {
    enabled: boolean;
    items: NavItem[];
  };
  footer: {
    copyright: string;
    links: FooterLink[];
  };
  seo?: {
    keywords?: string[];
    ogImage?: string;
  };
  social?: {
    email?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  enabled: boolean;
  order: number;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

// Content Status
export type ContentStatus = 'draft' | 'published';

// Content Wrapper (for versioning)
export interface ContentWrapper<T> {
  id: string;
  type: 'home' | 'about' | 'contact' | 'settings';
  status: ContentStatus;
  content: T;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// API Response Types
export interface ContentResponse<T> {
  success: boolean;
  data?: ContentWrapper<T>;
  error?: string;
}

export interface ContentListResponse<T> {
  success: boolean;
  data?: ContentWrapper<T>[];
  error?: string;
}
