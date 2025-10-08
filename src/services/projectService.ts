/**
 * Project Service
 * Business logic for project management
 */

import {
  UnifiedProject,
  CreateProjectData,
  ProjectFilters,
  ProjectImage,
} from '@/types/unified-project';
import { ProjectTemplate, DEFAULT_TEMPLATES } from '@/types/template';
import { generateSlug } from '@/utils/projectMigration';

/**
 * Validate project data before creation/update
 */
export function validateProject(data: Partial<UnifiedProject>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!data.role || data.role.trim().length === 0) {
    errors.push('Role is required');
  }

  if (!data.summary || data.summary.trim().length === 0) {
    errors.push('Summary is required');
  }

  if (data.summary && data.summary.length > 500) {
    errors.push('Summary must be less than 500 characters');
  }

  // Validate slug
  if (data.slug) {
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
  }

  // Validate tags
  if (data.tags && data.tags.length > 20) {
    errors.push('Maximum 20 tags allowed');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create a new project from scratch
 */
export function createEmptyProject(data: CreateProjectData): Partial<UnifiedProject> {
  const now = new Date().toISOString();
  const slug = data.slug || generateSlug(data.title);

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: data.title,
    slug,
    role: data.role || '',
    summary: data.summary || '',
    tags: data.tags || [],
    type: data.type || 'project',
    featured: false,
    templateId: data.templateId,
    sections: [], // Will be filled by template or manually
    content: {
      challenge: '',
      solution: '',
      results: '',
      process: [],
      technologies: [],
      skills: [],
    },
    images: [],
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a new project from a template
 */
export function createProjectFromTemplate(
  templateId: string,
  data: CreateProjectData
): Partial<UnifiedProject> | null {
  const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    console.error(`Template not found: ${templateId}`);
    return null;
  }

  const baseProject = createEmptyProject(data);

  return {
    ...baseProject,
    templateId: template.id,
    sections: JSON.parse(JSON.stringify(template.sections)), // Deep clone sections
  };
}

/**
 * Duplicate an existing project
 */
export function duplicateProject(project: UnifiedProject): Partial<UnifiedProject> {
  const now = new Date().toISOString();

  return {
    ...JSON.parse(JSON.stringify(project)), // Deep clone
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `${project.title} (Copy)`,
    slug: `${project.slug}-copy-${Date.now()}`,
    status: 'draft',
    featured: false,
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  };
}

/**
 * Filter projects based on criteria
 */
export function filterProjects(
  projects: UnifiedProject[],
  filters: ProjectFilters
): UnifiedProject[] {
  let filtered = [...projects];

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(p => p.status === filters.status);
  }

  // Featured filter
  if (filters.featured !== undefined) {
    filtered = filtered.filter(p => p.featured === filters.featured);
  }

  // Type filter
  if (filters.type) {
    filtered = filtered.filter(p => p.type === filters.type);
  }

  // Template filter
  if (filters.templateId) {
    filtered = filtered.filter(p => p.templateId === filters.templateId);
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(p =>
      filters.tags!.some(tag => p.tags.includes(tag))
    );
  }

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.summary.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Sorting
  const orderBy = filters.orderBy || 'updatedAt';
  const orderDirection = filters.orderDirection || 'desc';

  filtered.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (orderBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      case 'orderIndex':
        aValue = a.orderIndex ?? 999999;
        bValue = b.orderIndex ?? 999999;
        break;
      default:
        aValue = a.updatedAt;
        bValue = b.updatedAt;
    }

    if (aValue < bValue) return orderDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return orderDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
}

/**
 * Get all unique tags from projects
 */
export function getAllTags(projects: UnifiedProject[]): string[] {
  const tagSet = new Set<string>();

  projects.forEach(project => {
    project.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get all templates with usage count
 */
export function getTemplatesWithUsage(projects: UnifiedProject[]): Array<{
  template: ProjectTemplate;
  usageCount: number;
}> {
  const templateUsage = new Map<string, number>();

  // Count template usage
  projects.forEach(project => {
    if (project.templateId) {
      const count = templateUsage.get(project.templateId) || 0;
      templateUsage.set(project.templateId, count + 1);
    }
  });

  // Map templates with usage count
  return DEFAULT_TEMPLATES.map(template => ({
    template,
    usageCount: templateUsage.get(template.id) || 0,
  }));
}

/**
 * Calculate project statistics
 */
export function getProjectStats(projects: UnifiedProject[]): {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  byType: Record<string, number>;
  byTemplate: Record<string, number>;
} {
  const stats = {
    total: projects.length,
    published: 0,
    draft: 0,
    archived: 0,
    featured: 0,
    byType: {} as Record<string, number>,
    byTemplate: {} as Record<string, number>,
  };

  projects.forEach(project => {
    // Count by status
    if (project.status === 'published') stats.published++;
    if (project.status === 'draft') stats.draft++;
    if (project.status === 'archived') stats.archived++;

    // Count featured
    if (project.featured) stats.featured++;

    // Count by type
    stats.byType[project.type] = (stats.byType[project.type] || 0) + 1;

    // Count by template
    if (project.templateId) {
      stats.byTemplate[project.templateId] = (stats.byTemplate[project.templateId] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Reorder projects (for custom portfolio ordering)
 */
export function reorderProjects(
  projects: UnifiedProject[],
  projectIds: string[]
): UnifiedProject[] {
  // Create a map of projectId to new orderIndex
  const orderMap = new Map<string, number>();
  projectIds.forEach((id, index) => {
    orderMap.set(id, index);
  });

  // Update orderIndex for each project
  return projects.map(project => ({
    ...project,
    orderIndex: orderMap.get(project.id) ?? project.orderIndex,
  }));
}

/**
 * Prepare project for publishing
 */
export function prepareForPublish(project: UnifiedProject): UnifiedProject {
  const validation = validateProject(project);

  if (!validation.valid) {
    throw new Error(`Cannot publish project: ${validation.errors.join(', ')}`);
  }

  return {
    ...project,
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get cover image for a project
 */
export function getCoverImage(project: UnifiedProject): ProjectImage | null {
  if (project.images && project.images.length > 0) {
    // Find the first image or the one with order 0
    const coverImage = project.images.find(img => img.order === 0) || project.images[0];
    return coverImage || null;
  }
  return null;
}

/**
 * Search projects
 */
export function searchProjects(projects: UnifiedProject[], query: string): UnifiedProject[] {
  if (!query || query.trim().length === 0) {
    return projects;
  }

  const searchLower = query.toLowerCase();

  return projects.filter(project => {
    // Search in title
    if (project.title.toLowerCase().includes(searchLower)) return true;

    // Search in summary
    if (project.summary.toLowerCase().includes(searchLower)) return true;

    // Search in tags
    if (project.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;

    // Search in role
    if (project.role.toLowerCase().includes(searchLower)) return true;

    // Search in content
    if (project.content.challenge.toLowerCase().includes(searchLower)) return true;
    if (project.content.solution.toLowerCase().includes(searchLower)) return true;
    if (project.content.results.toLowerCase().includes(searchLower)) return true;

    return false;
  });
}

export const projectService = {
  validateProject,
  createEmptyProject,
  createProjectFromTemplate,
  duplicateProject,
  filterProjects,
  getAllTags,
  getTemplatesWithUsage,
  getProjectStats,
  reorderProjects,
  prepareForPublish,
  getCoverImage,
  searchProjects,
};
