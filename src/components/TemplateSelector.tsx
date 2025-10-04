import { useState } from 'react';
import { ProjectTemplate, PROJECT_TEMPLATES } from '@/types/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onCancel: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onCancel }: TemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = PROJECT_TEMPLATES.filter(template => {
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const templateTypes = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'case-study', name: 'Case Studies', icon: '📊' },
    { id: 'portfolio-piece', name: 'Portfolio Pieces', icon: '🎨' },
    { id: 'client-work', name: 'Client Work', icon: '💼' },
    { id: 'personal-project', name: 'Personal Projects', icon: '🚀' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Choose Project Template</h2>
              <p className="text-neutral-600 mt-1">Select a template to get started with pre-filled fields</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {templateTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedType === type.id
                      ? 'bg-brand text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                  }`}
                >
                  <span>{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-brand/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${template.color}20`, color: template.color }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mt-1">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {template.metadata.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {template.metadata.difficulty}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {template.fields.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.fields.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600">
                            +{template.fields.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">
                      {template.metadata.requiredFields.length} required fields
                    </span>
                    <button className="text-brand hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                      Use Template
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto text-neutral-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No templates found</h3>
              <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
