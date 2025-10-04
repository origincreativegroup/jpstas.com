import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/apiClient';
import { Project } from '@/types/project';
import NodeMesh from './NodeMesh';

interface BootSequenceProps {
  onComplete?: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPortals, setShowPortals] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);
  const navigate = useNavigate();
  const controls = useAnimation();
  const charIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced boot messages that reference actual projects
  const bootMessages = [
    { text: "Initializing creative systems...", delay: 1000 },
    { text: "Loading design architecture...", delay: 1200 },
    { text: "Establishing development protocols...", delay: 1000 },
    { text: "Calibrating innovation algorithms...", delay: 1500 },
    { text: "Welcome to the Workshop of John Stas.", delay: 2000 },
    { text: "Featured projects loaded successfully.", delay: 1500 },
    { text: "Systems online. Ready for exploration.", delay: 1000 }
  ];

  // Initialize particles with brand colors
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));
    setParticles(newParticles);
  }, []);

  // Fetch featured projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await api.getProjects();
        const featured = allProjects.filter(project => project.featured).slice(0, 3);
        setFeaturedProjects(featured);
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
        // Fallback to mock data
        setFeaturedProjects([
          {
            id: 'caribbean-pools',
            title: 'Caribbean Pools E-commerce',
            role: 'Creative Director & Lead Developer',
            summary: 'Custom e-commerce platform with print studio integration',
            tags: ['E-commerce', 'React', 'Node.js'],
            type: 'client-work',
            featured: true,
            images: [],
            content: {
              challenge: 'Migrate legacy e-commerce system',
              solution: 'Built custom platform with React and Node.js',
              process: ['Full-stack development', 'Print studio integration', 'Performance optimization'],
              technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
              results: '40% increase in conversion rates, 60% faster load times'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'published'
          }
        ]);
      }
    };
    fetchProjects();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.x <= 0 || particle.x >= window.innerWidth ? -particle.vx : particle.vx,
        vy: particle.y <= 0 || particle.y >= window.innerHeight ? -particle.vy : particle.vy,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Enhanced boot sequence with project showcase
  useEffect(() => {
    if (currentLine >= bootMessages.length) return;

    const currentMessage = bootMessages[currentLine];
    if (!currentMessage) return;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset character index for new message
    charIndexRef.current = 0;
    setCurrentText('');

    // Start typewriter effect immediately
    intervalRef.current = setInterval(() => {
      if (charIndexRef.current < currentMessage.text.length) {
        const newText = currentMessage.text.slice(0, charIndexRef.current + 1);
        setCurrentText(newText);
        charIndexRef.current++;
        
        // Update progress as we type
        const typingProgress = charIndexRef.current / currentMessage.text.length;
        const totalProgress = ((currentLine + typingProgress) / bootMessages.length) * 100;
        setProgress(totalProgress);
        
      } else {
        // Message complete
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Update progress to show message complete
        const totalProgress = ((currentLine + 1) / bootMessages.length) * 100;
        setProgress(totalProgress);
        
        // Wait for the delay before moving to next message
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
        }, currentMessage.delay);
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentLine]);

  // Handle completion with project showcase
  useEffect(() => {
    if (currentLine >= bootMessages.length && !isComplete) {
      setTimeout(() => {
        setShowPortals(true);
        // Cycle through featured projects
        if (featuredProjects.length > 0) {
          const projectInterval = setInterval(() => {
            setCurrentProjectIndex(prev => (prev + 1) % featuredProjects.length);
          }, 2000);
          
          setTimeout(() => {
            clearInterval(projectInterval);
            setIsComplete(true);
            controls.start({
              opacity: 0,
              scale: 0.8,
              transition: { duration: 1 }
            });
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              } else {
                navigate('/workshop');
              }
            }, 1000);
          }, featuredProjects.length * 2000 + 2000);
        } else {
          setTimeout(() => {
            setIsComplete(true);
            controls.start({
              opacity: 0,
              scale: 0.8,
              transition: { duration: 1 }
            });
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              } else {
                navigate('/workshop');
              }
            }, 1000);
          }, 2000);
        }
      }, 1000);
    }
  }, [currentLine, bootMessages.length, isComplete, controls, navigate, onComplete, featuredProjects.length]);

  const handleSkip = () => {
    setIsComplete(true);
    controls.start({
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5 }
    });
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate('/workshop');
      }
    }, 500);
  };

  const currentProject = featuredProjects[currentProjectIndex];

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-brand via-brand-dark to-brand text-accent font-mono overflow-hidden"
      animate={controls}
    >
      {/* Animated Background Grid with brand colors */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-16 h-full">
          {Array.from({ length: 320 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="border border-accent/30"
              animate={{
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles with brand colors */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-accent/70 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Node Mesh Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <NodeMesh isActive={!isComplete} />
      </div>

      {/* Progress Bar with brand styling */}
      <div className="absolute top-8 left-8 right-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-brand-dark/50 rounded-full h-2 overflow-hidden border border-accent/20">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-accent font-bold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* System Status with brand colors */}
      <div className="absolute top-8 right-8 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-accent rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm text-accent">ONLINE</span>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>

      {/* Boot Messages */}
      <div className="absolute bottom-20 left-8 right-8">
        <div className="space-y-6">
          {/* Current Message */}
          <motion.div
            key={currentLine}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold"
          >
            <span className="text-accent">
              {currentText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1 text-2xl"
              >
                ▊
              </motion.span>
            </span>
          </motion.div>

          {/* Previous Messages */}
          <div className="space-y-2">
            {bootMessages.slice(0, currentLine).map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-lg text-accent/70"
              >
                ✓ {message.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          onClick={handleSkip}
          className="mt-8 px-6 py-3 border-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300 rounded-lg font-semibold"
        >
          Skip Boot Sequence
        </motion.button>
      </div>

      {/* Featured Project Showcase */}
      <AnimatePresence>
        {showPortals && currentProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="max-w-2xl mx-auto px-8">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-brand-dark/80 backdrop-blur-sm border border-accent/30 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-accent mb-2">
                  {currentProject.title}
                </h3>
                <p className="text-brand-light mb-4">
                  {currentProject.summary}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {currentProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full border border-accent/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {currentProject.content?.results && (
                  <p className="text-accent-dark text-sm">
                    {currentProject.content.results.split('.')[0]}.
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Nodes with brand colors */}
      <AnimatePresence>
        {showPortals && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="grid grid-cols-5 gap-8">
              {[
                { name: 'Design', icon: '🎨', color: 'from-pink-500 to-rose-500' },
                { name: 'Development', icon: '💻', color: 'from-blue-500 to-cyan-500' },
                { name: 'Innovation', icon: '⚙️', color: 'from-purple-500 to-violet-500' },
                { name: 'Process', icon: '🧠', color: 'from-emerald-500 to-teal-500' },
                { name: 'Media', icon: '🎬', color: 'from-orange-500 to-amber-500' }
              ].map((portal, index) => (
                <motion.div
                  key={portal.name}
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className={`w-20 h-20 bg-gradient-to-br ${portal.color} rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl cursor-pointer hover:shadow-accent/25 transition-all duration-300`}
                >
                  <span className="text-2xl mb-1">{portal.icon}</span>
                  <span className="text-xs font-bold">{portal.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch Effect with brand colors */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.05, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        style={{
          background: 'linear-gradient(90deg, transparent 50%, rgba(212, 168, 72, 0.1) 50%)',
          backgroundSize: '4px 4px',
        }}
      />
    </motion.div>
  );
};

export default BootSequence;