import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import Tilt from 'react-parallax-tilt'; // Reserved for future use
import { TypeAnimation } from 'react-type-animation';
import { useCMS } from '@/context/CMSContext';
import { api } from '@/services/apiClient';
import { Project } from '@/types/project';
import Navigation from '../components/Navigation';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';
import { ParticleBackground } from '../components/ParticleBackground';
import PortfolioCard from '../components/PortfolioCard';
import { generateHomeFeaturedLayout } from '@/utils/bentoLayout';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { pageContent, fetchPageContent } = useCMS();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      // Silently handle error - will show empty state
    } finally {
      setLoading(false);
    }
  };

  const hero = pageContent?.hero;

  return (
    <>
      <SEO
        title="Home"
        description="Creative Technologist, Designer, & Process Innovator. Building bold experiences that bridge design, code, and operations."
        keywords="creative technologist, web developer, designer, portfolio, full-stack developer"
      />
      <Navigation />
      <section className="relative min-h-screen bg-gradient-to-br from-brand via-purple-900 to-brand text-white overflow-hidden">
        {/* Animated Particle Background */}
        <ParticleBackground />

        {/* Hero Background Image with Parallax */}
        {hero?.backgroundImage && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
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
          </motion.div>
        )}

        {/* Diagonal Stripes Overlay */}
        <div className="diagonal-stripes absolute inset-0 opacity-5"></div>

        {/* Animated Gradient Orb */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
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

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {hero?.subtitle && (
              <div className="inline-block rounded-2xl px-3 py-1 text-xs font-semibold bg-accent text-brand mb-5 shadow-lg shadow-accent/50">
                {hero.subtitle}
              </div>
            )}
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TypeAnimation
              sequence={[
                hero?.title || 'Creative Technologist',
                2000,
                'Designer & Innovator',
                2000,
                'Full-Stack Developer',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.h1>

          <motion.p
            className="mt-6 text-lg max-w-2xl text-brand-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {hero?.description ||
              'I build bold, vector-clean experiences that bridge design, code, and operations. From in-house print studios to SaaS concepts, I ship systems that scale.'}
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={hero?.ctaPrimary?.link || '/portfolio'}
                className="px-5 py-3 rounded-xl bg-accent text-brand font-semibold hover:bg-accent-dark transition-all shadow-lg shadow-accent/50 hover:shadow-xl hover:shadow-accent/70 inline-block"
              >
                {hero?.ctaPrimary?.text || 'View Work'}
              </Link>
            </motion.div>
            {hero?.ctaSecondary && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={hero.ctaSecondary.link}
                  className="px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:bg-brand-light transition-all shadow-lg hover:shadow-xl inline-block"
                >
                  {hero.ctaSecondary.text}
                </Link>
              </motion.div>
            )}
          </motion.div>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Featured Work
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    to="/portfolio"
                    className="px-5 py-2.5 text-sm font-bold text-accent hover:text-white border-2 border-accent hover:bg-accent rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <span>View All Projects</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl animate-pulse ${
                        i === 1 ? 'md:col-span-2 md:row-span-2 h-[42rem]' : 'h-80'
                      }`}
                    >
                      <div className="p-6">
                        <div className="h-4 bg-accent/30 rounded w-1/3 mb-3"></div>
                        <div className="h-6 bg-accent/30 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-accent/30 rounded w-full"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                  {generateHomeFeaturedLayout(featuredProjects).map((item, index) => (
                    <PortfolioCard
                      key={item.project.id}
                      project={item.project}
                      size={item.size}
                      index={index}
                      onProjectClick={(project) => {
                        navigate(`/portfolio?project=${project.id}`);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                  <p className="text-white/70 text-lg">Featured projects coming soon.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
