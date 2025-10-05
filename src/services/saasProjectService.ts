// SaaS Portfolio Project Service
import {
  ProjectDraft,
  ProjectTemplate,
  ProjectVersion,
  ProjectComment,
  ProjectExport,
  ProjectImport,
  ChangeLog,
  Collaborator,
} from '@/types/saas';
import { MediaFile } from '@/types/media';

class SaaSProjectService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SAAS_API_URL || '/api/saas';
  }

  // Project Management
  async createProject(
    template: ProjectTemplate,
    title: string,
    description: string
  ): Promise<ProjectDraft> {
    const project: ProjectDraft = {
      id: this.generateId(),
      title,
      description,
      status: 'draft',
      template,
      structure: { ...template.structure },
      content: {
        sections: template.structure.sections.map(section => ({ ...section })),
        media: [],
        seo: {
          title,
          description,
          keywords: [],
        },
      },
      metadata: {
        tags: [],
        category: template.category,
        featured: false,
        published: false,
        visibility: 'private',
        analytics: {
          trackViews: true,
          trackInteractions: true,
          customEvents: [],
        },
      },
      collaborators: [],
      permissions: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: this.getCurrentUserId(),
    };

    // In a real implementation, this would save to the backend
    this.saveProjectToStorage(project);
    return project;
  }

  async getProject(projectId: string): Promise<ProjectDraft | null> {
    const projects = this.getProjectsFromStorage();
    return projects.find(p => p.id === projectId) || null;
  }

  async updateProject(projectId: string, updates: Partial<ProjectDraft>): Promise<ProjectDraft> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedProject = {
      ...project,
      ...updates,
      version: project.version + 1,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: this.getCurrentUserId(),
    };

    // Create version history
    await this.createVersion(projectId, {
      version: project.version,
      title: `Version ${project.version}`,
      description: this.generateChangeDescription(project, updatedProject),
      content: project.content,
      changes: this.generateChangeLog(project, updatedProject),
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUserId(),
    });

    this.saveProjectToStorage(updatedProject);
    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    const projects = this.getProjectsFromStorage();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    this.saveProjectsToStorage(filteredProjects);
  }

  async listProjects(filters?: {
    status?: string;
    category?: string;
    tags?: string[];
    search?: string;
  }): Promise<ProjectDraft[]> {
    let projects = this.getProjectsFromStorage();

    if (filters) {
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.category) {
        projects = projects.filter(p => p.metadata.category === filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        projects = projects.filter(p => filters.tags!.some(tag => p.metadata.tags.includes(tag)));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        projects = projects.filter(
          p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }
    }

    return projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Template Management
  async getTemplates(): Promise<ProjectTemplate[]> {
    // In a real implementation, this would fetch from the backend
    return this.getMockTemplates();
  }

  async getTemplate(templateId: string): Promise<ProjectTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === templateId) || null;
  }

  // Media Integration
  async addMediaToProject(
    projectId: string,
    media: MediaFile,
    _sectionId: string,
    position?: { x: number; y: number }
  ): Promise<void> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const mediaReference = {
      id: this.generateId(),
      mediaId: media.id,
      type: media.type.startsWith('image/')
        ? ('image' as const)
        : media.type.startsWith('video/')
          ? ('video' as const)
          : media.type.startsWith('audio/')
            ? ('audio' as const)
            : ('document' as const),
      url: media.url,
      alt: media.alt || media.name,
      caption: media.caption || '',
      metadata: {
        width: media.metadata?.width,
        height: media.metadata?.height,
        duration: media.metadata?.duration,
        fileSize: media.size,
        format: media.type,
      },
      transformations: [],
      position: position ? { ...position, z: 0 } : { x: 0, y: 0, z: 0 },
      responsive: {
        mobile: { visible: true, columns: 1, spacing: 16 },
        tablet: { visible: true, columns: 2, spacing: 20 },
        desktop: { visible: true, columns: 3, spacing: 24 },
      },
    };

    project.content.media.push(mediaReference);
    await this.updateProject(projectId, { content: project.content });
  }

  async removeMediaFromProject(projectId: string, mediaReferenceId: string): Promise<void> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.content.media = project.content.media.filter(m => m.id !== mediaReferenceId);
    await this.updateProject(projectId, { content: project.content });
  }

  // Version Control
  async createVersion(
    projectId: string,
    version: Omit<ProjectVersion, 'id' | 'projectId'>
  ): Promise<ProjectVersion> {
    const newVersion: ProjectVersion = {
      id: this.generateId(),
      projectId,
      ...version,
    };

    const versions = this.getVersionsFromStorage();
    versions.push(newVersion);
    this.saveVersionsToStorage(versions);

    return newVersion;
  }

  async getVersions(projectId: string): Promise<ProjectVersion[]> {
    const versions = this.getVersionsFromStorage();
    return versions.filter(v => v.projectId === projectId).sort((a, b) => b.version - a.version);
  }

  async restoreVersion(projectId: string, versionId: string): Promise<ProjectDraft> {
    const versions = this.getVersionsFromStorage();
    const version = versions.find(v => v.id === versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const restoredProject = {
      ...project,
      content: version.content,
      version: project.version + 1,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: this.getCurrentUserId(),
    };

    await this.updateProject(projectId, restoredProject);
    return restoredProject;
  }

  // Collaboration
  async addCollaborator(
    projectId: string,
    collaborator: Omit<Collaborator, 'id' | 'invitedAt'>
  ): Promise<void> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const newCollaborator: Collaborator = {
      id: this.generateId(),
      ...collaborator,
      invitedAt: new Date().toISOString(),
    };

    project.collaborators.push(newCollaborator);
    await this.updateProject(projectId, { collaborators: project.collaborators });
  }

  async removeCollaborator(projectId: string, collaboratorId: string): Promise<void> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.collaborators = project.collaborators.filter(c => c.id !== collaboratorId);
    await this.updateProject(projectId, { collaborators: project.collaborators });
  }

  // Comments
  async addComment(
    projectId: string,
    comment: Omit<ProjectComment, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
  ): Promise<ProjectComment> {
    const newComment: ProjectComment = {
      id: this.generateId(),
      projectId,
      ...comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const comments = this.getCommentsFromStorage();
    comments.push(newComment);
    this.saveCommentsToStorage(comments);

    return newComment;
  }

  async getComments(projectId: string): Promise<ProjectComment[]> {
    const comments = this.getCommentsFromStorage();
    return comments
      .filter(c => c.projectId === projectId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Export/Import
  async exportProject(
    projectId: string,
    format: 'json' | 'html' | 'pdf' | 'zip'
  ): Promise<ProjectExport> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const exportData: ProjectExport = {
      id: this.generateId(),
      projectId,
      format,
      status: 'processing',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUserId(),
    };

    // In a real implementation, this would trigger a background job
    setTimeout(() => {
      exportData.status = 'completed';
      exportData.downloadUrl = this.generateDownloadUrl(exportData.id);
    }, 2000);

    const exports = this.getExportsFromStorage();
    exports.push(exportData);
    this.saveExportsToStorage(exports);

    return exportData;
  }

  async importProject(file: File, format: 'json' | 'html' | 'zip'): Promise<ProjectImport> {
    const importData: ProjectImport = {
      id: this.generateId(),
      file,
      format,
      status: 'processing',
      errors: [],
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUserId(),
    };

    // In a real implementation, this would process the file
    try {
      const content = await this.processImportFile(file);
      importData.status = 'completed';
      importData.result = content;
    } catch (error) {
      importData.status = 'failed';
      importData.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    const imports = this.getImportsFromStorage();
    imports.push(importData);
    this.saveImportsToStorage(imports);

    return importData;
  }

  // Private helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getCurrentUserId(): string {
    // In a real implementation, this would get the current user ID
    return 'current-user';
  }

  private generateChangeDescription(oldProject: ProjectDraft, newProject: ProjectDraft): string {
    const changes = [];
    if (oldProject.title !== newProject.title) changes.push('Title updated');
    if (oldProject.description !== newProject.description) changes.push('Description updated');
    if (oldProject.status !== newProject.status)
      changes.push(`Status changed to ${newProject.status}`);
    return changes.join(', ') || 'Project updated';
  }

  private generateChangeLog(oldProject: ProjectDraft, newProject: ProjectDraft): ChangeLog[] {
    const changes: ChangeLog[] = [];
    const timestamp = new Date().toISOString();
    const userId = this.getCurrentUserId();

    if (oldProject.title !== newProject.title) {
      changes.push({
        id: this.generateId(),
        type: 'update',
        section: 'metadata',
        description: 'Title updated',
        before: oldProject.title,
        after: newProject.title,
        timestamp,
        userId,
      });
    }

    if (oldProject.description !== newProject.description) {
      changes.push({
        id: this.generateId(),
        type: 'update',
        section: 'metadata',
        description: 'Description updated',
        before: oldProject.description,
        after: newProject.description,
        timestamp,
        userId,
      });
    }

    return changes;
  }

  private generateDownloadUrl(exportId: string): string {
    return `${this.baseUrl}/exports/${exportId}/download`;
  }

  private async processImportFile(file: File): Promise<ProjectDraft> {
    // Mock implementation - in reality this would parse the file
    const content = await file.text();
    return JSON.parse(content);
  }

  // Storage methods (in a real app, these would be API calls)
  private saveProjectToStorage(project: ProjectDraft): void {
    const projects = this.getProjectsFromStorage();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    this.saveProjectsToStorage(projects);
  }

  private getProjectsFromStorage(): ProjectDraft[] {
    const stored = localStorage.getItem('saas-projects');
    return stored ? JSON.parse(stored) : [];
  }

  private saveProjectsToStorage(projects: ProjectDraft[]): void {
    localStorage.setItem('saas-projects', JSON.stringify(projects));
  }

  private getVersionsFromStorage(): ProjectVersion[] {
    const stored = localStorage.getItem('saas-versions');
    return stored ? JSON.parse(stored) : [];
  }

  private saveVersionsToStorage(versions: ProjectVersion[]): void {
    localStorage.setItem('saas-versions', JSON.stringify(versions));
  }

  private getCommentsFromStorage(): ProjectComment[] {
    const stored = localStorage.getItem('saas-comments');
    return stored ? JSON.parse(stored) : [];
  }

  private saveCommentsToStorage(comments: ProjectComment[]): void {
    localStorage.setItem('saas-comments', JSON.stringify(comments));
  }

  private getExportsFromStorage(): ProjectExport[] {
    const stored = localStorage.getItem('saas-exports');
    return stored ? JSON.parse(stored) : [];
  }

  private saveExportsToStorage(exports: ProjectExport[]): void {
    localStorage.setItem('saas-exports', JSON.stringify(exports));
  }

  private getImportsFromStorage(): ProjectImport[] {
    const stored = localStorage.getItem('saas-imports');
    return stored ? JSON.parse(stored) : [];
  }

  private saveImportsToStorage(imports: ProjectImport[]): void {
    localStorage.setItem('saas-imports', JSON.stringify(imports));
  }

  private getMockTemplates(): ProjectTemplate[] {
    return [
      {
        id: 'portfolio-showcase',
        name: 'Portfolio Showcase',
        description: 'A clean, modern portfolio template perfect for showcasing your work',
        category: 'portfolio',
        thumbnail: '/templates/portfolio-showcase-thumb.jpg',
        preview: '/templates/portfolio-showcase-preview.jpg',
        structure: {
          sections: [
            {
              id: 'hero',
              type: 'hero',
              title: 'Hero Section',
              content: {},
              position: 0,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 1, spacing: 20 },
                desktop: { visible: true, columns: 1, spacing: 24 },
              },
              animations: [],
            },
            {
              id: 'gallery',
              type: 'gallery',
              title: 'Project Gallery',
              content: {},
              position: 1,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 2, spacing: 20 },
                desktop: { visible: true, columns: 3, spacing: 24 },
              },
              animations: [],
            },
          ],
          layout: {
            type: 'single-column',
            spacing: 'normal',
            alignment: 'center',
            maxWidth: 1200,
            padding: { top: 40, right: 20, bottom: 40, left: 20 },
          },
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            accentColor: '#F59E0B',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            fontFamily: 'Inter',
            fontSize: 'medium',
            borderRadius: 'medium',
            shadows: 'subtle',
          },
          interactions: [],
        },
        metadata: {
          author: 'SaaS Team',
          version: '1.0.0',
          tags: ['portfolio', 'modern', 'clean'],
          difficulty: 'beginner',
          estimatedTime: 30,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'case-study-detailed',
        name: 'Detailed Case Study',
        description: 'A comprehensive template for detailed project case studies',
        category: 'case-study',
        thumbnail: '/templates/case-study-thumb.jpg',
        preview: '/templates/case-study-preview.jpg',
        structure: {
          sections: [
            {
              id: 'hero',
              type: 'hero',
              title: 'Project Hero',
              content: {},
              position: 0,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 1, spacing: 20 },
                desktop: { visible: true, columns: 1, spacing: 24 },
              },
              animations: [],
            },
            {
              id: 'challenge',
              type: 'text',
              title: 'The Challenge',
              content: {},
              position: 1,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 1, spacing: 20 },
                desktop: { visible: true, columns: 1, spacing: 24 },
              },
              animations: [],
            },
            {
              id: 'solution',
              type: 'text',
              title: 'The Solution',
              content: {},
              position: 2,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 1, spacing: 20 },
                desktop: { visible: true, columns: 1, spacing: 24 },
              },
              animations: [],
            },
            {
              id: 'results',
              type: 'stats',
              title: 'Results',
              content: {},
              position: 3,
              visible: true,
              responsive: {
                mobile: { visible: true, columns: 1, spacing: 16 },
                tablet: { visible: true, columns: 2, spacing: 20 },
                desktop: { visible: true, columns: 3, spacing: 24 },
              },
              animations: [],
            },
          ],
          layout: {
            type: 'single-column',
            spacing: 'spacious',
            alignment: 'left',
            maxWidth: 800,
            padding: { top: 60, right: 40, bottom: 60, left: 40 },
          },
          theme: {
            primaryColor: '#6366F1',
            secondaryColor: '#4F46E5',
            accentColor: '#10B981',
            backgroundColor: '#FFFFFF',
            textColor: '#374151',
            fontFamily: 'Inter',
            fontSize: 'medium',
            borderRadius: 'small',
            shadows: 'medium',
          },
          interactions: [],
        },
        metadata: {
          author: 'SaaS Team',
          version: '1.0.0',
          tags: ['case-study', 'detailed', 'professional'],
          difficulty: 'intermediate',
          estimatedTime: 60,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

export const saasProjectService = new SaaSProjectService();
export default saasProjectService;
