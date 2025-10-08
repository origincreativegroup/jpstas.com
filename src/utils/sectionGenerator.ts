/**
 * Section Generator Utilities
 * Convert content fields to/from section-based structure
 */

import { TemplateSection } from '@/types/template';
import { ProjectContent, ProjectImage } from '@/types/unified-project';

/**
 * Sync content changes back to sections
 * When editing in Simple mode, update the corresponding sections
 */
export function syncContentToSections(
  content: ProjectContent,
  images: ProjectImage[],
  existingSections: TemplateSection[]
): TemplateSection[] {
  const sections = [...existingSections];

  // Update or create Challenge section
  updateOrCreateTextSection(sections, 'challenge', 'The Challenge', content.challenge);

  // Update or create Solution section
  updateOrCreateTextSection(sections, 'solution', 'The Solution', content.solution);

  // Update or create Results section
  updateOrCreateTextSection(sections, 'results', 'Results & Impact', content.results);

  // Update or create Process section
  if (content.process && content.process.length > 0) {
    updateOrCreateProcessSection(sections, content.process);
  }

  // Update or create Gallery section
  if (images && images.length > 0) {
    updateOrCreateGallerySection(sections, images);
  }

  // Update or create Technologies section
  if (content.technologies && content.technologies.length > 0) {
    updateOrCreateTechSection(sections, content.technologies);
  }

  // Re-order sections
  return sections.sort((a, b) => a.order - b.order);
}

/**
 * Update an existing text section or create a new one
 */
function updateOrCreateTextSection(
  sections: TemplateSection[],
  sectionKey: string,
  defaultTitle: string,
  text: string
) {
  const existing = sections.find(
    s =>
      s.id.includes(sectionKey) ||
      s.title?.toLowerCase().includes(sectionKey.toLowerCase())
  );

  if (existing) {
    // Update existing
    existing.content = {
      ...existing.content,
      text,
    };
  } else if (text) {
    // Create new
    sections.push({
      id: `${sectionKey}-${Date.now()}`,
      type: 'text',
      title: defaultTitle,
      content: { text },
      layout: 'contained',
      order: sections.length,
    });
  }
}

/**
 * Update or create Process section
 */
function updateOrCreateProcessSection(sections: TemplateSection[], steps: string[]) {
  const existing = sections.find(s => s.type === 'process');

  if (existing) {
    existing.content = {
      ...existing.content,
      steps,
    };
  } else {
    sections.push({
      id: `process-${Date.now()}`,
      type: 'process',
      title: 'Process',
      content: { steps },
      layout: 'contained',
      order: sections.length,
    });
  }
}

/**
 * Update or create Gallery section
 */
function updateOrCreateGallerySection(sections: TemplateSection[], images: ProjectImage[]) {
  const existing = sections.find(s => s.type === 'gallery');

  const mediaFiles = images.map(img => ({
    id: img.id,
    name: img.alt || 'Image',
    url: img.url,
    alt: img.alt,
    caption: img.caption,
    type: img.type,
    size: 0,
    uploadedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'active' as const, filename: 'image.jpg',
    tags: [],
  }));

  if (existing) {
    existing.media = mediaFiles as any;
  } else if (images.length > 0) {
    sections.push({
      id: `gallery-${Date.now()}`,
      type: 'gallery',
      title: 'Project Gallery',
      media: mediaFiles as any,
      layout: 'full-width',
      order: sections.length,
    });
  }
}

/**
 * Update or create Technologies section
 */
function updateOrCreateTechSection(sections: TemplateSection[], technologies: string[]) {
  const existing = sections.find(
    s => s.type === 'features' && s.title?.toLowerCase().includes('tech')
  );

  if (existing) {
    existing.content = {
      ...existing.content,
      technologies,
    };
  } else {
    sections.push({
      id: `tech-${Date.now()}`,
      type: 'features',
      title: 'Technologies',
      content: { technologies },
      layout: 'contained',
      order: sections.length,
    });
  }
}

/**
 * Extract content from sections for Simple mode editing
 */
