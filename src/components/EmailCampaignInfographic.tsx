import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

interface EmailCampaignInfographicProps {
  className?: string;
}

export default function EmailCampaignInfographic({ className = '' }: EmailCampaignInfographicProps) {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } as any
    }
  };

  const envelopeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut"
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
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" } as any
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
      width: `${width}%`,
      transition: { duration: 1.2, ease: "easeOut" } as any
    })
  };

  const CounterAnimation = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

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

  return (
    <motion.div
      ref={ref}
      className={`bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-8 text-white overflow-hidden relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
      </div>

      {/* Header Section */}
      <motion.div className="text-center mb-12 relative z-10" variants={itemVariants}>
        <motion.div
          className="inline-block mb-4"
          variants={envelopeVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <svg width="60" height="40" viewBox="0 0 60 40" className="text-orange-400">
            <motion.path
              d="M5 10 L30 25 L55 10 M5 10 L5 30 L55 30 L55 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={envelopeVariants}
            />
          </svg>
        </motion.div>
        <h3 className="text-3xl font-bold mb-2 font-montserrat">Automating Customer Communications</h3>
        <p className="text-blue-200 text-lg">Data-driven email campaigns that engage and convert</p>
      </motion.div>

      {/* Funnel Flow Animation */}
      <motion.div className="mb-12 relative z-10" variants={itemVariants}>
        <div className="flex items-center justify-between relative">
          {/* Segment Node */}
          <motion.div
            className="flex flex-col items-center bg-blue-600 rounded-xl p-4 min-w-[120px]"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2">
              <span className="text-blue-600 font-bold text-sm">S</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Segment</h4>
            <p className="text-xs text-blue-200">
              <CounterAnimation end={5000} suffix="+" /> contacts
            </p>
          </motion.div>

          {/* Connecting Line */}
          <motion.div
            className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-orange-400 mx-4 rounded-full"
            variants={lineVariants}
            animate={isVisible ? "visible" : "hidden"}
          />

          {/* Automate Node */}
          <motion.div
            className="flex flex-col items-center bg-orange-500 rounded-xl p-4 min-w-[120px]"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2">
              <span className="text-orange-500 font-bold text-sm">A</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Automate</h4>
            <p className="text-xs text-orange-200">
              <CounterAnimation end={80} suffix="%" /> workflows
            </p>
          </motion.div>

          {/* Connecting Line */}
          <motion.div
            className="flex-1 h-1 bg-gradient-to-r from-orange-500 to-green-500 mx-4 rounded-full"
            variants={lineVariants}
            animate={isVisible ? "visible" : "hidden"}
          />

          {/* Engage Node */}
          <motion.div
            className="flex flex-col items-center bg-green-500 rounded-xl p-4 min-w-[120px]"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2">
              <span className="text-green-500 font-bold text-sm">E</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Engage</h4>
            <p className="text-xs text-green-200">
              <CounterAnimation end={60} suffix="%" /> open rate
            </p>
          </motion.div>

          {/* Connecting Line */}
          <motion.div
            className="flex-1 h-1 bg-gradient-to-r from-green-500 to-purple-500 mx-4 rounded-full"
            variants={lineVariants}
            animate={isVisible ? "visible" : "hidden"}
          />

          {/* Analyze Node */}
          <motion.div
            className="flex flex-col items-center bg-purple-500 rounded-xl p-4 min-w-[120px]"
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-500 font-bold text-sm">A</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Analyze</h4>
            <p className="text-xs text-purple-200">
              <CounterAnimation end={30} suffix="%" /> CTR
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Counters */}
      <motion.div className="grid grid-cols-3 gap-6 mb-12 relative z-10" variants={itemVariants}>
        <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            <CounterAnimation end={60} suffix="%" />
          </div>
          <p className="text-sm text-blue-200">Open Rates</p>
        </div>
        <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-green-400 mb-2">
            <CounterAnimation end={30} suffix="%" />
          </div>
          <p className="text-sm text-blue-200">Click-Through Rate</p>
        </div>
        <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            <CounterAnimation end={80} suffix="%" />
          </div>
          <p className="text-sm text-blue-200">Automation Coverage</p>
        </div>
      </motion.div>

      {/* Bar Growth Visualization */}
      <motion.div className="space-y-4 relative z-10" variants={itemVariants}>
        <h4 className="text-lg font-semibold mb-4 text-center">Campaign Performance</h4>
        {[
          { name: 'Early Buy', width: 95, color: 'from-orange-500 to-orange-400' },
          { name: 'Service Updates', width: 88, color: 'from-blue-500 to-blue-400' },
          { name: 'Educational Series', width: 82, color: 'from-green-500 to-green-400' },
          { name: 'Holiday/Seasonal', width: 90, color: 'from-purple-500 to-purple-400' }
        ].map((campaign, index) => (
          <div key={campaign.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-200">{campaign.name}</span>
              <span className="text-white font-semibold">{campaign.width}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${campaign.color} rounded-full`}
                variants={barVariants}
                custom={campaign.width}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Closing Pulse */}
      <motion.div
        className="flex justify-center items-center mt-8 relative z-10"
        variants={itemVariants}
      >
        <motion.div
          className="relative"
          variants={pulseVariants}
          animate={isVisible ? "pulse" : "hidden"}
        >
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          {/* Connection Lines */}
          <motion.div
            className="absolute inset-0 border-2 border-orange-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <div className="ml-4 text-sm text-blue-200">
          <p className="font-semibold">Mailchimp + CRM Integration</p>
          <p className="text-xs">Automated workflows</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
