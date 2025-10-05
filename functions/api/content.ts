/**
 * DEPRECATED: Legacy Content API
 *
 * This endpoint is deprecated and maintained for backwards compatibility only.
 * Please use the new content endpoints instead:
 * - GET  /api/content/home      - Home page content
 * - GET  /api/content/about     - About page content
 * - GET  /api/content/contact   - Contact page content
 * - GET  /api/content/settings  - Global settings
 * - PATCH /api/content/{type}   - Update content
 * - POST  /api/content/publish  - Publish draft content
 *
 * This endpoint will be removed in a future version.
 */

export const onRequestGet: PagesFunction = async context => {
  const { request } = context;
  const url = new URL(request.url);
  const contentType = url.searchParams.get('type') || 'all';

  console.warn(
    '[DEPRECATED] Using legacy /api/content endpoint. Please migrate to /api/content/{type}'
  );
  try {
    // In a real implementation, you'd fetch from a database
    // For now, we'll use a simple JSON structure
    const content = {
      projects: [
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
              type: 'image',
            },
            {
              id: '2',
              url: '/images/placeholder.svg',
              alt: 'Vehicle wrap process',
              caption: 'Large format vehicle wrap installation',
              type: 'image',
            },
          ],
          content: {
            challenge: 'Needed to establish an in-house print studio to reduce outsourcing costs and improve turnaround times.',
            solution: 'Designed and implemented a complete print workflow using HP Latex 315, including training protocols for seasonal staff.',
            results: 'Reduced print costs by 40% and improved delivery times by 60%.',
            process: [
              'Research and equipment selection',
              'Workflow design and optimization',
              'Staff training and documentation',
              'Quality control implementation',
            ],
            technologies: [
              'HP Latex 315',
              'Adobe Creative Suite',
              'RIP Software',
              'Large Format Printing',
            ],
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15',
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
      ],
      about: {
        bio: 'Creative technologist with 8+ years building digital experiences that bridge design and development.',
        skills: ['UI/UX Design', 'Frontend Development', 'Product Strategy', 'Team Leadership'],
        experience: [
          {
            company: 'Caribbean Pools',
            role: 'Creative Director',
            period: '2020 - Present',
            description: 'Leading design and development initiatives across digital and print media.'
          },
          {
            company: 'Freelance',
            role: 'Designer & Developer',
            period: '2018 - 2020',
            description: 'Working with startups and agencies on web and mobile projects.'
          }
        ]
      }
    };

    let responseData;
    if (contentType === 'all') {
      responseData = content;
    } else if (contentType === 'projects') {
      responseData = content.projects;
    } else if (contentType === 'about') {
      responseData = content.about;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(responseData), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost: PagesFunction = async (context) => {
  const { request } = context;

  console.warn('[DEPRECATED] Using legacy /api/content POST endpoint. Please migrate to PATCH /api/content/{type}');

  try {
    const body = await request.json();
    const { type, data } = body;

    // In a real implementation, you'd save to a database
    // For now, we'll just return success
    console.log('Content update:', { type, data });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Content updated successfully',
      id: Date.now().toString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
