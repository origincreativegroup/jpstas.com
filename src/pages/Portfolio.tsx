import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CaseStudyTemplate from '../components/CaseStudyTemplate';
import { mockApi } from '../utils/mockApi';

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

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Check if there's a project parameter in the URL
    const projectId = searchParams.get('project');
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [searchParams, projects]);

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

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'featured') return project.featured;
    return project.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
  });

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (selectedProject) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <button
          onClick={() => {
            setSelectedProject(null);
            navigate('/portfolio');
          }}
          className="flex items-center gap-2 text-neutral-600 hover:text-brand transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Portfolio
        </button>
        <CaseStudyTemplate project={selectedProject} variant="detailed" />
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold">Selected Work</h2>
        <p className="text-neutral-600 mt-2">Creative projects and case studies</p>
      </header>

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              filter === 'all'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              filter === 'featured'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand'
            }`}
          >
            Featured
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filter === tag
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-brand text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div
        className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
      >
        {filteredProjects.map(project => (
          <div key={project.id} onClick={() => setSelectedProject(project)}>
            <CaseStudyTemplate
              project={project}
              variant={viewMode === 'list' ? 'minimal' : 'card'}
            />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">No projects found matching your filter.</p>
        </div>
      )}
    </section>
  );
}
