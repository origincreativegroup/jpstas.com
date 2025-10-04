import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadSkills, SkillGroup } from '../utils/contentLoader';

const SkillConsole: React.FC = () => {
  const navigate = useNavigate();
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    loadSkills().then(loadedSkills => {
      setSkillGroups(loadedSkills);
      setLoading(false);
    });
  }, []);

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-green-400 to-green-600';
    if (level >= 80) return 'from-blue-400 to-blue-600';
    if (level >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-neutral-400 to-neutral-600';
  };

  const getSkillGlow = (level: number) => {
    if (level >= 90) return 'shadow-green-400/50';
    if (level >= 80) return 'shadow-blue-400/50';
    if (level >= 70) return 'shadow-yellow-400/50';
    return 'shadow-neutral-400/50';
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
            <h1 className="text-2xl font-bold">Skill Console</h1>
          </div>
          <div className="text-sm text-neutral-400">
            Interactive Skills Matrix
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Matrix */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {skillGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                  className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6">{group.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: skillIndex * 0.1 }}
                        className="relative group"
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div className="bg-neutral-700/30 rounded-lg p-4 hover:bg-neutral-700/50 transition-all duration-300 cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {skill.name}
                            </h4>
                            <span className="text-sm font-bold text-neutral-400">
                              {skill.level}%
                            </span>
                          </div>
                          
                          {/* Skill Bar */}
                          <div className="w-full bg-neutral-600 rounded-full h-2 mb-3 overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} ${getSkillGlow(skill.level)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: skillIndex * 0.1 }}
                            />
                          </div>
                          
                          <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                            {skill.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skill Details Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-white mb-4">Skill Details</h3>
              
              {hoveredSkill ? (
                <motion.div
                  key={hoveredSkill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {skillGroups.map(group => 
                    group.skills
                      .filter(skill => skill.name === hoveredSkill)
                      .map(skill => (
                        <div key={skill.name}>
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {skill.name}
                          </h4>
                          <div className="text-sm text-neutral-400 mb-4">
                            {skill.description}
                          </div>
                          <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                            <div className="text-sm font-medium text-purple-300 mb-2">
                              Proof of Expertise
                            </div>
                            <div className="text-xs text-neutral-300">
                              {skill.proof}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⚡</div>
                  <div className="text-neutral-400 text-sm">
                    Hover over a skill to view details
                  </div>
                </div>
              )}
            </motion.div>

            {/* Skill Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Skill Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Total Skills</span>
                  <span className="text-sm font-bold text-white">
                    {skillGroups.reduce((total, group) => total + group.skills.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Expert Level (90%+)</span>
                  <span className="text-sm font-bold text-green-400">
                    {skillGroups
                      .flatMap(group => group.skills)
                      .filter(skill => skill.level >= 90).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Advanced Level (80%+)</span>
                  <span className="text-sm font-bold text-blue-400">
                    {skillGroups
                      .flatMap(group => group.skills)
                      .filter(skill => skill.level >= 80).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Average Level</span>
                  <span className="text-sm font-bold text-purple-400">
                    {Math.round(
                      skillGroups
                        .flatMap(group => group.skills)
                        .reduce((sum, skill) => sum + skill.level, 0) /
                      skillGroups.reduce((total, group) => total + group.skills.length, 0)
                    )}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillConsole;
