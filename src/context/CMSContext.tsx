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
  ResumeSection,
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
  subtitle: 'Multidisciplinary • Creative Tech • Product Designer',
  description:
    'I\'m a multidisciplinary Creative Technologist and Designer who bridges art, technology, and systems thinking. Over the past decade at Caribbean Pools, I transformed creative operations from the ground up—building an in-house print studio, launching an e-commerce platform, digitizing workflows, and leading the evolution of the company\'s brand across every touchpoint. My background is equal parts design and engineering mindset. I love designing beautiful things—but I\'m just as drawn to how processes work behind the scenes. That curiosity led me from Illustrator and Photoshop into code, automation, and AI tools, where I now build systems that make creative work smarter, faster, and more scalable. Today, I\'m focused on projects that sit at the intersection of design, product development, and innovation—where storytelling meets system-building. Whether it\'s branding a company, prototyping an app, or automating a creative workflow, my goal is the same: to bridge the gap between ideas and execution.',
  ctaPrimary: {
    text: 'View Work',
    link: '/portfolio',
  },
  ctaSecondary: {
    text: 'Download Resume',
    link: '/resume',
  },
};

const defaultAboutSection: AboutSection = {
  id: 'about-default',
  title: 'About Me',
  subtitle: 'Creative Technologist & Process Innovator',
  bio: "I'm a creative technologist with 8+ years of experience building digital experiences that bridge design, development, and business operations. I specialize in transforming complex challenges into scalable, efficient solutions—whether that's a $2M+ e-commerce platform, an automated print studio, or an AI-powered SaaS product. My multidisciplinary approach combines visual design, full-stack development, and process innovation to deliver measurable business impact. I believe great technology should feel invisible, amplifying human capabilities without getting in the way.",
  skills: [
    'Full-Stack Development (React, TypeScript, Node.js)',
    'UI/UX Design & Design Systems',
    'Product Strategy & Management',
    'Process Innovation & Automation',
    'Team Leadership & Training',
    'E-commerce & Digital Platforms',
    'DevOps & Cloud Infrastructure',
    'Print Production & Workflow Design',
  ],
  experience: [
    {
      company: 'Caribbean Pools & Spas',
      role: 'Business Development & Creative Lead',
      period: '2014 - 2025',
      description: 'Led digital transformation initiatives, built in-house print studio (40% cost reduction), launched $2M+ e-commerce platform, managed CRM migration, and drove 300% social media growth. Trained 15+ staff and created scalable systems across web, print, and operations.',
      current: false,
    },
    {
      company: 'Origin Creative Group',
      role: 'Proprietor / Designer',
      period: '2013 - 2014',
      description: 'Founded creative consultancy specializing in brand identity and digital design. Worked with startups and established businesses on web, print, and multimedia projects.',
    },
    {
      company: 'Halo Ventures',
      role: 'Director of Operations',
      period: '2012 - 2013',
      description: 'Managed operations and led process improvements for technology ventures. Developed systems and workflows for early-stage companies.',
    },
  ],
  education: [
    {
      institution: 'Indiana University',
      degree: 'BA, Visual Communications',
      period: '2008 - 2012',
      description: 'Herron School of Art & Design. Focused on visual communications, design thinking, and digital media.',
    },
  ],
  achievements: [
    {
      title: 'E-commerce Platform: $2M+ Revenue',
      description: 'Built full-stack e-commerce platform generating $2M+ in first year with 40% conversion increase and 60% faster page loads.',
      year: '2023',
    },
    {
      title: 'Print Studio: 40% Cost Reduction',
      description: 'Established in-house print studio reducing costs by $48k/year and improving delivery times by 60%.',
      year: '2023',
    },
    {
      title: 'Digital Transformation: 95% Paperless',
      description: 'Led digital transformation converting 20+ paper processes to automated workflows, achieving 15-30% email CTR.',
      year: '2022',
    },
    {
      title: 'Social Media Growth: 2K to 15K',
      description: 'Grew social media following by 650% with automated content pipeline and 300% engagement increase.',
      year: '2022',
    },
  ],
};

const defaultContactSection: ContactSection = {
  id: 'contact-default',
  title: 'Let\'s Build Something Great',
  subtitle: "Open to Full-Time Roles & Strategic Collaborations",
  description:
    "I'm seeking opportunities where I can drive innovation at the intersection of design, technology, and business. Whether you're looking for a creative technologist to lead digital transformation, build scalable products, or bridge design and engineering teams—let's talk. I'm particularly interested in roles that combine strategic thinking with hands-on execution.",
  contactInfo: {
    email: 'johnpstas@gmail.com',
    phone: '219-319-9788',
    website: 'https://jpstas.com',
    linkedin: 'https://www.linkedin.com/in/johnpstas',
    location: 'Chicago, IL (Open to Remote)',
  },
  formSettings: {
    enabled: true,
    fields: [
      { name: 'name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'email', type: 'email', required: true, placeholder: 'your.email@example.com' },
      { name: 'company', type: 'text', required: false, placeholder: 'Company (optional)' },
      {
        name: 'message',
        type: 'textarea',
        required: true,
        placeholder: 'Tell me about the role or project...',
      },
    ],
  },
};

const defaultResumeSection: ResumeSection = {
  id: 'resume-default',
  summary:
    'Multidisciplinary creative technologist with 8+ years transforming complex challenges into scalable solutions. Proven track record of driving measurable business impact through the intersection of design, development, and process innovation. Built $2M+ e-commerce platform, established cost-saving print studio, and led digital transformation initiatives. Expert in full-stack development, design systems, and operations optimization.',
  experience: [
    { 
      company: 'Caribbean Pools & Spas', 
      role: 'Business Development & Creative Lead', 
      period: '2014 - 2025', 
      description: 'Led comprehensive digital transformation: Built $2M+ e-commerce platform (40% conversion increase), established in-house print studio ($48k annual savings), migrated CRM systems, converted 20+ paper processes to digital, grew social media 650% (2K to 15K followers). Managed cross-functional initiatives, trained 15+ staff, created scalable systems across web, print, and operations.' 
    },
    { 
      company: 'Origin Creative Group', 
      role: 'Proprietor / Designer', 
      period: '2013 - 2014', 
      description: 'Founded creative consultancy delivering brand identity, web design, and digital solutions for startups and established businesses. Specialized in bridging client vision with technical execution.' 
    },
    { 
      company: 'Halo Ventures', 
      role: 'Director of Operations', 
      period: '2012 - 2013', 
      description: 'Managed operations and process improvements for technology ventures. Developed operational systems and workflows for early-stage companies.' 
    },
  ],
  education: [
    { 
      institution: 'Indiana University', 
      degree: 'BA, Visual Communications', 
      period: '2008 - 2012',
      description: 'Herron School of Art & Design'
    },
  ],
  skills: [
    'React', 
    'TypeScript', 
    'Node.js', 
    'PostgreSQL', 
    'Tailwind CSS',
    'Design Systems', 
    'UI/UX Design',
    'AWS / Cloudflare',
    'Adobe Creative Suite',
    'Process Innovation',
    'Team Leadership',
    'E-commerce',
  ],
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
          resume: page === 'resume' ? defaultResumeSection : undefined,
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
    if (!uploadedFile) {
      throw new Error('Failed to upload hero image');
    }
    return uploadedFile.url;
  }, []);

  const uploadHeadshot = useCallback(async (file: File): Promise<string> => {
    debug.cms.upload('Uploading headshot', { fileName: file.name, fileSize: file.size });
    const uploadedFile = await api.uploadFile(file);
    if (!uploadedFile) {
      throw new Error('Failed to upload headshot');
    }
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
