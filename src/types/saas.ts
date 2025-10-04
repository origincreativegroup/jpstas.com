// SaaS Portfolio Editor Types

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'portfolio' | 'case-study' | 'showcase' | 'gallery' | 'blog';
  thumbnail: string;
  preview: string;
  structure: ProjectStructure;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // in minutes
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStructure {
  sections: ProjectSection[];
  layout: LayoutConfig;
  theme: ThemeConfig;
  interactions: InteractionConfig[];
}

export interface ProjectSection {
  id: string;
  type: 'hero' | 'gallery' | 'text' | 'video' | 'testimonial' | 'stats' | 'timeline' | 'custom';
  title: string;
  content: any;
  position: number;
  visible: boolean;
  responsive: ResponsiveConfig;
  animations: AnimationConfig[];
}

export interface LayoutConfig {
  type: 'single-column' | 'two-column' | 'grid' | 'masonry' | 'timeline' | 'custom';
  spacing: 'compact' | 'normal' | 'spacious';
  alignment: 'left' | 'center' | 'right' | 'justify';
  maxWidth: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadows: 'none' | 'subtle' | 'medium' | 'strong';
}

export interface ResponsiveConfig {
  mobile: {
    visible: boolean;
    columns: number;
    spacing: number;
  };
  tablet: {
    visible: boolean;
    columns: number;
    spacing: number;
  };
  desktop: {
    visible: boolean;
    columns: number;
    spacing: number;
  };
}

export interface AnimationConfig {
  id: string;
  type: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'custom';
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'custom';
  trigger: 'on-scroll' | 'on-hover' | 'on-click' | 'on-load' | 'custom';
}

export interface InteractionConfig {
  id: string;
  type: 'hover' | 'click' | 'scroll' | 'load' | 'custom';
  action: 'navigate' | 'modal' | 'lightbox' | 'animation' | 'custom';
  target: string;
  parameters: Record<string, any>;
}

export interface ProjectDraft {
  id: string;
  projectId?: string; // If editing existing project
  title: string;
  description: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  template: ProjectTemplate;
  structure: ProjectStructure;
  content: ProjectContent;
  metadata: ProjectMetadata;
  collaborators: Collaborator[];
  permissions: Permission[];
  version: number;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface ProjectContent {
  sections: ProjectSection[];
  media: MediaReference[];
  customCSS?: string;
  customJS?: string;
  seo: SEOConfig;
}

export interface MediaReference {
  id: string;
  mediaId: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'embed';
  url: string;
  alt?: string;
  caption?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: number;
    format?: string;
  };
  transformations: MediaTransform[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  responsive: ResponsiveConfig;
}

export interface MediaTransform {
  id: string;
  type: 'crop' | 'resize' | 'filter' | 'overlay' | 'text' | 'custom';
  parameters: Record<string, any>;
  order: number;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

export interface ProjectMetadata {
  tags: string[];
  category: string;
  featured: boolean;
  published: boolean;
  publishDate?: string;
  visibility: 'public' | 'private' | 'unlisted';
  password?: string;
  analytics: {
    trackViews: boolean;
    trackInteractions: boolean;
    customEvents: string[];
  };
}

export interface Collaborator {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
  lastActive?: string;
}

export interface Permission {
  id: string;
  userId: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'share' | 'admin';
  conditions?: Record<string, any>;
  expiresAt?: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  position?: {
    x: number;
    y: number;
    sectionId: string;
  };
  resolved: boolean;
  replies: ProjectComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: number;
  title: string;
  description: string;
  content: ProjectContent;
  changes: ChangeLog[];
  createdAt: string;
  createdBy: string;
}

export interface ChangeLog {
  id: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'style' | 'content';
  section: string;
  description: string;
  before?: any;
  after?: any;
  timestamp: string;
  userId: string;
}

export interface ProjectExport {
  id: string;
  projectId: string;
  format: 'json' | 'html' | 'pdf' | 'zip' | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
}

export interface ProjectImport {
  id: string;
  file: File;
  format: 'json' | 'html' | 'zip' | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: ProjectDraft;
  errors: string[];
  createdAt: string;
  createdBy: string;
}

export interface SaaSUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  subscription: Subscription;
  preferences: UserPreferences;
  createdAt: string;
  lastActive: string;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  features: string[];
  limits: {
    projects: number;
    storage: number; // in MB
    collaborators: number;
    exports: number;
  };
  currentUsage: {
    projects: number;
    storage: number;
    collaborators: number;
    exports: number;
  };
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  price: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    comments: boolean;
    updates: boolean;
  };
  editor: {
    autoSave: boolean;
    autoSaveInterval: number;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
}

export interface SaaSProject {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  template: ProjectTemplate;
  content: ProjectContent;
  metadata: ProjectMetadata;
  collaborators: Collaborator[];
  versions: ProjectVersion[];
  comments: ProjectComment[];
  analytics: ProjectAnalytics;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;
}

export interface ProjectAnalytics {
  views: number;
  uniqueViews: number;
  interactions: number;
  timeOnPage: number;
  bounceRate: number;
  topSections: Array<{
    sectionId: string;
    views: number;
    interactions: number;
  }>;
  topMedia: Array<{
    mediaId: string;
    views: number;
    interactions: number;
  }>;
  referrers: Array<{
    source: string;
    views: number;
  }>;
  devices: Array<{
    type: string;
    views: number;
  }>;
  countries: Array<{
    country: string;
    views: number;
  }>;
}
