import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SectionPanelProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  index: number;
  viewMode?: 'grid' | 'list';
}

const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  description,
  icon,
  route,
  index,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ x: 4 }}
        className="group"
      >
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Navigate to ${title}`}
          className="relative bg-white border border-indigo-200 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">{icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-indigo-900 group-hover:text-amber-600 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-indigo-600 text-sm mt-1 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-indigo-400 group-hover:text-amber-500 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Navigate to ${title}`}
        className="relative bg-white border border-indigo-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 h-full"
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-amber-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl text-white">{icon}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-indigo-900 mb-3 group-hover:text-amber-600 transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          <p className="text-indigo-600 text-sm leading-relaxed flex-1 group-hover:text-indigo-700 transition-colors duration-200">
            {description}
          </p>

          {/* Action Indicator */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Explore
            </span>
            <div className="text-indigo-400 group-hover:text-amber-500 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Subtle Border Animation */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-200/50 transition-colors duration-300" />
      </div>
    </motion.div>
  );
};

export default SectionPanel;
