import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '@/context/CMSContext';
import { api } from '@/services/apiClient';
import { Project } from '@/types/project';
import Navigation from '../components/Navigation';

// Project interface is now imported from types/project

export default function Home() {
  const { pageContent, fetchPageContent } = useCMS();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent('home');
    fetchFeaturedProjects();
  }, [fetchPageContent]);

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

  const hero = pageContent?.hero;

  return (
    <>
      <Navigation />
      <section className="relative min-h-screen bg-brand text-white overflow-hidden">
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

          <div className="mt-8 flex gap-4">
            <Link
              to={hero?.ctaPrimary?.link || '/portfolio'}
              className="px-5 py-3 rounded-xl bg-accent text-brand font-semibold hover:bg-accent-dark transition-colors"
            >
              {hero?.ctaPrimary?.text || 'View Work'}
            </Link>
            {hero?.ctaSecondary && (
              <Link
                to={hero.ctaSecondary.link}
                className="px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:bg-brand-light transition-colors"
              >
                {hero.ctaSecondary.text}
              </Link>
            )}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Featured Work</h2>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-accent/30 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-accent/30 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-accent/30 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : featuredProjects.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {featuredProjects.map(project => (
                  <Link
                    key={project.id}
                    to={`/portfolio?project=${project.id}`}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="text-xs font-semibold text-accent mb-2">
                      {project.tags.join(' • ')}
                    </div>
                    <div className="text-xl font-bold group-hover:text-accent transition-colors">
                      {project.title}
                    </div>
                    <div className="mt-2 text-brand-light">{project.summary}</div>
                    {project.content.results && (
                      <div className="mt-3 text-sm text-accent font-medium">
                        {project.content.results.split('.')[0]}.
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-brand-light">No featured projects available.</p>
                <Link
                  to="/admin"
                  className="inline-block mt-4 px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                >
                  Add Featured Projects
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
