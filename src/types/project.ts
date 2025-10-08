export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  type: 'image' | 'video';
  order?: number;
}

export interface ProjectContent {
  challenge: string;
  solution: string;
  results: string;
  process: string[];
  technologies: string[];
  skills: string[];
  client?: string;
  timeline?: string;
  budget?: string;
  team?: string[];
  deliverables?: string[];
  metrics?: string[];
}

export interface ProjectAnalytics {
  views: number;
  likes: number;
  shares: number;
  lastViewed?: string;
  engagementRate?: number;
  topReferrers?: { source: string; count: number }[];
}

export interface ProjectVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string[];
  status: 'draft' | 'published' | 'archived';
}

export interface Project {
  id: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  type: 'case-study' | 'project' | 'image' | 'video' | 'audio' | 'document';
  featured: boolean;
  images: ProjectImage[]; // Visuals: photo templates, social media templates, animated infographics
  content: ProjectContent;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
  templateId?: string;
  analytics?: ProjectAnalytics;
  versions?: ProjectVersion[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface ProjectDraft extends Omit<Project, 'publishedAt' | 'analytics'> {
  status: 'draft';
  parentId?: string; // If this is a draft of an existing project
}

export interface ProjectPublishData {
  projectId: string;
  publishAt?: string; // For scheduled publishing
  notifySubscribers?: boolean;
  socialMedia?: {
    twitter?: boolean;
    linkedin?: boolean;
    facebook?: boolean;
  };
}

export interface ProjectVersionHistory {
  projectId: string;
  versions: ProjectVersion[];
  currentVersion: string;
  publishedVersion?: string;
}
