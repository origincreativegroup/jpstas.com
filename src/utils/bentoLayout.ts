import { Project } from '@/types/project';

export type CardSize = 'small' | 'medium' | 'large';

export interface LayoutItem {
  project: Project;
  size: CardSize;
}

/**
 * Smart bento layout algorithm that creates visual balance
 * - Featured projects get larger sizes (large or medium)
 * - Creates variety by mixing card sizes
 * - Ensures visual balance across the grid
 */
export function generateBentoLayout(projects: Project[]): LayoutItem[] {
  const layoutItems: LayoutItem[] = [];

  // Separate featured and non-featured projects
  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  // Track position to create balanced patterns
  let position = 0;

  // Layout featured projects first with larger sizes
  featuredProjects.forEach((project, index) => {
    // Alternate between large and medium for featured projects
    // First featured gets large, then medium, then alternate
    let size: CardSize;

    if (index === 0) {
      size = 'large'; // First featured is always large
    } else if (index % 3 === 1) {
      size = 'medium'; // Every 2nd featured is medium
    } else {
      size = 'large'; // Others are large
    }

    layoutItems.push({ project, size });
    position++;
  });

  // Layout regular projects with small and occasional medium sizes
  regularProjects.forEach((project, index) => {
    // Every 4th regular project gets medium, rest get small
    const size: CardSize = index > 0 && index % 4 === 0 ? 'medium' : 'small';

    layoutItems.push({ project, size });
    position++;
  });

  return layoutItems;
}

/**
 * Generate layout for home page featured section
 * Returns optimized layout for 3-4 featured projects
 */
export function generateHomeFeaturedLayout(projects: Project[]): LayoutItem[] {
  const featured = projects.filter(p => p.featured).slice(0, 4);

  if (featured.length === 0) return [];

  const layoutItems: LayoutItem[] = [];

  featured.forEach((project, index) => {
    // First project is large (hero), rest are small/medium
    let size: CardSize;

    if (index === 0) {
      size = 'large';
    } else if (index === 1) {
      size = 'medium';
    } else {
      size = 'small';
    }

    layoutItems.push({ project, size });
  });

  return layoutItems;
}

/**
 * Calculate estimated grid columns a size will occupy
 * Useful for responsive layout calculations
 */
export function getCardColumnSpan(size: CardSize): number {
  switch (size) {
    case 'large':
      return 2;
    case 'medium':
      return 2;
    case 'small':
      return 1;
    default:
      return 1;
  }
}

/**
 * Calculate estimated grid rows a size will occupy
 */
export function getCardRowSpan(size: CardSize): number {
  switch (size) {
    case 'large':
      return 2;
    case 'medium':
      return 1;
    case 'small':
      return 1;
    default:
      return 1;
  }
}
