import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { loadNavSections, NavSection } from '../utils/contentLoader';
import { useCMS } from '@/context/CMSContext';
import { api } from '@/services/apiClient';
import { Project } from '@/types/project';
import SectionPanel from '../components/experience/SectionPanel';
import BootSequence from '../components/experience/BootSequence';
import CMSAdmin from '../components/CMSAdmin';
import { useWorkshopTracking } from '@/hooks/useAnalytics';

const WorkshopHub: React.FC = () => {
  const { pageContent, fetchPageContent } = useCMS();
  const [sections, setSections] = useState<NavSection[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const { trackSectionView } = useWorkshopTracking();
  const [loading, setLoading] = useState(true);
  const [showBootSequence, setShowBootSequence] = useState(() => {
    // Check if boot sequence has been shown in this session
    return !sessionStorage.getItem('bootSequenceShown');
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmsAdminOpen, setCmsAdminOpen] = useState(false);

  useEffect(() => {
    fetchPageContent('home');
    loadNavSections().then(loadedSections => {
      setSections(loadedSections);
    });
    fetchFeaturedProjects();
  }, [fetchPageContent]);

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const fetchFeaturedProjects = async () => {
    try {
      const allProjects = await api.getProjects();
      const featured = allProjects.filter(project => project.featured).slice(0, 3);
      setFeaturedProjects(featured);
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch =
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase());
    // For now, all sections match all categories since NavSection doesn't have category
    const matchesCategory =
      selectedCategory === 'all' ||
      section.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      section.description.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'design', 'development', 'innovation', 'story', 'skills'];

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/resume', label: 'Resume' },
    { to: '/workshop/contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleBootComplete = () => {
    // Mark boot sequence as shown in this session
    sessionStorage.setItem('bootSequenceShown', 'true');
    setShowBootSequence(false);
  };

  if (showBootSequence) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>
          <p className="text-brand font-medium">Loading Workshop...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Navigation */}
      <header
        className={`sticky top-0 z-50 border-b border-accent/20 transition-all duration-300 ${
          scrolled ? 'bg-brand/98 backdrop-blur-md shadow-lg' : 'bg-brand/95 backdrop-blur'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 z-50" onClick={handleLinkClick}>
            <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-brand font-bold text-sm">JP</span>
            </div>
            <span className="font-bold tracking-tight text-white">John P. Stas</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold text-accent'
                    : 'text-white hover:text-accent transition-colors'
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* CMS Admin Button */}
            <button
              onClick={() => setCmsAdminOpen(true)}
              className="px-3 py-1 text-xs bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
              title="Open CMS Admin"
            >
              CMS
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-accent transition-colors z-50"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-brand/98 backdrop-blur-md border-t border-accent/20"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-accent' : 'text-white hover:text-accent'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setCmsAdminOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-medium text-white hover:text-accent transition-colors"
                >
                  CMS Admin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {(() => {
        const hero = pageContent?.hero;
        return (
          <div className="min-h-screen bg-brand text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen">
              {/* Hero Background Image */}
              {hero?.backgroundImage && (
                <div className="absolute inset-0">
                  <img
                    src={hero.backgroundImage.url}
                    alt={hero.backgroundImage.alt}
                    className="w-full h-full object-cover"
                  />
                  {hero.overlay?.enabled && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: hero.overlay.color,
                        opacity: hero.overlay.opacity,
                      }}
                    />
                  )}
                </div>
              )}

              {/* Diagonal Stripes Overlay */}
              <div className="diagonal-stripes absolute inset-0 opacity-5"></div>

              <div className="relative max-w-6xl mx-auto px-4 py-20">
                {hero?.subtitle && (
                  <div className="inline-block rounded-2xl px-3 py-1 text-xs font-semibold bg-accent text-brand mb-5">
                    {hero.subtitle}
                  </div>
                )}

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  {hero?.title || 'Creative Technologist, Designer, & Process Innovator'}
                </h1>

                <p className="mt-6 text-lg max-w-2xl text-brand-light">
                  {hero?.description ||
                    'I build bold, vector-clean experiences that bridge design, code, and operations. From in-house print studios to SaaS concepts, I ship systems that scale.'}
                </p>

                {/* Workshop Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                    onClick={() => trackSectionView('design-bench')}
                  >
                    <div className="flex items-center space-x-3">
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
                      <div>
                        <h3 className="font-semibold text-white">Design Bench</h3>
                        <p className="text-sm text-brand-light">Creative tools & processes</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                    onClick={() => trackSectionView('development-desk')}
                  >
                    <div className="flex items-center space-x-3">
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
                      <div>
                        <h3 className="font-semibold text-white">Development Desk</h3>
                        <p className="text-sm text-brand-light">Code & technical solutions</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                    onClick={() => trackSectionView('innovation-bay')}
                  >
                    <div className="flex items-center space-x-3">
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
                      <div>
                        <h3 className="font-semibold text-white">Innovation Bay</h3>
                        <p className="text-sm text-brand-light">Process & workflow optimization</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="mt-12 flex justify-center">
                  <div className="relative">
                    <img
                      src="/images/headshot.svg"
                      alt="John P. Stas - Creative Technologist"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-2xl border-2 border-accent/30"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-brand"
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
                  </div>
                </div>

                {/* Portfolio Showcase Section */}
                <div className="mt-20">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio Showcase</h2>
                    <p className="text-lg text-brand-light max-w-2xl mx-auto">
                      Explore detailed case studies and project breakdowns showcasing the full
                      creative process.
                    </p>
                  </div>

                  {/* Portfolio Navigation */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-brand-light">Filter by:</span>
                      {['all', 'featured', 'e-commerce', 'design', 'development', 'process'].map(
                        filter => (
                          <button
                            key={filter}
                            onClick={() => setSelectedCategory(filter)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedCategory === filter
                                ? 'bg-accent text-brand'
                                : 'bg-white/10 text-brand-light hover:bg-white/20'
                            }`}
                          >
                            {filter === 'all'
                              ? 'All Projects'
                              : filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </button>
                        )
                      )}
                    </div>

                    <Link
                      to="/portfolio"
                      className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors text-sm font-medium"
                    >
                      View Full Portfolio →
                    </Link>
                  </div>

                  {/* Portfolio Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-accent/10"
                      >
                        {/* Project Image Placeholder */}
                        <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-brand/20 rounded-xl mb-4 flex items-center justify-center">
                          <div className="text-4xl opacity-50">
                            {project.tags.includes('E-commerce')
                              ? '🛒'
                              : project.tags.includes('Design')
                                ? '🎨'
                                : project.tags.includes('Development')
                                  ? '💻'
                                  : '⚡'}
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-accent">
                              {project.tags.join(' • ')}
                            </div>
                            <div className="text-xs text-brand-light">
                              {new Date(project.createdAt).getFullYear()}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>

                          <p className="text-brand-light text-sm leading-relaxed">
                            {project.summary}
                          </p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2">
                            {project.content.technologies.slice(0, 3).map(tech => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.content.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-brand/20 text-brand-light text-xs rounded-md">
                                +{project.content.technologies.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Results */}
                          {project.content.results && (
                            <div className="pt-2 border-t border-accent/20">
                              <div className="text-sm text-accent font-medium">
                                {project.content.results.split('.')[0]}.
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <Link
                            to={`/portfolio?project=${project.id}`}
                            className="inline-flex items-center text-accent hover:text-accent-dark transition-colors text-sm font-medium group-hover:translate-x-1 transform duration-200"
                          >
                            View Case Study
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Workshop Sections */}
            <section className="relative bg-brand-light text-brand py-20">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Workshop</h2>
                  <p className="text-lg text-neutral-warm max-w-2xl mx-auto">
                    Explore my creative laboratory - a collection of tools, processes, and
                    innovations.
                  </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-neutral-warm"
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
                        <input
                          type="text"
                          placeholder="Search sections..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-accent/30 rounded-lg bg-white text-brand placeholder-neutral-warm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-accent/10 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'grid'
                              ? 'bg-white shadow-sm text-brand'
                              : 'text-accent hover:text-accent-dark'
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'list'
                              ? 'bg-white shadow-sm text-brand'
                              : 'text-accent hover:text-accent-dark'
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                  </div>

                  {/* Category Filter */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedCategory === category
                              ? 'bg-brand text-white shadow-sm'
                              : 'bg-accent/10 text-accent hover:bg-accent/20'
                          }`}
                        >
                          {category === 'all'
                            ? 'All Sections'
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workshop Sections Grid/List */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {filteredSections.map((section, index) => (
                      <SectionPanel
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        description={section.description}
                        icon={section.icon}
                        route={section.route}
                        index={index}
                        viewMode={viewMode}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredSections.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-accent"
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
                    <h3 className="text-lg font-medium text-brand mb-2">No sections found</h3>
                    <p className="text-accent/70">
                      {searchQuery
                        ? 'Try adjusting your search terms'
                        : 'No sections match the selected category'}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand text-white">
              <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
                        <span className="text-brand font-bold text-sm">JP</span>
                      </div>
                      <span className="text-xl font-bold">John P. Stas</span>
                    </div>
                    <p className="text-brand-light mb-6 max-w-md">
                      Creative technologist building the future through design, development, and
                      innovation.
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="mailto:johnpstas@gmail.com"
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/johnpstas"
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://github.com/johnpstas"
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Workshop</h3>
                    <ul className="space-y-2 text-sm text-brand-light">
                      <li>
                        <Link to="/workshop" className="hover:text-accent transition-colors">
                          Design Bench
                        </Link>
                      </li>
                      <li>
                        <Link to="/workshop" className="hover:text-accent transition-colors">
                          Development Desk
                        </Link>
                      </li>
                      <li>
                        <Link to="/workshop" className="hover:text-accent transition-colors">
                          Innovation Bay
                        </Link>
                      </li>
                      <li>
                        <Link to="/workshop" className="hover:text-accent transition-colors">
                          Story Forge
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-accent/20 mt-8 pt-8 text-center text-sm text-brand-light">
                  © 2024 John P. Stas. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        );
      })()}

      {/* CMS Admin Modal */}
      {cmsAdminOpen && <CMSAdmin onClose={() => setCmsAdminOpen(false)} />}
    </>
  );
};

export default WorkshopHub;
