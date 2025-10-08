/**
 * Project Migration Utilities
 * Convert between legacy Project types and UnifiedProject
 */

import { Project } from '@/types/project';
import { PortfolioProject, TemplateSection } from '@/types/template';
import { UnifiedProject, ProjectImage } from '@/types/unified-project';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate default sections from traditional Project content
 * Creates a section-based structure from flat content fields
 */
export function generateSectionsFromContent(project: Project): TemplateSection[] {
  const sections: TemplateSection[] = [];
  let order = 0;

  // Hero section (always first)
  sections.push({
    id: `hero-${project.id}`,
    type: 'hero',
    title: project.title,
    content: {
      title: project.title,
      subtitle: project.role,
      description: project.summary,
    },
    layout: 'full-width',
    order: order++,
  });

  // Challenge section
  if (project.content.challenge) {
    sections.push({
      id: `challenge-${project.id}`,
      type: 'text',
      title: 'The Challenge',
      content: {
        text: project.content.challenge,
      },
      layout: 'contained',
      order: order++,
    });
  }

  // Solution section
  if (project.content.solution) {
    sections.push({
      id: `solution-${project.id}`,
      type: 'text',
      title: 'The Solution',
      content: {
        text: project.content.solution,
      },
      layout: 'contained',
      order: order++,
    });
  }

  // Process section
  if (project.content.process && project.content.process.length > 0) {
    sections.push({
      id: `process-${project.id}`,
      type: 'process',
      title: 'Process',
      content: {
        steps: project.content.process,
      },
      layout: 'contained',
      order: order++,
    });
  }

  // Gallery section (from images)
  if (project.images && project.images.length > 0) {
    sections.push({
      id: `gallery-${project.id}`,
      type: 'gallery',
      title: 'Project Gallery',
      media: project.images.map(img => ({
        id: img.id,
        name: img.alt || 'Image',
        filename: img.alt || 'image.jpg',
        url: img.url,
        alt: img.alt,
        caption: img.caption,
        type: img.type || 'image',
        size: 0, // Unknown
        uploadedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const,
        tags: [],
      })) as any,
      layout: 'full-width',
      order: order++,
    });
  }

  // Results/Stats section
  if (project.content.results) {
    sections.push({
      id: `results-${project.id}`,
      type: 'stats',
      title: 'Results & Impact',
      content: {
        text: project.content.results,
        stats: parseResultsToStats(project.content.results),
      },
      layout: 'contained',
      order: order++,
    });
  }

  // Technologies section
  if (project.content.technologies && project.content.technologies.length > 0) {
    sections.push({
      id: `tech-${project.id}`,
      type: 'features',
      title: 'Technologies',
      content: {
        technologies: project.content.technologies,
      },
      layout: 'contained',
      order: order++,
    });
  }

  return sections;
}

/**
 * Parse results text into stat objects (best effort)
 */
function parseResultsToStats(results: string): Array<{ label: string; value: string }> {
  const stats: Array<{ label: string; value: string }> = [];

  // Try to extract percentage or number-based stats
  const sentences = results.split('.').filter(s => s.trim());

  sentences.forEach(sentence => {
    // Look for patterns like "40% increase" or "$2M+ revenue"
    const percentMatch = sentence.match(/(\d+)%/);
    const dollarMatch = sentence.match(/\$([0-9.,]+[KMB]?\+?)/);
    const numberMatch = sentence.match(/(\d+[\d.,]*[KMB]?\+?)\s+(\w+)/);

    if (percentMatch) {
      stats.push({
        value: percentMatch[0] || '',
        label: sentence.trim().substring(0, 40),
      });
    } else if (dollarMatch) {
      stats.push({
        value: dollarMatch[0] || '',
        label: sentence.trim().substring(0, 40),
      });
    } else if (numberMatch) {
      stats.push({
        value: numberMatch[1] || '',
        label: numberMatch[2] || '',
      });
    }
  });

  return stats;
}

/**
 * Convert legacy Project to UnifiedProject
 */
export function migrateProjectToUnified(project: Project): UnifiedProject {
  return {
    id: project.id,
    title: project.title,
    slug: generateSlug(project.title),
    role: project.role,
    summary: project.summary,
    tags: project.tags,
    type: project.type,
    featured: project.featured,

    // No template (legacy project)
    templateId: undefined,
    sections: generateSectionsFromContent(project),

    // Copy content directly
    content: project.content,

    // Copy images
    images: project.images || [],

    // SEO
    seo: project.seo,

    // Status
    status: project.status,
    orderIndex: undefined,

    // Timestamps
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    publishedAt: project.publishedAt,

    // Analytics
    analytics: project.analytics,

    // Versions
    versions: project.versions,
  };
}

