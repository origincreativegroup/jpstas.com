import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import LoginForm from '@/components/LoginForm';
import { LoadingPage } from '@/components/LoadingSpinner';
import { mockApi } from '@/utils/mockApi';
import { checkAuthStatus, setAuthenticated } from '@/config/auth';

interface Project {
  id: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  type: string;
  featured: boolean;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    caption: string;
    type?: 'image' | 'video';
  }>;
  content: {
    challenge: string;
    solution: string;
    results: string;
    process: string[];
    technologies: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (checkAuthStatus()) {
      setIsAuthenticated(true);
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      fetchProjects();
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsAuthenticated(false);
    setProjects([]);
    setShowAddForm(false);
    setEditingProject(null);
  };

  const fetchProjects = async () => {
    try {
      // Use mock API in development, real API in production
      if (import.meta.env.DEV) {
        const data = await mockApi.getProjects();
        setProjects(data);
      } else {
        const response = await fetch('/api/content?type=projects');
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/content/${id}`, { method: 'DELETE' });
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleSave = async (projectData: Partial<Project>) => {
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        await mockApi.saveProject(projectData);
        await fetchProjects();
        setShowAddForm(false);
        setEditingProject(null);
      } else {
        // Use real API in production
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'project', data: projectData }),
        });

        if (response.ok) {
          await fetchProjects();
          setShowAddForm(false);
          setEditingProject(null);
        }
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (loading) {
    return <LoadingPage message="Loading projects..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-neutral-600 mt-2">Manage your portfolio content</p>
          </div>
          <div className="flex gap-4">
            <NavLink
              to="/"
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              View Site
            </NavLink>
            <NavLink
              to="/admin/media"
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              Media Library
            </NavLink>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700"
            >
              Add Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
          </div>

          <div className="divide-y divide-neutral-200">
            {projects.map(project => (
              <div key={project.id} className="p-6 hover:bg-neutral-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-1 text-xs bg-accent text-white rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{project.role}</p>
                    <p className="text-neutral-700 mb-3">{project.summary}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-neutral-100 border border-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAddForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSave}
            onCancel={() => {
              setShowAddForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface ProjectFormProps {
  project?: Project | null;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    role: project?.role || '',
    summary: project?.summary || '',
    tags: project?.tags.join(', ') || '',
    featured: project?.featured || false,
    challenge: project?.content?.challenge || '',
    solution: project?.content?.solution || '',
    results: project?.content?.results || '',
    process: project?.content?.process.join('\n') || '',
    technologies: project?.content?.technologies.join(', ') || '',
  });

  const [mediaFiles, setMediaFiles] = useState(project?.images || []);

  const handleMediaUpload = (uploadedFile: any) => {
    const newMedia = {
      id: uploadedFile.id,
      url: uploadedFile.url,
      alt: uploadedFile.name,
      caption: '',
      type: (uploadedFile.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video',
    };
    setMediaFiles([...mediaFiles, newMedia]);
  };

  const handleMediaRemove = (fileId: string) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== fileId));
  };

  const handleMediaCaptionChange = (fileId: string, caption: string) => {
    setMediaFiles(mediaFiles.map(file => (file.id === fileId ? { ...file, caption } : file)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: Partial<Project> = {
      id: project?.id || Date.now().toString(),
      title: formData.title,
      role: formData.role,
      summary: formData.summary,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
      type: 'case-study',
      featured: formData.featured,
      images: mediaFiles,
      content: {
        challenge: formData.challenge,
        solution: formData.solution,
        results: formData.results,
        process: formData.process.split('\n').filter(Boolean),
        technologies: formData.technologies
          .split(',')
          .map(tech => tech.trim())
          .filter(Boolean),
      },
      createdAt: project?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(projectData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">{project ? 'Edit Project' : 'Add New Project'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Summary</label>
            <textarea
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Design, Web, E-commerce"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 text-brand focus:ring-brand border-neutral-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium">
              Featured Project
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Files</h3>

            <FileUpload
              onUpload={handleMediaUpload}
              accept="image/*,video/*"
              multiple={true}
              className="mb-4"
            />

            {mediaFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-medium">Uploaded Media</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaFiles.map(file => (
                    <div key={file.id} className="space-y-2">
                      <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                        {file.type === 'video' ? (
                          <video src={file.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={file.url} alt={file.alt} className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleMediaRemove(file.id)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Add caption..."
                        value={file.caption}
                        onChange={e => handleMediaCaptionChange(file.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-brand focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Case Study Content</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Challenge</label>
              <textarea
                value={formData.challenge}
                onChange={e => setFormData({ ...formData, challenge: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Solution</label>
              <textarea
                value={formData.solution}
                onChange={e => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Results</label>
              <textarea
                value={formData.results}
                onChange={e => setFormData({ ...formData, results: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Process (one per line)</label>
              <textarea
                value={formData.process}
                onChange={e => setFormData({ ...formData, process: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                rows={4}
                placeholder="Research and analysis&#10;Design and prototyping&#10;Development and testing&#10;Launch and optimization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="React, TypeScript, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-purple-700"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
