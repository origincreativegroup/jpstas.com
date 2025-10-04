import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { mockApi } from '@/utils/mockApi';
import { useToast } from '@/context/ToastContext';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      showToast('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      // In a real app, this would make an API call
      setProjects(projects.filter(p => p.id !== projectId));
      showToast('Project deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showToast('Failed to delete project', 'error');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updatedProject = { ...project, featured: !project.featured };
      // In a real app, this would make an API call
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
      showToast(`Project ${updatedProject.featured ? 'featured' : 'unfeatured'}`, 'success');
    } catch (error) {
      console.error('Failed to update project:', error);
      showToast('Failed to update project', 'error');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || 
      (filter === 'featured' && project.featured) ||
      (filter === 'published' && project.status === 'published') ||
      (filter === 'draft' && project.status === 'draft');
    
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand">Portfolio Projects</h2>
          <p className="text-neutral-600">Manage your portfolio projects and case studies</p>
        </div>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
        >
          Add New Project
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'featured', 'published', 'draft'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-accent text-brand'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Project Image */}
            <div className="h-48 bg-gradient-to-br from-accent/20 to-brand/20 flex items-center justify-center">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]?.url}
                  alt={project.images[0]?.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl opacity-50">
                  {project.tags.includes('E-commerce') ? '🛒' : 
                   project.tags.includes('Design') ? '🎨' : 
                   project.tags.includes('Development') ? '💻' : '⚡'}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-brand mb-1">{project.title}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{project.role}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {project.featured && (
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    project.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-neutral-700 mb-4 line-clamp-2">{project.summary}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`p-2 rounded-lg transition-colors ${
                      project.featured
                        ? 'bg-accent/20 text-accent'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title={project.featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
                    title="Edit project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No projects found</h3>
          <p className="text-neutral-600 mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
          >
            Add New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
