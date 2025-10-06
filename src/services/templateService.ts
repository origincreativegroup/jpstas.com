import { ProjectTemplate, PortfolioProject, TemplateSection, DEFAULT_TEMPLATES } from '@/types/template';
import { v4 as uuidv4 } from 'uuid';

/**
 * Template Service
 * Manages portfolio templates and project creation from templates
 */

class TemplateService {
  private templates: ProjectTemplate[] = [...DEFAULT_TEMPLATES];
  private customTemplates: ProjectTemplate[] = [];

  /**
   * Get all available templates
   */
  getAllTemplates(): ProjectTemplate[] {
    return [...this.templates, ...this.customTemplates];
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): ProjectTemplate[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  /**
   * Get a single template by ID
   */
  getTemplateById(id: string): ProjectTemplate | null {
    return this.getAllTemplates().find(t => t.id === id) || null;
  }

  /**
   * Create a new custom template
   */
  createCustomTemplate(template: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt'>): ProjectTemplate {
    const newTemplate: ProjectTemplate = {
      ...template,
      id: uuidv4(),
      isCustom: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.customTemplates.push(newTemplate);
    return newTemplate;
  }

  /**
   * Update an existing custom template
   */
  updateCustomTemplate(id: string, updates: Partial<ProjectTemplate>): ProjectTemplate | null {
    const index = this.customTemplates.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.customTemplates[index] = {
      ...this.customTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.customTemplates[index];
  }

  /**
   * Delete a custom template
   */
  deleteCustomTemplate(id: string): boolean {
    const index = this.customTemplates.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.customTemplates.splice(index, 1);
    return true;
  }

  /**
   * Create a project from a template
   */
  createProjectFromTemplate(
    templateId: string,
    projectData: {
      title: string;
      slug: string;
      userId: string;
      subtitle?: string;
      summary?: string;
    }
  ): PortfolioProject | null {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    // Increment usage count
    if (template.isCustom) {
      const index = this.customTemplates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        this.customTemplates[index].usageCount = (this.customTemplates[index].usageCount || 0) + 1;
      }
    }

    // Create project with deep copy of template sections
    const project: PortfolioProject = {
      id: uuidv4(),
      userId: projectData.userId,
      templateId: template.id,
      title: projectData.title,
      slug: projectData.slug,
      subtitle: projectData.subtitle,
      summary: projectData.summary,
      sections: this.deepCopySections(template.sections),
      status: 'draft',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return project;
  }

  /**
   * Deep copy sections to avoid reference issues
   */
  private deepCopySections(sections: TemplateSection[]): TemplateSection[] {
    return sections.map(section => ({
      ...section,
      id: uuidv4(), // Generate new IDs for project sections
      content: section.content ? JSON.parse(JSON.stringify(section.content)) : undefined,
      media: section.media ? [...section.media] : undefined,
      background: section.background ? { ...section.background } : undefined,
      padding: section.padding ? { ...section.padding } : undefined,
      settings: section.settings ? JSON.parse(JSON.stringify(section.settings)) : undefined,
    }));
  }

  /**
   * Duplicate a section within a project
   */
  duplicateSection(section: TemplateSection): TemplateSection {
    return {
      ...section,
      id: uuidv4(),
      content: section.content ? JSON.parse(JSON.stringify(section.content)) : undefined,
      media: section.media ? [...section.media] : undefined,
    };
  }

  /**
   * Get default section content based on type
   */
  getDefaultSectionContent(type: string): any {
    const defaults: Record<string, any> = {
      hero: {
        heading: 'Your Heading Here',
        subheading: 'Your subheading text',
        buttonText: 'Learn More',
        buttonLink: '#',
      },
      text: {
        body: '<p>Add your content here...</p>',
      },
      image: {
        caption: '',
        alt: '',
      },
      video: {
        url: '',
        poster: '',
        autoplay: false,
        loop: false,
        controls: true,
      },
      gallery: {
        images: [],
        columns: 3,
        gap: 20,
      },
      grid: {
        items: [],
        columns: 2,
        gap: 30,
      },
      split: {
        leftContent: '<p>Left side content</p>',
        rightContent: '<p>Right side content</p>',
      },
      stats: {
        items: [
          { label: 'Metric 1', value: '0', suffix: '' },
          { label: 'Metric 2', value: '0', suffix: '%' },
          { label: 'Metric 3', value: '0', suffix: '+' },
        ],
      },
      testimonial: {
        quote: 'Add testimonial quote here',
        author: 'Author Name',
        role: 'Role',
        avatar: '',
      },
      cta: {
        heading: 'Ready to get started?',
        description: 'Call to action description',
        primaryButton: { label: 'Get Started', link: '#' },
        secondaryButton: { label: 'Learn More', link: '#' },
      },
      timeline: {
        items: [
          { date: 'Phase 1', title: 'Title', description: 'Description' },
          { date: 'Phase 2', title: 'Title', description: 'Description' },
          { date: 'Phase 3', title: 'Title', description: 'Description' },
        ],
      },
      process: {
        steps: [
          { number: 1, title: 'Step 1', description: 'Description' },
          { number: 2, title: 'Step 2', description: 'Description' },
          { number: 3, title: 'Step 3', description: 'Description' },
        ],
      },
      features: {
        items: [
          { icon: '', title: 'Feature 1', description: 'Description' },
          { icon: '', title: 'Feature 2', description: 'Description' },
          { icon: '', title: 'Feature 3', description: 'Description' },
        ],
      },
      code: {
        language: 'javascript',
        code: '// Add your code here',
      },
      quote: {
        text: 'Add your quote here',
        author: 'Author',
      },
    };

    return defaults[type] || {};
  }

  /**
   * Save a project as a template
   */
  saveProjectAsTemplate(
    project: PortfolioProject,
    templateData: {
      name: string;
      description: string;
      category: string;
    }
  ): ProjectTemplate {
    return this.createCustomTemplate({
      name: templateData.name,
      description: templateData.description,
      category: templateData.category as any,
      sections: this.deepCopySections(project.sections),
    });
  }
}

// Export singleton instance
export const templateService = new TemplateService();
export default templateService;

