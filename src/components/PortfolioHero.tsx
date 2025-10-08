import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Project } from '@/types/project';

interface PortfolioHeroProps {
  project: Project;
  onProjectClick: (project: Project) => void;
}

export default function PortfolioHero({ project, onProjectClick }: PortfolioHeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const coverImage = project.images && project.images.length > 0
    ? project.images[0].url
    : '/images/placeholder.svg';

  // Extract first key result
  const keyResult = project.content.results
    ? project.content.results.split('.')[0] + '.'
    : '';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[70vh] md:h-[80vh] mb-12 overflow-hidden rounded-3xl shadow-2xl cursor-pointer group"
      onClick={() => onProjectClick(project)}
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="relative w-full h-full">
          <motion.img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/30 to-purple-900/30 mix-blend-multiply" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Featured Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 text-xs font-bold bg-accent text-brand rounded-full shadow-lg">
                ⭐ FEATURED PROJECT
              </span>
              <span className="px-4 py-2 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                {new Date(project.createdAt).getFullYear()}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.slice(0, 5).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="px-3 py-1 text-sm font-medium text-white/90 border border-white/30 rounded-lg backdrop-blur-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight group-hover:text-accent transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {project.title}
            </motion.h1>

            {/* Role */}
            <motion.p
              className="text-xl md:text-2xl text-accent font-semibold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {project.role}
            </motion.p>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className="text-lg md:text-xl text-white/95 leading-relaxed">
                  {project.summary}
                </p>
              </motion.div>

              {/* Key Result */}
              {keyResult && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-accent font-bold text-sm mb-2">KEY RESULT</p>
                      <p className="text-white font-semibold text-lg">{keyResult}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="px-6 py-3 bg-accent text-brand rounded-xl font-bold hover:bg-accent-dark transition-all shadow-lg hover:shadow-xl group-hover:translate-x-2 flex items-center gap-2">
                <span>View Full Case Study</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {project.content.technologies && project.content.technologies.length > 0 && (
                <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="font-medium">
                    {project.content.technologies.slice(0, 3).join(' • ')}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hover Indicator */}
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 90 }}
      >
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
