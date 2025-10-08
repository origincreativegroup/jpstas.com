import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface ComparisonItem {
  label: string;
  before: number | string;
  after: number | string;
  improvement?: string;
  icon?: React.ReactNode;
  isNumeric?: boolean;
}

interface ComparisonInfographicProps {
  title?: string;
  subtitle?: string;
  items: ComparisonItem[];
  className?: string;
  theme?: 'light' | 'dark' | 'gradient';
  layout?: 'side-by-side' | 'stacked' | 'slider';
  highlightImprovement?: boolean;
}

const CounterAnimation = ({
  end,
  duration = 2000,
  suffix = ''
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span>{count}{suffix}</span>;
};

export default function ComparisonInfographic({
  title,
  subtitle,
  items,
  className = '',
  theme = 'gradient',
  layout = 'side-by-side',
  highlightImprovement = true
}: ComparisonInfographicProps) {
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
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const slideVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" } as any
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
        return 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-slate-900';
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

  const renderSideBySide = () => (
    <div className="space-y-6 relative z-10">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`rounded-xl p-6 border ${getCardThemeClasses()}`}
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-4">
            {item.icon && <div className="text-blue-600">{item.icon}</div>}
            <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {item.label}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800"
              variants={slideVariants}
            >
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">
                Before
              </div>
              <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                {item.isNumeric !== false && typeof item.before === 'number' ? (
                  <CounterAnimation end={item.before} />
                ) : (
                  item.before
                )}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800"
              variants={slideVariants}
            >
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 uppercase tracking-wide">
                After
              </div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {item.isNumeric !== false && typeof item.after === 'number' ? (
                  <CounterAnimation end={item.after} />
                ) : (
                  item.after
                )}
              </div>
            </motion.div>
          </div>

          {/* Improvement */}
          {highlightImprovement && item.improvement && (
            <motion.div
              className="mt-4 text-center"
              variants={itemVariants}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {item.improvement}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderStacked = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`rounded-xl p-6 border ${getCardThemeClasses()}`}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            {item.icon && <div className="text-blue-600">{item.icon}</div>}
            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {item.label}
            </h4>
          </div>

          <div className="space-y-4">
            {/* Before */}
            <div>
              <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                Before
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                {item.isNumeric !== false && typeof item.before === 'number' ? (
                  <CounterAnimation end={item.before} />
                ) : (
                  item.before
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* After */}
            <div>
              <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                After
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                {item.isNumeric !== false && typeof item.after === 'number' ? (
                  <CounterAnimation end={item.after} />
                ) : (
                  item.after
                )}
              </div>
            </div>

            {/* Improvement */}
            {highlightImprovement && item.improvement && (
              <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                <div className={`text-sm font-semibold text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  {item.improvement}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSlider = () => (
    <div className="space-y-8 relative z-10">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`rounded-xl overflow-hidden border ${getCardThemeClasses()}`}
          variants={itemVariants}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {item.icon && <div className="text-blue-600">{item.icon}</div>}
              <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {item.label}
              </h4>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-white/10">
              <div className="pr-6">
                <div className={`text-xs font-semibold mb-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} uppercase tracking-wide`}>
                  Before
                </div>
                <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                  {item.isNumeric !== false && typeof item.before === 'number' ? (
                    <CounterAnimation end={item.before} />
                  ) : (
                    item.before
                  )}
                </div>
              </div>

              <div className="pl-6">
                <div className={`text-xs font-semibold mb-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} uppercase tracking-wide`}>
                  After
                </div>
                <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  {item.isNumeric !== false && typeof item.after === 'number' ? (
                    <CounterAnimation end={item.after} />
                  ) : (
                    item.after
                  )}
                </div>
              </div>
            </div>

            {highlightImprovement && item.improvement && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.improvement}
                </div>
              </div>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-300 rounded-full blur-2xl"></div>
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
            <p className={`text-lg ${theme === 'dark' ? 'text-orange-200' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {layout === 'side-by-side' && renderSideBySide()}
      {layout === 'stacked' && renderStacked()}
      {layout === 'slider' && renderSlider()}
    </motion.div>
  );
}
