import { motion } from 'framer-motion';
import { Project } from '@/types/project';

interface PortfolioCardProps {
  project: Project;
  size: 'small' | 'medium' | 'large';
  index: number;
  onProjectClick: (project: Project) => void;
}

export default function PortfolioCard({ project, size, index, onProjectClick }: PortfolioCardProps) {
  const sizeStyles = {
    small: 'col-span-1 row-span-1',
    medium: 'md:col-span-2 md:row-span-1',
    large: 'md:col-span-2 md:row-span-2'
  };

  const heightStyles = {
    small: 'h-80',
    medium: 'h-80 md:h-80',
    large: 'h-80 md:h-[42rem]'
  };

  const coverImage = project.images && project.images.length > 0 && project.images[0]
    ? project.images[0].url
    : '/images/placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`${sizeStyles[size]} group`}
    >
      <div
        onClick={() => onProjectClick(project)}
        className={`${heightStyles[size]} relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.tags.slice(0, size === 'large' ? 4 : 2).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-semibold bg-accent text-brand rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.featured && (
              <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                ⭐ Featured
              </span>
            )}
          </motion.div>

          {/* Title */}
          <h3 className={`font-bold text-white mb-2 group-hover:text-accent transition-colors ${
            size === 'large' ? 'text-3xl md:text-4xl' : size === 'medium' ? 'text-2xl' : 'text-xl'
          }`}>
            {project.title}
          </h3>

          {/* Role */}
          <p className="text-white/80 text-sm mb-3 font-medium">
            {project.role}
          </p>

          {/* Summary - Only show on medium and large cards */}
          {(size === 'medium' || size === 'large') && (
            <p className="text-white/90 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4">
              {project.summary}
            </p>
          )}

          {/* Quick Stats - Only show on large cards */}
          {size === 'large' && project.content.results && (
            <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-accent font-semibold text-sm mb-1">Key Result</p>
              <p className="text-white text-sm">
                {project.content.results.split('.')[0]}.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center text-accent group-hover:translate-x-2 transition-transform duration-300">
            <span className="text-sm font-semibold">View Case Study</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>

        {/* Hover Indicator */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1, rotate: 90 }}
        >
          <svg
            className="w-6 h-6 text-brand"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
