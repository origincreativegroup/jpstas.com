-- Add Templates Table
-- This migration adds support for portfolio templates

-- Templates table for reusable project templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('case-study', 'project-showcase', 'experiment', 'blog-post', 'landing-page')),
    thumbnail TEXT,
    sections JSONB NOT NULL,
    default_settings JSONB DEFAULT '{}',
    is_custom BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

-- Add trigger for updated_at
CREATE TRIGGER update_templates_updated_at 
BEFORE UPDATE ON templates 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO templates (name, description, category, sections, is_public, is_custom) VALUES
(
    'Detailed Case Study',
    'Complete case study with challenge, solution, and results',
    'case-study',
    '[
        {"id": "hero", "type": "hero", "title": "Hero Section", "layout": "full-width", "order": 0},
        {"id": "overview", "type": "text", "title": "Project Overview", "layout": "contained", "order": 1},
        {"id": "challenge", "type": "split", "title": "The Challenge", "layout": "split-left", "order": 2},
        {"id": "solution", "type": "text", "title": "The Solution", "layout": "contained", "order": 3},
        {"id": "process", "type": "process", "title": "Design Process", "layout": "contained", "order": 4},
        {"id": "visuals", "type": "gallery", "title": "Visual Showcase", "layout": "full-width", "order": 5},
        {"id": "results", "type": "stats", "title": "Results & Impact", "layout": "contained", "order": 6},
        {"id": "cta", "type": "cta", "title": "Next Project", "layout": "full-width", "order": 7}
    ]'::jsonb,
    true,
    false
),
(
    'Minimal Project',
    'Clean and simple project showcase',
    'project-showcase',
    '[
        {"id": "hero", "type": "hero", "title": "Project Hero", "layout": "full-width", "order": 0},
        {"id": "description", "type": "text", "title": "Description", "layout": "contained", "order": 1},
        {"id": "gallery", "type": "gallery", "title": "Project Gallery", "layout": "full-width", "order": 2},
        {"id": "info", "type": "split", "title": "Project Info", "layout": "split-right", "order": 3}
    ]'::jsonb,
    true,
    false
),
(
    'Visual Portfolio',
    'Image-heavy portfolio with minimal text',
    'project-showcase',
    '[
        {"id": "hero-image", "type": "image", "title": "Hero Image", "layout": "full-width", "order": 0},
        {"id": "intro", "type": "text", "title": "Introduction", "layout": "contained", "order": 1},
        {"id": "grid-1", "type": "grid", "title": "Image Grid 1", "layout": "full-width", "order": 2},
        {"id": "video", "type": "video", "title": "Video Showcase", "layout": "full-width", "order": 3},
        {"id": "grid-2", "type": "grid", "title": "Image Grid 2", "layout": "full-width", "order": 4}
    ]'::jsonb,
    true,
    false
),
(
    'Experiment Log',
    'Document experiments and explorations',
    'experiment',
    '[
        {"id": "title", "type": "hero", "title": "Experiment Title", "layout": "contained", "order": 0},
        {"id": "hypothesis", "type": "text", "title": "Hypothesis", "layout": "contained", "order": 1},
        {"id": "method", "type": "text", "title": "Method", "layout": "contained", "order": 2},
        {"id": "results", "type": "split", "title": "Results", "layout": "split-left", "order": 3},
        {"id": "code", "type": "code", "title": "Code Snippet", "layout": "contained", "order": 4},
        {"id": "conclusion", "type": "text", "title": "Conclusion", "layout": "contained", "order": 5}
    ]'::jsonb,
    true,
    false
),
(
    'Feature Focused',
    'Highlight key features and functionality',
    'project-showcase',
    '[
        {"id": "hero", "type": "hero", "title": "Product Hero", "layout": "full-width", "order": 0},
        {"id": "overview", "type": "text", "title": "Overview", "layout": "contained", "order": 1},
        {"id": "features", "type": "features", "title": "Key Features", "layout": "contained", "order": 2},
        {"id": "demo", "type": "video", "title": "Demo Video", "layout": "full-width", "order": 3},
        {"id": "testimonial", "type": "testimonial", "title": "User Feedback", "layout": "contained", "order": 4},
        {"id": "cta", "type": "cta", "title": "Try It Out", "layout": "full-width", "order": 5}
    ]'::jsonb,
    true,
    false
),
(
    'Timeline Story',
    'Tell your project story chronologically',
    'case-study',
    '[
        {"id": "hero", "type": "hero", "title": "Story Hero", "layout": "full-width", "order": 0},
        {"id": "intro", "type": "text", "title": "Introduction", "layout": "contained", "order": 1},
        {"id": "timeline", "type": "timeline", "title": "Project Timeline", "layout": "contained", "order": 2},
        {"id": "gallery", "type": "gallery", "title": "Visual Journey", "layout": "full-width", "order": 3},
        {"id": "outcome", "type": "stats", "title": "Final Outcome", "layout": "contained", "order": 4}
    ]'::jsonb,
    true,
    false
);