export function extractContentFromSections(sections: TemplateSection[]): {
  content: ProjectContent;
  images: ProjectImage[];
} {
  const content: ProjectContent = {
    challenge: '',
    solution: '',
    results: '',
    process: [],
    technologies: [],
    skills: [],
  };

  const images: ProjectImage[] = [];

  sections.forEach(section => {
    if (!section.content) return;

    const title = section.title?.toLowerCase() || '';
    const id = section.id.toLowerCase();

    // Extract text sections
    if (title.includes('challenge') || id.includes('challenge')) {
      content.challenge = section.content.text || '';
    }

    if (title.includes('solution') || id.includes('solution')) {
      content.solution = section.content.text || '';
    }

    if (
      title.includes('result') ||
      title.includes('impact') ||
      id.includes('result') ||
      id.includes('impact')
    ) {
      content.results = section.content.text || '';
    }

    // Extract process steps
    if (section.type === 'process' && section.content.steps) {
      content.process = section.content.steps;
    }

    // Extract technologies
    if (section.content.technologies) {
      content.technologies = section.content.technologies;
    }

    // Extract skills
    if (section.content.skills) {
      content.skills = section.content.skills;
    }

    // Extract metadata
    if (section.content.client) content.client = section.content.client;
    if (section.content.timeline) content.timeline = section.content.timeline;
    if (section.content.budget) content.budget = section.content.budget;
    if (section.content.team) content.team = section.content.team;
    if (section.content.deliverables) content.deliverables = section.content.deliverables;
    if (section.content.metrics) content.metrics = section.content.metrics;

    // Extract images from sections with media
    if (section.media && section.media.length > 0) {
      section.media.forEach((mediaFile, index) => {
        images.push({
          id: mediaFile.id,
          url: mediaFile.url,
          alt: mediaFile.alt || mediaFile.name,
          caption: mediaFile.caption || '',
          type: mediaFile.type === 'video' ? 'video' : 'image',
          order: images.length + index,
        });
      });
    }
  });

  return { content, images };
}

/**
 * Add a new section to the sections array
 */
export function addSection(
  sections: TemplateSection[],
  type: TemplateSection['type'],
  title?: string
): TemplateSection[] {
  const newSection: TemplateSection = {
    id: `${type}-${Date.now()}`,
    type,
    title: title || getDefaultSectionTitle(type),
    content: getDefaultSectionContent(type),
    layout: getDefaultSectionLayout(type),
    order: sections.length,
  };

  return [...sections, newSection];
}

/**
 * Remove a section from the sections array
 */
export function removeSection(sections: TemplateSection[], sectionId: string): TemplateSection[] {
  return sections.filter(s => s.id !== sectionId).map((s, index) => ({
    ...s,
    order: index,
  }));
}

/**
 * Reorder sections
 */
export function reorderSections(
  sections: TemplateSection[],
  fromIndex: number,
  toIndex: number
): TemplateSection[] {
  const result = [...sections];
  const [removed] = result.splice(fromIndex, 1);
  if (removed) {
    result.splice(toIndex, 0, removed);
  }

  return result.map((s, index) => ({
    ...s,
    order: index,
  }));
}

/**
 * Duplicate a section
 */
export function duplicateSection(sections: TemplateSection[], sectionId: string): TemplateSection[] {
  const section = sections.find(s => s.id === sectionId);
  if (!section) return sections;

  const duplicate: TemplateSection = {
    ...JSON.parse(JSON.stringify(section)),
    id: `${section.type}-${Date.now()}`,
    order: sections.length,
  };

  return [...sections, duplicate];
}

// Helper functions

function getDefaultSectionTitle(type: TemplateSection['type']): string {
  const titles: Record<TemplateSection['type'], string> = {
    hero: 'Hero Section',
    text: 'Text Section',
    image: 'Image',
    video: 'Video',
    gallery: 'Gallery',
    grid: 'Grid',
    split: 'Split Section',
    stats: 'Statistics',
    testimonial: 'Testimonial',
    cta: 'Call to Action',
    timeline: 'Timeline',
    process: 'Process',
    features: 'Features',
    code: 'Code',
    quote: 'Quote',
  };
  return titles[type] || 'New Section';
}

function getDefaultSectionContent(type: TemplateSection['type']): any {
  switch (type) {
    case 'text':
      return { text: '' };
    case 'process':
      return { steps: [] };
    case 'stats':
      return { stats: [] };
    case 'features':
      return { features: [] };
    case 'quote':
      return { quote: '', author: '' };
    default:
      return {};
  }
}

function getDefaultSectionLayout(type: TemplateSection['type']): TemplateSection['layout'] {
  const fullWidthTypes: TemplateSection['type'][] = ['hero', 'gallery', 'video', 'cta'];
  return fullWidthTypes.includes(type) ? 'full-width' : 'contained';
}
