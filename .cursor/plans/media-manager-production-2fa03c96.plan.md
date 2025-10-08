<!-- 2fa03c96-a1e1-4947-8355-b2b25b51678c 66b4b045-9935-4491-a6ce-3fa897a5b175 -->
# Complete Admin Features Implementation Plan

## Current Status Analysis

The admin dashboard has these views defined but incompletely implemented:

1. **Dashboard** - Basic implementation exists but needs analytics
2. **Projects** - Fully implemented with ProjectManagerView  
3. **Templates** - Basic read-only view exists
4. **Media** - Basic preview, but full library at `/media` route
5. **Content** - Placeholder only (needs full CMS implementation)
6. **Settings** - Placeholder only (needs implementation)

## Issues Found

- `fetchProjects()` uses localStorage with TODO to replace with API
- ContentView has non-functional "Edit Content" buttons
- SettingsView is just a placeholder
- Dashboard analytics are basic (can be enhanced)

## Implementation Tasks

### 1. Content Management System (CMS) View

Build a comprehensive CMS interface for managing site content:

**Pages to Manage:**

- Homepage content (hero, bio, skills)
- About page content
- Contact page content  
- Navigation configuration

**Features:**

- Rich text editor for markdown content
- Live preview of changes
- Publish/draft states
- Version history
- Revert changes capability

**Files to create:**

- `src/components/admin/ContentEditor.tsx` - Rich content editor
- `src/components/admin/NavigationEditor.tsx` - Nav config editor

**API Integration:**

- Use existing `/api/content` endpoints
- Add CMS settings endpoint if needed

### 2. Settings Panel

Create comprehensive settings management:

**Settings Sections:**

- **Site Settings**: Site title, tagline, SEO metadata
- **Admin Account**: Change password, email preferences
- **Media Settings**: Upload limits, allowed file types
- **Build & Deploy**: Clear cache, rebuild site
- **Analytics**: Configure Google Analytics, tracking
- **Integrations**: API keys, third-party services

**Files to create:**

- `src/components/admin/SettingsPanel.tsx` - Main settings component
- `src/components/admin/SettingsSections/` - Individual setting sections

### 3. Enhanced Dashboard Analytics

Upgrade dashboard with useful metrics:

**Metrics to Add:**

- Total projects breakdown (published vs draft)
- Recent activity feed
- Media storage usage
- Quick actions panel
- System health status

**Charts/Visualizations:**

- Project status pie chart
- Media upload timeline
- Page view stats (if analytics connected)

### 4. Fix Project Loading

Replace localStorage with API calls:

- Update `fetchProjects()` to use `api.getUnifiedProjects()`
- Remove localStorage dependencies
- Add proper error handling
- Add loading states

### 5. Template Management Enhancement

Add template CRUD operations:

- View template details
- Create custom templates
- Edit existing templates
- Delete templates
- Import/export templates

## Key Files to Modify

1. **AdminDashboard.tsx** (main file)

- Replace fetchProjects localStorage → API
- Enhance DashboardView with analytics
- Wire up ContentView to real CMS
- Wire up SettingsView to settings panel

2. **New Components to Create**

- `ContentEditor.tsx` - CMS editor interface
- `NavigationEditor.tsx` - Nav menu editor
- `SettingsPanel.tsx` - Settings management
- `DashboardStats.tsx` - Enhanced metrics
- `RecentActivity.tsx` - Activity feed

3. **API Integration**

- Verify CMS endpoints work
- Add settings API if needed
- Add analytics API if needed

## Success Criteria

- ✅ Content can be edited and published through CMS
- ✅ Settings can be configured and saved
- ✅ Dashboard shows meaningful analytics
- ✅ Projects load from API (not localStorage)
- ✅ All admin views are fully functional
- ✅ No placeholder "coming soon" messages
- ✅ Proper error handling throughout
- ✅ Loading states for all async operations

### To-dos

- [ ] Update environment configuration files (env.example, wrangler.toml) with all required Cloudflare variables and KV bindings
- [ ] Create /functions/api/media/bulk.ts endpoint with bulk update, delete, and usage query operations
- [ ] Add bulk operation methods to apiClient.ts (bulkUpdateMedia, bulkDeleteMedia, bulkGetMediaUsage)
- [ ] Update MediaContext.tsx to use new bulk endpoints instead of individual API calls
- [ ] Optimize MediaLibrary.tsx to load usage data on-demand instead of preloading for 20 files
- [ ] Enhance error handling in cloudflareStream.ts and EnhancedFileUpload.tsx with retry logic and better messages
- [ ] Update PRODUCTION_CHECKLIST.md with media manager specific deployment checks and testing procedures
- [ ] Test all media manager features including uploads, bulk operations, usage tracking, and error scenarios