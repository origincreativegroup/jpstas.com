import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedProject, ProjectFilters } from '@/types/unified-project';
import { api } from '@/services/apiClient';
import { projectService } from '@/services/projectService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProjectManagerViewProps {
  onEdit: (project: UnifiedProject) => void;
  onCreateNew: () => void;
}

type ViewMode = 'grid' | 'table';
type StatusFilter = 'all' | 'published' | 'draft' | 'archived';

export default function ProjectManagerView({ onEdit, onCreateNew }: ProjectManagerViewProps) {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);
  const [typeFilter] = useState<string | undefined>(undefined); // Reserved for future project type filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const filters: ProjectFilters = {
        status: statusFilter,
        orderBy: sortBy,
        orderDirection: sortDirection,
      };
      const data = await api.getUnifiedProjects(filters);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply featured filter
    if (featuredFilter !== undefined) {
      filtered = filtered.filter(p => p.featured === featuredFilter);
    }

    // Apply type filter
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = projectService.searchProjects(filtered, searchQuery);
    }

    return filtered;
  }, [projects, featuredFilter, typeFilter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => projectService.getProjectStats(projects), [projects]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.deleteUnifiedProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  // Handle duplicate
  const handleDuplicate = async (id: string) => {
    try {
      const duplicate = await api.duplicateUnifiedProject(id);
      setProjects(prev => [duplicate, ...prev]);
    } catch (error) {
      console.error('Failed to duplicate project:', error);
      alert('Failed to duplicate project');
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (project: UnifiedProject) => {
    try {
      const updated = await api.updateUnifiedProject(project.id, {
        featured: !project.featured,
      });
      setProjects(prev => prev.map(p => (p.id === project.id ? updated : p)));
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      alert('Failed to update project');
    }
  };

  // Handle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredProjects.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // Bulk actions
  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;

    try {
      await api.bulkUpdateUnifiedProjects(Array.from(selectedIds), { status: 'published' });
      await loadProjects();
      deselectAll();
    } catch (error) {
      console.error('Failed to bulk publish:', error);
      alert('Failed to publish projects');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;

    try {
      await api.bulkUpdateUnifiedProjects(Array.from(selectedIds), { status: 'archived' });
      await loadProjects();
      deselectAll();
    } catch (error) {
      console.error('Failed to bulk archive:', error);
      alert('Failed to archive projects');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} projects? This cannot be undone.`)) return;

    try {
      await Promise.all(Array.from(selectedIds).map(id => api.deleteUnifiedProject(id)));
      await loadProjects();
      deselectAll();
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      alert('Failed to delete projects');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard label="Total" value={stats.total} icon="📁" color="blue" />
        <StatsCard label="Published" value={stats.published} icon="✅" color="green" />
        <StatsCard label="Drafts" value={stats.draft} icon="📝" color="yellow" />
        <StatsCard label="Archived" value={stats.archived} icon="📦" color="gray" />
        <StatsCard label="Featured" value={stats.featured} icon="⭐" color="purple" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
            <select
              value={featuredFilter === undefined ? 'all' : featuredFilter ? 'true' : 'false'}
              onChange={e =>
                setFeaturedFilter(
                  e.target.value === 'all' ? undefined : e.target.value === 'true'
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Projects</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDirection === 'asc' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="font-semibold text-indigo-900">{selectedIds.size} selected</span>
            <button
              onClick={deselectAll}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Deselect All
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Publish
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <GridView
          projects={filteredProjects}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onEdit={onEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleFeatured={handleToggleFeatured}
        />
      ) : (
        <TableView
          projects={filteredProjects}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onEdit={onEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleFeatured={handleToggleFeatured}
        />
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    gray: 'bg-gray-50 text-gray-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`${colors[color as keyof typeof colors]} rounded-xl p-4`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}

// Grid View Component
function GridView({
  projects,
  selectedIds,
  onToggleSelection,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFeatured,
}: {
  projects: UnifiedProject[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onEdit: (project: UnifiedProject) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFeatured: (project: UnifiedProject) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
        <svg
          className="w-20 h-20 text-gray-300 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No projects found</h3>
        <p className="text-gray-500 text-lg">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            selected={selectedIds.has(project.id)}
            onToggleSelection={() => onToggleSelection(project.id)}
            onEdit={() => onEdit(project)}
            onDelete={() => onDelete(project.id)}
            onDuplicate={() => onDuplicate(project.id)}
            onToggleFeatured={() => onToggleFeatured(project)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  index,
  selected,
  onToggleSelection,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFeatured,
}: {
  project: UnifiedProject;
  index: number;
  selected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFeatured: () => void;
}) {
  const coverImage = projectService.getCoverImage(project);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`bg-white rounded-xl border-2 transition-all hover:shadow-lg ${
        selected ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
      }`}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
        {coverImage ? (
          <img src={coverImage.url} alt={coverImage.alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelection}
            className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              project.status === 'published'
                ? 'bg-green-500 text-white'
                : project.status === 'draft'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">{project.role}</p>
          </div>
          {project.featured && (
            <span className="text-xl ml-2" title="Featured">
              ⭐
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onToggleFeatured}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={project.featured ? 'Unfeature' : 'Feature'}
          >
            {project.featured ? '⭐' : '☆'}
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}

// Table View Component
function TableView({
  projects,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFeatured,
}: {
  projects: UnifiedProject[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onEdit: (project: UnifiedProject) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFeatured: (project: UnifiedProject) => void;
}) {
  const allSelected = projects.length > 0 && selectedIds.size === projects.length;

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-2">No projects found</h3>
        <p className="text-gray-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => (allSelected ? onDeselectAll() : onSelectAll())}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(project.id)}
                    onChange={() => onToggleSelection(project.id)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {projectService.getCoverImage(project) ? (
                        <img
                          src={projectService.getCoverImage(project)!.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{project.title}</div>
                        {project.featured && <span title="Featured">⭐</span>}
                      </div>
                      <div className="text-sm text-gray-600">{project.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : project.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onToggleFeatured(project)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={project.featured ? 'Unfeature' : 'Feature'}
                    >
                      {project.featured ? '⭐' : '☆'}
                    </button>
                    <button
                      onClick={() => onDuplicate(project.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
