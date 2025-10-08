// Unified API client that handles both mock and real APIs
import { config, getApiUrl, retryWithBackoff, withTimeout, envLog } from '@/config/environment';
import { pushDebug } from '@/components/DebugOverlay';
import { MediaFile } from '@/types/media';
import { Project } from '@/types/project';
import { PageContent, CMSSettings } from '@/types/cms';
import {
  UnifiedProject,
  CreateProjectData,
  UpdateProjectData,
  ProjectFilters,
  ProjectReference
} from '@/types/unified-project';
import { mockUnifiedApi } from './mockUnifiedApi';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError extends Error {
  status?: number;
  response?: Response;
}

// Create a custom error class for API errors
export class ApiClientError extends Error implements ApiError {
  status?: number;
  response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.response = response;
  }
}

// Generic API request wrapper
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);

  envLog.debug(`API Request: ${options.method || 'GET'} ${url}`, options);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await withTimeout(retryWithBackoff(() => fetch(url, requestOptions)));

    const responseRequestId = response.headers.get('X-Request-Id') || undefined;
    envLog.debug(`API Response: ${response.status} ${response.statusText} ${responseRequestId ? `(req ${responseRequestId})` : ''}`);
    if (responseRequestId) {
      pushDebug('info', 'API response received', { endpoint, status: response.status, requestId: responseRequestId });
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
      }

      const err = new ApiClientError(errorMessage, response.status, response);
      if (responseRequestId) {
        (err as any).requestId = responseRequestId;
      }
      pushDebug('error', 'API error', { endpoint, status: response.status, error: errorMessage, requestId: responseRequestId });
      throw err;
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      pushDebug('error', 'ApiClientError thrown', { endpoint, status: error.status, message: error.message, requestId: (error as any).requestId });
      throw error;
    }

    envLog.error('API Request failed:', error);
    pushDebug('error', 'API Request failed', { endpoint, error: error instanceof Error ? error.message : String(error) });
    throw new ApiClientError(error instanceof Error ? error.message : 'Unknown error occurred', 0);
  }
}

