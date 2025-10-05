import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InnovationBay: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const projects = [
    {
      id: 'fpv-drone',
      title: 'FPV Racing Drone',
      description:
        'Custom-built FPV racing drone with 3D printed frame and custom flight controller',
      category: 'Hardware',
      status: 'Completed',
      blueprint: 'fpv-drone-blueprint',
    },
    {
      id: '3d-printer',
      title: '3D Printer Modifications',
      description:
        'Enhanced Ender 3 with custom firmware, auto-leveling, and improved print quality',
      category: 'Hardware',
      status: 'Active',
      blueprint: '3d-printer-blueprint',
    },
    {
      id: 'iot-sensor',
      title: 'IoT Environmental Sensor',
      description:
        'ESP32-based sensor network for monitoring temperature, humidity, and air quality',
      category: 'IoT',
      status: 'Prototype',
      blueprint: 'iot-sensor-blueprint',
    },
    {
      id: 'cnc-router',
      title: 'CNC Router Build',
      description: 'DIY CNC router for precision woodworking and prototyping',
      category: 'Hardware',
      status: 'Planning',
      blueprint: 'cnc-router-blueprint',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-400 bg-green-400/20';
      case 'Active':
        return 'text-blue-400 bg-blue-400/20';
      case 'Prototype':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'Planning':
        return 'text-purple-400 bg-purple-400/20';
      default:
        return 'text-neutral-400 bg-neutral-400/20';
    }
  };

  const BlueprintSVG = ({ projectId }: { projectId: string }) => (
    <svg
      className="w-full h-48 text-blue-400/30"
      viewBox="0 0 400 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {/* Grid Lines */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Project-specific blueprints */}
      {projectId === 'fpv-drone' && (
        <>
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="300" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="100" y1="100" x2="300" y2="100" strokeWidth="2" />
          <rect
            x="150"
            y="80"
            width="100"
            height="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="200" cy="100" r="5" fill="currentColor" />
        </>
      )}

      {projectId === '3d-printer' && (
        <>
          <rect
            x="50"
            y="50"
            width="300"
            height="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="70"
            y="70"
            width="60"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="150"
            y="70"
            width="60"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="230"
            y="70"
            width="60"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="200" cy="100" r="3" fill="currentColor" />
        </>
      )}

      {projectId === 'iot-sensor' && (
        <>
          <rect
            x="100"
            y="80"
            width="200"
            height="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="120" cy="100" r="8" fill="currentColor" />
          <circle cx="160" cy="100" r="8" fill="currentColor" />
          <circle cx="200" cy="100" r="8" fill="currentColor" />
          <circle cx="240" cy="100" r="8" fill="currentColor" />
          <circle cx="280" cy="100" r="8" fill="currentColor" />
          <path d="M 120 100 L 160 100 L 200 100 L 240 100 L 280 100" strokeWidth="1" />
        </>
      )}

      {projectId === 'cnc-router' && (
        <>
          <rect
            x="50"
            y="50"
            width="300"
            height="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="70"
            y="70"
            width="260"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="200" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 180 100 L 220 100 M 200 80 L 200 120" strokeWidth="1" />
        </>
      )}
    </svg>
  );

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
            <h1 className="text-2xl font-bold">Innovation Bay</h1>
          </div>
          <div className="text-sm text-neutral-400">Hardware & Prototyping Lab</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Active Projects</h2>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm mb-2">{project.description}</p>
                    <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-500">Blueprint: {project.blueprint}</div>
              </motion.div>
            ))}
          </div>

          {/* Blueprint Display */}
          <div className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-neutral-400 text-sm">
                {selectedProject
                  ? `${selectedProject}-blueprint.dwg`
                  : 'Select a project to view blueprint'}
              </span>
            </div>

            <div className="bg-black/50 rounded-lg p-4 h-96 overflow-hidden">
              {selectedProject ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BlueprintSVG projectId={selectedProject} />
                </motion.div>
              ) : (
                <div className="text-neutral-500 text-center py-20">
                  Click on a project to view its blueprint
                </div>
              )}
            </div>

            {/* Blueprint Controls */}
            <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
              <button className="hover:text-white transition-colors">Zoom In</button>
              <button className="hover:text-white transition-colors">Zoom Out</button>
              <button className="hover:text-white transition-colors">Reset View</button>
              <button className="hover:text-white transition-colors">Export</button>
            </div>
          </div>
        </div>

        {/* Project Details */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Specifications</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Material: Carbon Fiber</li>
                  <li>• Weight: 250g</li>
                  <li>• Flight Time: 4-6 min</li>
                  <li>• Range: 2km</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Components</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Flight Controller: F4</li>
                  <li>• Motors: 2207 2400KV</li>
                  <li>• ESC: 4-in-1 45A</li>
                  <li>• Camera: Caddx Ratel</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Status</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Design: Complete</li>
                  <li>• Assembly: In Progress</li>
                  <li>• Testing: Pending</li>
                  <li>• Documentation: Draft</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InnovationBay;
