import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudyTemplate from '../components/CaseStudyTemplate';
import { mockApi } from '../utils/mockApi';
import { usePortfolioTracking } from '@/hooks/useAnalytics';

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
  const { trackProjectView, trackProjectFilter } = usePortfolioTracking();

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
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand">
      {/* Workshop Integration Header */}
      <section className="bg-brand text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio & Workshop</h1>
            <p className="text-lg text-brand-light max-w-2xl mx-auto">
              Explore my creative work and the processes behind each project. See how design
              thinking, development practices, and innovation come together.
            </p>
          </div>

          {/* Workshop Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              to="/workshop"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Design Process</h3>
              </div>
              <p className="text-sm text-brand-light">
                Creative tools, workflows, and design thinking methodologies
              </p>
            </Link>

            <Link
              to="/workshop"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Development Tools</h3>
              </div>
              <p className="text-sm text-brand-light">
                Code practices, technical solutions, and development workflows
              </p>
            </Link>

            <Link
              to="/workshop"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Innovation Lab</h3>
              </div>
              <p className="text-sm text-brand-light">
                Process optimization, workflow innovation, and efficiency tools
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand">Selected Work</h2>
          <p className="text-neutral-warm mt-2">Creative projects and case studies</p>
        </header>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilter('all');
                trackProjectFilter('category', 'all');
              }}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filter === 'all'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter('featured');
                trackProjectFilter('category', 'featured');
              }}
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
                onClick={() => {
                  setFilter(tag);
                  trackProjectFilter('tag', tag);
                }}
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
            <div
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                trackProjectView(project.id, project.title);
              }}
            >
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

      {/* Process Insights Section */}
      <section className="bg-brand-light py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-4">Process Insights</h2>
            <p className="text-lg text-neutral-warm max-w-2xl mx-auto">
              Behind every project is a systematic approach to problem-solving and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-accent/10"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand mb-2">Research & Discovery</h3>
              <p className="text-sm text-neutral-warm">
                Understanding user needs, market context, and technical constraints
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-accent/10"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand mb-2">Design & Prototyping</h3>
              <p className="text-sm text-neutral-warm">
                Iterative design process with rapid prototyping and user testing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-accent/10"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand mb-2">Development & Build</h3>
              <p className="text-sm text-neutral-warm">
                Clean code, scalable architecture, and performance optimization
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-accent/10"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand mb-2">Launch & Optimize</h3>
              <p className="text-sm text-neutral-warm">
                Deployment, monitoring, and continuous improvement
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/workshop"
              className="inline-flex items-center px-6 py-3 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors font-medium"
            >
              Explore Workshop Tools
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
