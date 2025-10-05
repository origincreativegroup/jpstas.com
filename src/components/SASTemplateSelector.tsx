import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectTemplate } from '@/types/saas';
import saasProjectService from '@/services/saasProjectService';

interface SASTemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onCancel: () => void;
}

export default function SASTemplateSelector({
  onSelectTemplate,
  onCancel,
}: SASTemplateSelectorProps) {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templateList = await saasProjectService.getTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesType = selectedType === 'all' || template.category === selectedType;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const templateTypes = [
    { id: 'all', label: 'All Templates', count: templates.length },
    {
      id: 'portfolio',
      label: 'Portfolio',
      count: templates.filter(t => t.category === 'portfolio').length,
    },
    {
      id: 'case-study',
      label: 'Case Study',
      count: templates.filter(t => t.category === 'case-study').length,
    },
    {
      id: 'showcase',
      label: 'Showcase',
      count: templates.filter(t => t.category === 'showcase').length,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      count: templates.filter(t => t.category === 'gallery').length,
    },
    { id: 'blog', label: 'Blog', count: templates.filter(t => t.category === 'blog').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-neutral-600">Select a template to start building your project</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {templateTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type.id
                  ? 'bg-accent text-brand'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSelectTemplate(template)}
          >
            {/* Template Preview */}
            <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-sm text-neutral-600">Preview</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 bg-accent text-brand px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  Select Template
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                  {template.category}
                </span>
              </div>
              <p className="text-neutral-600 text-sm mb-3">{template.description}</p>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Difficulty: {template.metadata.difficulty}</span>
                <span>{template.metadata.estimatedTime} min</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {template.metadata.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    {tag}
                  </span>
                ))}
                {template.metadata.tags.length > 3 && (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded">
                    +{template.metadata.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-neutral-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
