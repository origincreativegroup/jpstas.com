import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface MetricData {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  color?: string;
  description?: string;
}

interface MetricsInfographicProps {
  title?: string;
  subtitle?: string;
  metrics: MetricData[];
  columns?: number;
  className?: string;
  variant?: 'card' | 'minimal' | 'detailed';
  theme?: 'light' | 'dark' | 'gradient';
}

const CounterAnimation = ({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
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
  return <span>{prefix}{displayValue}{suffix}</span>;
};

export default function MetricsInfographic({
  title,
  subtitle,
  metrics,
  columns = 3,
  className = '',
  variant = 'card',
  theme = 'gradient'
}: MetricsInfographicProps) {
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
        return 'bg-white/70 backdrop-blur-sm border-slate-200';
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[Math.min(columns, 4)] || 'grid-cols-3';

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
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
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
        <motion.div className="text-center mb-8 relative z-10" variants={itemVariants}>
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
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className={`grid ${gridCols} gap-6 relative z-10`}>
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${getCardThemeClasses()}`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            {variant === 'detailed' && metric.icon && (
              <div className={`mb-4 ${metric.color || 'text-blue-600'}`}>
                {metric.icon}
              </div>
            )}

            <div className={`text-4xl font-bold mb-2 ${metric.color || (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`}>
              <CounterAnimation
                end={metric.value}
                suffix={metric.suffix || ''}
                prefix={metric.prefix || ''}
                decimals={metric.value % 1 !== 0 ? 1 : 0}
              />
            </div>

            <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
              {metric.label}
            </p>

            {variant === 'detailed' && metric.description && (
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>
                {metric.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
