import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  GlobalSettings,
  ContentWrapper,
} from '@/types/content';

interface ContentContextType {
  // Content State
  homeContent: ContentWrapper<HomePageContent> | null;
  aboutContent: ContentWrapper<AboutPageContent> | null;
  contactContent: ContentWrapper<ContactPageContent> | null;
  settings: ContentWrapper<GlobalSettings> | null;

  // Loading & Error States
  loading: { [key: string]: boolean };
  error: string | null;

  // CRUD Operations
  fetchHomeContent: () => Promise<void>;
  fetchAboutContent: () => Promise<void>;
  fetchContactContent: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  updateHomeContent: (content: Partial<HomePageContent>) => Promise<void>;
  updateAboutContent: (content: Partial<AboutPageContent>) => Promise<void>;
  updateContactContent: (content: Partial<ContactPageContent>) => Promise<void>;
  updateSettings: (settings: Partial<GlobalSettings>) => Promise<void>;

  publishContent: (type: 'home' | 'about' | 'contact') => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [homeContent, setHomeContent] = useState<ContentWrapper<HomePageContent> | null>(null);
  const [aboutContent, setAboutContent] = useState<ContentWrapper<AboutPageContent> | null>(null);
  const [contactContent, setContactContent] = useState<ContentWrapper<ContactPageContent> | null>(
    null
  );
  const [settings, setSettings] = useState<ContentWrapper<GlobalSettings> | null>(null);

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const fetchHomeContent = useCallback(async () => {
    setLoading(prev => ({ ...prev, home: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/home');
      if (!response.ok) throw new Error('Failed to fetch home content');

      const data = await response.json();
      setHomeContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, home: false }));
    }
  }, []);

  const fetchAboutContent = useCallback(async () => {
    setLoading(prev => ({ ...prev, about: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/about');
      if (!response.ok) throw new Error('Failed to fetch about content');

      const data = await response.json();
      setAboutContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, about: false }));
    }
  }, []);

  const fetchContactContent = useCallback(async () => {
    setLoading(prev => ({ ...prev, contact: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/contact');
      if (!response.ok) throw new Error('Failed to fetch contact content');

      const data = await response.json();
      setContactContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, contact: false }));
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoading(prev => ({ ...prev, settings: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setSettings(data.data || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  }, []);

  const updateHomeContent = useCallback(async (content: Partial<HomePageContent>) => {
    setLoading(prev => ({ ...prev, home: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/home', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to update home content');

      const data = await response.json();
      setHomeContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, home: false }));
    }
  }, []);

  const updateAboutContent = useCallback(async (content: Partial<AboutPageContent>) => {
    setLoading(prev => ({ ...prev, about: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to update about content');

      const data = await response.json();
      setAboutContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, about: false }));
    }
  }, []);

  const updateContactContent = useCallback(async (content: Partial<ContactPageContent>) => {
    setLoading(prev => ({ ...prev, contact: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to update contact content');

      const data = await response.json();
      setContactContent(data.data || data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, contact: false }));
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<GlobalSettings>) => {
    setLoading(prev => ({ ...prev, settings: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      const data = await response.json();
      setSettings(data.data || data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  }, []);

  const publishContent = useCallback(async (type: 'home' | 'about' | 'contact') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const response = await fetch('/api/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error(`Failed to publish ${type} content`);

      // Refresh the content after publishing
      switch (type) {
        case 'home':
          await fetchHomeContent();
          break;
        case 'about':
          await fetchAboutContent();
          break;
        case 'contact':
          await fetchContactContent();
          break;
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [fetchHomeContent, fetchAboutContent, fetchContactContent]);

  return (
    <ContentContext.Provider
      value={{
        homeContent,
        aboutContent,
        contactContent,
        settings,
        loading,
        error,
        fetchHomeContent,
        fetchAboutContent,
        fetchContactContent,
        fetchSettings,
        updateHomeContent,
        updateAboutContent,
        updateContactContent,
        updateSettings,
        publishContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
