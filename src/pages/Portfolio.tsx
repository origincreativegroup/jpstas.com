import { useState, useEffect, useDeferredValue, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import CaseStudyTemplate from '../components/CaseStudyTemplate';
import { mockApi } from '../utils/mockApi';
import { usePortfolioTracking } from '@/hooks/useAnalytics';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';

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

  // Use deferred value for filter to keep UI responsive
  const deferredFilter = useDeferredValue(filter);

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
      // Silently handle error - will show empty state
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered projects with deferred value for non-blocking filtering
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (deferredFilter === 'all') return true;
      if (deferredFilter === 'featured') return project.featured;
      return project.tags.some(tag => tag.toLowerCase().includes(deferredFilter.toLowerCase()));
    });
  }, [projects, deferredFilter]);

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  if (loading) {
    return (
      <>
        <SEO
          title="Portfolio"
          description="Explore my portfolio of design and development projects."
        />
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading projects...</p>
          </div>
        </section>
      </>
    );
  }

  if (selectedProject) {
    return (
      <>
        <SEO
          title={selectedProject.title}
          description={selectedProject.summary}
          keywords={selectedProject.tags.join(', ')}
        />
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
      </>
    );
  }

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore my portfolio of design and development projects. Full-stack applications, creative designs, and process innovations."
        keywords="portfolio, web development, design projects, case studies, full-stack"
      />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-neutral-100">
        {/* Portfolio Header */}
        <section className="relative bg-gradient-to-br from-brand via-purple-900 to-brand text-white py-20 overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute top-10 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="diagonal-stripes absolute inset-0 opacity-5"></div>

          <div className="relative max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Portfolio
              </motion.h1>
              <motion.p
                className="text-xl text-brand-light max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Explore my creative work and the processes behind each project. See how design
                thinking, development practices, and innovation come together.
              </motion.p>
            </motion.div>
          </div>
        </section>

      {/* Portfolio Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <ScrollReveal direction="up" delay={0.2}>
          <header className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand mb-3">Selected Work</h2>
            <p className="text-lg text-neutral-600">Creative projects and case studies</p>
          </header>
        </ScrollReveal>

        {/* Filters and View Controls */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={() => {
                  setFilter('all');
                  trackProjectFilter('category', 'all');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all shadow-sm ${
                  filter === 'all'
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/30'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand hover:shadow-md'
                }`}
              >
                All
              </motion.button>
              <motion.button
                onClick={() => {
                  setFilter('featured');
                  trackProjectFilter('category', 'featured');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all shadow-sm ${
                  filter === 'featured'
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/30'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand hover:shadow-md'
                }`}
              >
                Featured
              </motion.button>
              {allTags.map(tag => (
                <motion.button
                  key={tag}
                  onClick={() => {
                    setFilter(tag);
                    trackProjectFilter('tag', tag);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm rounded-full border transition-all shadow-sm ${
                    filter === tag
                      ? 'bg-brand text-white border-brand shadow-lg shadow-brand/30'
                      : 'bg-white text-neutral-600 border-neutral-300 hover:border-brand hover:shadow-md'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all shadow-sm ${
                  viewMode === 'grid'
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all shadow-sm ${
                  viewMode === 'list'
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
                : 'space-y-6'
            }
          >
            {filteredProjects.map((project, index) => (
              <Tilt
                key={project.id}
                tiltMaxAngleX={viewMode === 'grid' ? 5 : 0}
                tiltMaxAngleY={viewMode === 'grid' ? 5 : 0}
                scale={viewMode === 'grid' ? 1.02 : 1}
                transitionSpeed={400}
                className="transform-gpu break-inside-avoid mb-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => {
                    setSelectedProject(project);
                    trackProjectView(project.id, project.title);
                  }}
                  className="cursor-pointer"
                >
                  <CaseStudyTemplate
                    project={project}
                    variant={viewMode === 'list' ? 'minimal' : 'card'}
                  />
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <svg
              className="w-16 h-16 text-neutral-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-neutral-500 text-lg">No projects found matching your filter.</p>
            <p className="text-neutral-400 text-sm mt-2">Try selecting a different category</p>
          </motion.div>
        )}
      </section>

      {/* Process Insights Section */}
      <section className="relative bg-gradient-to-br from-neutral-50 via-purple-50 to-neutral-100 py-20 mt-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand mb-4">
                Process Insights
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Behind every project is a systematic approach to problem-solving and innovation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={0.2}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-accent/10 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="font-bold text-lg text-brand mb-3">Research & Discovery</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Understanding user needs, market context, and technical constraints
                </p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-accent/10 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="font-bold text-lg text-brand mb-3">Design & Prototyping</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Iterative design process with rapid prototyping and user testing
                </p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-accent/10 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="font-bold text-lg text-brand mb-3">Development & Build</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Clean code, scalable architecture, and performance optimization
                </p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-accent/10 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="font-bold text-lg text-brand mb-3">Launch & Optimize</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Deployment, monitoring, and continuous improvement
                </p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