/**
 * Convert PortfolioProject to UnifiedProject
 */
export function migratePortfolioProjectToUnified(portfolioProject: PortfolioProject): UnifiedProject {
  // Extract traditional content from sections
  const extractedContent = extractContentFromSections(portfolioProject.sections);

  // Extract images from gallery sections
  const extractedImages = extractImagesFromSections(portfolioProject.sections);

  return {
    id: portfolioProject.id,
    title: portfolioProject.title,
    slug: portfolioProject.slug,
    role: portfolioProject.role || '',
    summary: portfolioProject.summary || '',
    tags: portfolioProject.tags || [],
    type: 'case-study', // Default for template projects
    featured: portfolioProject.featured || false,

    // Template info
    templateId: portfolioProject.templateId,
    sections: portfolioProject.sections,

    // Extracted content
    content: extractedContent,

    // Extracted images
    images: extractedImages,

    // SEO
    seo: portfolioProject.seo,

    // Status
    status: portfolioProject.status,
    orderIndex: portfolioProject.orderIndex,

    // Timestamps
    createdAt: portfolioProject.createdAt,
    updatedAt: portfolioProject.updatedAt,
    publishedAt: portfolioProject.publishedAt,
  };
}

/**
 * Extract traditional content fields from sections
 */
function extractContentFromSections(sections: TemplateSection[]): UnifiedProject['content'] {
  const content: UnifiedProject['content'] = {
    challenge: '',
    solution: '',
    results: '',
    process: [],
    technologies: [],
    skills: [],
  };

  sections.forEach(section => {
    if (!section.content) return;

    // Extract based on section type and title
    const title = section.title?.toLowerCase() || '';

    if (title.includes('challenge') || section.id.includes('challenge')) {
      content.challenge = section.content.text || '';
    }

    if (title.includes('solution') || section.id.includes('solution')) {
      content.solution = section.content.text || '';
    }

    if (title.includes('result') || title.includes('impact') || section.id.includes('result')) {
      content.results = section.content.text || '';
    }

    if (section.type === 'process' && section.content.steps) {
      content.process = section.content.steps;
    }

    if (section.content.technologies) {
      content.technologies = section.content.technologies;
    }

    if (section.content.skills) {
      content.skills = section.content.skills;
    }

    // Extract additional metadata
    if (section.content.client) {
      content.client = section.content.client;
    }

    if (section.content.timeline) {
      content.timeline = section.content.timeline;
    }
  });

  return content;
}

/**
 * Extract images from gallery sections
 */
function extractImagesFromSections(sections: TemplateSection[]): ProjectImage[] {
  const images: ProjectImage[] = [];
  let order = 0;

  sections.forEach(section => {
    if (section.media && section.media.length > 0) {
      section.media.forEach(mediaFile => {
        images.push({
          id: mediaFile.id,
          url: mediaFile.url,
          alt: mediaFile.alt || mediaFile.name,
          caption: mediaFile.caption || '',
          type: mediaFile.type === 'video' ? 'video' : 'image',
          order: order++,
        });
      });
    }
  });

  return images;
}

/**
 * Convert UnifiedProject back to legacy Project format
 * (For backward compatibility with portfolio display)
 */
export function convertUnifiedToLegacyProject(unified: UnifiedProject): Project {
  return {
    id: unified.id,
    title: unified.title,
    role: unified.role,
    summary: unified.summary,
    tags: unified.tags,
    type: unified.type,
    featured: unified.featured,
    images: unified.images,
    content: unified.content,
    createdAt: unified.createdAt,
    updatedAt: unified.updatedAt,
    publishedAt: unified.publishedAt,
    status: unified.status,
    seo: unified.seo,
    analytics: unified.analytics,
    versions: unified.versions,
  };
}

/**
 * Batch migrate an array of projects
 */
export function batchMigrateProjects(projects: Project[]): UnifiedProject[] {
  return projects.map(migrateProjectToUnified);
}

/**
 * Batch migrate an array of portfolio projects
 */
export function batchMigratePortfolioProjects(projects: PortfolioProject[]): UnifiedProject[] {
  return projects.map(migratePortfolioProjectToUnified);
}
