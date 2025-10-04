import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

interface WorkshopContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: {
    overview: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    tools: Array<{
      name: string;
      description: string;
      category: string;
    }>;
    processes: Array<{
      step: number;
      title: string;
      description: string;
    }>;
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'tool' | 'template';
    }>;
  };
  active: boolean;
  order: number;
  updatedAt: string;
}

interface WorkshopContentEditorProps {
  content: WorkshopContent | null;
  onSave: (content: WorkshopContent) => void;
  onClose: () => void;
}

const WorkshopContentEditor: React.FC<WorkshopContentEditorProps> = ({
  content,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<WorkshopContent>({
    id: '',
    title: '',
    description: '',
    icon: '🔧',
    color: 'from-blue-500 to-cyan-500',
    content: {
      overview: '',
      features: [],
      tools: [],
      processes: [],
      resources: []
    },
    active: true,
    order: 0,
    updatedAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tools' | 'processes' | 'resources'>('overview');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedContent = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      await onSave(updatedContent);
      showToast('Content saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save content:', error);
      showToast('Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        features: [
          ...prev.content.features,
          { title: '', description: '', icon: '✨' }
        ]
      }
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        features: prev.content.features.map((feature, i) =>
          i === index ? { ...feature, [field]: value } : feature
        )
      }
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        features: prev.content.features.filter((_, i) => i !== index)
      }
    }));
  };

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tools: [
          ...prev.content.tools,
          { name: '', description: '', category: 'General' }
        ]
      }
    }));
  };

  const updateTool = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tools: prev.content.tools.map((tool, i) =>
          i === index ? { ...tool, [field]: value } : tool
        )
      }
    }));
  };

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tools: prev.content.tools.filter((_, i) => i !== index)
      }
    }));
  };

  const addProcess = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        processes: [
          ...prev.content.processes,
          { step: prev.content.processes.length + 1, title: '', description: '' }
        ]
      }
    }));
  };

  const updateProcess = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        processes: prev.content.processes.map((process, i) =>
          i === index ? { ...process, [field]: value } : process
        )
      }
    }));
  };

  const removeProcess = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        processes: prev.content.processes.filter((_, i) => i !== index)
      }
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: [
          ...prev.content.resources,
          { title: '', url: '', type: 'article' as const }
        ]
      }
    }));
  };

  const updateResource = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: prev.content.resources.map((resource, i) =>
          i === index ? { ...resource, [field]: value } : resource
        )
      }
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: prev.content.resources.filter((_, i) => i !== index)
      }
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📝' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'processes', label: 'Processes', icon: '🔄' },
    { id: 'resources', label: 'Resources', icon: '📚' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${formData.color} rounded-lg flex items-center justify-center text-2xl`}>
              {formData.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{formData.title || 'Edit Workshop Section'}</h2>
              <p className="text-sm text-neutral-600">Manage content and features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-neutral-200 bg-neutral-50 p-4">
            <div className="space-y-2">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Enter section title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={3}
                  placeholder="Brief description"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="🔧"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color Gradient</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="from-blue-500 to-cyan-500">Blue to Cyan</option>
                  <option value="from-pink-500 to-rose-500">Pink to Rose</option>
                  <option value="from-yellow-500 to-orange-500">Yellow to Orange</option>
                  <option value="from-purple-500 to-indigo-500">Purple to Indigo</option>
                  <option value="from-green-500 to-emerald-500">Green to Emerald</option>
                  <option value="from-red-500 to-pink-500">Red to Pink</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm text-neutral-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-neutral-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Overview</label>
                    <textarea
                      value={formData.content.overview}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        content: { ...prev.content, overview: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      rows={8}
                      placeholder="Detailed overview of this workshop section..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Features</h3>
                    <button
                      onClick={addFeature}
                      className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.content.features.map((feature, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">Feature {index + 1}</h4>
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Icon</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="✨"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Feature title"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            rows={3}
                            placeholder="Feature description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tools</h3>
                    <button
                      onClick={addTool}
                      className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Add Tool
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.content.tools.map((tool, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">Tool {index + 1}</h4>
                          <button
                            onClick={() => removeTool(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                              type="text"
                              value={tool.name}
                              onChange={(e) => updateTool(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Tool name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input
                              type="text"
                              value={tool.category}
                              onChange={(e) => updateTool(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Category"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={tool.description}
                            onChange={(e) => updateTool(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            rows={3}
                            placeholder="Tool description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'processes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Processes</h3>
                    <button
                      onClick={addProcess}
                      className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Add Process Step
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.content.processes.map((process, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">Step {process.step}</h4>
                          <button
                            onClick={() => removeProcess(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Step Number</label>
                            <input
                              type="number"
                              value={process.step}
                              onChange={(e) => updateProcess(index, 'step', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              min="1"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={process.title}
                              onChange={(e) => updateProcess(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Process step title"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={process.description}
                            onChange={(e) => updateProcess(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            rows={3}
                            placeholder="Process step description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Resources</h3>
                    <button
                      onClick={addResource}
                      className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Add Resource
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.content.resources.map((resource, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">Resource {index + 1}</h4>
                          <button
                            onClick={() => removeResource(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              value={resource.type}
                              onChange={(e) => updateResource(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="tool">Tool</option>
                              <option value="template">Template</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={resource.title}
                              onChange={(e) => updateResource(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Resource title"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => updateResource(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Last updated: {new Date(formData.updatedAt).toLocaleString()}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopContentEditor;
