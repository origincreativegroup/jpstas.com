import { useState, useEffect } from 'react';
import { ProjectTemplate } from '@/types/template';

interface TemplateEditorProps {
  template?: ProjectTemplate | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'portfolio',
    isCustom: true,
    sections: [] as string[]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        isCustom: template.isCustom ?? true,
        sections: template.sections.map(s => s.title).filter((t): t is string => t !== undefined)
      });
    }
  }, [template]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const templateData: Omit<ProjectTemplate, 'id'> = {
        name: formData.name,
        description: formData.description,
        category: formData.category as any, // TemplateCategory enum
        isCustom: formData.isCustom,
        sections: formData.sections.map((title, index) => ({
          id: `section-${index}`,
          title,
          type: 'text' as const,
          content: '',
          order: index
        })),
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (template) {
        // Update existing template
        console.log('Updating template:', { ...templateData, id: template.id });
        // TODO: Call API to update template
      } else {
        // Create new template
        console.log('Creating new template:', templateData);
        // TODO: Call API to create template
      }

      onSave();
    } catch (err) {
      console.error('Failed to save template:', err);
      setError('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, '']
    }));
  };

  const updateSection = (index: number, title: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => i === index ? title : section)
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const isEditing = !!template;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing ? 'Modify template details and sections' : 'Create a custom portfolio template'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Modern Portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="portfolio">Portfolio</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe what this template is best suited for..."
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isCustom}
                onChange={(e) => setFormData(prev => ({ ...prev, isCustom: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Custom Template</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Custom templates can be modified and deleted</p>
          </div>
        </div>

        {/* Template Sections */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Template Sections</h3>
            <button
              onClick={addSection}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {formData.sections.map((section, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => updateSection(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Section title (e.g., Hero, About, Projects)"
                />
                <button
                  onClick={() => removeSection(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove section"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {formData.sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-sm">No sections yet. Add your first section to get started.</p>
            </div>
          )}
        </div>

        {/* Template Preview */}
        {formData.sections.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{formData.name || 'Untitled Template'}</h4>
              <p className="text-sm text-gray-600 mb-4">{formData.description || 'No description provided'}</p>
              <div className="space-y-2">
                {formData.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">{section || `Section ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading || !formData.name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Template' : 'Create Template')}
          </button>
        </div>
      </div>
    </div>
  );
}