// Mock API implementations
const mockApi = {
  async getProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: '1',
        title: 'In‑House Print Studio Build',
        role: 'Designer • Ops Lead',
        summary:
          'HP Latex 315 print workflow, vehicle wraps, apparel—training seasonal staff and saving costs.',
        tags: ['Design', 'Ops', 'Large Format'],
        type: 'case-study',
        featured: true,
        images: [
          {
            id: '1',
            url: '/images/placeholder.svg',
            alt: 'Print studio setup',
            caption: 'HP Latex 315 printer in action',
            type: 'image' as const,
          },
        ],
        content: {
          challenge:
            'Needed to establish an in-house print studio to reduce outsourcing costs and improve turnaround times.',
          solution:
            'Designed and implemented a complete print workflow using HP Latex 315, including training protocols for seasonal staff.',
          results: 'Reduced print costs by 40% and improved delivery times by 60%.',
          process: [
            'Research and equipment selection',
            'Workflow design and optimization',
            'Staff training and documentation',
            'Quality control implementation',
          ],
          technologies: [
            'HP Latex 315',
            'Adobe Creative Suite',
            'RIP Software',
            'Large Format Printing',
          ],
          skills: ['Print Production', 'Workflow Management', 'Staff Training', 'Quality Control'],
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        status: 'published',
      },
    ];
  },

  async getMedia(): Promise<MediaFile[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: '1',
        name: 'sample-image.jpg',
        filename: 'sample-image.jpg',
        url: '/images/placeholder.svg',
        alt: 'Sample image',
        caption: 'This is a sample image',
        size: 1024000,
        type: 'image',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        status: 'ready',
        tags: ['sample', 'placeholder'],
        collections: ['default'],
      },
    ];
  },

  async uploadFile(file: File): Promise<MediaFile> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockFile: MediaFile = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      filename: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      caption: '',
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      status: 'ready',
      tags: [],
      collections: ['default'],
    };

    return mockFile;
  },

  async saveProject(project: Project): Promise<{ id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    envLog.debug('Mock: Project saved', { id: project.id, title: project.title });
    return { id: project.id };
  },

  async updateMedia(id: string, updates: Partial<MediaFile>): Promise<MediaFile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    envLog.debug('Mock: Media updated', { id, updates });
    return { id, ...updates } as MediaFile;
  },

  async deleteMedia(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    envLog.debug('Mock: Media deleted', { id });
  },

  // CMS API methods (mock)
  async getPageContent(page: string): Promise<PageContent> {
    await new Promise(resolve => setTimeout(resolve, 200));
    envLog.debug('Mock: Get page content', { page });

    // Return mock page content based on page type
    const mockContent: PageContent = {
      id: `${page}-content`,
      page: page as any,
      seo: {
        title: `${page.charAt(0).toUpperCase() + page.slice(1)} - John P. Stas`,
        description: `John P. Stas - ${page} page`,
        keywords: ['creative technologist', 'designer', 'developer'],
      },
      lastUpdated: new Date().toISOString(),
      published: true,
    };

    return mockContent;
  },

  async updatePageContent(page: string, content: Partial<PageContent>): Promise<PageContent> {
    await new Promise(resolve => setTimeout(resolve, 300));
    envLog.debug('Mock: Update page content', { page, content });

    const updatedContent: PageContent = {
      id: `${page}-content`,
      page: page as any,
      seo: {
        title: '',
        description: '',
        keywords: [],
      },
      published: false,
      ...content,
      lastUpdated: new Date().toISOString(),
    };

    return updatedContent;
  },

  async publishPageContent(page: string): Promise<PageContent> {
    await new Promise(resolve => setTimeout(resolve, 200));
    envLog.debug('Mock: Publish page content', { page });

    const publishedContent: PageContent = {
      id: `${page}-content`,
      page: page as any,
      seo: {
        title: `${page.charAt(0).toUpperCase() + page.slice(1)} - John P. Stas`,
        description: `John P. Stas - ${page} page`,
        keywords: ['creative technologist', 'designer', 'developer'],
      },
      published: true,
      lastUpdated: new Date().toISOString(),
    };

    return publishedContent;
  },

  async getCMSSettings(): Promise<CMSSettings> {
    await new Promise(resolve => setTimeout(resolve, 200));
    envLog.debug('Mock: Get CMS settings');

    const mockSettings: CMSSettings = {
      siteName: 'John P. Stas',
      siteDescription: 'Creative Technologist, Designer, & Process Innovator',
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#f1f5f9',
        accentColor: '#fbbf24',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      social: {
        linkedin: 'https://www.linkedin.com/in/johnpstas',
        github: 'https://github.com/johnpstas',
      },
    };

    return mockSettings;
  },

  async updateCMSSettings(settings: Partial<CMSSettings>): Promise<CMSSettings> {
    await new Promise(resolve => setTimeout(resolve, 300));
    envLog.debug('Mock: Update CMS settings', { settings });

    const updatedSettings: CMSSettings = {
      siteName: 'John P. Stas',
      siteDescription: 'Creative Technologist, Designer, & Process Innovator',
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#f1f5f9',
        accentColor: '#fbbf24',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      social: {
        linkedin: 'https://www.linkedin.com/in/johnpstas',
        github: 'https://github.com/johnpstas',
      },
      ...settings,
    };

    return updatedSettings;
  },

  // UnifiedProject CRUD methods (delegated to mockUnifiedApi with localStorage)
  async getUnifiedProjects(filters?: ProjectFilters): Promise<UnifiedProject[]> {
    return mockUnifiedApi.getUnifiedProjects(filters);
  },

  async getUnifiedProject(id: string): Promise<UnifiedProject> {
    return mockUnifiedApi.getUnifiedProject(id);
  },

  async createUnifiedProject(data: CreateProjectData): Promise<UnifiedProject> {
    return mockUnifiedApi.createUnifiedProject(data);
  },

  async createUnifiedProjectFromTemplate(
    templateId: string,
    data: CreateProjectData
  ): Promise<UnifiedProject> {
    return mockUnifiedApi.createUnifiedProjectFromTemplate(templateId, data);
  },

  async updateUnifiedProject(id: string, updates: UpdateProjectData): Promise<UnifiedProject> {
    return mockUnifiedApi.updateUnifiedProject(id, updates);
  },

  async deleteUnifiedProject(id: string): Promise<void> {
    return mockUnifiedApi.deleteUnifiedProject(id);
  },

  async duplicateUnifiedProject(id: string): Promise<UnifiedProject> {
    return mockUnifiedApi.duplicateUnifiedProject(id);
  },

  async reorderUnifiedProjects(projectIds: string[]): Promise<void> {
    return mockUnifiedApi.reorderUnifiedProjects(projectIds);
  },

  async bulkUpdateUnifiedProjects(
    ids: string[],
    updates: UpdateProjectData
  ): Promise<UnifiedProject[]> {
    return mockUnifiedApi.bulkUpdateUnifiedProjects(ids, updates);
  },

  async getMediaUsage(mediaId: string): Promise<ProjectReference[]> {
    return mockUnifiedApi.getMediaUsage(mediaId);
  },

  // Mock bulk operations (for development)
  async bulkUpdateMedia(ids: string[], updates: Partial<MediaFile>): Promise<{ results: any[], errors?: any[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      results: ids.map(id => ({ id, success: true, updated: { ...updates, id } })),
      errors: []
    };
  },

  async bulkDeleteMedia(ids: string[]): Promise<{ results: any[], errors?: any[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      results: ids.map(id => ({ id, success: true })),
      errors: []
    };
  },

  async bulkGetMediaUsage(ids: string[]): Promise<{ [key: string]: ProjectReference[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const usageData: { [key: string]: ProjectReference[] } = {};
    for (const id of ids) {
      usageData[id] = await mockUnifiedApi.getMediaUsage(id);
    }
    return usageData;
  },
};

