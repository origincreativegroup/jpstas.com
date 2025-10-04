#!/usr/bin/env node

/**
 * Data Migration Script
 * Migrates data from the legacy Cloudflare Pages Functions to the new Neon database
 */

import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Legacy data structure (from the old API)
const legacyData = {
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

async function migrateData() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get the admin user ID
    const adminResult = await client.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );
    
    if (adminResult.rows.length === 0) {
      throw new Error('Admin user not found. Please run the seed migration first.');
    }
    
    const adminUserId = adminResult.rows[0].id;
    console.log('📋 Using admin user ID:', adminUserId);

    // Migrate projects
    console.log('🔄 Migrating projects...');
    for (const legacyProject of legacyData.projects) {
      const slug = legacyProject.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const projectResult = await client.query(
        `INSERT INTO projects (
          user_id, title, slug, role, summary, description, content, tags, 
          type, status, featured, order_index, published_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          role = EXCLUDED.role,
          summary = EXCLUDED.summary,
          description = EXCLUDED.description,
          content = EXCLUDED.content,
          tags = EXCLUDED.tags,
          type = EXCLUDED.type,
          featured = EXCLUDED.featured,
          updated_at = NOW()
        RETURNING id`,
        [
          adminUserId,
          legacyProject.title,
          slug,
          legacyProject.role,
          legacyProject.summary,
          legacyProject.summary, // Use summary as description
          JSON.stringify(legacyProject.content),
          legacyProject.tags,
          legacyProject.type,
          'published',
          legacyProject.featured,
          parseInt(legacyProject.id),
          legacyProject.createdAt,
          legacyProject.createdAt,
          legacyProject.updatedAt
        ]
      );

      const projectId = projectResult.rows[0].id;
      console.log(`  ✅ Migrated project: ${legacyProject.title} (ID: ${projectId})`);

      // Migrate project images
      if (legacyProject.images && legacyProject.images.length > 0) {
        for (let i = 0; i < legacyProject.images.length; i++) {
          const image = legacyProject.images[i];
          
          const mediaResult = await client.query(
            `INSERT INTO media (
              user_id, project_id, filename, original_filename, file_path, file_url,
              file_size, mime_type, alt_text, caption, type, is_public, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
            RETURNING id`,
            [
              adminUserId,
              projectId,
              path.basename(image.url),
              path.basename(image.url),
              image.url,
              image.url,
              0, // Unknown file size
              'image/svg+xml', // Assuming SVG for placeholder
              image.alt,
              image.caption,
              'image',
              true,
            ]
          );

          const mediaId = mediaResult.rows[0].id;

          // Associate media with project
          await client.query(
            `INSERT INTO project_media (project_id, media_id, order_index)
             VALUES ($1, $2, $3)
             ON CONFLICT (project_id, media_id) DO UPDATE SET order_index = EXCLUDED.order_index`,
            [projectId, mediaId, i]
          );

          console.log(`    📷 Migrated image: ${image.alt}`);
        }
      }
    }

    // Migrate content sections
    console.log('🔄 Migrating content sections...');
    
    // About section
    await client.query(
      `INSERT INTO content_sections (user_id, section_key, title, content, is_published)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, section_key) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         is_published = EXCLUDED.is_published,
         updated_at = NOW()`,
      [
        adminUserId,
        'about',
        'About',
        JSON.stringify(legacyData.about),
        true
      ]
    );
    console.log('  ✅ Migrated about section');

    // Hero section
    const heroContent = {
      title: 'Creative Technologist',
      subtitle: 'Building digital experiences that bridge design and development',
      cta_text: 'Explore My Work',
      cta_link: '/workshop'
    };

    await client.query(
      `INSERT INTO content_sections (user_id, section_key, title, content, is_published)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, section_key) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         is_published = EXCLUDED.is_published,
         updated_at = NOW()`,
      [
        adminUserId,
        'hero',
        'Hero Section',
        JSON.stringify(heroContent),
        true
      ]
    );
    console.log('  ✅ Migrated hero section');

    // Contact section
    const contactContent = {
      email: 'hello@jpstas.com',
      social: {
        linkedin: 'https://linkedin.com/in/jpstas',
        github: 'https://github.com/jpstas',
        twitter: 'https://twitter.com/jpstas'
      },
      message: "Let's build something amazing together."
    };

    await client.query(
      `INSERT INTO content_sections (user_id, section_key, title, content, is_published)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, section_key) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         is_published = EXCLUDED.is_published,
         updated_at = NOW()`,
      [
        adminUserId,
        'contact',
        'Contact',
        JSON.stringify(contactContent),
        true
      ]
    );
    console.log('  ✅ Migrated contact section');

    // Migrate skills
    console.log('🔄 Migrating skills...');
    const skillsData = [
      { name: 'UI/UX Design', category: 'design', proficiency: 5, is_featured: true },
      { name: 'Frontend Development', category: 'development', proficiency: 5, is_featured: true },
      { name: 'Product Strategy', category: 'strategy', proficiency: 4, is_featured: true },
      { name: 'Team Leadership', category: 'leadership', proficiency: 4, is_featured: true },
      { name: 'React', category: 'development', proficiency: 5, is_featured: false },
      { name: 'TypeScript', category: 'development', proficiency: 4, is_featured: false },
      { name: 'Node.js', category: 'development', proficiency: 4, is_featured: false },
      { name: 'Adobe Creative Suite', category: 'tools', proficiency: 5, is_featured: false },
      { name: 'Figma', category: 'tools', proficiency: 5, is_featured: false },
      { name: 'PostgreSQL', category: 'development', proficiency: 3, is_featured: false },
      { name: 'AWS', category: 'infrastructure', proficiency: 3, is_featured: false }
    ];

    for (let i = 0; i < skillsData.length; i++) {
      const skill = skillsData[i];
      await client.query(
        `INSERT INTO skills (user_id, name, category, proficiency, order_index, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, name) DO UPDATE SET
           category = EXCLUDED.category,
           proficiency = EXCLUDED.proficiency,
           order_index = EXCLUDED.order_index,
           is_featured = EXCLUDED.is_featured,
           updated_at = NOW()`,
        [
          adminUserId,
          skill.name,
          skill.category,
          skill.proficiency,
          i,
          skill.is_featured
        ]
      );
      console.log(`  ✅ Migrated skill: ${skill.name}`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migrated:`);
    console.log(`  - ${legacyData.projects.length} projects`);
    console.log(`  - ${legacyData.projects.reduce((acc, p) => acc + (p.images?.length || 0), 0)} images`);
    console.log(`  - 3 content sections`);
    console.log(`  - ${skillsData.length} skills`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData };
