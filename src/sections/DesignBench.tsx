import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadProjects, Project } from '../utils/contentLoader';

const DesignBench: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects().then(loadedProjects => {
      setProjects(loadedProjects);
      setLoading(false);
    });
  }, []);

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Workshop
            </button>
            <div className="h-6 w-px bg-neutral-700"></div>
            <h1 className="text-2xl font-bold">Design Bench</h1>
          </div>
          <div className="text-sm text-neutral-400">
            {projects.length} projects
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl overflow-hidden hover:border-purple-400/50 transition-all duration-300">
                {/* Project Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-orange-500/20 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎨
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">👁️</div>
                      <div className="text-sm font-medium">View Case File</div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4">
                    {project.role} • {project.date}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-neutral-700/50 text-neutral-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {Array.isArray(project.tags) && project.tags.length > 3 && (
                      <span className="text-xs text-neutral-500">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseProject}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-700/50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                  <p className="text-neutral-400">{selectedProject.role} • {selectedProject.date}</p>
                </div>
                <button
                  onClick={handleCloseProject}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* PCSI Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-purple-300 mb-3">Problem</h3>
                      <p className="text-neutral-300">{selectedProject.content?.problem || 'No problem description available'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-orange-300 mb-3">Challenge</h3>
                      <p className="text-neutral-300">{selectedProject.content?.challenge || 'No challenge description available'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-green-300 mb-3">Solution</h3>
                      <p className="text-neutral-300">{selectedProject.content?.solution || 'No solution description available'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-blue-300 mb-3">Impact</h3>
                      <p className="text-neutral-300">{selectedProject.content?.impact || 'No impact description available'}</p>
                    </div>
                  </div>

                  {/* Project Gallery */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
                    <div className="space-y-4">
                      {Array.isArray(selectedProject.gallery) && selectedProject.gallery.length > 0 ? (
                        selectedProject.gallery.map((image, index) => (
                          <div key={index} className="aspect-video bg-neutral-700/50 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${selectedProject.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="aspect-video bg-neutral-700/50 rounded-lg flex items-center justify-center text-neutral-500">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🖼️</div>
                            <div className="text-sm">No gallery images available</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignBench;
