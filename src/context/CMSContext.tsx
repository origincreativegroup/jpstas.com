import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import {
  PageContent,
  CMSSettings,
  HeroSection,
  AboutSection,
  ContactSection,
  PortfolioSection,
} from '@/types/cms';
import { api, handleApiError } from '@/services/apiClient';
import { config } from '@/config/environment';
import { debug } from '@/utils/debug';

interface CMSContextType {
  // Content
  pageContent: PageContent | null;
  settings: CMSSettings | null;
  loading: boolean;
  error: string | null;

  // Content Management
  fetchPageContent: (page: string) => Promise<void>;
  updatePageContent: (page: string, content: Partial<PageContent>) => Promise<void>;
  publishPageContent: (page: string) => Promise<void>;

  // Settings Management
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<CMSSettings>) => Promise<void>;

  // Specific Section Updates
  updateHeroSection: (page: string, hero: HeroSection) => Promise<void>;
  updateAboutSection: (about: AboutSection) => Promise<void>;
  updateContactSection: (contact: ContactSection) => Promise<void>;
  updatePortfolioSection: (portfolio: PortfolioSection) => Promise<void>;

  // Media Management
  uploadHeroImage: (file: File) => Promise<string>;
  uploadHeadshot: (file: File) => Promise<string>;

  // Utilities
  getPageContent: (page: string) => PageContent | null;
  isPagePublished: (page: string) => boolean;
  refreshContent: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Default content templates
const defaultHeroSection: HeroSection = {
  id: 'hero-default',
  title: 'Creative Technologist, Designer, & Process Innovator',
  subtitle: 'Multidisciplinary • Creative Tech • SaaS',
  description:
    'I build bold, vector-clean experiences that bridge design, code, and operations. From in-house print studios to SaaS concepts, I ship systems that scale.',
  ctaPrimary: {
    text: 'View Work',
    link: '/portfolio',
  },
  ctaSecondary: {
    text: 'Resume',
    link: '/resume',
  },
};

const defaultAboutSection: AboutSection = {
  id: 'about-default',
  title: 'About Me',
  subtitle: 'Creative Technologist & Process Innovator',
  bio: "I'm a creative technologist with 8+ years of experience building digital experiences that bridge design and development. I specialize in creating systems that are both beautiful and functional, scalable and user-friendly.",
  skills: [
    'UI/UX Design',
    'Frontend Development',
    'Product Strategy',
    'Team Leadership',
    'Process Innovation',
  ],
  experience: [
    {
      company: 'Caribbean Pools',
      role: 'Creative Director',
      period: '2020 - Present',
      description: 'Leading design and development initiatives across digital and print media.',
      current: true,
    },
    {
      company: 'Freelance',
      role: 'Designer & Developer',
      period: '2018 - 2020',
      description: 'Working with startups and agencies on web and mobile projects.',
    },
  ],
  education: [
    {
      institution: 'Indiana University',
      degree: 'Bachelor of Science in Computer Science',
      period: '2014 - 2018',
      description: 'Focus on software engineering and human-computer interaction.',
    },
  ],
  achievements: [
    {
      title: 'Built In-House Print Studio',
      description: 'Reduced print costs by 40% and improved delivery times by 60%.',
      year: '2023',
    },
    {
      title: 'E-commerce Platform Launch',
      description: 'Generated over $100k in net revenue in the first year.',
      year: '2022',
    },
  ],
};

