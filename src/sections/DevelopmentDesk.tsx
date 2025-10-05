import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DevelopmentDesk: React.FC = () => {
  const navigate = useNavigate();
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const projects = [
    {
      id: 'portfolio-cms',
      title: 'Portfolio CMS',
      description: 'Headless CMS built with React, TypeScript, and Cloudflare Pages',
      tech: ['React', 'TypeScript', 'Cloudflare Pages', 'Tailwind CSS'],
      status: 'Live',
      url: 'https://jpstas.com',
      terminal: 'portfolio-terminal',
    },
    {
      id: 'ecommerce-platform',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with custom print studio integration',
      tech: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
      status: 'Production',
      url: 'https://caribbeanpools.com',
      terminal: 'ecommerce-terminal',
    },
    {
      id: 'design-system',
      title: 'Design System',
      description: 'Component library and design tokens for consistent UI development',
      tech: ['Storybook', 'React', 'TypeScript', 'Figma'],
      status: 'Maintained',
      url: 'https://design.jpstas.com',
      terminal: 'design-system-terminal',
    },
    {
      id: 'api-gateway',
      title: 'API Gateway',
      description: 'Microservices gateway with authentication and rate limiting',
      tech: ['Node.js', 'Express', 'Redis', 'Docker'],
      status: 'Production',
      url: 'https://api.jpstas.com',
      terminal: 'api-gateway-terminal',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'text-green-400 bg-green-400/20';
      case 'Production':
        return 'text-blue-400 bg-blue-400/20';
      case 'Maintained':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-neutral-400 bg-neutral-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToWorkshop}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Workshop
            </button>
            <div className="h-6 w-px bg-neutral-700"></div>
            <h1 className="text-2xl font-bold">Development Desk</h1>
          </div>
          <div className="text-sm text-neutral-400">{projects.length} active projects</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Active Terminals</h2>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTerminal(project.terminal)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm">{project.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs bg-neutral-700/50 text-neutral-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                    onClick={e => e.stopPropagation()}
                  >
                    View Source →
                  </a>
                  <span className="text-neutral-500 text-sm">Terminal: {project.terminal}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Terminal Display */}
          <div className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-neutral-400 text-sm ml-4">
                {activeTerminal || 'Select a terminal to view'}
              </span>
            </div>

            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
              {activeTerminal ? (
                <div className="space-y-2">
                  <div className="text-green-400">
                    <span className="text-neutral-500">$</span> npm run dev
                  </div>
                  <div className="text-neutral-300">Starting development server...</div>
                  <div className="text-green-400">✓ Server running on http://localhost:3000</div>
                  <div className="text-blue-400">✓ Hot reload enabled</div>
                  <div className="text-yellow-400">⚠ Building for production...</div>
                  <div className="text-green-400">✓ Build completed successfully</div>
                  <div className="text-neutral-300">
                    <span className="text-neutral-500">$</span> git status
                  </div>
                  <div className="text-neutral-300">On branch main</div>
                  <div className="text-green-400">
                    Your branch is up to date with 'origin/main'.
                  </div>
                  <div className="text-neutral-300">
                    <span className="text-neutral-500">$</span> npm test
                  </div>
                  <div className="text-green-400">✓ All tests passing</div>
                  <div className="text-neutral-300">
                    <span className="text-neutral-500">$</span> npm run build
                  </div>
                  <div className="text-green-400">✓ Build optimized for production</div>
                  <div className="text-blue-400">✓ Lighthouse score: 95+</div>
                  <div className="text-neutral-300">
                    <span className="text-neutral-500">$</span> _
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 text-center py-20">
                  Click on a project to view its terminal
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentDesk;
