/**
 * Unified Project Type
 * Merges the portfolio Project type with the template-based PortfolioProject type
 * Supports both traditional content editing and flexible section-based layouts
 */

import { TemplateSection } from './template';

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

export interface ProjectSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface UnifiedProject {
  // Core Identity
  id: string;
  title: string;
  slug: string;
  role: string;
  summary: string;
  tags: string[];
  type: 'case-study' | 'project' | 'image' | 'video' | 'audio' | 'document';
  featured: boolean;

  // Template System Integration
  templateId?: string; // Which template this was created from
  sections: TemplateSection[]; // Flexible section-based content structure

  // Traditional Content (maps to/from sections)
  content: ProjectContent;

  // Media
  images: ProjectImage[]; // Cover images and quick-access gallery

  // Meta & SEO
  seo?: ProjectSEO;
  status: 'draft' | 'published' | 'archived';

  // Ordering & Display
  orderIndex?: number; // For custom portfolio ordering

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Analytics (optional)
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    lastViewed?: string;
  };

  // Versioning (optional)
  versions?: ProjectVersion[];
}

export interface ProjectVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string[];
  status: 'draft' | 'published' | 'archived';
}

// For creating new projects
export interface CreateProjectData {
  title: string;
  slug?: string; // Auto-generated if not provided
  role?: string;
  summary?: string;
  templateId?: string;
  tags?: string[];
  type?: UnifiedProject['type'];
}

// For updating projects
export type UpdateProjectData = Partial<Omit<UnifiedProject, 'id' | 'createdAt'>>;

// Filters for querying projects
export interface ProjectFilters {
  status?: UnifiedProject['status'] | 'all';
  featured?: boolean;
  type?: UnifiedProject['type'];
  templateId?: string;
  tags?: string[];
  search?: string; // Search in title, summary, tags
  orderBy?: 'createdAt' | 'updatedAt' | 'title' | 'orderIndex';
  orderDirection?: 'asc' | 'desc';
}

// Reference to where media is used in projects
export interface ProjectReference {
  projectId: string;
  projectTitle: string;
  sectionId?: string;
  sectionTitle?: string;
}

// Editor modes
export type EditorMode = 'simple' | 'advanced';

// Simple mode field groups for tabs
export interface SimpleEditorState {
  basicInfo: {
    title: string;
    role: string;
    summary: string;
    tags: string[];
    type: UnifiedProject['type'];
    featured: boolean;
  };
  content: ProjectContent;
  media: ProjectImage[];
  seo: ProjectSEO;
}
