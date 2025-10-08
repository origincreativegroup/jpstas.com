/**
 * Enhanced Mock API with localStorage persistence
 * Provides full CRUD operations for UnifiedProject during development
 */

import {
  UnifiedProject,
  CreateProjectData,
  UpdateProjectData,
  ProjectFilters,
  ProjectReference,
} from '@/types/unified-project';
import { mockProjects } from '@/utils/mockApi';
import { migrateProjectToUnified } from '@/utils/projectMigration';
import { projectService } from './projectService';

const STORAGE_KEY = 'unified_projects_v1';
const MEDIA_USAGE_KEY = 'media_usage_v1';

/**
 * Load projects from localStorage or migrate from mock data
 */
function loadProjectsFromStorage(): UnifiedProject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // If no stored projects, migrate from mockProjects
    const migrated = mockProjects.map(migrateProjectToUnified);
    saveProjectsToStorage(migrated);
    return migrated;
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
    return [];
  }
}

/**
 * Save projects to localStorage
 */
function saveProjectsToStorage(projects: UnifiedProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
  }
}

/**
 * Load media usage tracking
 */
function loadMediaUsage(): Map<string, ProjectReference[]> {
  try {
    const stored = localStorage.getItem(MEDIA_USAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    }
  } catch (error) {
    console.error('Failed to load media usage:', error);
  }
  return new Map();
}

/**
 * Save media usage tracking
 */
