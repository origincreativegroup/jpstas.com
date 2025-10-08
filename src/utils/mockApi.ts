// Mock API for development - simulates the Cloudflare Pages functions
// This will be replaced by the actual API when deployed
import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Caribbean Pools E-commerce Platform',
    role: 'Product Designer · Digital Strategist  Developer',
    summary:
      'Designed and launched an online retail platform for Caribbean Pools, transforming manual ordering into a seamless digital experience that generated over $100k in its first year.',
    tags: ['e-commerce', 'UX design', 'digital transformation', 'WordPress', 'WooCommerce'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '1-1',
        url: '/images/placeholder.svg',
        alt: 'E-commerce homepage design',
        caption: 'Mobile-first responsive design with dynamic product configurator',
        type: 'image' as const,
      },
      {
        id: '1-2',
        url: '/images/placeholder.svg',
        alt: 'Product catalog interface',
        caption: 'Advanced filtering and real-time inventory tracking',
        type: 'image' as const,
      },
      {
        id: '1-3',
        url: '/images/placeholder.svg',
        alt: 'Admin dashboard',
        caption: 'Comprehensive order management and analytics dashboard',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'All purchases and early buy programs were handled manually—via paper forms and phone calls—creating bottlenecks every spring and overloading the customer service team.',
      solution:
        'Built ShopCaribbeanPools.com using WordPress + WooCommerce., Digitized early buy forms and linked them to automated order workflows., Implemented responsive design for mobile ordering.,Connected payment gateways and email confirmations.',
      results: '$100k+ net revenue in the first year., 20–30% reduction in call time per customer., Hundreds of customers adopted online ordering.Reduced paperwork and improved customer convenience.',
      process: [
        'Discovery: Met with retail, and customer service staff to understand customer pain points and seasonal order patterns.',
        'Planning: Outlined site architecture, product categorization, and a workflow for digitizing the Early Buy program.',
        'Design: Created general wireframes and a visual design system.',
        'Development: Built the storefront using WordPress and WooCommerce, customizing product templates and automations.',
        'Integration: Linked online orders with existing CRM (Evosus) to streamline Online scheduling.',
        'Testing: Ran pilot orders internally, refined checkout flow, and optimized site performance.',
        'Launch: Rolled out ShopCaribbeanPools.com with training for office staff and clear customer onboarding guides.',
        'Collected analytics and customer feedback to improve product filtering, checkout speed, and UX clarity.',
      ],
      technologies: [
        'WordPress',
        'WooCommerce',
        'Evosus',
        'MailChimp',
        'Google Analytics',
        'Google Search Console',
        'Google My Business',
      ],
      skills: [
        'UI/UX Design',
        'Web Development',
        'Digital Marketing',
        'Customer Experience',
        'Workflow Automation',
      ],
    },
    createdAt: '2023-06-15',
    updatedAt: '2024-01-10',
    status: 'published',
  },
  {
    id: '2',
    title: 'In-House Print Studio Build',
    role: 'Creative Technologist · Designer · Process Innovator',
    summary:
      'Built a fully in-house print and production studio at Caribbean Pools, transforming outsourcing into a self-sufficient creative engine that handled wraps, signage, apparel, and retail campaigns.',
    tags: ['large-format printing', 'process design', 'production systems', 'branding', 'apparel'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '2-1',
        url: '/images/placeholder.svg',
        alt: 'Print studio setup',
        caption: 'HP Latex 315 large format printer and production workflow',
        type: 'image' as const,
      },
      {
        id: '2-2',
        url: '/images/placeholder.svg',
        alt: 'Vehicle wrap installation',
        caption: 'Professional vehicle wrap installation process',
        type: 'image' as const,
      },
      {
        id: '2-3',
        url: '/images/placeholder.svg',
        alt: 'Production workflow diagram',
        caption: 'Optimized workflow from design to installation',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Caribbean relied on expensive third-party vendors for wraps, apparel, and signage. This caused inconsistent quality, long lead times, and limited adaptability to seasonal demand.',
      solution:
        'Introduced HP Latex 315 printer-cutter and built an internal workflow for design-to-production.,Trained seasonal staff and standardized templates for recurring jobs.,Expanded into apparel production (120+ uniforms annually), fleet branding, and retail displays.,Integrated design, print, and installation for rapid campaign launches.',
      results: '$250k+ saved in outsourcing costs over 8 years., Branded 20+ vehicles and unified 3 retail locations under one visual standard.Enabled same-day production for promotions and signage.,Elevated brand consistency and customer recognition.',
      process: [
        'Research: Evaluated 8+ printer options and workflow solutions',
        'Planning: Designed studio layout and equipment requirements',
        'Procurement: Selected HP Latex 315 and supporting equipment',
        'Setup: Installed equipment and established workspace standards',
        'Training: Worked with seasonal staff to hands-on training program for staff',
        'Integration: Connected to e-commerce platform for automated job generation',
        'Optimization: Refined processes based on production data and feedback',
      ],
      technologies: [
        'HP Latex 315',
        'Adobe Creative Suite (Illustrator, Photoshop, InDesign)',
        'Caldera RIP Software',
        'Large Format Printing',
        'Color Management Systems',
        'Workflow Automation',
        'Production Planning',
      ],
      skills: [
        'Operations Management',
        'Process Design & Optimization',
        'Training & Documentation',
        'Quality Control',
        'Vendor Management',
        'Production Planning',
        'Staff Training & Development',
        'Cost Analysis & Reduction',
        'Workflow Integration',
        'Print Production',
      ],
    },
    createdAt: '2022-03-20',
    updatedAt: '2023-12-01',
    status: 'published',
  },
  {
    id: '3',
    title: 'AI-Integrated Workflows',
    role: 'Creative Technologist · Workflow Engineer',
    summary:
      'Leveraged AI and automation to bridge creative and operational processes, reducing design time by 40% and seeding three new SaaS concepts.',
    tags: ['AI', 'automation', 'process optimization', 'SaaS development', 'ChatGPT', 'workflow design'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '3-1',
        url: '/images/placeholder.svg',
        alt: 'PortfolioForge editor interface',
        caption: 'Intuitive block-based editor with AI-powered suggestions',
        type: 'image' as const,
      },
      {
        id: '3-2',
        url: '/images/placeholder.svg',
        alt: 'Portfolio template gallery',
        caption: 'Professional templates optimized for different creative fields',
        type: 'image' as const,
      },
      {
        id: '3-3',
        url: '/images/placeholder.svg',
        alt: 'AI content assistant',
        caption: 'Context-aware AI assistant providing writing suggestions',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Creative departments often lose time to repetitive administrative tasks—duplicating data between systems, reformatting briefs, or generating minor content variations.',
      solution:
        'Introduced AI-assisted design iteration and copy generation. Automated form-based submissions from Jobber → MailChimp → Email. Implemented Python and VBA scripts for documentation and reporting. Prototyped four AI-driven tools (DeckHand, PortfolioForge, MindForge, NexusCore).',
      results: '40% reduction in average design turnaround time. 12 process automations integrated into daily workflows. Improved documentation and reporting accuracy. Foundation skills built for future SaaS ecosystem development.',
      process: [
        'Process mapping --> AI Model Intergration --> Script Development --> Prototyping --> Beta Testing --> Launch --> Feedback Collection --> Iteration --> Optimization.'
      ],
      technologies: [
        'React',
        'TypeScript',
        'OpenAI GPT-4 API',
        'Python',
        'VBA',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Tailwind CSS',
        'Cloudflare',
        'Vercel',
        'GitHub',
        'Power Automate',
        'Microsoft 365',
      ],
      skills: [
        'Product Design & Strategy',
        'AI/ML Integration',
        'SaaS Development',
        'User Research & Testing',
        'Full-Stack Development',
        'Content Strategy',
        'Go-to-Market Planning',
        'Startup Operations',
        'Competitor Analysis',
        'Pricing Strategy',
      ],
    },
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
    status: 'published',
  },
  {
    id: '4',
    title: 'Training & Educational Media Production',
    role: 'Media Producer · Instructional Designer',
    summary:
      'Produced an educational media suite—including drone video, tutorial playlists, and QR-linked starter kits—to standardize training for 120+ seasonal employees and pool owners.',
    tags: ['video production', 'instructional design', 'drone media', 'training systems', 'QR code integration'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '4-1',
        url: '/images/placeholder.svg',
        alt: 'Video thumbnails',
        caption: 'Training video thumbnails for seasonal staff onboarding',
        type: 'image' as const,
      },
      {
        id: '4-2',
        url: '/images/placeholder.svg',
        alt: 'Training dashboards',
        caption: 'Educational content management and tracking dashboards',
        type: 'image' as const,
      },
      {
        id: '4-3',
        url: '/images/placeholder.svg',
        alt: 'QR product cards',
        caption: 'QR code integration linking physical products to video tutorials',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Seasonal turnover and complex maintenance routines led to inconsistent training and repeat service calls. Printed manuals were ineffective for quick learning.',
      solution:
        'Produced high-quality video tutorials covering maintenance and safety. Integrated drone and FPV footage for dynamic visual storytelling. Designed starter kits with QR codes linking directly to how-to videos. Hosted content on a public YouTube playlist for 24/7 accessibility.',
      results: '50% reduction in repeat service calls. Faster onboarding and higher retention among seasonal staff. Improved customer satisfaction and brand authority. Media assets reusable for both marketing and training.',
      process: [
        'Storyboard: Planned video sequences and educational flow',
        'Script: Developed clear, concise instructional content',
        'Production: Filmed using drone and ground-level cameras',
        'Editing: Post-processed with Adobe Creative Suite',
        'Deployment: Published to YouTube and integrated QR codes',
        'Measurement: Tracked engagement and training effectiveness',
      ],
      technologies: [
        'Adobe Premiere',
        'Adobe Audition',
        'Adobe Illustrator',
        'FPV Drone Systems',
        'YouTube Studio',
        'QR Code Generators',
      ],
      skills: [
        'Video Production',
        'Audio Editing',
        'Storyboarding',
        'Drone Operation',
        'Instructional Design',
        'Content Strategy',
      ],
    },
    createdAt: '2022-05-15',
    updatedAt: '2023-08-20',
    status: 'published',
  },
  {
    id: '5',
    title: 'Early Buy Sales Print Campaign',
    role: 'Creative Technologist · Designer · Marketing Strategist',
    summary:
      'Designed and produced an integrated print campaign for Caribbean Pools\' annual Early Buy sale, combining brochures, signage, and digital extensions to drive record pre-season engagement.',
    tags: ['print design', 'campaign strategy', 'retail marketing', 'large-format printing', 'cross-channel integration'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '5-1',
        url: '/images/placeholder.svg',
        alt: 'Brochure mockups',
        caption: 'Early Buy campaign brochure designs and layouts',
        type: 'image' as const,
      },
      {
        id: '5-2',
        url: '/images/placeholder.svg',
        alt: 'Store signage',
        caption: 'Point-of-purchase signage and window displays',
        type: 'image' as const,
      },
      {
        id: '5-3',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'QR-linked digital extensions and animated content',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'The sales team relied on outsourced, inconsistent print materials. Campaign visuals didn\'t match digital promotions, and long vendor lead times made last-minute updates impossible.',
      solution:
        'Centralized all campaign design and production in-house using the HP Latex print studio. Developed modular templates for product pages, signage, and mailers that could be reused each season. Introduced QR codes linking directly to online Early Buy products and promotions. Designed visually consistent assets across print, social media, and in-store displays.',
      results: 'Cut print and design turnaround time by over 70%. Unified marketing visuals across 3 retail locations and digital channels. Increased Early Buy participation rate year-over-year. Created reusable campaign framework adaptable for future promotions.',
      process: [
        'Discovery: Interviewed sales staff and analyzed prior Early Buy performance to identify messaging gaps',
        'Planning: Mapped print and digital touchpoints for a cohesive campaign rollout',
        'Design: Built a seasonal style guide, print templates, and signage system emphasizing clarity and brand recall',
        'Production: Printed and finished brochures, banners, and clings in-house using HP Latex technology',
        'Distribution: Coordinated logistics across three locations with synchronized launch timing',
        'Optimization: Refined templates based on customer and staff feedback for subsequent campaigns',
      ],
      technologies: [
        'HP Latex 315 Printer',
        'Adobe Illustrator',
        'Adobe Photoshop',
        'Adobe InDesign',
        'Formstack QR Integrations',
      ],
      skills: [
        'Graphic Design',
        'Campaign Strategy',
        'Print Production',
        'Marketing Coordination',
        'Process Improvement',
      ],
    },
    createdAt: '2022-02-10',
    updatedAt: '2023-03-15',
    status: 'published',
  },
  {
    id: '6',
    title: 'New Pool Drone Photo & Video Project',
    role: 'Creative Technologist · FPV Drone Pilot · Media Producer',
    summary:
      'From 2018–2021, I directed and produced a cinematic drone media campaign for Caribbean Pools, capturing newly completed pools with DJI and custom-built FPV drones. The footage became a core marketing asset—featured across the website, social media, and new pool sales materials—to showcase craftsmanship, elevate the brand, and drive customer engagement.',
    tags: ['aerial photography', 'drone videography', 'marketing media', 'storytelling', 'FPV pilot', 'video production'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '6-1',
        url: '/images/placeholder.svg',
        alt: 'Drone footage',
        caption: 'Cinematic aerial footage of completed pool installations',
        type: 'video' as const,
      },
      {
        id: '6-2',
        url: '/images/placeholder.svg',
        alt: 'Photo templates',
        caption: 'Professional aerial photography templates for marketing use',
        type: 'image' as const,
      },
      {
        id: '6-3',
        url: '/images/placeholder.svg',
        alt: 'Video thumbnails',
        caption: 'Social media video thumbnails and promotional graphics',
        type: 'image' as const,
      },
      {
        id: '6-4',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'Motion graphics and animated content for sales presentations',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Marketing relied on inconsistent job-site photos that didn\'t communicate the scale or quality of finished work. The company needed a more cinematic, emotionally engaging way to show its craftsmanship and lifestyle appeal.',
      solution:
        'Captured professional aerial footage using DJI Phantom 3 and 4 drones for smooth, high-resolution visuals. Deployed custom-built FPV cinematography drones for immersive fly-throughs and dynamic perspective shots. Created a repeatable production workflow: site scouting, flight planning, capture, and post-production. Edited promotional highlight reels optimized for web and social channels. Designed branded lower-thirds, title cards, and LUTs for visual consistency. Integrated content into sales decks, website banners, and seasonal ad campaigns.',
      results: '400% increase in social engagement on posts featuring drone footage. Enhanced perceived craftsmanship and customer trust through professional storytelling. Supported sales team with visually compelling materials that increased new pool conversions. Established a scalable process for ongoing content capture and seasonal updates.',
      process: [
        'Pre-Production: Scouted project sites, coordinated schedules with construction crews, and defined flight plans',
        'Capture: Conducted drone and FPV flights focused on storytelling, lighting, and composition',
        'Post-Production: Edited footage in Adobe Premiere Pro and DaVinci Resolve, applied LUTs, and mixed audio',
        'Distribution: Delivered multi-format content for social media, web galleries, and sales presentations',
        'Optimization: Collected engagement data to refine visual style and platform strategy for future campaigns',
      ],
      technologies: [
        'DJI Phantom 3',
        'DJI Phantom 4',
        'Custom Cinematography FPV Drones',
        'GoPro Hero 11',
        'Adobe Premiere Pro',
        'DaVinci Resolve',
        'Adobe Audition',
        'LUTs',
        'ND Filters',
      ],
      skills: [
        'Drone Operation (Part 107 Certified)',
        'FPV Cinematography',
        'Aerial Photography',
        'Video Editing',
        'Color Grading',
        'Storytelling',
        'Cross-Channel Marketing',
      ],
    },
    createdAt: '2018-03-01',
    updatedAt: '2021-12-15',
    status: 'published',
  },
  {
    id: '7',
    title: 'Email Marketing Campaigns & Customer Communications',
    role: 'Creative Technologist · Marketing Strategist · CRM Integrator',
    summary:
      'Developed and managed automated email marketing campaigns and customer communication systems for Caribbean Pools, combining design, data, and CRM automation to improve engagement and streamline client interactions.',
    tags: ['email marketing', 'CRM integration', 'customer communication', 'automation', 'Mailchimp', 'campaign design'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '7-1',
        url: '/images/placeholder.svg',
        alt: 'Campaign screenshots',
        caption: 'Email campaign examples and performance metrics',
        type: 'image' as const,
      },
      {
        id: '7-2',
        url: '/images/placeholder.svg',
        alt: 'Email templates',
        caption: 'Responsive email templates for marketing and service communications',
        type: 'image' as const,
      },
      {
        id: '7-3',
        url: '/images/placeholder.svg',
        alt: 'Analytics infographics',
        caption: 'Email performance analytics and engagement tracking dashboards',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Customer communication was fragmented across emails, phone calls, and paper mailers, making it hard to maintain consistency or track engagement. Marketing messages lacked personalization, and internal teams spent valuable time manually sending reminders and follow-ups.',
      solution:
        'Designed branded, responsive email templates for marketing, operations, and service updates. Integrated Mailchimp with Jobber CRM and Formstack to automate recurring campaigns. Created targeted audience segments based on service history, region, and purchase behavior. Managed content calendar and aligned messaging with seasonal promotions and weather patterns. Wrote concise, data-informed copy optimized for clarity, timing, and click-throughs.',
      results: 'Increased average email open rates to 45–60% and click-through rates to 15–30%, depending on campaign type. Automated over 80% of recurring customer communication workflows. Reduced inbound support calls during seasonal peaks by providing proactive updates. Improved customer satisfaction and retention through consistent, transparent messaging.',
      process: [
        'Discovery: Audited all existing communication channels and identified manual tasks that could be automated',
        'Planning: Outlined customer lifecycle stages and mapped communications to each phase',
        'Design: Created modular, reusable email templates with brand-aligned visuals and accessible layout',
        'Integration: Connected Mailchimp automations with CRM and form tools for data-driven targeting',
        'Launch: Deployed seasonal campaigns, tracking engagement through analytics dashboards',
        'Optimization: Refined content strategy based on performance data, A/B testing, and customer feedback',
      ],
      technologies: [
        'Mailchimp',
        'Jobber CRM',
        'Formstack',
        'Adobe Illustrator',
        'Adobe Photoshop',
        'Google Analytics',
      ],
      skills: [
        'Email Marketing',
        'CRM Integration',
        'Automation Design',
        'Copywriting',
        'Campaign Strategy',
        'Data Analysis',
      ],
    },
    createdAt: '2020-06-01',
    updatedAt: '2022-11-30',
    status: 'published',
  },
  {
    id: '8',
    title: 'DeckHand Pool Maintenance App',
    role: 'Founder · Product Designer · Field Operations Technologist',
    summary:
      'Conceptualized and prototyped DeckHand, a mobile app designed to streamline pool maintenance operations, digitize technician checklists, and centralize service data into a single, intuitive dashboard for teams in the field.',
    tags: ['mobile app', 'field service', 'SaaS prototype', 'workflow automation', 'UX design', 'pool maintenance', 'process optimization'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '8-1',
        url: '/images/placeholder.svg',
        alt: 'Mobile UI mockups',
        caption: 'DeckHand mobile app interface and technician dashboard',
        type: 'image' as const,
      },
      {
        id: '8-2',
        url: '/images/placeholder.svg',
        alt: 'Workflow diagrams',
        caption: 'Pool maintenance workflow and field service process maps',
        type: 'image' as const,
      },
      {
        id: '8-3',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'Mobile app performance metrics and efficiency improvements',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Field service technicians were using outdated paper logs and inconsistent communication methods. This caused reporting delays, lost data, and duplicated work between field and office teams. The challenge was to create a lightweight, scalable mobile solution that blended ease of use with real-time data accuracy.',
      solution:
        'Designed a mobile app prototype focused on rapid input and clear visual feedback. Created digital versions of weekly and biweekly service checklists with built-in chemical calculators. Implemented offline data storage for rural job sites, syncing automatically when online. Built an admin dashboard to monitor routes, technician progress, and customer notes. Connected output forms to email and customer portals for same-day reporting. Planned integration with Jobber CRM for future scheduling and billing sync.',
      results: 'Reduced average report completion time from 10 minutes to under 3 minutes per visit (prototype testing). Enabled near real-time visibility for managers tracking technician routes. Improved data consistency and eliminated lost paperwork. Provided foundation for potential SaaS platform targeting small-to-mid-sized service businesses.',
      process: [
        'Discovery: Documented current maintenance workflows and technician pain points',
        'Planning: Outlined MVP requirements focusing on speed, clarity, and offline-first reliability',
        'Design: Built UI/UX wireframes in Figma emphasizing one-hand usability and high contrast for outdoor visibility',
        'Development: Created a functional prototype using React Native, Firebase, and Node.js backend for testing',
        'Testing: Piloted app with select technicians to gather performance data and user feedback',
        'Iteration: Added chemical calculators, customer tagging, and simplified navigation based on field feedback',
      ],
      technologies: [
        'React Native',
        'Firebase',
        'Node.js',
        'Google Maps API',
        'Formstack (for report export)',
        'Jobber CRM (planned integration)',
      ],
      skills: [
        'Mobile App Design',
        'UX Research',
        'Workflow Automation',
        'Field Operations',
        'Product Development',
        'React Native',
        'Process Design',
      ],
    },
    createdAt: '2023-08-01',
    updatedAt: '2024-03-15',
    status: 'published',
  },
  {
    id: '9',
    title: 'MindForge: AI-Powered Process Mapping & Business Intelligence',
    role: 'Founder · Creative Technologist · Product Designer',
    summary:
      'Conceptualized and prototyped MindForge, an AI-powered SaaS platform designed to help businesses map workflows, identify inefficiencies, and visualize operational data through natural language and adaptive process intelligence.',
    tags: ['AI', 'SaaS', 'process mapping', 'workflow automation', 'business intelligence', 'data visualization', 'innovation'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '8-1',
        url: '/images/placeholder.svg',
        alt: 'Dashboard mockups',
        caption: 'MindForge dashboard interface and process mapping visualization',
        type: 'image' as const,
      },
      {
        id: '8-2',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'AI-powered process optimization and efficiency metrics',
        type: 'image' as const,
      },
      {
        id: '8-3',
        url: '/images/placeholder.svg',
        alt: 'AI workflow diagrams',
        caption: 'Conversational AI interface generating visual process maps',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Traditional business process documentation is slow, manual, and inaccessible to non-technical teams. Existing BPM (business process management) software is rigid and requires expert-level configuration. The challenge was to create a visual, AI-assisted system that lowers the barrier to process mapping and connects directly to operational metrics.',
      solution:
        'Designed a conversational UX that turns text prompts into visual process maps. Built early prototypes using React, Tailwind, and FastAPI for the web interface and logic layer. Integrated with local LLMs (LM Studio / Ollama) for offline analysis and real-time mapping suggestions. Created AI agents capable of recommending automation points and visualizing "before vs after" process performance. Developed modular components for displaying cost, time, and efficiency deltas via animated infographics.',
      results: 'Achieved functional prototype demonstrating text-to-process visualization. Generated automated flow diagrams from unstructured prompts with >80% accuracy. Tested integrations with Google Sheets and internal databases for proof of concept. Established foundational architecture for scaling MindForge into a full SaaS offering.',
      process: [
        'Discovery: Researched BPM tools and identified opportunity for conversational process mapping',
        'Planning: Defined MVP scope—text input → process visualization → optimization insights',
        'Design: Built wireframes and UI prototypes emphasizing clarity, motion, and modularity',
        'Development: Used React, Tailwind, and FastAPI to create the prototype; linked to local AI endpoints',
        'Testing: Ran scenario-based process descriptions to validate model understanding',
        'Iteration: Refined LLM prompts, process-node rendering, and user feedback systems',
      ],
      technologies: [
        'React',
        'Tailwind CSS',
        'FastAPI',
        'Python',
        'LM Studio',
        'OpenAI / Local LLMs (Ollama)',
        'Node.js',
        'D3.js (for visualization)',
      ],
      skills: [
        'AI Integration',
        'UX/UI Design',
        'Systems Thinking',
        'SaaS Development',
        'Workflow Automation',
        'Data Visualization',
        'Product Strategy',
      ],
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-12-01',
    status: 'published',
  },
  {
    id: '10',
    title: 'Paper to Digital: Formstack Integration',
    role: 'Creative Technologist · Process Designer · Systems Integrator',
    summary:
      'Beginning in 2017, led a multi-year migration from paper-based forms to a Formstack-powered digital system for HR, field service, and customer-facing workflows—cutting paperwork, reducing errors, and accelerating approvals.',
    tags: ['Formstack', 'digital transformation', 'e-signatures', 'workflow automation', 'field operations', 'HR onboarding'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '8-1',
        url: '/images/placeholder.svg',
        alt: 'Form templates',
        caption: 'Digital form templates and workflow designs',
        type: 'image' as const,
      },
      {
        id: '8-2',
        url: '/images/placeholder.svg',
        alt: 'Workflow diagrams',
        caption: 'Process flow diagrams and automation workflows',
        type: 'image' as const,
      },
      {
        id: '8-3',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'Digital transformation metrics and process improvements',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Paper forms slowed scheduling and approvals, created duplicate data entry, and introduced errors. Seasonal hiring magnified the burden each spring, and field techs couldn\'t easily submit clean, searchable data from job sites.',
      solution:
        'Built a scalable Formstack library for HR, field service, customer authorizations, and retail workflows. Implemented conditional logic, required fields, and validation to reduce errors at the source. Enabled e-signatures and mobile-friendly layouts for technicians and customers in the field. Connected Formstack to email, spreadsheets, and (later) Jobber to reduce manual re-entry. Created standardized PDF outputs and automated email confirmations for customers and managers. Documented SOPs and trained seasonal staff and office teams for consistent usage.',
      results: '~80% reduction in paper usage for targeted workflows. 50–70% faster turnaround on approvals (e.g., service authorizations, HR packets). Error rates on data entry dropped significantly (fewer incomplete/illegible submissions). 1,000+ digital submissions per peak season as adoption increased (approx.). Improved auditability and searchability with centralized, timestamped records.',
      process: [
        'Discovery: Audited all paper forms; identified bottlenecks and high-volume use cases',
        'Design: Created standardized templates with clear field names, validation, and conditional logic',
        'Build: Implemented Formstack forms with e-sign and mobile layouts; generated branded PDFs',
        'Integration: Routed submissions to inboxes, sheets, and—post-migration—into Jobber where applicable',
        'Training: Produced quick-reference guides and ran short workshops for office/field teams',
        'Optimization: Iterated each season based on submission analytics and feedback',
      ],
      technologies: [
        'Formstack (Forms, Documents)',
        'Email automations',
        'PDF generation',
        'Google Sheets/Drive',
        'Jobber (post-integration)',
        'Adobe Illustrator for branded assets',
      ],
      skills: [
        'Process Improvement',
        'Workflow Design',
        'Form UX',
        'Systems Integration',
        'Training & Documentation',
        'Change Management',
      ],
    },
    createdAt: '2017-03-01',
    updatedAt: '2022-06-15',
    status: 'published',
  },
  {
    id: '11',
    title: 'IVR Call Menu & Customer Experience Optimization',
    role: 'Creative Technologist · Process Designer · Customer Experience Strategist',
    summary:
      'Designed and implemented a new interactive voice response (IVR) system for Caribbean Pools to streamline customer service calls, route inquiries efficiently, and improve communication during peak seasonal demand.',
    tags: ['IVR system', 'customer experience', 'process design', 'automation', 'telephony integration', 'CX design'],
    type: 'case-study',
    featured: true,
    images: [
      {
        id: '8-1',
        url: '/images/placeholder.svg',
        alt: 'Call flow diagrams',
        caption: 'IVR call routing flow diagrams and customer journey mapping',
        type: 'image' as const,
      },
      {
        id: '8-2',
        url: '/images/placeholder.svg',
        alt: 'System dashboards',
        caption: 'Call analytics dashboard and performance monitoring interface',
        type: 'image' as const,
      },
      {
        id: '8-3',
        url: '/images/placeholder.svg',
        alt: 'Animated infographics',
        caption: 'Customer experience optimization metrics and process improvements',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Customer wait times during spring and summer peaks often exceeded 10 minutes, and many calls were misrouted. Staff spent significant time transferring calls between departments, resulting in dropped inquiries and inconsistent service.',
      solution:
        'Audited call logs and identified top customer request categories (service, retail, billing, new installs). Designed a multi-level IVR menu to route calls based on intent. Recorded professional voice prompts and scripts using Adobe Audition for clarity and tone consistency. Integrated IVR workflows with the company\'s Jobber CRM and voicemail management system. Implemented after-hours routing and seasonal call scripts for emergencies or store closures.',
      results: 'Reduced average call handling time by 35%. Increased first-contact resolution rates by 40%. Lowered dropped calls during peak hours by 60%. Freed up staff time for customer relationship building and sales.',
      process: [
        'Discovery: Reviewed seasonal call data and observed customer support patterns',
        'Planning: Outlined the call routing hierarchy and user experience flow',
        'Design: Wrote and recorded branded voice scripts with natural pacing and tone',
        'Implementation: Configured and tested menu system with routing to dedicated service and retail lines',
        'Training: Provided staff with updated procedures and troubleshooting documentation',
        'Optimization: Collected analytics from call reports and refined menu options based on feedback',
      ],
      technologies: [
        'Jobber CRM',
        'Spectrum VoIP / RingCentral IVR Systems',
        'Adobe Audition',
        'Formstack for message tracking',
      ],
      skills: [
        'Process Design',
        'Customer Experience (CX)',
        'Audio Production',
        'Workflow Optimization',
        'System Integration',
        'Data Analysis',
      ],
    },
    createdAt: '2021-09-15',
    updatedAt: '2022-08-20',
    status: 'published',
  },
  {
    id: '12',
    title: 'CRM Migration & Integration',
    role: 'Systems Architect • Migration Lead',
    summary:
      'Seamless CRM system migration with zero data loss. Improved team productivity by 45% through better workflows.',
    tags: ['Systems Architecture', 'Data Migration', 'CRM', 'Integration'],
    type: 'case-study',
    featured: false,
    images: [
      {
        id: '5-1',
        url: '/images/placeholder.svg',
        alt: 'CRM dashboard',
        caption: 'Modern CRM interface with custom workflows',
        type: 'image' as const,
      },
      {
        id: '5-2',
        url: '/images/placeholder.svg',
        alt: 'Integration architecture',
        caption: 'Connected systems providing unified data view',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'The company\'s legacy CRM system was outdated, slow, and lacked mobile support. Data was siloed across multiple systems, making it difficult to get a complete customer view. The team needed a modern solution without losing years of customer data and history.',
      solution:
        'Led a complete CRM migration project, carefully planning data mapping and validation. Implemented a modern cloud-based CRM with custom workflows tailored to the business. Created integrations with the e-commerce platform, print studio, and email marketing tools to provide a unified customer view.',
      results: 'Zero data loss during migration, 45% improvement in team productivity, 70% faster customer lookup times, 100% mobile accessibility, seamless integration with all business systems, improved reporting and analytics capabilities.',
      process: [
        'Assessment: Evaluated current system and defined requirements',
        'Selection: Researched and selected new CRM platform',
        'Planning: Created detailed migration plan and timeline',
        'Data Mapping: Designed data transformation and validation rules',
        'Testing: Performed multiple test migrations and validations',
        'Migration: Executed production migration during low-activity period',
        'Training: Conducted comprehensive team training sessions',
        'Optimization: Fine-tuned workflows and automations',
      ],
      technologies: [
        'Cloud CRM Platform',
        'Data Migration Tools',
        'API Integration',
        'Custom Webhooks',
        'Automated Testing',
      ],
      skills: [
        'Systems Architecture',
        'Data Migration Strategy',
        'Project Management',
        'Risk Management',
        'Integration Planning',
        'Data Validation & Quality',
        'Team Training',
        'Business Process Analysis',
        'Technical Documentation',
        'Vendor Evaluation',
      ],
    },
    createdAt: '2020-11-05',
    updatedAt: '2021-03-20',
    status: 'published',
  },
  {
    id: '13',
    title: 'Social Media Strategy & Automation',
    role: 'Digital Marketing Strategist',
    summary:
      'Grew social presence from 2K to 15K followers. Automated content pipeline, 300% engagement increase.',
    tags: ['Social Media', 'Content Strategy', 'Automation', 'Marketing'],
    type: 'case-study',
    featured: false,
    images: [
      {
        id: '6-1',
        url: '/images/placeholder.svg',
        alt: 'Social media analytics dashboard',
        caption: 'Growth metrics across Facebook, Instagram, and YouTube',
        type: 'image' as const,
      },
      {
        id: '6-2',
        url: '/images/placeholder.svg',
        alt: 'Content calendar',
        caption: 'Organized content pipeline with automated scheduling',
        type: 'image' as const,
      },
    ],
    content: {
      challenge:
        'Caribbean Pools had minimal social media presence despite operating in a highly visual industry. Content creation was inconsistent, posting was irregular, and there was no strategy for audience engagement. The marketing team was stretched thin and couldn\'t maintain regular social media activity.',
      solution:
        'Developed a comprehensive social media strategy focusing on visual storytelling and customer success stories. Created a content pipeline that repurposed project photos, customer testimonials, and behind-the-scenes content. Implemented automation tools for scheduling and cross-platform posting while maintaining authentic engagement.',
      results: 'Grew from 2,000 to 15,000+ followers across platforms, 300% increase in engagement rate, consistent posting schedule (5+ posts per week), generated significant inbound leads through social channels, reduced content creation time by 60% through automation.',
      process: [
        'Audit: Analyzed current social presence and competitor strategies',
        'Strategy: Developed content pillars and posting schedule',
        'Content System: Created templates and workflows for content creation',
        'Automation: Implemented scheduling and cross-posting tools',
        'Engagement: Developed community management protocols',
        'Analytics: Set up tracking and reporting dashboards',
        'Optimization: Refined strategy based on performance data',
      ],
      technologies: [
        'Facebook',
        'Instagram',
        'YouTube',
        'Hootsuite',
        'Canva',
        'Adobe Creative Suite',
        'Analytics Tools',
      ],
      skills: [
        'Social Media Strategy',
        'Content Creation & Curation',
        'Community Management',
        'Visual Storytelling',
        'Marketing Automation',
        'Analytics & Reporting',
        'Brand Development',
        'Copywriting',
        'Campaign Planning',
        'Audience Growth',
      ],
    },
    createdAt: '2021-04-12',
    updatedAt: '2023-09-30',
    status: 'published',
  },
];

export const mockApi = {
  async getProjects(): Promise<Project[]> {
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
      uploadedAt: new Date().toISOString(),
    };

    return { success: true, file: mockFile };
  },

  async saveProject(projectData: any) {
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Project saved:', projectData);
    return { success: true, id: projectData.id };
  },
};