const defaultContactSection: ContactSection = {
  id: 'contact-default',
  title: 'Get In Touch',
  subtitle: "Let's build something together",
  description:
    "I'm open to creative tech roles and collaborations. Reach out to discuss your project or just say hello!",
  contactInfo: {
    email: 'johnpstas@gmail.com',
    phone: '219-319-9788',
    website: 'https://jpstas.com',
    linkedin: 'https://www.linkedin.com/in/johnpstas',
    location: 'Chicago, IL',
  },
  formSettings: {
    enabled: true,
    fields: [
      { name: 'name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'email', type: 'email', required: true, placeholder: 'your.email@example.com' },
      {
        name: 'message',
        type: 'textarea',
        required: true,
        placeholder: 'Tell me about your project or idea...',
      },
    ],
  },
};

const defaultSettings: CMSSettings = {
  siteName: 'John P. Stas',
  siteDescription: 'Creative Technologist, Designer, & Process Innovator',
  theme: {
    primaryColor: '#6366f1', // brand
    secondaryColor: '#f1f5f9', // brand-light
    accentColor: '#fbbf24', // accent
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/johnpstas',
    github: 'https://github.com/johnpstas',
  },
};

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [settings, setSettings] = useState<CMSSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch page content
  const fetchPageContent = useCallback(async (page: string) => {
    setLoading(true);
    setError(null);
    debug.cms.fetch('Fetching page content', { page });

    try {
      if (config.enableMockApi) {
        // Mock data for development
        const mockContent: PageContent = {
          id: `${page}-content`,
          page: page as any,
          hero: page === 'home' ? defaultHeroSection : undefined,
          about: page === 'about' ? defaultAboutSection : undefined,
          contact: page === 'contact' ? defaultContactSection : undefined,
          seo: {
            title: `${page.charAt(0).toUpperCase() + page.slice(1)} - John P. Stas`,
            description: `John P. Stas - ${page} page`,
            keywords: ['creative technologist', 'designer', 'developer'],
          },
          lastUpdated: new Date().toISOString(),
          published: true,
        };
        setPageContent(mockContent);
        debug.cms.fetch('Page content fetched (mock)', { page, content: mockContent });
      } else {
        const response = await api.getPageContent(page);
        setPageContent(response);
        debug.cms.fetch('Page content fetched', { page, content: response });
      }
    } catch (err) {
      debug.cms.error('Failed to fetch page content', err as Error, { page });
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update page content
  const updatePageContent = useCallback(async (page: string, content: Partial<PageContent>) => {
    setLoading(true);
    setError(null);
    debug.cms.update('Updating page content', { page, content });

    try {
      if (config.enableMockApi) {
        // Mock update for development
        setPageContent(prev =>
          prev ? { ...prev, ...content, lastUpdated: new Date().toISOString() } : null
        );
        debug.cms.update('Page content updated (mock)', { page, content });
      } else {
        const response = await api.updatePageContent(page, content);
        setPageContent(response);
        debug.cms.update('Page content updated', { page, content: response });
      }
    } catch (err) {
      debug.cms.error('Failed to update page content', err as Error, { page, content });
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Publish page content
  const publishPageContent = useCallback(async (page: string) => {
    setLoading(true);
    setError(null);
    debug.cms.publish('Publishing page content', { page });

    try {
      if (config.enableMockApi) {
        // Mock publish for development
        setPageContent(prev =>
          prev ? { ...prev, published: true, lastUpdated: new Date().toISOString() } : null
        );
        debug.cms.publish('Page content published (mock)', { page });
      } else {
        const response = await api.publishPageContent(page);
        setPageContent(response);
        debug.cms.publish('Page content published', { page, content: response });
      }
    } catch (err) {
      debug.cms.error('Failed to publish page content', err as Error, { page });
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    debug.cms.fetch('Fetching CMS settings');

    try {
      if (config.enableMockApi) {
        // Mock settings for development
        setSettings(defaultSettings);
        debug.cms.fetch('Settings fetched (mock)', { settings: defaultSettings });
      } else {
        const response = await api.getCMSSettings();
        setSettings(response);
        debug.cms.fetch('Settings fetched', { settings: response });
      }
    } catch (err) {
      debug.cms.error('Failed to fetch settings', err as Error);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<CMSSettings>) => {
    setLoading(true);
    setError(null);
    debug.cms.update('Updating CMS settings', { settings: newSettings });

    try {
      if (config.enableMockApi) {
        // Mock update for development
        setSettings(prev => (prev ? { ...prev, ...newSettings } : null));
        debug.cms.update('Settings updated (mock)', { settings: newSettings });
      } else {
        const response = await api.updateCMSSettings(newSettings);
        setSettings(response);
        debug.cms.update('Settings updated', { settings: response });
      }
    } catch (err) {
      debug.cms.error('Failed to update settings', err as Error, { settings: newSettings });
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Specific section updates
  const updateHeroSection = useCallback(
    async (page: string, hero: HeroSection) => {
      await updatePageContent(page, { hero });
    },
    [updatePageContent]
  );

  const updateAboutSection = useCallback(
    async (about: AboutSection) => {
      await updatePageContent('about', { about });
    },
    [updatePageContent]
  );

  const updateContactSection = useCallback(
    async (contact: ContactSection) => {
      await updatePageContent('contact', { contact });
    },
    [updatePageContent]
  );

  const updatePortfolioSection = useCallback(
    async (portfolio: PortfolioSection) => {
      await updatePageContent('portfolio', { portfolio });
    },
    [updatePageContent]
  );

  // Media uploads
  const uploadHeroImage = useCallback(async (file: File): Promise<string> => {
    debug.cms.upload('Uploading hero image', { fileName: file.name, fileSize: file.size });
    const uploadedFile = await api.uploadFile(file);
    return uploadedFile.url;
  }, []);

  const uploadHeadshot = useCallback(async (file: File): Promise<string> => {
    debug.cms.upload('Uploading headshot', { fileName: file.name, fileSize: file.size });
    const uploadedFile = await api.uploadFile(file);
    return uploadedFile.url;
  }, []);

  // Utilities
  const getPageContent = useCallback(
    (page: string) => {
      return pageContent?.page === page ? pageContent : null;
    },
    [pageContent]
  );

  const isPagePublished = useCallback(
    (page: string) => {
      const content = getPageContent(page);
      return content?.published || false;
    },
    [getPageContent]
  );

  const refreshContent = useCallback(async () => {
    if (pageContent) {
      await fetchPageContent(pageContent.page);
    }
  }, [pageContent, fetchPageContent]);

  // Initialize settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <CMSContext.Provider
      value={{
        pageContent,
        settings,
        loading,
        error,
        fetchPageContent,
        updatePageContent,
        publishPageContent,
        fetchSettings,
        updateSettings,
        updateHeroSection,
        updateAboutSection,
        updateContactSection,
        updatePortfolioSection,
        uploadHeroImage,
        uploadHeadshot,
        getPageContent,
        isPagePublished,
        refreshContent,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
