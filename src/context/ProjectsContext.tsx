import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, Project } from '../services/api';

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  featuredProjects: Project[];
  getProjects: (params?: any) => Promise<void>;
  getProject: (slug: string) => Promise<Project | null>;
  createProject: (project: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const featuredProjects = projects.filter(project => project.featured);

  const getProjects = async (params?: any): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getProjects(params);
      
      if (response.data) {
        setProjects(response.data.projects);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }
    } catch (error) {
      setError('Network error');
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProject = async (slug: string): Promise<Project | null> => {
    try {
      const response = await apiClient.getProject(slug);
      
      if (response.data) {
        return response.data.project;
      } else {
        setError(response.error || 'Failed to fetch project');
        return null;
      }
    } catch (error) {
      setError('Network error');
      console.error('Failed to fetch project:', error);
      return null;
    }
  };

  const createProject = async (project: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.createProject(project);
      
      if (response.data) {
        // Add the new project to the list
        setProjects(prev => [response.data!.project, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to create project' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.updateProject(id, updates);
      
      if (response.data) {
        // Update the project in the list
        setProjects(prev => 
          prev.map(project => 
            project.id === id ? response.data!.project : project
          )
        );
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update project' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.deleteProject(id);
      
      if (response.data) {
        // Remove the project from the list
        setProjects(prev => prev.filter(project => project.id !== id));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to delete project' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const refreshProjects = async (): Promise<void> => {
    await getProjects();
  };

  // Load projects on mount
  useEffect(() => {
    getProjects();
  }, []);

  const value: ProjectsContextType = {
    projects,
    isLoading,
    error,
    featuredProjects,
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
