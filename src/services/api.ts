/**
 * API Service Layer for Portfolio Backend
 * Handles all API communication with the Fly.io backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  role?: string;
  summary?: string;
  description?: string;
  content?: any;
  tags?: string[];
  type: 'case-study' | 'project' | 'experiment';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  order_index: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  images?: MediaFile[];
}

export interface MediaFile {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  type: 'image' | 'video' | 'document' | 'audio';
  order_index?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ContentSection {
  id: string;
  section_key: string;
  title?: string;
  content: any;
  is_published: boolean;
  version: number;
  updated_at: string;
  author_name?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  proficiency: number;
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth methods
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  async logout() {
    this.setToken(null);
  }

  // Projects
  async getProjects(params?: {
    status?: string;
    featured?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<ApiResponse<{ projects: Project[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';

    return this.request<{ projects: Project[]; pagination: PaginationInfo }>(endpoint);
  }

  async getProject(slug: string): Promise<ApiResponse<{ project: Project }>> {
    return this.request<{ project: Project }>(`/projects/${slug}`);
  }

  async createProject(project: Partial<Project>): Promise<ApiResponse<{ project: Project }>> {
    return this.request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<ApiResponse<{ project: Project }>> {
    return this.request<{ project: Project }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Media
  async getMedia(params?: {
    project_id?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ media: any[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/media?${queryString}` : '/media';

    return this.request<{ media: any[]; pagination: PaginationInfo }>(endpoint);
  }

  async uploadMedia(
    file: File,
    metadata?: {
      project_id?: string;
      alt_text?: string;
      caption?: string;
    }
  ): Promise<ApiResponse<{ media: any }>> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    const url = `${this.baseURL}/media/upload`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Content
  async getContentSections(): Promise<ApiResponse<{ sections: Record<string, ContentSection> }>> {
    return this.request<{ sections: Record<string, ContentSection> }>('/content');
  }

  async getContentSection(key: string): Promise<ApiResponse<{ section: ContentSection }>> {
    return this.request<{ section: ContentSection }>(`/content/${key}`);
  }

  async updateContentSection(
    key: string,
    section: Partial<ContentSection>
  ): Promise<ApiResponse<{ section: ContentSection }>> {
    return this.request<{ section: ContentSection }>(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(section),
    });
  }

  async publishContentSection(key: string): Promise<ApiResponse<{ section: ContentSection }>> {
    return this.request<{ section: ContentSection }>(`/content/${key}/publish`, {
      method: 'PATCH',
    });
  }

  // Skills
  async getSkills(params?: {
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<{ skills: Skill[] }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/skills?${queryString}` : '/skills';

    return this.request<{ skills: Skill[] }>(endpoint);
  }

  async updateSkills(skills: Partial<Skill>[]): Promise<ApiResponse<{ skills: Skill[] }>> {
    return this.request<{ skills: Skill[] }>('/skills/bulk', {
      method: 'PUT',
      body: JSON.stringify({ skills }),
    });
  }

  // Analytics
  async trackEvent(event: {
    event_type: string;
    event_data?: any;
    page_url?: string;
    project_id?: string;
  }): Promise<ApiResponse<{ event_id: string }>> {
    return this.request<{ event_id: string }>('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getAnalytics(params?: {
    start_date?: string;
    end_date?: string;
    project_id?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/analytics/dashboard?${queryString}` : '/analytics/dashboard';

    return this.request<any>(endpoint);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
