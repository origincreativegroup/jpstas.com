import React, { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';

interface InteractiveHeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  primaryCTA?: { label: string; onClick: () => void };
  secondaryCTA?: { label: string; onClick: () => void };
  className?: string;
  variant?: 'default' | 'gradient' | 'video' | 'parallax';
  videoUrl?: string;
}

export default function InteractiveHeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundColor = 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
  primaryCTA,
  secondaryCTA,
  className = '',
  variant = 'default',
  videoUrl
}: InteractiveHeroSectionProps) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } as any
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Background */}
      {variant === 'video' && videoUrl ? (
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : variant === 'parallax' && backgroundImage ? (
        <motion.div
          className="absolute inset-0"
          style={{ y: variant === 'parallax' ? y : 0 }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      ) : (
        <div className={`absolute inset-0 ${backgroundColor}`}>
          {backgroundImage && (
            <div
              className="w-full h-full bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white"
        style={{ opacity: variant === 'parallax' ? opacity : 1 }}
      >
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl font-medium mb-4 text-white/90"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            {primaryCTA && (
              <motion.button
                onClick={primaryCTA.onClick}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryCTA.label}
              </motion.button>
            )}
            {secondaryCTA && (
              <motion.button
                onClick={secondaryCTA.onClick}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/50 hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {secondaryCTA.label}
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
