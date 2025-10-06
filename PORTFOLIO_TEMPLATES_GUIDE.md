# 🎨 Portfolio Template System - Complete Guide

## Overview

This guide explains the comprehensive portfolio template system that enables you to create stunning case studies and projects using pre-designed templates or custom layouts.

## ✨ Features

### 1. **Template Library**
- **6 Pre-built Templates**: Professional templates for various use cases
- **Custom Templates**: Create and save your own reusable templates
- **Template Categories**: case-study, project-showcase, experiment, blog-post, landing-page

### 2. **Admin Dashboard**
- **Unified Interface**: Manage projects, templates, media, and content in one place
- **Visual Project Editor**: Drag-and-drop section management
- **Real-time Preview**: See changes as you make them
- **Publishing Workflow**: Draft → Review → Publish

### 3. **Global Media Manager**
- **Breadcrumb Tracking**: See which projects use each media file
- **Project Associations**: Files show all projects they're linked to
- **Usage Statistics**: Track usage count and last used date
- **Cross-project Access**: Upload once, use everywhere

### 4. **Flexible Section Types**
15 section types to build any portfolio layout:
- **hero**: Full-screen hero sections
- **text**: Rich text content
- **image**: Single image displays
- **video**: Video showcases
- **gallery**: Image galleries
- **grid**: Custom grid layouts
- **split**: Split-screen layouts
- **stats**: Statistics/metrics display
- **testimonial**: Client testimonials
- **cta**: Call-to-action sections
- **timeline**: Project timelines
- **process**: Process/workflow steps
- **features**: Feature highlights
- **code**: Code snippets
- **quote**: Blockquotes

## 🚀 Getting Started

### Access the Admin Dashboard

1. **Navigate to Admin**:
   ```
   /admin/dashboard
   ```

2. **Dashboard Views**:
   - **Dashboard**: Overview and quick actions
   - **Projects**: Manage all portfolio projects
   - **Templates**: Browse and manage templates
   - **Media Library**: Manage media with breadcrumbs
   - **Page Content**: Edit homepage, about, contact
   - **Settings**: Configure site settings

### Create a New Project

1. **Click "New Project"** in the Projects view
2. **Enter Project Details**:
   - Title: Your project name
   - Slug: URL-friendly identifier
3. **Choose a Template** from the gallery
4. **Edit Sections** in the project editor
5. **Save Draft** or **Publish** when ready

## 📋 Available Templates

### 1. Detailed Case Study
**Best for**: Complete project case studies with full detail

**Sections**:
- Hero Section
- Project Overview
- The Challenge
- The Solution
- Design Process
- Visual Showcase
- Results & Impact
- Next Project CTA

**Use when**: You want to tell the complete story of a project with challenges, solutions, and measurable results.

---

### 2. Minimal Project
**Best for**: Clean, simple project showcases

**Sections**:
- Project Hero
- Description
- Project Gallery
- Project Info

**Use when**: You want a clean, image-focused presentation without extensive text.

---

### 3. Visual Portfolio
**Best for**: Image-heavy portfolios with minimal text

**Sections**:
- Hero Image
- Introduction
- Image Grid 1
- Video Showcase
- Image Grid 2

**Use when**: Your work speaks for itself through visuals.

---

### 4. Experiment Log
**Best for**: Documenting experiments and explorations

**Sections**:
- Experiment Title
- Hypothesis
- Method
- Results
- Code Snippet
- Conclusion

**Use when**: Sharing technical experiments, research, or exploration projects.

---

### 5. Feature Focused
**Best for**: Highlighting product features

**Sections**:
- Product Hero
- Overview
- Key Features
- Demo Video
- User Feedback
- Try It Out CTA

**Use when**: Showcasing a product or service with specific features to highlight.

---

### 6. Timeline Story
**Best for**: Chronological project narratives

**Sections**:
- Story Hero
- Introduction
- Project Timeline
- Visual Journey
- Final Outcome

**Use when**: You want to tell your project story chronologically.

## 🎯 Using the Project Editor

### Section Management

