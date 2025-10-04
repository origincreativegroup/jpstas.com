import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadNavSections, NavSection } from '@/utils/contentLoader';
import { useToast } from '@/context/ToastContext';
import WorkshopContentEditor from './WorkshopContentEditor';

const WorkshopManagement: React.FC = () => {
  const [sections, setSections] = useState<NavSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await loadNavSections();
      setSections(data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      showToast('Failed to fetch workshop sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    try {
      // In a real app, this would make an API call
      setSections(sections.filter(s => s.id !== sectionId));
      showToast('Section deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete section:', error);
      showToast('Failed to delete section', 'error');
    }
  };

  const handleToggleActive = async (section: NavSection) => {
    try {
      const updatedSection = { ...section, active: !(section as any).active };
      // In a real app, this would make an API call
      setSections(sections.map(s => s.id === section.id ? updatedSection : s));
      showToast(`Section ${(updatedSection as any).active ? 'activated' : 'deactivated'}`, 'success');
    } catch (error) {
      console.error('Failed to update section:', error);
      showToast('Failed to update section', 'error');
    }
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setShowEditor(true);
  };

  const handleSaveContent = async (content: any) => {
    try {
      // In a real app, this would make an API call
      setSections(sections.map(s => s.id === content.id ? content : s));
      showToast('Content saved successfully', 'success');
      setShowEditor(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to save content:', error);
      showToast('Failed to save content', 'error');
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingSection(null);
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const workshopSections = [
    {
      id: 'design-bench',
      title: 'Design Bench',
      description: 'Creative tools and design processes',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'development-desk',
      title: 'Development Desk',
      description: 'Code and technical solutions',
      icon: '💻',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'innovation-bay',
      title: 'Innovation Bay',
      description: 'Process optimization and workflow innovation',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'story-forge',
      title: 'Story Forge',
      description: 'Content creation and storytelling tools',
      icon: '📖',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'skill-console',
      title: 'Skill Console',
      description: 'Learning resources and skill development',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand">Workshop Sections</h2>
          <p className="text-neutral-600">Manage your workshop tools and processes</p>
        </div>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
        >
          Add New Section
        </button>
      </div>

      {/* Workshop Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshopSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {section.icon}
            </div>
            <h3 className="text-lg font-bold text-brand mb-2">{section.title}</h3>
            <p className="text-neutral-600 text-sm mb-4">{section.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                {sections.filter(s => (s as any).category === section.id).length} items
              </span>
              <button
                onClick={() => handleEditSection(section)}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors text-sm"
              >
                Manage
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-brand">{section.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    (section as any).active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {(section as any).active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-neutral-600 mb-3">{section.description}</p>
                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                  <span>Category: {(section as any).category || 'Uncategorized'}</span>
                  <span>Order: {(section as any).order || 0}</span>
                  <span>Updated: {new Date((section as any).updatedAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleActive(section)}
                  className={`p-2 rounded-lg transition-colors ${
                    (section as any).active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={(section as any).active ? 'Deactivate' : 'Activate'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEditSection(section)}
                  className="p-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                  title="Edit section"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete section"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No sections found</h3>
          <p className="text-neutral-600 mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first workshop section'}
          </p>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
          >
            Add New Section
          </button>
        </div>
      )}

      {/* Content Editor Modal */}
      {showEditor && (
        <WorkshopContentEditor
          content={editingSection}
          onSave={handleSaveContent}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default WorkshopManagement;
