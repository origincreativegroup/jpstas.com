// Mock API for development - simulates the Cloudflare Pages functions
// This will be replaced by the actual API when deployed

export const mockProjects = [
  {
    id: '1',
    title: 'In‑House Print Studio Build',
    role: 'Designer • Ops Lead',
    summary: 'HP Latex 315 print workflow, vehicle wraps, apparel—training seasonal staff and saving costs.',
    tags: ['Design', 'Ops', 'Large Format'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '1',
        url: '/images/placeholder.svg',
        alt: 'Print studio setup',
        caption: 'HP Latex 315 printer in action',
        type: 'image'
      },
      {
        id: '2', 
        url: '/images/placeholder.svg',
        alt: 'Vehicle wrap process',
        caption: 'Large format vehicle wrap installation',
        type: 'image'
      }
    ],
    content: {
      challenge: 'Needed to establish an in-house print studio to reduce outsourcing costs and improve turnaround times.',
      solution: 'Designed and implemented a complete print workflow using HP Latex 315, including training protocols for seasonal staff.',
      results: 'Reduced print costs by 40% and improved delivery times by 60%.',
      process: [
        'Research and equipment selection',
        'Workflow design and optimization',
        'Staff training and documentation',
        'Quality control implementation'
      ],
      technologies: ['HP Latex 315', 'Adobe Creative Suite', 'RIP Software', 'Large Format Printing']
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'shop.caribbeanpools.com',
    role: 'Designer • Developer',
    summary: 'Retail extension site enabling early-buys; >$100k net in first year.',
    tags: ['Web', 'E‑commerce'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '3',
        url: '/images/placeholder.svg',
        alt: 'E-commerce homepage',
        caption: 'Clean, modern e-commerce interface',
        type: 'image'
      },
      {
        id: '4',
        url: '/images/placeholder.svg', 
        alt: 'Product catalog view',
        caption: 'Intuitive product browsing experience',
        type: 'image'
      }
    ],
    content: {
      challenge: 'Caribbean Pools needed a digital presence to capture early-buy customers before peak season.',
      solution: 'Built a custom e-commerce platform with streamlined checkout and mobile-first design.',
      results: 'Generated over $100k in net revenue in the first year with 85% mobile traffic.',
      process: [
        'User research and competitive analysis',
        'Wireframing and prototyping',
        'Frontend development with React',
        'Backend integration and testing',
        'Launch and performance optimization'
      ],
      technologies: ['React', 'Node.js', 'Stripe', 'MongoDB', 'AWS']
    },
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: '3',
    title: 'PortfolioForge (Prototype)',
    role: 'Founder • Product',
    summary: 'AI-assisted narrative builder for creatives; block-based editor concept.',
    tags: ['SaaS', 'AI', 'Design'],
    type: 'case-study',
    featured: false,
    images: [
      {
        id: '5',
        url: '/images/placeholder.svg',
        alt: 'PortfolioForge interface',
        caption: 'Block-based editor interface',
        type: 'image'
      }
    ],
    content: {
      challenge: 'Creative professionals struggle to present their work in compelling narratives that resonate with clients.',
      solution: 'Developed an AI-powered platform that helps creatives build structured portfolio narratives using drag-and-drop blocks.',
      results: 'Prototype achieved 70% user engagement rate in beta testing with 50+ creative professionals.',
      process: [
        'Market research and user interviews',
        'AI model training for content suggestions',
        'Block-based editor development',
        'User testing and iteration',
        'Beta launch and feedback collection'
      ],
      technologies: ['React', 'TypeScript', 'OpenAI API', 'Framer Motion', 'Supabase']
    },
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  }
];

export const mockApi = {
  async getProjects() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProjects;
  },

  async uploadFile(file: File) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock response
    const mockFile = {
      id: Date.now().toString(),
      name: file.name,
      filename: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file), // Use object URL for preview
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };

    return { success: true, file: mockFile };
  },

  async saveProject(projectData: any) {
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Project saved:', projectData);
    return { success: true, id: projectData.id };
  }
};
