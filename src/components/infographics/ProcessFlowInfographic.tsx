import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface ProcessNode {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  metric?: string;
}

interface ProcessFlowInfographicProps {
  title?: string;
  subtitle?: string;
  nodes: ProcessNode[];
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  theme?: 'light' | 'dark' | 'gradient';
  showConnections?: boolean;
}

export default function ProcessFlowInfographic({
  title,
  subtitle,
  nodes,
  className = '',
  layout = 'horizontal',
  theme = 'gradient',
  showConnections = true
}: ProcessFlowInfographicProps) {
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
        staggerChildren: 0.2
      }
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "backOut" } as any
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" } as any
    }
  };

  const verticalLineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" } as any
    }
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

  const getDefaultNodeColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const renderHorizontalFlow = () => (
    <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
      {nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          {/* Node */}
          <motion.div
            className="flex flex-col items-center min-w-[140px]"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`bg-gradient-to-br ${node.color || getDefaultNodeColor(index)} rounded-xl p-5 min-w-[120px] text-center shadow-lg`}>
              {node.icon && (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  {node.icon}
                </div>
              )}
              <h4 className="font-bold text-white mb-1 text-sm">{node.label}</h4>
              {node.metric && (
                <p className="text-xs text-white/90 font-medium">{node.metric}</p>
              )}
            </div>
            {node.description && (
              <p className={`text-xs mt-3 text-center max-w-[140px] ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                {node.description}
              </p>
            )}
          </motion.div>

          {/* Connecting Line */}
          {showConnections && index < nodes.length - 1 && (
            <motion.div
              className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-4 rounded-full min-w-[40px]"
              variants={lineVariants}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderVerticalFlow = () => (
    <div className="flex flex-col items-center space-y-0 w-full max-w-md mx-auto">
      {nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          {/* Node */}
          <motion.div
            className="flex items-center w-full"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`bg-gradient-to-br ${node.color || getDefaultNodeColor(index)} rounded-xl p-5 w-full text-center shadow-lg`}>
              <div className="flex items-center justify-center gap-4">
                {node.icon && (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    {node.icon}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-white mb-1">{node.label}</h4>
                  {node.description && (
                    <p className="text-xs text-white/90">{node.description}</p>
                  )}
                  {node.metric && (
                    <p className="text-xs text-white/90 font-medium mt-1">{node.metric}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connecting Line */}
          {showConnections && index < nodes.length - 1 && (
            <motion.div
              className="w-1 h-12 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full my-2"
              variants={verticalLineVariants}
              style={{ transformOrigin: 'top' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderGridFlow = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          className="flex flex-col items-center"
          variants={nodeVariants}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className={`bg-gradient-to-br ${node.color || getDefaultNodeColor(index)} rounded-xl p-6 w-full text-center shadow-lg`}>
            {node.icon && (
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                {node.icon}
              </div>
            )}
            <h4 className="font-bold text-white mb-2">{node.label}</h4>
            {node.description && (
              <p className="text-sm text-white/90 mb-2">{node.description}</p>
            )}
            {node.metric && (
              <p className="text-xs text-white/90 font-medium bg-white/20 rounded-full py-1 px-3 inline-block">
                {node.metric}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

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
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-2xl"></div>
        </div>
      )}
      {theme === 'dark' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
        </div>
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10 relative z-10">
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

      {/* Flow Visualization */}
      <div className="relative z-10">
        {layout === 'horizontal' && renderHorizontalFlow()}
        {layout === 'vertical' && renderVerticalFlow()}
        {layout === 'grid' && renderGridFlow()}
      </div>
    </motion.div>
  );
}
