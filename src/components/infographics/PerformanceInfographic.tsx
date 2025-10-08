import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface PerformanceMetric {
  label: string;
  value: number;
  target?: number;
  unit?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

interface PerformanceInfographicProps {
  title?: string;
  subtitle?: string;
  metrics: PerformanceMetric[];
  className?: string;
  theme?: 'light' | 'dark' | 'gradient';
  layout?: 'gauge' | 'bars' | 'circles' | 'dashboard';
  showTrend?: boolean;
}

const CounterAnimation = ({
  end,
  duration = 2000,
  suffix = '',
  decimals = 0
}: {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
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
      const currentValue = progress * end;
      setCount(decimals > 0 ? parseFloat(currentValue.toFixed(decimals)) : Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration, decimals]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : count;
  return <span>{displayValue}{suffix}</span>;
};

export default function PerformanceInfographic({
  title,
  subtitle,
  metrics,
  className = '',
  theme = 'gradient',
  layout = 'dashboard',
  showTrend = true
}: PerformanceInfographicProps) {
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
      width: `${width}%`,
      transition: { duration: 1.2, ease: "easeOut" } as any
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
        return 'bg-white/10 backdrop-blur-sm border-white/20';
      case 'light':
        return 'bg-slate-50 border-slate-200';
      case 'gradient':
      default:
        return 'bg-white/80 backdrop-blur-sm border-slate-200';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend || !showTrend) return null;

    const icons = {
      up: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      down: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      neutral: (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      )
    };

    return icons[trend];
  };

  const renderCircleGauge = (metric: PerformanceMetric, index: number) => {
    const percentage = metric.target ? (metric.value / metric.target) * 100 : metric.value;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const color = metric.color || 'blue';

    return (
      <motion.div
        key={index}
        className={`rounded-xl p-6 border ${getCardThemeClasses()} text-center`}
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="transform -rotate-90" width="128" height="128">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke={`var(--${color}-600, #3B82F6)`}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={inView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold">
              <CounterAnimation
                end={percentage}
                suffix="%"
                decimals={0}
              />
            </div>
          </div>
        </div>
        <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          {metric.label}
        </h4>
        <div className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
          <CounterAnimation end={metric.value} suffix={metric.unit || ''} />
          {metric.target && <span className="text-xs"> / {metric.target}{metric.unit}</span>}
        </div>
        {metric.description && (
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>
            {metric.description}
          </p>
        )}
      </motion.div>
    );
  };

  const renderBarLayout = () => (
    <div className="space-y-6 relative z-10">
      {metrics.map((metric, index) => {
        const percentage = metric.target ? (metric.value / metric.target) * 100 : metric.value;
        const color = metric.color || 'blue';

        return (
          <motion.div
            key={index}
            className={`rounded-xl p-5 border ${getCardThemeClasses()}`}
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {metric.label}
                </h4>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold text-${color}-600`}>
                  <CounterAnimation
                    end={metric.value}
                    suffix={metric.unit || ''}
                    decimals={metric.value % 1 !== 0 ? 1 : 0}
                  />
                </div>
                {metric.target && (
                  <div className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                    of {metric.target}{metric.unit}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className={`h-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                <motion.div
                  className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
                  variants={barVariants}
                  custom={Math.min(percentage, 100)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                />
              </div>
              {metric.target && (
                <div className="text-xs text-right mt-1 text-slate-500">
                  {percentage.toFixed(0)}%
                </div>
              )}
            </div>

            {metric.description && (
              <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                {metric.description}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderDashboardLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
      {metrics.map((metric, index) => {
        const color = metric.color || 'blue';
        return (
          <motion.div
            key={index}
            className={`rounded-xl p-6 border ${getCardThemeClasses()}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                {metric.label}
              </h4>
              {getTrendIcon(metric.trend)}
            </div>

            <div className={`text-4xl font-bold mb-2 text-${color}-600`}>
              <CounterAnimation
                end={metric.value}
                suffix={metric.unit || ''}
                decimals={metric.value % 1 !== 0 ? 1 : 0}
              />
            </div>

            {metric.description && (
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                {metric.description}
              </p>
            )}

            {metric.target && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}>
                    Target: {metric.target}{metric.unit}
                  </span>
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}>
                    {((metric.value / metric.target) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className={`h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                  <motion.div
                    className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
                    variants={barVariants}
                    custom={Math.min((metric.value / metric.target) * 100, 100)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
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

      {/* Content */}
      {layout === 'circles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {metrics.map((metric, index) => renderCircleGauge(metric, index))}
        </div>
      )}
      {layout === 'bars' && renderBarLayout()}
      {layout === 'dashboard' && renderDashboardLayout()}
      {layout === 'gauge' && renderDashboardLayout()}
    </motion.div>
  );
}
