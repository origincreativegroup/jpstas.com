import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, ProjectDraft, ProjectVersion } from '@/types/project';
import { debug } from '@/utils/debug';

interface DraftContextType {
  drafts: ProjectDraft[];
  loading: boolean;
  error: string | null;
  createDraft: (project: Partial<Project>) => Promise<ProjectDraft>;
  updateDraft: (id: string, updates: Partial<ProjectDraft>) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  publishDraft: (id: string) => Promise<Project>;
  duplicateDraft: (id: string) => Promise<ProjectDraft>;
  getDraftById: (id: string) => ProjectDraft | undefined;
  refreshDrafts: () => Promise<void>;
  getDraftHistory: (projectId: string) => ProjectVersion[];
  restoreVersion: (projectId: string, versionId: string) => Promise<void>;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function useDrafts() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDrafts must be used within a DraftProvider');
  }
  return context;
}

interface DraftProviderProps {
  children: ReactNode;
}

export function DraftProvider({ children }: DraftProviderProps) {
  const [drafts, setDrafts] = useState<ProjectDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDraft = useCallback(async (project: Partial<Project>): Promise<ProjectDraft> => {
    debug.draft.create('Creating new draft', { project: project.title });
    debug.perf.start('createDraft');

    try {
      const draft: ProjectDraft = {
        id: `draft_${Date.now()}`,
        title: project.title || 'Untitled Project',
        role: project.role || '',
        summary: project.summary || '',
        tags: project.tags || [],
        type: project.type || 'case-study',
        featured: project.featured || false,
        images: project.images || [],
        content: project.content || {
          challenge: '',
          solution: '',
          results: '',
          process: [],
          technologies: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        templateId: project.templateId,
        versions: [{
          id: `version_${Date.now()}`,
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          createdBy: 'current_user',
          changes: ['Initial draft created'],
          status: 'draft'
        }]
      };

      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Mock create draft (dev mode)', { draftId: draft.id });
        setDrafts(prev => [...prev, draft]);
      } else {
        // Real API call
        const response = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });

        if (!response.ok) {
          throw new Error('Failed to create draft');
        }

        const createdDraft = await response.json();
        setDrafts(prev => [...prev, createdDraft]);
      }

      debug.draft.complete('Draft created successfully', { draftId: draft.id });
      debug.perf.end('createDraft');
      return draft;
    } catch (err) {
      debug.draft.error('Failed to create draft', err as Error, { project: project.title });
      debug.perf.end('createDraft');
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const updateDraft = useCallback(async (id: string, updates: Partial<ProjectDraft>): Promise<void> => {
    debug.content.update('Updating draft', { id, updates });
    debug.perf.start(`updateDraft:${id}`);

    try {
      const updatedDraft = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Mock update draft (dev mode)', { id, updates });
        setDrafts(prev => prev.map(draft => 
          draft.id === id ? { ...draft, ...updatedDraft } : draft
        ));
      } else {
        // Real API call
        const response = await fetch(`/api/drafts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDraft),
        });

        if (!response.ok) {
          throw new Error('Failed to update draft');
        }

        setDrafts(prev => prev.map(draft => 
          draft.id === id ? { ...draft, ...updatedDraft } : draft
        ));
      }

      debug.draft.complete('Draft updated successfully', { id });
      debug.perf.end(`updateDraft:${id}`);
    } catch (err) {
      debug.draft.error('Failed to update draft', err as Error, { id });
      debug.perf.end(`updateDraft:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const deleteDraft = useCallback(async (id: string): Promise<void> => {
    debug.draft.delete('Deleting draft', { id });
    debug.perf.start(`deleteDraft:${id}`);

    try {
      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Mock delete draft (dev mode)', { id });
        setDrafts(prev => prev.filter(draft => draft.id !== id));
      } else {
        // Real API call
        const response = await fetch(`/api/drafts/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete draft');
        }

        setDrafts(prev => prev.filter(draft => draft.id !== id));
      }

      debug.draft.complete('Draft deleted successfully', { id });
      debug.perf.end(`deleteDraft:${id}`);
    } catch (err) {
      debug.draft.error('Failed to delete draft', err as Error, { id });
      debug.perf.end(`deleteDraft:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const publishDraft = useCallback(async (id: string): Promise<Project> => {
    debug.content.publish('Publishing draft', { id });
    debug.perf.start(`publishDraft:${id}`);

    try {
      const draft = drafts.find(d => d.id === id);
      if (!draft) {
        throw new Error('Draft not found');
      }

      const publishedProject: Project = {
        ...draft,
        status: 'published',
        publishedAt: new Date().toISOString(),
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
        }
      };

      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Mock publish draft (dev mode)', { id });
        // In a real app, this would call the projects API
        setDrafts(prev => prev.filter(d => d.id !== id));
      } else {
        // Real API call
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(publishedProject),
        });

        if (!response.ok) {
          throw new Error('Failed to publish draft');
        }

        setDrafts(prev => prev.filter(d => d.id !== id));
      }

      debug.draft.complete('Draft published successfully', { id });
      debug.perf.end(`publishDraft:${id}`);
      return publishedProject;
    } catch (err) {
      debug.draft.error('Failed to publish draft', err as Error, { id });
      debug.perf.end(`publishDraft:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, [drafts]);

  const duplicateDraft = useCallback(async (id: string): Promise<ProjectDraft> => {
    debug.draft.create('Duplicating draft', { id });
    debug.perf.start(`duplicateDraft:${id}`);

    try {
      const originalDraft = drafts.find(d => d.id === id);
      if (!originalDraft) {
        throw new Error('Draft not found');
      }

      const duplicatedDraft: ProjectDraft = {
        ...originalDraft,
        id: `draft_${Date.now()}`,
        title: `${originalDraft.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        versions: [{
          id: `version_${Date.now()}`,
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          createdBy: 'current_user',
          changes: ['Duplicated from existing draft'],
          status: 'draft'
        }]
      };

      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Mock duplicate draft (dev mode)', { id, newId: duplicatedDraft.id });
        setDrafts(prev => [...prev, duplicatedDraft]);
      } else {
        // Real API call
        const response = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(duplicatedDraft),
        });

        if (!response.ok) {
          throw new Error('Failed to duplicate draft');
        }

        const createdDraft = await response.json();
        setDrafts(prev => [...prev, createdDraft]);
      }

      debug.draft.complete('Draft duplicated successfully', { id, newId: duplicatedDraft.id });
      debug.perf.end(`duplicateDraft:${id}`);
      return duplicatedDraft;
    } catch (err) {
      debug.draft.error('Failed to duplicate draft', err as Error, { id });
      debug.perf.end(`duplicateDraft:${id}`);
      setError((err as Error).message);
      throw err;
    }
  }, [drafts]);

  const getDraftById = useCallback((id: string): ProjectDraft | undefined => {
    return drafts.find(draft => draft.id === id);
  }, [drafts]);

  const refreshDrafts = useCallback(async (): Promise<void> => {
    debug.content.fetch('Refreshing drafts');
    debug.perf.start('refreshDrafts');
    setLoading(true);
    setError(null);

    try {
      if (import.meta.env.DEV) {
        // Mock API in development
        debug.info('Using mock drafts data (dev mode)');
        const mockDrafts: ProjectDraft[] = [
          {
            id: 'draft_1',
            title: 'E-commerce Redesign',
            role: 'Lead Designer',
            summary: 'Complete redesign of the shopping experience',
            tags: ['Design', 'E-commerce', 'UX'],
            type: 'case-study',
            featured: true,
            images: [],
            content: {
              challenge: 'Outdated design was hurting conversion rates',
              solution: 'Modern, mobile-first redesign with improved UX',
              results: 'Increased conversion by 40%',
              process: ['Research', 'Design', 'Testing', 'Launch'],
              technologies: ['Figma', 'React', 'CSS'],
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            templateId: 'case-study-template',
            versions: [{
              id: 'version_1',
              version: '1.2.0',
              createdAt: new Date().toISOString(),
              createdBy: 'current_user',
              changes: ['Updated results section', 'Added new screenshots'],
              status: 'draft'
            }]
          }
        ];
        setDrafts(mockDrafts);
      } else {
        // Real API call
        const response = await fetch('/api/drafts');
        if (!response.ok) {
          throw new Error('Failed to fetch drafts');
        }
        const data = await response.json();
        setDrafts(data.drafts || []);
      }

      debug.draft.complete('Drafts refreshed successfully', { count: drafts.length });
      debug.perf.end('refreshDrafts');
    } catch (err) {
      debug.draft.error('Failed to refresh drafts', err as Error);
      debug.perf.end('refreshDrafts');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [drafts.length]);

  const getDraftHistory = useCallback((projectId: string): ProjectVersion[] => {
    const draft = drafts.find(d => d.id === projectId);
    return draft?.versions || [];
  }, [drafts]);

  const restoreVersion = useCallback(async (projectId: string, versionId: string): Promise<void> => {
    debug.content.update('Restoring version', { projectId, versionId });
    debug.perf.start(`restoreVersion:${projectId}:${versionId}`);

    try {
      // This would typically fetch the version data and restore it
      // For now, just log the action
      debug.info('Mock restore version (dev mode)', { projectId, versionId });
      
      debug.draft.complete('Version restored successfully', { projectId, versionId });
      debug.perf.end(`restoreVersion:${projectId}:${versionId}`);
    } catch (err) {
      debug.draft.error('Failed to restore version', err as Error, { projectId, versionId });
      debug.perf.end(`restoreVersion:${projectId}:${versionId}`);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const value: DraftContextType = {
    drafts,
    loading,
    error,
    createDraft,
    updateDraft,
    deleteDraft,
    publishDraft,
    duplicateDraft,
    getDraftById,
    refreshDrafts,
    getDraftHistory,
    restoreVersion,
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
}
