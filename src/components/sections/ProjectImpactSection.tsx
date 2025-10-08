import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface ImpactMetric {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  description?: string;
  isNumeric?: boolean;
}

interface ProjectImpactSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  metrics: ImpactMetric[];
  className?: string;
  theme?: 'light' | 'dark' | 'gradient';
  layout?: 'grid' | 'showcase' | 'highlight';
}

const CounterAnimation = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = ''
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
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

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export default function ProjectImpactSection({
  title = 'Project Impact',
  subtitle,
  description,
  metrics,
  className = '',
  theme = 'gradient',
  layout = 'grid'
}: ProjectImpactSectionProps) {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } as any
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 text-white';
      case 'light':
        return 'bg-white text-slate-900';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white';
    }
  };

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          {metric.icon && (
            <div className="mb-4 flex justify-center text-white/80">
              {metric.icon}
            </div>
          )}
          <div className="text-4xl font-bold mb-2">
            {metric.isNumeric !== false && typeof metric.value === 'number' ? (
              <CounterAnimation
                end={metric.value}
                suffix={metric.suffix || ''}
                prefix={metric.prefix || ''}
              />
            ) : (
              <span>{metric.prefix}{metric.value}{metric.suffix}</span>
            )}
          </div>
          <p className="font-medium mb-1">{metric.label}</p>
          {metric.description && (
            <p className="text-sm text-white/70">{metric.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderShowcaseLayout = () => (
    <div className="space-y-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 flex items-center gap-6"
          variants={itemVariants}
          whileHover={{ x: 10 }}
        >
          {metric.icon && (
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-white/80">
              {metric.icon}
            </div>
          )}
          <div className="flex-1">
            <div className="text-5xl font-bold mb-2">
              {metric.isNumeric !== false && typeof metric.value === 'number' ? (
                <CounterAnimation
                  end={metric.value}
                  suffix={metric.suffix || ''}
                  prefix={metric.prefix || ''}
                />
              ) : (
                <span>{metric.prefix}{metric.value}{metric.suffix}</span>
              )}
            </div>
            <p className="text-xl font-semibold mb-1">{metric.label}</p>
            {metric.description && (
              <p className="text-white/70">{metric.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderHighlightLayout = () => {
    const mainMetric = metrics[0];
    const otherMetrics = metrics.slice(1);

    return (
      <div className="space-y-6">
        {mainMetric && (
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20"
            variants={itemVariants}
          >
            {mainMetric.icon && (
              <div className="mb-6 flex justify-center text-white/80">
                {mainMetric.icon}
              </div>
            )}
            <div className="text-7xl font-bold mb-4">
              {mainMetric.isNumeric !== false && typeof mainMetric.value === 'number' ? (
                <CounterAnimation
                  end={mainMetric.value}
                  suffix={mainMetric.suffix || ''}
                  prefix={mainMetric.prefix || ''}
                />
              ) : (
                <span>{mainMetric.prefix}{mainMetric.value}{mainMetric.suffix}</span>
              )}
            </div>
            <p className="text-2xl font-semibold mb-2">{mainMetric.label}</p>
            {mainMetric.description && (
              <p className="text-lg text-white/70 max-w-2xl mx-auto">{mainMetric.description}</p>
            )}
          </motion.div>
        )}

        {otherMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold mb-2">
                  {metric.isNumeric !== false && typeof metric.value === 'number' ? (
                    <CounterAnimation
                      end={metric.value}
                      suffix={metric.suffix || ''}
                      prefix={metric.prefix || ''}
                    />
                  ) : (
                    <span>{metric.prefix}{metric.value}{metric.suffix}</span>
                  )}
                </div>
                <p className="font-medium">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      className={`py-16 ${getThemeClasses()} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="max-w-6xl mx-auto px-6">
        {(title || subtitle || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-4xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-xl mb-4 opacity-90">{subtitle}</p>}
            {description && <p className="text-lg opacity-80 max-w-3xl mx-auto">{description}</p>}
          </div>
        )}

        {layout === 'grid' && renderGridLayout()}
        {layout === 'showcase' && renderShowcaseLayout()}
        {layout === 'highlight' && renderHighlightLayout()}
      </div>
    </motion.div>
  );
}