function saveMediaUsage(usage: Map<string, ProjectReference[]>): void {
  try {
    const data = Object.fromEntries(usage);
    localStorage.setItem(MEDIA_USAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save media usage:', error);
  }
}

/**
 * Track media usage in a project
 */
function trackMediaUsage(project: UnifiedProject): void {
  const usage = loadMediaUsage();

  // Clear old usage for this project
  usage.forEach((refs, mediaId) => {
    usage.set(
      mediaId,
      refs.filter(ref => ref.projectId !== project.id)
    );
  });

  // Track new usage
  project.images.forEach(image => {
    const refs = usage.get(image.id) || [];
    refs.push({
      projectId: project.id,
      projectTitle: project.title,
    });
    usage.set(image.id, refs);
  });

  // Track media in sections
  project.sections.forEach(section => {
    if (section.media) {
      section.media.forEach(media => {
        const refs = usage.get(media.id) || [];
        refs.push({
          projectId: project.id,
          projectTitle: project.title,
          sectionId: section.id,
          sectionTitle: section.title,
        });
        usage.set(media.id, refs);
      });
    }
  });

  saveMediaUsage(usage);
}

/**
 * Mock UnifiedProject API implementation with localStorage
 */
export const mockUnifiedApi = {
  async getUnifiedProjects(filters?: ProjectFilters): Promise<UnifiedProject[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    let projects = loadProjectsFromStorage();

    if (filters) {
      projects = projectService.filterProjects(projects, filters);
    }

    return projects;
  },

  async getUnifiedProject(id: string): Promise<UnifiedProject> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const projects = loadProjectsFromStorage();
    const project = projects.find(p => p.id === id);

    if (!project) {
      throw new Error(`Project not found: ${id}`);
    }

    return project;
  },

  async createUnifiedProject(data: CreateProjectData): Promise<UnifiedProject> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const projects = loadProjectsFromStorage();
    const newProject = projectService.createEmptyProject(data);

    const fullProject: UnifiedProject = {
      ...newProject,
      id: newProject.id!,
      title: newProject.title!,
      slug: newProject.slug!,
      role: newProject.role!,
      summary: newProject.summary!,
      tags: newProject.tags!,
      type: newProject.type!,
      featured: newProject.featured!,
      sections: newProject.sections!,
      content: newProject.content!,
      images: newProject.images!,
      status: newProject.status!,
      createdAt: newProject.createdAt!,
      updatedAt: newProject.updatedAt!,
    };

    projects.push(fullProject);
    saveProjectsToStorage(projects);

    return fullProject;
  },

  async createUnifiedProjectFromTemplate(
    templateId: string,
    data: CreateProjectData
  ): Promise<UnifiedProject> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const projects = loadProjectsFromStorage();
    const newProject = projectService.createProjectFromTemplate(templateId, data);

    if (!newProject) {
      throw new Error(`Failed to create project from template: ${templateId}`);
    }

    const fullProject: UnifiedProject = {
      ...newProject,
      id: newProject.id!,
      title: newProject.title!,
      slug: newProject.slug!,
      role: newProject.role!,
      summary: newProject.summary!,
      tags: newProject.tags!,
      type: newProject.type!,
      featured: newProject.featured!,
      sections: newProject.sections!,
      content: newProject.content!,
      images: newProject.images!,
      status: newProject.status!,
      createdAt: newProject.createdAt!,
      updatedAt: newProject.updatedAt!,
    };

    projects.push(fullProject);
    saveProjectsToStorage(projects);

    return fullProject;
  },

  async updateUnifiedProject(id: string, updates: UpdateProjectData): Promise<UnifiedProject> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const projects = loadProjectsFromStorage();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Project not found: ${id}`);
    }

    const updatedProject: UnifiedProject = {
      ...projects[index]!,
      ...updates,
      // Ensure required fields are not undefined
      id: projects[index]!.id,
      title: updates.title ?? projects[index]!.title,
      slug: updates.slug ?? projects[index]!.slug,
      role: updates.role ?? projects[index]!.role,
      summary: updates.summary ?? projects[index]!.summary,
      tags: updates.tags ?? projects[index]!.tags,
      type: updates.type ?? projects[index]!.type,
      featured: updates.featured ?? projects[index]!.featured,
      sections: updates.sections ?? projects[index]!.sections,
      content: updates.content ?? projects[index]!.content,
      images: updates.images ?? projects[index]!.images,
      status: updates.status ?? projects[index]!.status,
      updatedAt: new Date().toISOString(),
    };

    // Validate project
    const validation = projectService.validateProject(updatedProject);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    projects[index] = updatedProject;
    saveProjectsToStorage(projects);
    trackMediaUsage(updatedProject);

    return updatedProject;
  },

  async deleteUnifiedProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const projects = loadProjectsFromStorage();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) {
      throw new Error(`Project not found: ${id}`);
    }

    saveProjectsToStorage(filtered);
  },

  async duplicateUnifiedProject(id: string): Promise<UnifiedProject> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const projects = loadProjectsFromStorage();
    const original = projects.find(p => p.id === id);

    if (!original) {
      throw new Error(`Project not found: ${id}`);
    }

    const duplicate = projectService.duplicateProject(original);
    const fullDuplicate: UnifiedProject = {
      ...duplicate,
      id: duplicate.id!,
      title: duplicate.title!,
      slug: duplicate.slug!,
      role: duplicate.role!,
      summary: duplicate.summary!,
      tags: duplicate.tags!,
      type: duplicate.type!,
      featured: duplicate.featured!,
      sections: duplicate.sections!,
      content: duplicate.content!,
      images: duplicate.images!,
      status: duplicate.status!,
      createdAt: duplicate.createdAt!,
      updatedAt: duplicate.updatedAt!,
    };

    projects.push(fullDuplicate);
    saveProjectsToStorage(projects);

    return fullDuplicate;
  },

  async reorderUnifiedProjects(projectIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const projects = loadProjectsFromStorage();
    const reordered = projectService.reorderProjects(projects, projectIds);
    saveProjectsToStorage(reordered);
  },

  async bulkUpdateUnifiedProjects(
    ids: string[],
    updates: UpdateProjectData
  ): Promise<UnifiedProject[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const projects = loadProjectsFromStorage();
    const updated: UnifiedProject[] = [];

    projects.forEach(project => {
      if (ids.includes(project.id)) {
        const updatedProject: UnifiedProject = {
          ...project,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updated.push(updatedProject);
        const index = projects.findIndex(p => p.id === project.id);
        projects[index] = updatedProject;
      }
    });

    saveProjectsToStorage(projects);
    return updated;
  },

  async getMediaUsage(mediaId: string): Promise<ProjectReference[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const usage = loadMediaUsage();
    return usage.get(mediaId) || [];
  },
};

/**
 * Utility: Reset storage to default mock projects
 */
export function resetProjectStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(MEDIA_USAGE_KEY);
}

/**
 * Utility: Export all projects as JSON
 */
export function exportProjects(): string {
  const projects = loadProjectsFromStorage();
  return JSON.stringify(projects, null, 2);
}

/**
 * Utility: Import projects from JSON
 */
export function importProjects(json: string): void {
  try {
    const projects = JSON.parse(json);
    if (Array.isArray(projects)) {
      saveProjectsToStorage(projects);
    } else {
      throw new Error('Invalid projects data');
    }
  } catch (error) {
    console.error('Failed to import projects:', error);
    throw error;
  }
}
