-- Migration: 001_initial_schema.sql
-- Description: Initial database schema setup
-- Created: 2024-12-19

-- This migration creates the initial database schema
-- Run this first when setting up a new Neon database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    provider VARCHAR(50), -- 'google', 'github', 'local'
    provider_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255),
    summary TEXT,
    description TEXT,
    content JSONB, -- Flexible content structure
    tags TEXT[],
    type VARCHAR(50) DEFAULT 'case-study' CHECK (type IN ('case-study', 'project', 'experiment')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media files table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    type VARCHAR(50) DEFAULT 'image' CHECK (type IN ('image', 'video', 'document', 'audio')),
    cloudflare_id VARCHAR(255), -- For Cloudflare Stream/Images
    metadata JSONB, -- Additional file metadata
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project media relationships (many-to-many)
CREATE TABLE project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, media_id)
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content sections (for dynamic content management)
CREATE TABLE content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    section_key VARCHAR(100) NOT NULL, -- 'about', 'contact', 'hero', etc.
    title VARCHAR(255),
    content JSONB NOT NULL,
    is_published BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section_key)
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'design', 'development', 'tools', etc.
    proficiency INTEGER DEFAULT 1 CHECK (proficiency >= 1 AND proficiency <= 5),
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- API keys for external services
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service VARCHAR(50) NOT NULL, -- 'cloudflare', 'google', 'github', etc.
    key_name VARCHAR(100) NOT NULL,
    encrypted_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service, key_name)
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_published_at ON projects(published_at);
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_project_id ON media(project_id);
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_content_sections_user_key ON content_sections(user_id, section_key);
CREATE INDEX idx_skills_user_id ON skills(user_id);

-- Full-text search indexes
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || summary || ' ' || description));
CREATE INDEX idx_media_search ON media USING gin(to_tsvector('english', filename || ' ' || alt_text || ' ' || caption));

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
