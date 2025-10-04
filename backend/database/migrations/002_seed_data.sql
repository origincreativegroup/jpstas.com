-- Migration: 002_seed_data.sql
-- Description: Seed initial data for portfolio
-- Created: 2024-12-19

-- Insert default admin user (password: 'admin123' - change in production!)
INSERT INTO users (id, email, password_hash, name, role, provider, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@jpstas.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'JP Stas', 'admin', 'local', true);

-- Insert sample projects
INSERT INTO projects (id, user_id, title, slug, role, summary, description, content, tags, type, status, featured, order_index, published_at) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'In‑House Print Studio Build',
    'print-studio-build',
    'Designer • Ops Lead',
    'HP Latex 315 print workflow, vehicle wraps, apparel—training seasonal staff and saving costs.',
    'Established an in-house print studio to reduce outsourcing costs and improve turnaround times.',
    '{"challenge": "Needed to establish an in-house print studio to reduce outsourcing costs and improve turnaround times.", "solution": "Designed and implemented a complete print workflow using HP Latex 315, including training protocols for seasonal staff.", "results": "Reduced print costs by 40% and improved delivery times by 60%.", "process": ["Research and equipment selection", "Workflow design and optimization", "Staff training and documentation", "Quality control implementation"], "technologies": ["HP Latex 315", "Adobe Creative Suite", "RIP Software", "Large Format Printing"]}',
    ARRAY['Design', 'Ops', 'Large Format'],
    'case-study',
    'published',
    true,
    1,
    NOW()
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'shop.caribbeanpools.com',
    'caribbean-pools-ecommerce',
    'Designer • Developer',
    'Retail extension site enabling early-buys; >$100k net in first year.',
    'Built a custom e-commerce platform with streamlined checkout and mobile-first design.',
    '{"challenge": "Caribbean Pools needed a digital presence to capture early-buy customers before peak season.", "solution": "Built a custom e-commerce platform with streamlined checkout and mobile-first design.", "results": "Generated over $100k in net revenue in the first year with 85% mobile traffic.", "process": ["User research and competitive analysis", "Wireframing and prototyping", "Frontend development with React", "Backend integration and testing", "Launch and performance optimization"], "technologies": ["React", "Node.js", "Stripe", "MongoDB", "AWS"]}',
    ARRAY['Web', 'E‑commerce'],
    'case-study',
    'published',
    true,
    2,
    NOW()
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'PortfolioForge (Prototype)',
    'portfolioforge-prototype',
    'Founder • Product',
    'AI-assisted narrative builder for creatives; block-based editor concept.',
    'Developed an AI-powered platform that helps creatives build structured portfolio narratives using drag-and-drop blocks.',
    '{"challenge": "Creative professionals struggle to present their work in compelling narratives that resonate with clients.", "solution": "Developed an AI-powered platform that helps creatives build structured portfolio narratives using drag-and-drop blocks.", "results": "Prototype achieved 70% user engagement rate in beta testing with 50+ creative professionals.", "process": ["Market research and user interviews", "AI model training for content suggestions", "Block-based editor development", "User testing and iteration", "Beta launch and feedback collection"], "technologies": ["React", "TypeScript", "OpenAI API", "Framer Motion", "Supabase"]}',
    ARRAY['SaaS', 'AI', 'Design'],
    'case-study',
    'published',
    false,
    3,
    NOW()
);

-- Insert content sections
INSERT INTO content_sections (user_id, section_key, title, content, is_published) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'about',
    'About',
    '{"bio": "Creative technologist with 8+ years building digital experiences that bridge design and development.", "skills": ["UI/UX Design", "Frontend Development", "Product Strategy", "Team Leadership"], "experience": [{"company": "Caribbean Pools", "role": "Creative Director", "period": "2020 - Present", "description": "Leading design and development initiatives across digital and print media."}, {"company": "Freelance", "role": "Designer & Developer", "period": "2018 - 2020", "description": "Working with startups and agencies on web and mobile projects."}]}',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'hero',
    'Hero Section',
    '{"title": "Creative Technologist", "subtitle": "Building digital experiences that bridge design and development", "cta_text": "Explore My Work", "cta_link": "/workshop"}',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'contact',
    'Contact',
    '{"email": "hello@jpstas.com", "social": {"linkedin": "https://linkedin.com/in/jpstas", "github": "https://github.com/jpstas", "twitter": "https://twitter.com/jpstas"}, "message": "Lets build something amazing together."}',
    true
);

-- Insert skills
INSERT INTO skills (user_id, name, category, proficiency, order_index, is_featured) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'UI/UX Design', 'design', 5, 1, true),
('550e8400-e29b-41d4-a716-446655440000', 'React Development', 'development', 5, 2, true),
('550e8400-e29b-41d4-a716-446655440000', 'TypeScript', 'development', 4, 3, true),
('550e8400-e29b-41d4-a716-446655440000', 'Node.js', 'development', 4, 4, true),
('550e8400-e29b-41d4-a716-446655440000', 'Product Strategy', 'strategy', 4, 5, true),
('550e8400-e29b-41d4-a716-446655440000', 'Team Leadership', 'leadership', 4, 6, true),
('550e8400-e29b-41d4-a716-446655440000', 'Adobe Creative Suite', 'tools', 5, 7, false),
('550e8400-e29b-41d4-a716-446655440000', 'Figma', 'tools', 5, 8, false),
('550e8400-e29b-41d4-a716-446655440000', 'PostgreSQL', 'development', 3, 9, false),
('550e8400-e29b-41d4-a716-446655440000', 'AWS', 'infrastructure', 3, 10, false);