// Real API implementations
const realApi = {
  async getProjects(): Promise<Project[]> {
    const response = await apiRequest<{ projects: Project[] }>('/content?type=projects');
    return response.data?.projects || [];
  },

  async getMedia(): Promise<MediaFile[]> {
    const response = await apiRequest<{ media: MediaFile[] }>('/media');
    return response.data?.media || [];
  },

  async uploadFile(file: File): Promise<MediaFile | null> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest<{ file: MediaFile }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let fetch set Content-Type for FormData
    });

    return response.data?.file || null;
  },

  async saveProject(project: Project): Promise<{ id: string }> {
    const response = await apiRequest<{ id: string }>('/content', {
      method: 'POST',
      body: JSON.stringify({ type: 'project', data: project }),
    });

    return response.data || { id: '' };
  },

  async updateMedia(id: string, updates: Partial<MediaFile>): Promise<MediaFile | null> {
    const response = await apiRequest<{ media: MediaFile }>(`/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return response.data?.media || null;
  },

  async deleteMedia(id: string): Promise<void> {
    await apiRequest(`/media?id=${id}`, {
      method: 'DELETE',
    });
  },

  // CMS API methods
  async getPageContent(page: string): Promise<PageContent> {
    const response = await apiRequest<PageContent>(`/cms/pages/${page}`);
    return response.data!;
  },

  async updatePageContent(page: string, content: Partial<PageContent>): Promise<PageContent> {
    const response = await apiRequest<PageContent>(`/cms/pages/${page}`, {
      method: 'PATCH',
      body: JSON.stringify(content),
    });
    return response.data!;
  },

  async publishPageContent(page: string): Promise<PageContent> {
    const response = await apiRequest<PageContent>(`/cms/pages/${page}/publish`, {
      method: 'POST',
    });
    return response.data!;
  },

  async getCMSSettings(): Promise<CMSSettings> {
    const response = await apiRequest<CMSSettings>('/cms/settings');
    return response.data!;
  },

  async updateCMSSettings(settings: Partial<CMSSettings>): Promise<CMSSettings> {
    const response = await apiRequest<CMSSettings>('/cms/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
    return response.data!;
  },

  // UnifiedProject CRUD methods (real API)
  async getUnifiedProjects(filters?: ProjectFilters): Promise<UnifiedProject[]> {
    const queryParams = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
    if (filters?.featured !== undefined) queryParams.append('featured', String(filters.featured));
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.templateId) queryParams.append('templateId', filters.templateId);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.orderBy) queryParams.append('orderBy', filters.orderBy);
    if (filters?.orderDirection) queryParams.append('orderDirection', filters.orderDirection);
    if (filters?.tags) filters.tags.forEach(tag => queryParams.append('tags', tag));

    const response = await apiRequest<{ projects: UnifiedProject[] }>(
      `/projects?${queryParams.toString()}`
    );
    return response.data?.projects || [];
  },

  async getUnifiedProject(id: string): Promise<UnifiedProject> {
    const response = await apiRequest<{ project: UnifiedProject }>(`/projects/${id}`);
    if (!response.data?.project) {
      throw new ApiClientError('Project not found', 404);
    }
    return response.data.project;
  },

  async createUnifiedProject(data: CreateProjectData): Promise<UnifiedProject> {
    const response = await apiRequest<{ project: UnifiedProject }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.data?.project) {
      throw new ApiClientError('Failed to create project', 500);
    }
    return response.data.project;
  },

  async createUnifiedProjectFromTemplate(
    templateId: string,
    data: CreateProjectData
  ): Promise<UnifiedProject> {
    const response = await apiRequest<{ project: UnifiedProject }>('/projects/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, ...data }),
    });
    if (!response.data?.project) {
      throw new ApiClientError('Failed to create project from template', 500);
    }
    return response.data.project;
  },

  async updateUnifiedProject(id: string, updates: UpdateProjectData): Promise<UnifiedProject> {
    const response = await apiRequest<{ project: UnifiedProject }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (!response.data?.project) {
      throw new ApiClientError('Failed to update project', 500);
    }
    return response.data.project;
  },

  async deleteUnifiedProject(id: string): Promise<void> {
    await apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async duplicateUnifiedProject(id: string): Promise<UnifiedProject> {
    const response = await apiRequest<{ project: UnifiedProject }>(`/projects/${id}/duplicate`, {
      method: 'POST',
    });
    if (!response.data?.project) {
      throw new ApiClientError('Failed to duplicate project', 500);
    }
    return response.data.project;
  },

  async reorderUnifiedProjects(projectIds: string[]): Promise<void> {
    await apiRequest('/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ projectIds }),
    });
  },

  async bulkUpdateUnifiedProjects(
    ids: string[],
    updates: UpdateProjectData
  ): Promise<UnifiedProject[]> {
    const response = await apiRequest<{ projects: UnifiedProject[] }>('/projects/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ ids, updates }),
    });
    return response.data?.projects || [];
  },

  async getMediaUsage(mediaId: string): Promise<ProjectReference[]> {
    const response = await apiRequest<{ usage: ProjectReference[] }>(`/media/${mediaId}/usage`);
    return response.data?.usage || [];
  },

  // Bulk operations for improved performance
  async bulkUpdateMedia(ids: string[], updates: Partial<MediaFile>): Promise<{ results: any[], errors?: any[] }> {
    const response = await apiRequest<{ results: any[], errors?: any[] }>('/media/bulk', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'update',
        ids,
        updates,
      }),
    });
    return response.data || { results: [], errors: [] };
  },

  async bulkDeleteMedia(ids: string[]): Promise<{ results: any[], errors?: any[] }> {
    const response = await apiRequest<{ results: any[], errors?: any[] }>('/media/bulk', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'delete',
        ids,
      }),
    });
    return response.data || { results: [], errors: [] };
  },

  async bulkGetMediaUsage(ids: string[]): Promise<{ [key: string]: ProjectReference[] }> {
    const response = await apiRequest<{ usageData: { [key: string]: ProjectReference[] } }>('/media/bulk', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'usage',
        ids,
      }),
    });
    return response.data?.usageData || {};
  },
};

// Export the appropriate API based on environment
export const api = config.enableMockApi ? mockApi : realApi;

// Export individual functions for easier use
export const {
  getProjects,
  getMedia,
  uploadFile,
  saveProject,
  updateMedia,
  deleteMedia,
  // UnifiedProject methods
  getUnifiedProjects,
  getUnifiedProject,
  createUnifiedProject,
  createUnifiedProjectFromTemplate,
  updateUnifiedProject,
  deleteUnifiedProject,
  duplicateUnifiedProject,
  reorderUnifiedProjects,
  bulkUpdateUnifiedProjects,
  getMediaUsage,
  // Bulk media operations
  bulkUpdateMedia,
  bulkDeleteMedia,
  bulkGetMediaUsage,
} = api;

// Utility functions
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

// Batch operations
export const batchUpload = async (files: File[]): Promise<MediaFile[]> => {
  const uploadPromises = files.map(file => uploadFile(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((file): file is MediaFile => file !== null);
};

export const batchDelete = async (ids: string[]): Promise<void> => {
  const deletePromises = ids.map(id => deleteMedia(id));
  await Promise.all(deletePromises);
};
