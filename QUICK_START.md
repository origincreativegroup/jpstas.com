# 🚀 Quick Start Guide - Portfolio Template System

Get your portfolio template system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon or local)
- Git repository cloned

## 1. Setup Database

### Option A: Using Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

### Option B: Local PostgreSQL

```bash
createdb portfolio_db
```

## 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=your_postgres_connection_string
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
JWT_SECRET=your_secret_key_here
EOF

# Run migrations
npm run migrate

# Start server
npm start
```

Server should start at `http://localhost:3000`

## 3. Frontend Setup

```bash
# Return to root
cd ..

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

# Start dev server
npm run dev
```

Frontend should start at `http://localhost:5173`

## 4. Access Admin Dashboard

Navigate to: **http://localhost:5173/admin/dashboard**

You should see:
- Dashboard overview
- Empty projects list
- 6 default templates
- Empty media library

## 5. Create Your First Project

1. **Click "New Project"** button
2. **Enter project info**:
   - Title: "My Portfolio Project"
   - Slug: "my-portfolio-project"
3. **Click "Choose Template"**
4. **Select "Minimal Project"** template
5. **Project editor opens** with 4 sections

## 6. Edit Your Project

1. **Click a section** in the left sidebar
2. **Edit the title** in the main area
3. **Click "Add Media"** to add images
4. **Drag sections** to reorder them
5. **Click "Save Draft"** to save

## 7. Add Media

1. **Click "Add Media"** in any section
2. **Select from library** OR **upload new**
3. **Media appears** in section
4. **Go to Media Library** view
5. **See breadcrumb** showing your project

## 8. Publish Your Project

1. **Review all sections**
2. **Click "Publish"** button
3. **Project goes live**
4. **Access at**: `/portfolio/my-portfolio-project`

## 🎉 You're Done!

You now have:
- ✅ Working admin dashboard
- ✅ Project with template applied
- ✅ Media library with breadcrumbs
- ✅ Published portfolio project

## Next Steps

### Explore Templates

Try the other 5 templates:
- Detailed Case Study
- Visual Portfolio  
- Experiment Log
- Feature Focused
- Timeline Story

### Customize Sections

Each section has:
- Different layouts (full-width, contained, split)
- Background options (color, gradient, image)
- Custom content (JSON editor)

### Upload More Media

1. Go to Media Library
2. Upload multiple files
3. Use across different projects
4. Track usage via breadcrumbs

### Create Custom Template

1. Build a project you like
2. Click "Save as Template"
3. Reuse for future projects

## Common Issues

### Database Connection Failed

**Error**: `Connection refused`

**Fix**: Check DATABASE_URL in backend/.env
```bash
# Verify connection string format
postgresql://user:password@host:port/database
```

### API Not Found

**Error**: `Failed to fetch`

**Fix**: Check VITE_API_URL in frontend .env
```bash
# Should match backend port
VITE_API_URL=http://localhost:3000/api
```

### Upload Failed

**Error**: `Upload directory not found`

**Fix**: Create uploads directory
```bash
cd backend
mkdir uploads
chmod 755 uploads
```

### Templates Not Showing

**Error**: Empty template gallery

**Fix**: Run migrations again
```bash
cd backend
npm run migrate
```

## Useful Commands

### Backend

```bash
# Start server
npm start

# Run migrations
npm run migrate

# View logs
tail -f logs/server.log
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Connect to database
psql $DATABASE_URL

# View templates
SELECT name, category FROM templates;

# View projects
SELECT title, status FROM projects;

# View media associations
SELECT m.filename, p.title 
FROM media m 
JOIN project_media pm ON pm.media_id = m.id 
JOIN projects p ON p.id = pm.project_id;
```

## Need Help?

1. **Read the full guide**: [PORTFOLIO_TEMPLATES_GUIDE.md](./PORTFOLIO_TEMPLATES_GUIDE.md)
2. **Check implementation**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
3. **Review existing docs**: [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)

---

**Happy building!** 🚀

