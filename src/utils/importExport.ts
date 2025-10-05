import { Project, ProjectDraft } from '@/types/project';
import { MediaFile } from '@/types/media';

export interface ExportData {
  version: string;
  exportedAt: string;
  exportedBy: string;
  projects: Project[];
  drafts: ProjectDraft[];
  media: MediaFile[];
  metadata: {
    totalProjects: number;
    totalDrafts: number;
    totalMedia: number;
    exportSize: number;
  };
}

export interface ImportOptions {
  mergeStrategy: 'replace' | 'merge' | 'skip';
  includeMedia: boolean;
  includeDrafts: boolean;
  validateData: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: {
    projects: number;
    drafts: number;
    media: number;
  };
  errors: string[];
  warnings: string[];
}

export class ProjectImportExport {
  private static readonly EXPORT_VERSION = '1.0.0';

  /**
   * Export projects to JSON format
   */
  static async exportProjects(
    projects: Project[],
    drafts: ProjectDraft[] = [],
    media: MediaFile[] = [],
    exportedBy: string = 'user'
  ): Promise<string> {
    const exportData: ExportData = {
      version: this.EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      exportedBy,
      projects,
      drafts,
      media,
      metadata: {
        totalProjects: projects.length,
        totalDrafts: drafts.length,
        totalMedia: media.length,
        exportSize: 0, // Will be calculated after JSON stringification
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    exportData.metadata.exportSize = new Blob([jsonString]).size;

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export projects to CSV format
   */
  static async exportProjectsCSV(projects: Project[]): Promise<string> {
    const headers = [
      'ID',
      'Title',
      'Role',
      'Summary',
      'Tags',
      'Type',
      'Featured',
      'Status',
      'Created At',
      'Updated At',
      'Published At',
      'Challenge',
      'Solution',
      'Results',
      'Process',
      'Technologies',
      'Client',
      'Timeline',
      'Budget',
      'Team',
      'Deliverables',
      'Metrics',
    ];

    const rows = projects.map(project => [
      project.id,
      project.title,
      project.role,
      project.summary,
      project.tags.join('; '),
      project.type,
      project.featured ? 'Yes' : 'No',
      project.status,
      project.createdAt,
      project.updatedAt,
      project.publishedAt || '',
      project.content.challenge,
      project.content.solution,
      project.content.results,
      project.content.process.join('; '),
      project.content.technologies.join('; '),
      project.content.client || '',
      project.content.timeline || '',
      project.content.budget || '',
      project.content.team?.join('; ') || '',
      project.content.deliverables?.join('; ') || '',
      project.content.metrics?.join('; ') || '',
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  /**
   * Import projects from JSON data
   */
  static async importProjects(
    jsonData: string,
    options: ImportOptions = {
      mergeStrategy: 'merge',
      includeMedia: true,
      includeDrafts: true,
      validateData: true,
    }
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: { projects: 0, drafts: 0, media: 0 },
      errors: [],
      warnings: [],
    };

    try {
      const data: ExportData = JSON.parse(jsonData);

      // Validate export version
      if (data.version !== this.EXPORT_VERSION) {
        result.warnings.push(
          `Export version ${data.version} may not be compatible with current version ${this.EXPORT_VERSION}`
        );
      }

      // Validate data structure
      if (options.validateData) {
        const validation = this.validateExportData(data);
        if (!validation.valid) {
          result.errors.push(...validation.errors);
          result.success = false;
          return result;
        }
      }

      // Import projects
      if (data.projects && data.projects.length > 0) {
        try {
          // In a real app, this would call the API
          console.log('Importing projects:', data.projects.length);
          result.imported.projects = data.projects.length;
        } catch (error) {
          result.errors.push(`Failed to import projects: ${(error as Error).message}`);
        }
      }

      // Import drafts
      if (options.includeDrafts && data.drafts && data.drafts.length > 0) {
        try {
          console.log('Importing drafts:', data.drafts.length);
          result.imported.drafts = data.drafts.length;
        } catch (error) {
          result.errors.push(`Failed to import drafts: ${(error as Error).message}`);
        }
      }

      // Import media
      if (options.includeMedia && data.media && data.media.length > 0) {
        try {
          console.log('Importing media:', data.media.length);
          result.imported.media = data.media.length;
        } catch (error) {
          result.errors.push(`Failed to import media: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to parse import data: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Validate export data structure
   */
  private static validateExportData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.version) {
      errors.push('Missing version field');
    }

    if (!data.exportedAt) {
      errors.push('Missing exportedAt field');
    }

    if (!Array.isArray(data.projects)) {
      errors.push('Projects must be an array');
    }

    if (data.drafts && !Array.isArray(data.drafts)) {
      errors.push('Drafts must be an array');
    }

    if (data.media && !Array.isArray(data.media)) {
      errors.push('Media must be an array');
    }

    // Validate project structure
    if (data.projects) {
      data.projects.forEach((project: any, index: number) => {
        if (!project.id) {
          errors.push(`Project ${index} is missing ID`);
        }
        if (!project.title) {
          errors.push(`Project ${index} is missing title`);
        }
        if (!project.type) {
          errors.push(`Project ${index} is missing type`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a backup of all data
   */
  static async createBackup(
    projects: Project[],
    drafts: ProjectDraft[] = [],
    media: MediaFile[] = []
  ): Promise<Blob> {
    const exportData = await this.exportProjects(projects, drafts, media, 'backup');
    return new Blob([exportData], { type: 'application/json' });
  }

  /**
   * Download data as file
   */
  static downloadFile(
    data: string | Blob,
    filename: string,
    mimeType: string = 'application/json'
  ) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Read file from input
   */
  static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate file before import
   */
  static validateImportFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size is ${this.formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = ['application/json', 'text/csv', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Please select a JSON or CSV file.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