**Drag to Reorder**:
- Click and drag the handle icon (☰) to reorder sections

**Edit Section**:
1. Click on a section in the left sidebar
2. Edit title, layout, content, and media
3. Changes save automatically

**Duplicate Section**:
- Click the duplicate icon to create a copy

**Delete Section**:
- Click the delete icon (confirm when prompted)

### Adding Media

1. **Click "Add Media"** in any section
2. **Select from Library** or upload new files
3. **Media appears** in section preview
4. **Global tracking**: File is automatically tracked in media manager with breadcrumb to this project

### Layout Options

Each section supports multiple layouts:
- **default**: Standard container layout
- **full-width**: Edge-to-edge layout
- **contained**: Centered with max-width
- **split-left**: Content on left, media on right
- **split-right**: Media on left, content on right

### Content Editing

Sections include a JSON editor for content:
```json
{
  "heading": "Your Heading",
  "body": "Your content here",
  "buttonText": "Call to Action",
  "buttonLink": "/link"
}
```

## 📸 Global Media Manager

### Key Features

**Breadcrumb Tracking** ✨:
- Each media file shows which projects it's used in
- Visual breadcrumb chips with project names
- Click to navigate directly to project
- See usage count and last used date

**Project Associations**:
- Files automatically track when added to projects
- Many-to-many relationships (one file, many projects)
- Real-time updates across all views

**Upload Behavior**:
- Upload to a specific project → tracked globally
- Upload to media library → available to all projects
- All uploads appear in global media manager

### Viewing Media Usage

In the Media Library view:
```
[Image Thumbnail]
filename.jpg

Used in:
[Project A] [Project B] [Project C]

Used 5 times • Last used: Jan 15, 2025
```

## 🔧 Advanced Features

### Create Custom Templates

1. **Build a project** with your desired structure
2. **Click "Save as Template"** in project editor
3. **Name your template** and add description
4. **Choose category** (case-study, project, etc.)
5. **Template appears** in gallery for future projects

### Template Settings

Each template can define default settings:

```typescript
{
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter"
  },
  colors: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#ec4899"
  }
}
```

### Section Content Types

Different section types expect different content structures:

**Hero**:
```json
{
  "heading": "Main Heading",
  "subheading": "Subheading text",
  "buttonText": "CTA Button",
  "buttonLink": "#"
}
```

**Gallery**:
```json
{
  "columns": 3,
  "gap": 20,
  "images": []  // Media files added separately
}
```

**Stats**:
```json
{
  "items": [
    { "label": "Users", "value": "10k", "suffix": "+" },
    { "label": "Growth", "value": "250", "suffix": "%" }
  ]
}
```

## 🔄 Publishing Workflow

### Draft Status
- Projects start as drafts
- Not visible on public site
- Can be edited freely
- Auto-saves changes

### Publishing
1. **Complete your project** sections
2. **Review content** and media
3. **Click "Publish"**
4. **Project goes live** on your portfolio
5. **URL accessible** at `/portfolio/{slug}`

### Updating Published Projects
- Edit published projects anytime
- Changes save to draft first
- Click "Update" to publish changes
- Version history maintained

## 📊 Backend API

### Template Endpoints

```bash
# Get all templates
GET /api/templates

# Get single template
GET /api/templates/:id

# Create custom template (authenticated)
POST /api/templates

# Update template (authenticated)
PATCH /api/templates/:id

# Delete template (authenticated)
DELETE /api/templates/:id

# Track template usage
POST /api/templates/:id/use
```

### Project Endpoints

```bash
# Get all projects
GET /api/projects

# Get single project
GET /api/projects/:id

# Create project
POST /api/projects

# Update project
PATCH /api/projects/:id

# Delete project
DELETE /api/projects/:id

# Get project media associations
GET /api/projects/:id/media
```

### Media with Breadcrumbs

