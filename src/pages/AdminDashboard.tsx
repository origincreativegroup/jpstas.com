import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioProject, ProjectTemplate } from '@/types/template';
import { UnifiedProject, CreateProjectData } from '@/types/unified-project';
import { templateService } from '@/services/templateService';
import { useMedia } from '@/context/MediaContext';
import { api } from '@/services/apiClient';
// import { useContent } from '@/context/ContentContext';
import TemplateGallery from '@/components/TemplateGallery';
import ProjectEditor from '@/components/ProjectEditor';
import ProjectManagerView from '@/components/admin/ProjectManagerView';
import UnifiedProjectEditor from '@/components/admin/UnifiedProjectEditor';
import MediaBreadcrumbs from '@/components/MediaBreadcrumbs';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdminAuth, { AdminUserBadge } from '@/components/AdminAuth';
import ContentEditor from '@/components/admin/ContentEditor';
import NavigationEditor from '@/components/admin/NavigationEditor';
import SettingsPanel from '@/components/admin/SettingsPanel';
import TemplateEditor from '@/components/admin/TemplateEditor';

type AdminView = 'dashboard' | 'projects' | 'templates' | 'media' | 'content' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { media, loading: mediaLoading, refreshMedia } = useMedia();
  // Content is available through API but not used in current dashboard view

  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [newProjectData, setNewProjectData] = useState({ title: '', slug: '' });

  // New unified project state
  const [editingUnifiedProject, setEditingUnifiedProject] = useState<UnifiedProject | null>(null);

  // Content management state
  const [editingContent, setEditingContent] = useState<'homepage' | 'about' | 'contact' | null>(null);
  const [editingNavigation, setEditingNavigation] = useState(false);

  // Template management state
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  useEffect(() => {
    // Load projects from API
    fetchProjects();
    refreshMedia();
  }, []);

  const fetchProjects = async () => {
    try {
      // Load unified projects from API
      const unifiedProjects = await api.getUnifiedProjects();
      
      // Convert UnifiedProject to PortfolioProject for compatibility
      const portfolioProjects: PortfolioProject[] = unifiedProjects.map(project => ({
        id: project.id,
        userId: 'default-user', // Default user for now
        templateId: project.templateId,
        title: project.title,
        slug: project.slug,
        status: project.status,
        featured: project.featured,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        publishedAt: project.publishedAt,
        summary: project.summary || '',
        role: project.role || '',
        tags: project.tags || [],
        sections: project.sections || [],
      }));
      
      setProjects(portfolioProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Fallback to empty array if API fails
      setProjects([]);
    }
  };

  const saveProject = async (project: PortfolioProject) => {
    try {
      // Convert PortfolioProject back to UnifiedProject format
      const updateData = {
        title: project.title,
        slug: project.slug,
        status: project.status,
        featured: project.featured,
        summary: project.summary,
        role: project.role,
        tags: project.tags,
        sections: project.sections,
      };
      
      await api.updateUnifiedProject(project.id, updateData);
      
      // Update local state
      const updatedProjects = projects.map(p => (p.id === project.id ? project : p));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  };

  const createProjectFromTemplate = async (template: ProjectTemplate) => {
    if (!newProjectData.title || !newProjectData.slug) {
      alert('Please enter project title and slug');
      return;
    }

    try {
      // Create unified project from template
      const projectData: CreateProjectData = {
        title: newProjectData.title,
        slug: newProjectData.slug,
        templateId: template.id,
      };

      const newProject = await api.createUnifiedProjectFromTemplate(template.id, projectData);

      setShowTemplateGallery(false);
      setEditingUnifiedProject(newProject);
      setNewProjectData({ title: '', slug: '' });
    } catch (error) {
      console.error('Failed to create project from template:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const publishProject = (project: PortfolioProject) => {
    const updated = {
      ...project,
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProject(updated);
    setEditingProject(updated);
  };

  // Keep for future use - currently using ProjectManagerView's delete functionality
  // const deleteProject = (projectId: string) => {
  //   if (!confirm('Are you sure you want to delete this project?')) return;
  //   const updatedProjects = projects.filter(p => p.id !== projectId);
  //   setProjects(updatedProjects);
  // };

  // Get media with project associations
  const mediaWithProjects = media.map(m => ({
    ...m,
    projects: projects.filter(p =>
      p.sections.some(s => s.media?.some(sm => sm.id === m.id))
    ),
  }));

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900"
                  title="Back to site"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {projects.length} projects • {media.length} media files
                </span>
                <AdminUserBadge />
              </div>
            </div>
          </div>
        </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            <NavItem
              icon="📊"
              label="Dashboard"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <NavItem
              icon="📁"
              label="Projects"
              active={currentView === 'projects'}
              onClick={() => setCurrentView('projects')}
              badge={projects.length}
            />
            <NavItem
              icon="🎨"
              label="Templates"
              active={currentView === 'templates'}
              onClick={() => setCurrentView('templates')}
            />
            <NavItem
              icon="🖼️"
              label="Media Library"
              active={currentView === 'media'}
              onClick={() => setCurrentView('media')}
              badge={media.length}
            />
            <NavItem
              icon="📝"
              label="Page Content"
              active={currentView === 'content'}
              onClick={() => setCurrentView('content')}
            />
            <NavItem
              icon="⚙️"
              label="Settings"
              active={currentView === 'settings'}
              onClick={() => setCurrentView('settings')}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && <DashboardView projects={projects} media={media} />}
          {currentView === 'projects' && (
            <ProjectManagerView
              onEdit={setEditingUnifiedProject}
              onCreateNew={() => setShowNewProjectModal(true)}
            />
          )}
          {currentView === 'templates' && (
            <TemplatesView 
              onEditTemplate={setEditingTemplate}
              onCreateTemplate={() => setShowTemplateEditor(true)}
            />
          )}
          {currentView === 'media' && (
            <MediaView media={mediaWithProjects} loading={mediaLoading} />
          )}
          {currentView === 'content' && (
            <ContentView onEditContent={setEditingContent} onEditNavigation={() => setEditingNavigation(true)} />
          )}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* New Project Modal - Step 1: Basic Info */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectData.title}
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setNewProjectData({ title, slug });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectData.slug}
                  onChange={e =>
                    setNewProjectData({
                      ...newProjectData,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="my-awesome-project"
                />
                <p className="text-sm text-gray-500 mt-1">Auto-generated from title, can be edited</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectData({ title: '', slug: '' });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newProjectData.title || !newProjectData.slug) {
                    alert('Please enter both title and slug');
                    return;
                  }
                  setShowNewProjectModal(false);
                  setShowTemplateGallery(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Choose Template →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Gallery Modal - Step 2: Select Template */}
      {showTemplateGallery && (
        <TemplateGallery
          onSelectTemplate={createProjectFromTemplate}
          onClose={() => {
            setShowTemplateGallery(false);
            setNewProjectData({ title: '', slug: '' });
          }}
        />
      )}

      {/* Project Editor */}
      {editingProject && (
        <ProjectEditor
          project={editingProject}
          onUpdate={saveProject}
          onSave={() => {
            saveProject(editingProject);
            alert('Project saved!');
          }}
          onPublish={() => publishProject(editingProject)}
          onClose={() => setEditingProject(null)}
        />
      )}

      {/* Unified Project Editor */}
      {editingUnifiedProject && (
        <UnifiedProjectEditor
          project={editingUnifiedProject}
          onUpdate={(updated) => {
            setEditingUnifiedProject(updated);
          }}
          onSave={() => {
            alert('Project saved!');
          }}
          onPublish={() => {
            alert('Project published!');
            setEditingUnifiedProject(null);
          }}
          onClose={() => setEditingUnifiedProject(null)}
        />
      )}

      {/* Content Editor Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ContentEditor
              pageType={editingContent}
              onSave={() => {
                setEditingContent(null);
                // Refresh content if needed
              }}
              onCancel={() => setEditingContent(null)}
            />
          </div>
        </div>
      )}

      {/* Navigation Editor Modal */}
      {editingNavigation && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <NavigationEditor
              onSave={() => {
                setEditingNavigation(false);
                // Refresh navigation if needed
              }}
              onCancel={() => setEditingNavigation(false)}
            />
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {(editingTemplate || showTemplateEditor) && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TemplateEditor
              template={editingTemplate}
              onSave={() => {
                setEditingTemplate(null);
                setShowTemplateEditor(false);
                // Refresh templates if needed
              }}
              onCancel={() => {
                setEditingTemplate(null);
                setShowTemplateEditor(false);
              }}
            />
          </div>
        </div>
      )}
      </div>
    </AdminAuth>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function DashboardView({ projects, media }: { projects: PortfolioProject[]; media: any[] }) {
  const publishedCount = projects.filter(p => p.status === 'published').length;
  const draftCount = projects.filter(p => p.status === 'draft').length;
  const featuredCount = projects.filter(p => p.featured).length;
  
  // Calculate storage usage (mock data for now)
  const imageCount = media.filter(m => m.type === 'image').length;
  const videoCount = media.filter(m => m.type === 'video').length;
  const totalStorage = media.reduce((total, m) => total + (m.size || 0), 0);
  const storageInMB = Math.round(totalStorage / (1024 * 1024));
  
  // Recent activity (mock data)
  const recentActivity = [
    { type: 'project', action: 'created', title: 'New Portfolio Project', time: '2 hours ago' },
    { type: 'media', action: 'uploaded', title: 'hero-image.jpg', time: '4 hours ago' },
    { type: 'project', action: 'published', title: 'E-commerce Redesign', time: '1 day ago' },
    { type: 'media', action: 'uploaded', title: 'product-demo.mp4', time: '2 days ago' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon="📁" 
          label="Total Projects" 
          value={projects.length}
          subtitle={`${publishedCount} published, ${draftCount} drafts`}
        />
        <StatCard 
          icon="⭐" 
          label="Featured Projects" 
          value={featuredCount} 
          color="yellow"
          subtitle="Showcased on homepage"
        />
        <StatCard 
          icon="🖼️" 
          label="Media Files" 
          value={media.length} 
          color="blue"
          subtitle={`${imageCount} images, ${videoCount} videos`}
        />
        <StatCard 
          icon="💾" 
          label="Storage Used" 
          value={`${storageInMB}MB`} 
          color="purple"
          subtitle="Total file size"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Project Status Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Project Status</h3>
          <ProjectStatusChart published={publishedCount} draft={draftCount} featured={featuredCount} />
        </div>

        {/* Media Type Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Media Breakdown</h3>
          <MediaBreakdownChart imageCount={imageCount} videoCount={videoCount} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
          {projects.slice(0, 5).map(project => (
            <div key={project.id} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                      {project.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'project' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{activity.action} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="➕" label="Create Project" description="Start a new project" />
          <QuickAction icon="📤" label="Upload Media" description="Add images or videos" />
          <QuickAction icon="✏️" label="Edit Content" description="Update site content" />
          <QuickAction icon="⚙️" label="Settings" description="Configure site settings" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = 'gray', subtitle }: any) {
  const colors = {
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`${colors[color as keyof typeof colors]} rounded-lg p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
      {subtitle && (
        <div className="text-xs opacity-60 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

function QuickAction({ icon, label, description }: { icon: string; label: string; description?: string }) {
  return (
    <button className="w-full flex flex-col items-center gap-2 px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </button>
  );
}

// Removed ProjectsView - now using ProjectManagerView component

function TemplatesView({ 
  onEditTemplate, 
  onCreateTemplate 
}: { 
  onEditTemplate: (template: ProjectTemplate) => void;
  onCreateTemplate: () => void;
}) {
  const templates = templateService.getAllTemplates();

  const handleDeleteTemplate = (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Call API to delete template
      console.log('Deleting template:', templateId);
      // templateService.deleteTemplate(templateId);
      alert('Template deleted successfully!');
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleDuplicateTemplate = (template: ProjectTemplate) => {
    const duplicatedTemplate: ProjectTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // TODO: Call API to create duplicated template
      console.log('Duplicating template:', duplicatedTemplate);
      // templateService.createTemplate(duplicatedTemplate);
      alert('Template duplicated successfully!');
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      alert('Failed to duplicate template. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Portfolio Templates</h2>
        <button
          onClick={onCreateTemplate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              </div>
              {template.isCustom && (
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded ml-2">
                  Custom
                </span>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {template.sections.length} sections • {template.category}
            </div>

            {/* Template Preview */}
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2">Sections:</div>
              <div className="flex flex-wrap gap-1">
                {template.sections.slice(0, 3).map((section, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {section.title}
                  </span>
                ))}
                {template.sections.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{template.sections.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditTemplate(template)}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
              
              <button
                onClick={() => handleDuplicateTemplate(template)}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                title="Duplicate template"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              {template.isCustom && (
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  title="Delete template"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Template Metadata */}
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Created {new Date(template.createdAt || Date.now()).toLocaleDateString()}
              {template.updatedAt && template.updatedAt !== template.createdAt && (
                <span> • Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-600 mb-6">Create your first custom template to get started.</p>
          <button
            onClick={onCreateTemplate}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            Create Your First Template
          </button>
        </div>
      )}
    </div>
  );
}

function MediaView({ media, loading }: { media: any[]; loading: boolean }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Library</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map(m => (
          <div key={m.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100">
              {m.type === 'image' ? (
                <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
              ) : (
                <video src={m.url} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-3">
              <div className="text-sm font-medium text-gray-900 truncate mb-2">{m.name}</div>
              <MediaBreadcrumbs media={m} projects={m.projects} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentView({ 
  onEditContent, 
  onEditNavigation 
}: { 
  onEditContent: (pageType: 'homepage' | 'about' | 'contact') => void;
  onEditNavigation: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Page Content Management</h2>
        <button
          onClick={onEditNavigation}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Edit Navigation
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentSection 
          title="Homepage" 
          description="Hero section, bio, and featured projects"
          icon="🏠"
          onEdit={() => onEditContent('homepage')}
        />
        <ContentSection 
          title="About Page" 
          description="Personal story, skills, and experience"
          icon="👤"
          onEdit={() => onEditContent('about')}
        />
        <ContentSection 
          title="Contact Page" 
          description="Contact information and form"
          icon="📧"
          onEdit={() => onEditContent('contact')}
        />
      </div>

      {/* Content Management Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Content Management Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the preview tab to see how your content will look before publishing</li>
          <li>• Save drafts frequently to avoid losing your work</li>
          <li>• Use keywords in your content to improve SEO</li>
          <li>• Keep descriptions concise and engaging</li>
        </ul>
      </div>
    </div>
  );
}

function ContentSection({ 
  title, 
  description, 
  icon, 
  onEdit 
}: { 
  title: string; 
  description: string;
  icon: string;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={onEdit}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Content
        </button>
        
        <div className="text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Published
          </span>
          <span className="ml-3">Last updated 2 days ago</span>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return <SettingsPanel />;
}

// Chart Components
function ProjectStatusChart({ published, draft, featured }: { published: number; draft: number; featured: number }) {
  const total = published + draft;
  const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;
  const draftPercent = total > 0 ? Math.round((draft / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Published ({published})</span>
        </div>
        <span className="text-sm text-gray-500">{publishedPercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${publishedPercent}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-medium">Drafts ({draft})</span>
        </div>
        <span className="text-sm text-gray-500">{draftPercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${draftPercent}%` }}
        ></div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium">Featured Projects</span>
          <span className="text-sm text-gray-500">({featured})</span>
        </div>
      </div>
    </div>
  );
}

function MediaBreakdownChart({ imageCount, videoCount }: { imageCount: number; videoCount: number }) {
  const total = imageCount + videoCount;
  const imagePercent = total > 0 ? Math.round((imageCount / total) * 100) : 0;
  const videoPercent = total > 0 ? Math.round((videoCount / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📁</div>
        <p className="text-sm">No media files yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">Images ({imageCount})</span>
        </div>
        <span className="text-sm text-gray-500">{imagePercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${imagePercent}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium">Videos ({videoCount})</span>
        </div>
        <span className="text-sm text-gray-500">{videoPercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-red-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${videoPercent}%` }}
        ></div>
      </div>
    </div>
  );
}

