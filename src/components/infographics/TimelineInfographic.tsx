import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  tags?: string[];
  image?: string;
}

interface TimelineInfographicProps {
  title?: string;
  subtitle?: string;
  events: TimelineEvent[];
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark' | 'gradient';
  alternating?: boolean; // For vertical timeline
}

export default function TimelineInfographic({
  title,
  subtitle,
  events,
  className = '',
  orientation = 'vertical',
  theme = 'gradient',
  alternating = true
}: TimelineInfographicProps) {
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

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { duration: 0.4, ease: "backOut" } as any
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

  const getCardThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-white/10 backdrop-blur-sm border-white/20';
      case 'light':
        return 'bg-slate-50 border-slate-200';
      case 'gradient':
      default:
        return 'bg-white/80 backdrop-blur-sm border-slate-200';
    }
  };

  const getDefaultColor = (index: number) => {
    const colors = ['blue', 'purple', 'green', 'orange', 'pink', 'indigo'];
    return colors[index % colors.length];
  };

  const renderVerticalTimeline = () => (
    <div className="relative max-w-4xl mx-auto">
      {/* Central line */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 ${
        theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'
      }`} />

      {events.map((event, index) => {
        const isLeft = alternating ? index % 2 === 0 : false;
        const colorClass = event.color || getDefaultColor(index);

        return (
          <motion.div
            key={event.id}
            className={`relative flex items-center mb-12 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
            variants={itemVariants}
          >
            {/* Content */}
            <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <motion.div
                className={`rounded-xl p-6 border ${getCardThemeClasses()} transition-all duration-300 hover:shadow-lg`}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <div className={`text-sm font-semibold mb-2 text-${colorClass}-600`}>
                  {event.date}
                </div>
                <h4 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {event.title}
                </h4>
                {event.description && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                    {event.description}
                  </p>
                )}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-2 py-1 text-xs rounded-full ${
                          theme === 'dark'
                            ? 'bg-white/10 text-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Dot */}
            <motion.div
              className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-${colorClass}-600 border-4 ${
                theme === 'dark' ? 'border-slate-900' : 'border-white'
              } flex items-center justify-center shadow-lg z-10`}
              variants={dotVariants}
            >
              {event.icon && (
                <div className="text-white text-xs">
                  {event.icon}
                </div>
              )}
            </motion.div>

            {/* Spacer */}
            <div className="w-5/12" />
          </motion.div>
        );
      })}
    </div>
  );

  const renderHorizontalTimeline = () => (
    <div className="relative w-full overflow-x-auto pb-8">
      {/* Horizontal line */}
      <div className={`absolute top-8 left-0 right-0 h-0.5 ${
        theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'
      }`} />

      <div className="flex gap-8 min-w-max px-4">
        {events.map((event, index) => {
          const colorClass = event.color || getDefaultColor(index);

          return (
            <motion.div
              key={event.id}
              className="flex flex-col items-center min-w-[280px]"
              variants={itemVariants}
            >
              {/* Dot */}
              <motion.div
                className={`w-8 h-8 rounded-full bg-${colorClass}-600 border-4 ${
                  theme === 'dark' ? 'border-slate-900' : 'border-white'
                } flex items-center justify-center shadow-lg mb-6 z-10`}
                variants={dotVariants}
              >
                {event.icon && (
                  <div className="text-white text-xs">
                    {event.icon}
                  </div>
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                className={`rounded-xl p-5 border ${getCardThemeClasses()} transition-all duration-300 hover:shadow-lg w-full`}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className={`text-sm font-semibold mb-2 text-${colorClass}-600`}>
                  {event.date}
                </div>
                <h4 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {event.title}
                </h4>
                {event.description && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                    {event.description}
                  </p>
                )}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-2 py-1 text-xs rounded-full ${
                          theme === 'dark'
                            ? 'bg-white/10 text-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
        </div>
      )}
      {theme === 'dark' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
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

      {/* Timeline */}
      <div className="relative z-10">
        {orientation === 'vertical' ? renderVerticalTimeline() : renderHorizontalTimeline()}
      </div>
    </motion.div>
  );
}
