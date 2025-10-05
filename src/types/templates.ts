export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'case-study' | 'portfolio-piece' | 'client-work' | 'personal-project';
  icon: string;
  color: string;
  fields: {
    title: string;
    role: string;
    summary: string;
    tags: string[];
    featured: boolean;
    challenge: string;
    solution: string;
    results: string;
    process: string[];
    technologies: string[];
    client?: string;
    timeline?: string;
    budget?: string;
    team?: string[];
    deliverables?: string[];
    metrics?: string[];
  };
  metadata: {
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    requiredFields: string[];
  };
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'case-study-template',
    name: 'Case Study',
    description: 'Detailed analysis of a project with problem, solution, and results',
    type: 'case-study',
    icon: '📊',
    color: '#3B82F6',
    fields: {
      title: 'Project Title',
      role: 'Your Role',
      summary: 'Brief description of the project and its impact',
      tags: ['Design', 'Development', 'Strategy'],
      featured: true,
      challenge: 'What problem did this project solve? What were the constraints and requirements?',
      solution: 'How did you approach the problem? What was your methodology and process?',
      results: 'What were the outcomes? Include metrics, feedback, and impact.',
      process: [
        'Research and Discovery',
        'Planning and Strategy',
        'Design and Prototyping',
        'Development and Testing',
        'Launch and Optimization',
      ],
      technologies: ['Technology 1', 'Technology 2', 'Technology 3'],
      metrics: ['Metric 1', 'Metric 2', 'Metric 3'],
    },
    metadata: {
      category: 'Professional',
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      requiredFields: ['title', 'role', 'summary', 'challenge', 'solution', 'results'],
    },
  },
  {
    id: 'portfolio-piece-template',
    name: 'Portfolio Piece',
    description: 'Showcase of creative work with focus on visual presentation',
    type: 'portfolio-piece',
    icon: '🎨',
    color: '#8B5CF6',
    fields: {
      title: 'Creative Project Title',
      role: 'Artist • Designer • Creator',
      summary: 'Description of your creative vision and the work produced',
      tags: ['Art', 'Design', 'Creative'],
      featured: true,
      challenge: 'What was the creative challenge or inspiration?',
      solution: 'How did you approach the creative process? What techniques did you use?',
      results: 'What was the final outcome? How was it received?',
      process: [
        'Concept and Ideation',
        'Research and Inspiration',
        'Sketching and Planning',
        'Creation and Iteration',
        'Finalization and Presentation',
      ],
      technologies: ['Tool 1', 'Tool 2', 'Medium'],
      deliverables: ['Final Artwork', 'Process Documentation', 'Behind-the-Scenes'],
    },
    metadata: {
      category: 'Creative',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      requiredFields: ['title', 'role', 'summary'],
    },
  },
  {
    id: 'client-work-template',
    name: 'Client Work',
    description: 'Professional project for external client with business focus',
    type: 'client-work',
    icon: '💼',
    color: '#10B981',
    fields: {
      title: 'Client Project Name',
      role: 'Your Role • Company',
      summary: 'Overview of the client project and your contribution',
      tags: ['Client Work', 'Business', 'Professional'],
      featured: true,
      challenge: "What was the client's business challenge or goal?",
      solution: 'How did you solve their problem? What was your approach?',
      results: 'What were the business results? Include ROI, client satisfaction, etc.',
      process: [
        'Client Discovery',
        'Requirements Analysis',
        'Proposal and Planning',
        'Execution and Delivery',
        'Review and Handoff',
      ],
      technologies: ['Technology Stack'],
      client: 'Client Company Name',
      timeline: 'Project Duration',
      budget: 'Project Budget Range',
      team: ['Team Member 1', 'Team Member 2'],
      deliverables: ['Deliverable 1', 'Deliverable 2'],
      metrics: ['Business Metric 1', 'Client Satisfaction', 'ROI'],
    },
    metadata: {
      category: 'Professional',
      difficulty: 'advanced',
      estimatedTime: '3-4 hours',
      requiredFields: ['title', 'role', 'summary', 'client', 'challenge', 'solution', 'results'],
    },
  },
  {
    id: 'personal-project-template',
    name: 'Personal Project',
    description: 'Side project or personal exploration with learning focus',
    type: 'personal-project',
    icon: '🚀',
    color: '#F59E0B',
    fields: {
      title: 'Personal Project Name',
      role: 'Creator • Developer • Designer',
      summary: 'What you built and what you learned from it',
      tags: ['Personal', 'Learning', 'Side Project'],
      featured: false,
      challenge: 'What motivated you to start this project? What did you want to learn?',
      solution: 'How did you build it? What technologies and approaches did you use?',
      results: 'What did you learn? What would you do differently?',
      process: [
        'Ideation and Planning',
        'Learning and Research',
        'Building and Iterating',
        'Testing and Refining',
        'Documentation and Sharing',
      ],
      technologies: ['New Technology 1', 'New Technology 2'],
      timeline: 'Development Time',
      deliverables: ['Working Prototype', 'Documentation', 'Code Repository'],
    },
    metadata: {
      category: 'Personal',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      requiredFields: ['title', 'role', 'summary'],
    },
  },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByType(type: ProjectTemplate['type']): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(template => template.type === type);
}
