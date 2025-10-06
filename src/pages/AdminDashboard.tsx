import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioProject, ProjectTemplate } from '@/types/template';
import { templateService } from '@/services/templateService';
import { useMedia } from '@/context/MediaContext';
import { useContent } from '@/context/ContentContext';
import TemplateGallery from '@/components/TemplateGallery';
import ProjectEditor from '@/components/ProjectEditor';
import MediaBreadcrumbs from '@/components/MediaBreadcrumbs';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdminAuth, { AdminUserBadge } from '@/components/AdminAuth';

type AdminView = 'dashboard' | 'projects' | 'templates' | 'media' | 'content' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { media, loading: mediaLoading, refreshMedia } = useMedia();
  const { homeContent, aboutContent, contactContent } = useContent();

  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [newProjectData, setNewProjectData] = useState({ title: '', slug: '' });

  useEffect(() => {
    // Load projects from API
    fetchProjects();
    refreshMedia();
  }, []);

  const fetchProjects = async () => {
    // TODO: Replace with actual API call
    // For now, load from localStorage
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  };

  const saveProject = (project: PortfolioProject) => {
    const updatedProjects = projects.map(p => (p.id === project.id ? project : p));
    setProjects(updatedProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
  };

  const createProjectFromTemplate = (template: ProjectTemplate) => {
    if (!newProjectData.title || !newProjectData.slug) {
      alert('Please enter project title and slug');
      return;
    }

    const project = templateService.createProjectFromTemplate(template.id, {
      ...newProjectData,
      userId: 'current-user', // TODO: Get from auth context
    });

    if (project) {
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      setShowTemplateGallery(false);
      setEditingProject(project);
      setNewProjectData({ title: '', slug: '' });
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

  const deleteProject = (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
  };

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
            <ProjectsView
              projects={projects}
              onEdit={setEditingProject}
              onDelete={deleteProject}
              onCreateNew={() => setShowTemplateGallery(true)}
            />
          )}
          {currentView === 'templates' && <TemplatesView />}
          {currentView === 'media' && (
            <MediaView media={mediaWithProjects} loading={mediaLoading} />
          )}
          {currentView === 'content' && (
            <ContentView
              homeContent={homeContent}
              aboutContent={aboutContent}
              contactContent={contactContent}
            />
          )}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Project</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={newProjectData.title}
                  onChange={e => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
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
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowTemplateGallery(false);
                  setNewProjectData({ title: '', slug: '' });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newProjectData.title && newProjectData.slug) {
                    // Show template selection
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Choose Template
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateGallery && newProjectData.title && newProjectData.slug && (
        <TemplateGallery
          onSelectTemplate={createProjectFromTemplate}
          onClose={() => setShowTemplateGallery(false)}
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

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="📁" label="Total Projects" value={projects.length} />
        <StatCard icon="✅" label="Published" value={publishedCount} color="green" />
        <StatCard icon="📝" label="Drafts" value={draftCount} color="yellow" />
        <StatCard icon="🖼️" label="Media Files" value={media.length} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
          {projects.slice(0, 5).map(project => (
            <div key={project.id} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{project.title}</div>
                  <div className="text-sm text-gray-500">{project.status}</div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickAction icon="➕" label="Create New Project" />
            <QuickAction icon="📤" label="Upload Media" />
            <QuickAction icon="✏️" label="Edit Homepage" />
            <QuickAction icon="⚙️" label="Site Settings" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = 'gray' }: any) {
  const colors = {
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className={`${colors[color as keyof typeof colors]} rounded-lg p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-gray-900">{label}</span>
    </button>
  );
}

function ProjectsView({
  projects,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  projects: PortfolioProject[];
  onEdit: (project: PortfolioProject) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.subtitle || project.summary}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <span>{project.sections.length} sections</span>
              <span>•</span>
              <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(project)}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesView() {
  const templates = templateService.getAllTemplates();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              {template.sections.length} sections • {template.category}
            </div>
            {template.isCustom && (
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                Custom Template
              </span>
            )}
          </div>
        ))}
      </div>
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

function ContentView({ homeContent, aboutContent, contactContent }: any) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Page Content</h2>
      <div className="space-y-6">
        <ContentSection title="Homepage" content={homeContent} />
        <ContentSection title="About Page" content={aboutContent} />
        <ContentSection title="Contact Page" content={contactContent} />
      </div>
    </div>
  );
}

function ContentSection({ title, content }: { title: string; content: any }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
        Edit Content
      </button>
    </div>
  );
}

function SettingsView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Settings panel coming soon...</p>
      </div>
    </div>
  );
}

