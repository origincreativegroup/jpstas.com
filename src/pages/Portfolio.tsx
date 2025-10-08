import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudyTemplate from '../components/CaseStudyTemplate';
import PortfolioHero from '../components/PortfolioHero';
import PortfolioBentoGrid from '../components/PortfolioBentoGrid';
import { mockApi } from '../utils/mockApi';
import { usePortfolioTracking } from '@/hooks/useAnalytics';
import { SEO } from '../components/SEO';
import Navigation from '../components/Navigation';

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

// Category mapping for cleaner filtering
const CATEGORIES = {
  'e-commerce': ['e-commerce', 'digital transformation', 'WordPress', 'WooCommerce'],
  'design-systems': ['UX design', 'branding', 'process design', 'UI/UX'],
  'media-production': ['large-format printing', 'video production', 'animation', 'apparel'],
  'automation': ['workflow automation', 'AI integration', 'process optimization', 'integration'],
};

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
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
      // Silently handle error - will show empty state
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by category or featured status
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    if (filter === 'featured') return projects.filter(p => p.featured);

    // Filter by category
    const categoryTags = CATEGORIES[filter as keyof typeof CATEGORIES] || [];
    return projects.filter(project =>
      project.tags.some(tag =>
        categoryTags.some(catTag =>
          tag.toLowerCase().includes(catTag.toLowerCase())
        )
      )
    );
  }, [projects, filter]);

  // Get hero project (first featured project that isn't in filtered results for other categories)
  const heroProject = useMemo(() => {
    if (filter === 'all' || filter === 'featured') {
      // Show hero for all/featured views
      const featured = projects.filter(p => p.featured);
      return featured.length > 0 ? featured[0] : null;
    }
    return null;
  }, [projects, filter]);

  // Get grid projects (exclude hero if showing)
  const gridProjects = useMemo(() => {
    if (heroProject) {
      return filteredProjects.filter(p => p.id !== heroProject.id);
    }
    return filteredProjects;
  }, [filteredProjects, heroProject]);

  if (loading) {
    return (
      <>
        <SEO
          title="Portfolio"
          description="Explore my portfolio of design and development projects."
        />
        <Navigation />
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
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-neutral-100">
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
        </div>
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
      <Navigation />
      <div className="min-h-screen bg-neutral-50">
        {/* Portfolio Header - Enhanced */}
        <section className="relative bg-gradient-to-br from-brand via-purple-900 to-purple-950 text-white py-20 overflow-hidden">
          {/* Diagonal Stripes Overlay */}
          <div className="diagonal-stripes absolute inset-0 opacity-5"></div>

          {/* Animated Gradient Orb */}
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4">Portfolio</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
                Selected work in e-commerce, design systems, media production, and automation.
                <span className="block mt-2 text-accent font-semibold">
                  {projects.length} projects • {projects.filter(p => p.featured).length} featured
                </span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
          {/* Category Filters - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-20 z-40 bg-neutral-50/95 backdrop-blur-lg py-6 -mx-6 px-6 mb-12 border-b border-neutral-200/50"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setFilter('all');
                  trackProjectFilter('category', 'all');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                All Projects
                <span className="ml-2 text-xs opacity-75">({projects.length})</span>
              </button>
              <button
                onClick={() => {
                  setFilter('featured');
                  trackProjectFilter('category', 'featured');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'featured'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                ⭐ Featured
                <span className="ml-2 text-xs opacity-75">({projects.filter(p => p.featured).length})</span>
              </button>
              <button
                onClick={() => {
                  setFilter('e-commerce');
                  trackProjectFilter('category', 'e-commerce');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'e-commerce'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                E-commerce
              </button>
              <button
                onClick={() => {
                  setFilter('design-systems');
                  trackProjectFilter('category', 'design-systems');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'design-systems'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                Design Systems
              </button>
              <button
                onClick={() => {
                  setFilter('media-production');
                  trackProjectFilter('category', 'media-production');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'media-production'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                Media Production
              </button>
              <button
                onClick={() => {
                  setFilter('automation');
                  trackProjectFilter('category', 'automation');
                }}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  filter === 'automation'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 hover:border-brand/30'
                }`}
              >
                Automation
              </button>
            </div>
          </motion.div>

          {/* Hero Featured Project */}
          {heroProject && (
            <PortfolioHero
              project={heroProject}
              onProjectClick={(project) => {
                setSelectedProject(project);
                trackProjectView(project.id, project.title);
              }}
            />
          )}

          {/* Bento Grid */}
          <PortfolioBentoGrid
            projects={gridProjects}
            onProjectClick={(project) => {
              setSelectedProject(project);
              trackProjectView(project.id, project.title);
            }}
            filterKey={filter}
          />
        </section>
      </div>
    </>
  );
}
