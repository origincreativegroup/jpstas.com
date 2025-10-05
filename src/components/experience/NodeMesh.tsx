import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NodeMeshProps {
  isActive: boolean;
}

const NodeMesh: React.FC<NodeMeshProps> = ({ isActive }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !svgRef.current) return;

    const svg = svgRef.current;
    const nodes = Array.from(svg.querySelectorAll('.node'));
    const lines = Array.from(svg.querySelectorAll('.line'));

    const animate = () => {
      nodes.forEach((node, index) => {
        const delay = index * 0.1;
        if (node instanceof HTMLElement) {
          node.style.animationDelay = `${delay}s`;
        }
      });

      lines.forEach((line, index) => {
        const delay = index * 0.05;
        if (line instanceof HTMLElement) {
          line.style.animationDelay = `${delay}s`;
        }
      });
    };

    animate();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  const nodes = [
    { x: 150, y: 120, id: 'node-1' },
    { x: 350, y: 180, id: 'node-2' },
    { x: 550, y: 240, id: 'node-3' },
    { x: 250, y: 320, id: 'node-4' },
    { x: 450, y: 380, id: 'node-5' },
    { x: 650, y: 440, id: 'node-6' },
    { x: 200, y: 520, id: 'node-7' },
    { x: 400, y: 580, id: 'node-8' },
    { x: 600, y: 640, id: 'node-9' },
    { x: 100, y: 300, id: 'node-10' },
    { x: 700, y: 300, id: 'node-11' },
    { x: 400, y: 100, id: 'node-12' },
    { x: 400, y: 700, id: 'node-13' },
  ];

  const connections = [
    { from: 'node-1', to: 'node-2' },
    { from: 'node-2', to: 'node-3' },
    { from: 'node-1', to: 'node-4' },
    { from: 'node-2', to: 'node-5' },
    { from: 'node-3', to: 'node-6' },
    { from: 'node-4', to: 'node-7' },
    { from: 'node-5', to: 'node-8' },
    { from: 'node-6', to: 'node-9' },
    { from: 'node-4', to: 'node-5' },
    { from: 'node-5', to: 'node-6' },
    { from: 'node-7', to: 'node-8' },
    { from: 'node-8', to: 'node-9' },
    { from: 'node-10', to: 'node-1' },
    { from: 'node-10', to: 'node-4' },
    { from: 'node-10', to: 'node-7' },
    { from: 'node-11', to: 'node-3' },
    { from: 'node-11', to: 'node-6' },
    { from: 'node-11', to: 'node-9' },
    { from: 'node-12', to: 'node-1' },
    { from: 'node-12', to: 'node-2' },
    { from: 'node-12', to: 'node-3' },
    { from: 'node-13', to: 'node-7' },
    { from: 'node-13', to: 'node-8' },
    { from: 'node-13', to: 'node-9' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex items-center justify-center"
    >
      <svg
        ref={svgRef}
        width="800"
        height="700"
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 20px rgba(212, 168, 72, 0.4))' }}
      >
        {/* Connection Lines */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);

          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`line-${index}`}
              className="line"
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#gradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 1.5, delay: index * 0.05 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g key={node.id}>
            {/* Node Glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="12"
              fill="url(#nodeGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            {/* Main Node */}
            <motion.circle
              className="node"
              cx={node.x}
              cy={node.y}
              r="6"
              fill="url(#nodeGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.3 }}
            />
            {/* Inner Core */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="#ffffff"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            />
          </motion.g>
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A848" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#282850" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#B8943A" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A848" stopOpacity="1" />
            <stop offset="70%" stopColor="#282850" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B8943A" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A848" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4A848" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Central Pulse Effect */}
      <motion.div
        className="absolute w-6 h-6 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#D4A848',
        }}
      />

      {/* Secondary Pulse */}
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.05, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#282850',
        }}
      />
    </motion.div>
  );
};

export default NodeMesh;
