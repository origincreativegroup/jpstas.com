import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

export interface CostData {
  category: string;
  before: number;
  after: number;
  label?: string;
  icon?: React.ReactNode;
}

interface CostSavingsInfographicProps {
  title?: string;
  subtitle?: string;
  costs?: CostData[];
  totalBefore?: number;
  totalAfter?: number;
  currency?: string;
  className?: string;
  theme?: 'light' | 'dark' | 'gradient';
  showPercentage?: boolean;
  layout?: 'chart' | 'comparison' | 'summary';
}

const CounterAnimation = ({ end, duration = 2000, prefix = '' }: { end: number; duration?: number; prefix?: string }) => {
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

  return <span>{prefix}{count.toLocaleString()}</span>;
};

export default function CostSavingsInfographic({
  title,
  subtitle,
  costs = [],
  totalBefore,
  totalAfter,
  currency = '$',
  className = '',
  theme = 'gradient',
  showPercentage = true,
  layout = 'comparison'
}: CostSavingsInfographicProps) {
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

  const barVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
      width: `${width}%`,
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
        return 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-slate-900';
    }
  };

  const calculateTotals = () => {
    const before = totalBefore || costs.reduce((sum, cost) => sum + cost.before, 0);
    const after = totalAfter || costs.reduce((sum, cost) => sum + cost.after, 0);
    const savings = before - after;
    const percentage = before > 0 ? ((savings / before) * 100).toFixed(1) : 0;
    return { before, after, savings, percentage };
  };

  const totals = calculateTotals();

  const renderSummaryLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="text-red-600 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-red-600 mb-2">
          <CounterAnimation end={totals.before} prefix={currency} />
        </div>
        <p className="text-sm font-medium text-slate-600">Previous Cost</p>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="text-blue-600 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          <CounterAnimation end={totals.after} prefix={currency} />
        </div>
        <p className="text-sm font-medium text-slate-600">Current Cost</p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-center text-white shadow-lg"
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-2">
          <CounterAnimation end={totals.savings} prefix={currency} />
        </div>
        <p className="text-sm font-medium">
          Total Savings {showPercentage && `(${totals.percentage}%)`}
        </p>
      </motion.div>
    </div>
  );

  const renderComparisonLayout = () => (
    <div className="space-y-6 relative z-10">
      {costs.map((cost, index) => {
        const savings = cost.before - cost.after;
        const percentage = cost.before > 0 ? ((savings / cost.before) * 100).toFixed(1) : 0;
        const maxValue = Math.max(...costs.map(c => c.before));

        return (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {cost.icon && <div className="text-blue-600">{cost.icon}</div>}
                <h4 className="font-bold text-slate-800">{cost.category}</h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {currency}{savings.toLocaleString()}
                </div>
                {showPercentage && (
                  <div className="text-sm text-slate-600">
                    {percentage}% reduction
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Before</span>
                  <span className="font-semibold text-red-600">{currency}{cost.before.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-red-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    variants={barVariants}
                    custom={(cost.before / maxValue) * 100}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">After</span>
                  <span className="font-semibold text-blue-600">{currency}{cost.after.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    variants={barVariants}
                    custom={(cost.after / maxValue) * 100}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  />
                </div>
              </div>
            </div>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 rounded-full blur-2xl"></div>
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
            <p className={`text-lg ${theme === 'dark' ? 'text-green-200' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {layout === 'summary' && renderSummaryLayout()}
      {layout === 'comparison' && renderComparisonLayout()}
      {layout === 'chart' && (
        <>
          {renderSummaryLayout()}
          <div className="mt-8">
            {renderComparisonLayout()}
          </div>
        </>
      )}
    </motion.div>
  );
}
