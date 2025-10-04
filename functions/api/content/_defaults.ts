/**
 * Default Content for CMS
 *
 * These objects provide initial content for the portfolio site when KV storage is empty
 * or when running in development mode without KV access.
 */

import type {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  GlobalSettings,
  ContentWrapper,
} from '../../../src/types/content';

const now = new Date().toISOString();

/**
 * Default Home Page Content
 */
export const defaultHomeContent: ContentWrapper<HomePageContent> = {
  id: 'home',
  type: 'home',
  status: 'published',
  content: {
    hero: {
      badge: 'Multidisciplinary • Creative Tech',
      heading: 'Creative Technologist',
      subheading: 'Bridging Design & Development',
      description:
        'I build bold digital experiences that connect creativity with technology. From e-commerce platforms to print workflows, I create solutions that work.',
      cta: {
        primary: { label: 'View Work', link: '/portfolio' },
        secondary: { label: 'Resume', link: '/resume' },
      },
      media: {
        type: 'image',
        url: '/images/hero-placeholder.svg',
        alt: 'Creative workspace showcasing design and technology',
      },
      overlay: {
        enabled: true,
        opacity: 0.3,
        color: '#000000',
      },
      layout: 'overlay',
      parallax: true,
    },
    featuredProjectIds: [],
  },
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};

/**
 * Default About Page Content
 */
export const defaultAboutContent: ContentWrapper<AboutPageContent> = {
  id: 'about',
  type: 'about',
  status: 'published',
  content: {
    hero: {
      title: 'About Me',
      subtitle: 'Creative technologist with a passion for building digital experiences',
    },
    sections: [
      {
        id: 'intro',
        type: 'text',
        title: 'Who I Am',
        content:
          '<p>I'm a creative technologist who bridges the gap between design and development. With 8+ years of experience, I've built everything from e-commerce platforms to in-house print studios.</p><p>My approach combines strategic thinking with hands-on execution, whether that's coding a React application or training a team on new workflows.</p>',
        order: 1,
      },
      {
        id: 'skills',
        type: 'grid',
        title: 'Skills & Expertise',
        items: [
          {
            id: 'design',
            title: 'UI/UX Design',
            description: 'Creating intuitive interfaces and user experiences',
            icon: 'palette',
          },
          {
            id: 'development',
            title: 'Frontend Development',
            description: 'Building responsive web applications with React and TypeScript',
            icon: 'code',
          },
          {
            id: 'product',
            title: 'Product Strategy',
            description: 'Translating business needs into technical solutions',
            icon: 'lightbulb',
          },
          {
            id: 'leadership',
            title: 'Team Leadership',
            description: 'Mentoring teams and establishing efficient workflows',
            icon: 'users',
          },
        ],
        order: 2,
      },
      {
        id: 'experience',
        type: 'timeline',
        title: 'Experience',
        items: [
          {
            id: 'current',
            title: 'Creative Director • Caribbean Pools',
            description: '2020 - Present • Leading design and development initiatives',
          },
          {
            id: 'freelance',
            title: 'Designer & Developer • Freelance',
            description: '2018 - 2020 • Working with startups and agencies',
          },
        ],
        order: 3,
      },
    ],
  },
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};

/**
 * Default Contact Page Content
 */
export const defaultContactContent: ContentWrapper<ContactPageContent> = {
  id: 'contact',
  type: 'contact',
  status: 'published',
  content: {
    hero: {
      title: 'Get In Touch',
      subtitle: 'Let's build something great together',
    },
    contactInfo: [
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        value: 'johnpstas@gmail.com',
        link: 'mailto:johnpstas@gmail.com',
        icon: 'mail',
        order: 1,
      },
      {
        id: 'linkedin',
        type: 'social',
        label: 'LinkedIn',
        value: 'linkedin.com/in/johnpstas',
        link: 'https://www.linkedin.com/in/johnpstas',
        icon: 'linkedin',
        order: 2,
      },
      {
        id: 'github',
        type: 'social',
        label: 'GitHub',
        value: 'github.com/johnpstas',
        link: 'https://github.com/',
        icon: 'github',
        order: 3,
      },
    ],
    formSettings: {
      enabled: true,
      submitEndpoint: '/api/contact',
      successMessage: 'Thanks for reaching out! I'll get back to you soon.',
      errorMessage: 'Something went wrong. Please try again or email me directly.',
    },
  },
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};

/**
 * Default Global Settings
 */
export const defaultSettings: ContentWrapper<GlobalSettings> = {
  id: 'settings',
  type: 'settings',
  status: 'published',
  content: {
    site: {
      title: 'John P. Stas',
      description: 'Creative Technologist • Designer • Developer',
      logo: {
        text: 'JPS',
      },
    },
    navigation: {
      enabled: true,
      items: [
        { id: 'portfolio', label: 'Portfolio', path: '/portfolio', enabled: true, order: 1 },
        { id: 'about', label: 'About', path: '/about', enabled: true, order: 2 },
        { id: 'resume', label: 'Resume', path: '/resume', enabled: true, order: 3 },
        { id: 'contact', label: 'Contact', path: '/contact', enabled: true, order: 4 },
      ],
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} John P. Stas. All rights reserved.`,
      links: [
        { id: 'email', label: 'Email', url: 'mailto:johnpstas@gmail.com', order: 1 },
        {
          id: 'linkedin',
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/johnpstas',
          order: 2,
        },
        { id: 'github', label: 'GitHub', url: 'https://github.com/', order: 3 },
      ],
    },
    seo: {
      keywords: [
        'creative technologist',
        'web developer',
        'UI/UX designer',
        'React developer',
        'TypeScript',
        'product design',
      ],
      ogImage: '/images/og-image.jpg',
    },
    social: {
      email: 'johnpstas@gmail.com',
      linkedin: 'https://www.linkedin.com/in/johnpstas',
      github: 'https://github.com/',
    },
  },
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};