```bash
# Get all media (includes project associations)
GET /api/media

# Returns:
{
  "media": [
    {
      "id": "uuid",
      "name": "image.jpg",
      "url": "/uploads/image.jpg",
      "projects": [
        {
          "id": "project-uuid",
          "title": "Project Title",
          "slug": "project-slug"
        }
      ],
      "usage": {
        "projectIds": ["uuid1", "uuid2"],
        "useCount": 5,
        "lastUsed": "2025-01-15T10:00:00Z"
      }
    }
  ]
}
```

## 🗄️ Database Schema

### Templates Table
```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    thumbnail TEXT,
    sections JSONB NOT NULL,
    default_settings JSONB DEFAULT '{}',
    is_custom BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Project-Media Relationships
```sql
CREATE TABLE project_media (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    media_id UUID REFERENCES media(id),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, media_id)
);
```

## 💡 Best Practices

### Template Selection
- **Case Study**: Use "Detailed Case Study" for client work
- **Personal Projects**: Use "Minimal Project" or "Visual Portfolio"
- **Experiments**: Use "Experiment Log" for technical explorations
- **Products**: Use "Feature Focused" for SaaS or products

### Media Organization
- Use descriptive filenames
- Add alt text for accessibility
- Organize with tags and collections
- Upload at appropriate resolution (1920px wide max)

### Content Structure
- Keep section titles clear and concise
- Use consistent heading hierarchy
- Break long content into multiple sections
- Add visual breaks with images/videos

### SEO Optimization
- Fill in project SEO fields
- Use descriptive slugs
- Add meta descriptions
- Include relevant tags

## 🎨 Customization

### Styling Sections

Each section supports:
- **Background**: Color, gradient, image, or video
- **Padding**: Top and bottom spacing
- **Layout**: Various layout options
- **Settings**: Section-specific configurations

Example background configuration:
```typescript
{
  type: 'gradient',
  value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  opacity: 0.9
}
```

### Creating Section Types

To add a new section type:

1. **Add to types** (`src/types/template.ts`):
```typescript
export type SectionType = 
  | 'your-new-type'
  | ...existing types;
```

2. **Add default content** (`src/services/templateService.ts`):
```typescript
'your-new-type': {
  // Default structure
}
```

3. **Create renderer** component
4. **Update ProjectEditor** to handle new type

## 🚨 Important Notes

### Media Breadcrumb Tracking

**Critical Feature**: When you upload a file to a project, it MUST appear in the global media manager with breadcrumbs showing which project(s) use it.

This is accomplished through:
1. **project_media junction table**: Tracks many-to-many relationships
2. **Media API**: Returns project associations with each file
3. **MediaBreadcrumbs component**: Displays usage in UI
4. **Real-time updates**: Associations update immediately

### File Upload Flow

```
1. User uploads file in ProjectEditor
   ↓
2. File saved to /uploads directory
   ↓
3. Record created in media table
   ↓
4. Association created in project_media table
   ↓
5. MediaContext refreshes global state
   ↓
6. Media Manager shows file with breadcrumb
```

## 📚 Additional Resources

### Component Files
- `src/pages/AdminDashboard.tsx` - Main admin interface
- `src/components/ProjectEditor.tsx` - Project editing interface
- `src/components/TemplateGallery.tsx` - Template selection
- `src/components/MediaBreadcrumbs.tsx` - Media usage tracking
- `src/services/templateService.ts` - Template management logic

### Type Definitions
- `src/types/template.ts` - Template and project types
- `src/types/media.ts` - Media types with breadcrumb support

### Backend Routes
- `backend/src/routes/templates.js` - Template CRUD operations
- `backend/src/routes/media.js` - Media with project associations
- `backend/src/routes/projects.js` - Project management

## 🎉 Summary

You now have a complete portfolio template system with:

✅ **6 professional templates** ready to use
✅ **Custom template creation** for unique needs
✅ **Comprehensive admin dashboard** for all management tasks
✅ **Project editor** with drag-and-drop sections
✅ **Global media manager** with breadcrumb tracking
✅ **Publishing workflow** from draft to live
✅ **Backend API** with full CRUD operations
✅ **Database schema** optimized for performance

**Start building amazing portfolio projects today!** 🚀

---

*For questions or issues, please refer to the main README or open an issue on GitHub.*

