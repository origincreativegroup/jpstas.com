import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Reveals content with animation when scrolling into view
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    up: { y: 60, opacity: 0 },
    down: { y: -60, opacity: 0 },
    left: { x: 60, opacity: 0 },
    right: { x: -60, opacity: 0 },
    fade: { opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction]}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : variants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
