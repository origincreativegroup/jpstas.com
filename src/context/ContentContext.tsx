import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, ContentSection } from '../services/api';

interface ContentContextType {
  sections: Record<string, ContentSection>;
  isLoading: boolean;
  error: string | null;
  getSections: () => Promise<void>;
  getSection: (key: string) => Promise<ContentSection | null>;
  updateSection: (
    key: string,
    section: Partial<ContentSection>
  ) => Promise<{ success: boolean; error?: string }>;
  publishSection: (key: string) => Promise<{ success: boolean; error?: string }>;
  unpublishSection: (key: string) => Promise<{ success: boolean; error?: string }>;
  refreshSections: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [sections, setSections] = useState<Record<string, ContentSection>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSections = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.getContentSections();

      if (response.data) {
        setSections(response.data.sections);
      } else {
        setError(response.error || 'Failed to fetch content sections');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const getSection = async (key: string): Promise<ContentSection | null> => {
    try {
      const response = await apiClient.getContentSection(key);

      if (response.data) {
        return response.data.section;
      } else {
        setError(response.error || 'Failed to fetch content section');
        return null;
      }
    } catch (error) {
      setError('Network error');
      return null;
    }
  };

  const updateSection = async (
    key: string,
    section: Partial<ContentSection>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.updateContentSection(key, section);

      if (response.data) {
        // Update the section in the state
        setSections(prev => ({
          ...prev,
          [key]: response.data!.section,
        }));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update content section' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const publishSection = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.publishContentSection(key);

      if (response.data) {
        // Update the section in the state
        setSections(prev => ({
          ...prev,
          [key]: response.data!.section,
        }));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to publish content section' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const unpublishSection = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${apiClient.getBaseURL()}/content/${key}/unpublish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(apiClient.getToken() && { Authorization: `Bearer ${apiClient.getToken()}` }),
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the section in the state
        setSections(prev => ({
          ...prev,
          [key]: data.section,
        }));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to unpublish content section' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const refreshSections = async (): Promise<void> => {
    await getSections();
  };

  // Load sections on mount
  useEffect(() => {
    getSections();
  }, []);

  const value: ContentContextType = {
    sections,
    isLoading,
    error,
    getSections,
    getSection,
    updateSection,
    publishSection,
    unpublishSection,
    refreshSections,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
