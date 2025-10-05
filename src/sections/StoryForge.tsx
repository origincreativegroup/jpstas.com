import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadBio } from '../utils/contentLoader';

const StoryForge: React.FC = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBio().then(loadedBio => {
      setBio(loadedBio);
      setLoading(false);
    });
  }, []);

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const milestones = [
    {
      year: '2014',
      title: 'The Beginning',
      description: 'Started Computer Science at Indiana University',
      icon: '🎓',
    },
    {
      year: '2018',
      title: 'First Steps',
      description: 'Graduated and entered the startup world',
      icon: '🚀',
    },
    {
      year: '2020',
      title: 'The Pivot',
      description: 'Joined Caribbean Pools as Creative Director',
      icon: '🎨',
    },
    {
      year: '2023',
      title: 'The Workshop',
      description: 'Launched independent creative technology consultancy',
      icon: '🔧',
    },
  ];

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
            <h1 className="text-2xl font-bold">Story Forge</h1>
          </div>
          <div className="text-sm text-neutral-400">Narrative & Creative Writing</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: bio }} className="space-y-6" />
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Journey Timeline</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-16 bg-gradient-to-b from-purple-400/50 to-orange-400/50"></div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full flex items-center justify-center text-xl">
                        {milestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-purple-300 mb-1">
                          {milestone.year}
                        </div>
                        <div className="text-white font-medium mb-1">{milestone.title}</div>
                        <div className="text-neutral-400 text-sm">{milestone.description}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Insights */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-300 mb-2">
                    Design + Code = Magic
                  </div>
                  <div className="text-xs text-neutral-400">
                    The best solutions come from understanding both creative and technical
                    constraints.
                  </div>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-400/20 rounded-lg">
                  <div className="text-sm font-medium text-orange-300 mb-2">
                    Process Over Perfection
                  </div>
                  <div className="text-xs text-neutral-400">
                    Building systems that can adapt and improve is more valuable than perfect first
                    attempts.
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-300 mb-2">
                    Human-Centered Innovation
                  </div>
                  <div className="text-xs text-neutral-400">
                    Technology should amplify human potential, not replace human creativity.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Writing Process */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">The Writing Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                ✍️
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Draft</h4>
              <p className="text-sm text-neutral-400">
                Raw ideas and stream-of-consciousness writing to capture the essence of the story.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🔄
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Refine</h4>
              <p className="text-sm text-neutral-400">
                Iterative editing to improve clarity, flow, and impact of the narrative.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                ✨
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Polish</h4>
              <p className="text-sm text-neutral-400">
                Final touches to ensure the story resonates and connects with the audience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryForge;
