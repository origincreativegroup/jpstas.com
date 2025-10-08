import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TechItem {
  name: string;
  icon?: string | React.ReactNode;
  description?: string;
  category?: string;
  proficiency?: number;
  yearsUsed?: number;
}

interface TechStackSectionProps {
  title?: string;
  subtitle?: string;
  technologies: TechItem[];
  className?: string;
  showTooltips?: boolean;
  layout?: 'grid' | 'categories' | 'cloud';
}

export default function TechStackSection({
  title = 'Technology Stack',
  subtitle,
  technologies,
  className = '',
  showTooltips = true,
  layout = 'grid'
}: TechStackSectionProps) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const categories = Array.from(new Set(technologies.map(t => t.category).filter(Boolean)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const renderTechItem = (tech: TechItem, index: number) => (
    <motion.div
      key={index}
      className="relative group"
      variants={itemVariants}
      onMouseEnter={() => setHoveredTech(tech.name)}
      onMouseLeave={() => setHoveredTech(null)}
      whileHover={{ scale: 1.1, zIndex: 10 }}
    >
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-500">
        {typeof tech.icon === 'string' ? (
          <img src={tech.icon} alt={tech.name} className="w-12 h-12 mx-auto mb-2" />
        ) : (
          <div className="w-12 h-12 mx-auto mb-2 text-blue-600">{tech.icon}</div>
        )}
        <p className="text-sm font-semibold text-slate-800 text-center">{tech.name}</p>

        {tech.proficiency && (
          <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${tech.proficiency}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltips && hoveredTech === tech.name && tech.description && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {tech.description}
          {tech.yearsUsed && <span className="block mt-1 text-blue-300">{tech.yearsUsed} years</span>}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-slate-600">{subtitle}</p>}
          </div>
        )}

        {layout === 'grid' && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technologies.map((tech, index) => renderTechItem(tech, index))}
          </motion.div>
        )}

        {layout === 'categories' && (
          <div className="space-y-12">
            {categories.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{category}</h3>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {technologies
                    .filter(t => t.category === category)
                    .map((tech, index) => renderTechItem(tech, index))}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {layout === 'cloud' && (
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <div className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-500 flex items-center gap-2">
                  {typeof tech.icon === 'string' ? (
                    <img src={tech.icon} alt={tech.name} className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6 text-blue-600">{tech.icon}</div>
                  )}
                  <span className="text-sm font-semibold text-slate-800">{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
