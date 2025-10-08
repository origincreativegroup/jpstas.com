import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface TechItem {
  name: string;
  category?: string;
  icon?: React.ReactNode;
  description?: string;
  proficiency?: number; // 0-100
  color?: string;
}

export interface TechCategory {
  name: string;
  items: TechItem[];
  icon?: React.ReactNode;
  color?: string;
}

interface TechnologyStackInfographicProps {
  title?: string;
  subtitle?: string;
  technologies?: TechItem[];
  categories?: TechCategory[];
  className?: string;
  layout?: 'grid' | 'grouped' | 'layered';
  theme?: 'light' | 'dark' | 'gradient';
  showProficiency?: boolean;
}

export default function TechnologyStackInfographic({
  title,
  subtitle,
  technologies = [],
  categories = [],
  className = '',
  layout = 'grid',
  theme = 'gradient',
  showProficiency = false
}: TechnologyStackInfographicProps) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" } as any
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (proficiency: number) => ({
      width: `${proficiency}%`,
      transition: { duration: 1, ease: "easeOut" } as any
    })
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white';
      case 'light':
        return 'bg-white text-slate-900';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900';
    }
  };

  const getCardThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20';
      case 'light':
        return 'bg-slate-50 border-slate-200 hover:bg-slate-100';
      case 'gradient':
      default:
        return 'bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white';
    }
  };

  const renderGridLayout = () => {
    const items = technologies.length > 0 ? technologies : categories.flatMap(cat => cat.items);

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
        {items.map((tech, index) => (
          <motion.div
            key={index}
            className={`rounded-xl p-4 border transition-all duration-300 text-center ${getCardThemeClasses()}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {tech.icon && (
              <div className={`mb-3 flex justify-center ${tech.color || 'text-blue-600'}`}>
                {tech.icon}
              </div>
            )}
            <h4 className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {tech.name}
            </h4>
            {tech.description && (
              <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>
                {tech.description}
              </p>
            )}
            {showProficiency && tech.proficiency !== undefined && (
              <div className="mt-3">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${tech.color ? `bg-${tech.color}` : 'bg-blue-600'} rounded-full`}
                    variants={progressVariants}
                    custom={tech.proficiency}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderGroupedLayout = () => (
    <div className="space-y-8 relative z-10">
      {categories.map((category, catIndex) => (
        <motion.div
          key={catIndex}
          variants={categoryVariants}
        >
          <div className="flex items-center gap-3 mb-4">
            {category.icon && (
              <div className={`${category.color || 'text-blue-600'}`}>
                {category.icon}
              </div>
            )}
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {category.name}
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {category.items.map((tech, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-3 border transition-all duration-300 text-center ${getCardThemeClasses()}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                {tech.icon && (
                  <div className={`mb-2 flex justify-center ${tech.color || category.color || 'text-blue-600'}`}>
                    {tech.icon}
                  </div>
                )}
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                  {tech.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderLayeredLayout = () => {
    const layers = categories.length > 0 ? categories : [
      { name: 'Technologies', items: technologies }
    ];

    return (
      <div className="flex flex-col gap-4 relative z-10">
        {layers.map((layer, layerIndex) => (
          <motion.div
            key={layerIndex}
            className={`rounded-xl p-6 border ${getCardThemeClasses()}`}
            variants={categoryVariants}
            style={{
              marginLeft: `${layerIndex * 20}px`,
              marginRight: `${layerIndex * 20}px`,
            }}
          >
            <h4 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {layer.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((tech, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech.icon && (
                    <div className={`${tech.color || layer.color || 'text-blue-600'}`}>
                      {tech.icon}
                    </div>
                  )}
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      className={`${getThemeClasses()} rounded-2xl p-8 overflow-hidden relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Background Effects */}
      {theme === 'gradient' && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
        </div>
      )}
      {theme === 'dark' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        </div>
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8 relative z-10">
          {title && (
            <h3 className={`text-3xl font-bold mb-2 font-montserrat ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-lg ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Tech Stack Visualization */}
      {layout === 'grid' && renderGridLayout()}
      {layout === 'grouped' && renderGroupedLayout()}
      {layout === 'layered' && renderLayeredLayout()}
    </motion.div>
  );
}
