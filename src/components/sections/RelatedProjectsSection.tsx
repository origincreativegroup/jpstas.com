import { motion } from 'framer-motion';

export interface RelatedProject {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  tags?: string[];
  link?: string;
}

interface RelatedProjectsSectionProps {
  title?: string;
  subtitle?: string;
  projects: RelatedProject[];
  className?: string;
  columns?: number;
  onProjectClick?: (project: RelatedProject) => void;
}

export default function RelatedProjectsSection({
  title = 'Related Projects',
  subtitle,
  projects,
  className = '',
  columns = 3,
  onProjectClick
}: RelatedProjectsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[Math.min(columns, 4)] || 'grid-cols-3';

  const handleClick = (project: RelatedProject) => {
    if (onProjectClick) {
      onProjectClick(project);
    } else if (project.link) {
      window.location.href = project.link;
    }
  };

  return (
    <div className={`py-16 bg-slate-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-slate-600">{subtitle}</p>}
          </div>
        )}

        <motion.div
          className={`grid ${gridCols} gap-6`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              onClick={() => handleClick(project)}
              whileHover={{ y: -10 }}
            >
              {/* Image */}
              {project.image && (
                <div className="relative aspect-video overflow-hidden bg-slate-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Category badge */}
                  {project.category && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* View link */}
                <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>View Project</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        {projects.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Projects</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
