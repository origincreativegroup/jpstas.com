import { marked } from 'marked';

export interface Project {
  id: string;
  title: string;
  role: string;
  date: string;
  tags: string[];
  featured: boolean;
  thumbnail: string;
  gallery: string[];
  content: {
    problem: string;
    challenge: string;
    solution: string;
    impact: string;
    technicalDetails?: string;
    keyFeatures?: string[];
    lessonsLearned?: string;
  };
  html: string;
}

export interface Skill {
  name: string;
  level: number;
  description: string;
  proof: string;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface NavSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

// Content loading functions
export async function loadProjects(): Promise<Project[]> {
  try {
    // In a real implementation, this would dynamically import all .md files
    // For now, we'll use static imports
    const projectModules = await Promise.all([
      import('../content/projects/caribbean-pools-ecommerce.md?raw')
    ]);

    return projectModules.map((module, index) => {
      const content = module.default;
      const frontMatter = extractFrontMatter(content);
      const markdown = content.replace(/^---[\s\S]*?---\n/, '');
      
      return {
        id: `project-${index}`,
        title: frontMatter.title || 'Untitled Project',
        role: frontMatter.role || '',
        date: frontMatter.date || '',
        tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
        featured: Boolean(frontMatter.featured),
        thumbnail: frontMatter.thumbnail || '',
        gallery: Array.isArray(frontMatter.gallery) ? frontMatter.gallery : [],
        content: parsePCSI(markdown),
        html: marked(markdown) as string
      };
    });
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

export async function loadSkills(): Promise<SkillGroup[]> {
  try {
    const skillsModule = await import('../content/skills.json');
    return skillsModule.default.skillGroups;
  } catch (error) {
    console.error('Failed to load skills:', error);
    return [];
  }
}

export async function loadNavSections(): Promise<NavSection[]> {
  try {
    const navModule = await import('../content/nav.json');
    return navModule.default.sections;
  } catch (error) {
    console.error('Failed to load navigation:', error);
    return [];
  }
}

export async function loadBio(): Promise<string> {
  try {
    const bioModule = await import('../content/bio.md?raw');
    return marked(bioModule.default);
  } catch (error) {
    console.error('Failed to load bio:', error);
    return '';
  }
}

// Utility functions
function extractFrontMatter(content: string): Record<string, any> {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) return {};

  const frontMatter = frontMatterMatch[1];
  if (!frontMatter) return {};
  
  const result: Record<string, any> = {};

  frontMatter.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) return;

    const key = trimmedLine.slice(0, colonIndex).trim();
    let value = trimmedLine.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        result[key] = Array.isArray(parsed) ? parsed : [];
      } catch {
        result[key] = [];
      }
    } else if (key === 'featured') {
      // Handle boolean values
      result[key] = value === 'true';
    } else {
      result[key] = value;
    }
  });

  return result;
}

function parsePCSI(markdown: string): Project['content'] {
  const sections = markdown.split(/\n## /);
  const result: Project['content'] = {
    problem: '',
    challenge: '',
    solution: '',
    impact: ''
  };

  sections.forEach(section => {
    const lines = section.split('\n');
    const firstLine = lines[0];
    if (!firstLine) return;
    
    const title = firstLine.replace(/^#+\s*/, '').toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    switch (title) {
      case 'problem':
        result.problem = content;
        break;
      case 'challenge':
        result.challenge = content;
        break;
      case 'solution':
        result.solution = content;
        break;
      case 'impact':
        result.impact = content;
        break;
      case 'technical details':
        result.technicalDetails = content;
        break;
      case 'key features':
        result.keyFeatures = content.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, ''));
        break;
      case 'lessons learned':
        result.lessonsLearned = content;
        break;
    }
  });

  return result;
}
