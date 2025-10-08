import { useState, useEffect } from 'react';
import { UnifiedProject, EditorMode } from '@/types/unified-project';
import { api } from '@/services/apiClient';
import { projectService } from '@/services/projectService';
import { syncContentToSections, extractContentFromSections } from '@/utils/sectionGenerator';
import MediaSelector from './MediaSelector';

interface UnifiedProjectEditorProps {
  project: UnifiedProject;
  onUpdate: (project: UnifiedProject) => void;
  onSave: () => void;
  onPublish: () => void;
  onClose: () => void;
}

type SimpleTab = 'basic' | 'content' | 'media' | 'seo';

export default function UnifiedProjectEditor({
  project,
  onUpdate,
  onSave,
  onPublish,
  onClose,
}: UnifiedProjectEditorProps) {
  const [mode, setMode] = useState<EditorMode>('simple');
  const [activeTab, setActiveTab] = useState<SimpleTab>('basic');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Simple mode state (extracted from project)
  const [simpleState, setSimpleState] = useState(() => {
    const { content, images } = extractContentFromSections(project.sections);
    return {
      title: project.title,
      role: project.role,
      summary: project.summary,
      tags: project.tags,
      type: project.type,
      featured: project.featured,
      content,
      images,
      seo: project.seo || {},
    };
  });

  // Detect unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasChanges) return;

    const autoSaveInterval = setInterval(() => {
      handleSave(true);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [hasChanges]);

  // Update project when simple state changes
  const updateFromSimpleMode = () => {
    // Sync simple content to sections
    const updatedSections = syncContentToSections(
      simpleState.content,
      simpleState.images,
      project.sections
    );

    const updatedProject: UnifiedProject = {
      ...project,
      title: simpleState.title,
      role: simpleState.role,
      summary: simpleState.summary,
      tags: simpleState.tags,
      type: simpleState.type,
      featured: simpleState.featured,
      content: simpleState.content,
      images: simpleState.images,
      sections: updatedSections,
      seo: simpleState.seo,
      updatedAt: new Date().toISOString(),
    };

    return updatedProject;
  };

  const handleSave = async (isAutoSave = false) => {
    setSaving(true);
    setErrors([]);

    try {
      const updatedProject = mode === 'simple' ? updateFromSimpleMode() : project;

      // Validate
      const validation = projectService.validateProject(updatedProject);
      if (!validation.valid) {
        setErrors(validation.errors);
        setSaving(false);
        return;
      }

      // Save via API
      await api.updateUnifiedProject(updatedProject.id, updatedProject);
      onUpdate(updatedProject);
      setHasChanges(false);

      if (!isAutoSave) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      setErrors(['Failed to save project. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setErrors([]);

    try {
      const updatedProject = mode === 'simple' ? updateFromSimpleMode() : project;
      const publishedProject = projectService.prepareForPublish(updatedProject);

      await api.updateUnifiedProject(publishedProject.id, publishedProject);
      onUpdate(publishedProject);
      setHasChanges(false);
      onPublish();
    } catch (error: any) {
      console.error('Failed to publish project:', error);
      setErrors([error.message || 'Failed to publish project']);
    } finally {
      setSaving(false);
    }
  };

  const handleSimpleChange = (field: string, value: any) => {
    setSimpleState(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleContentChange = (field: string, value: any) => {
    setSimpleState(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
    setHasChanges(true);
  };

  const switchMode = (newMode: EditorMode) => {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Switch modes anyway?')) return;
    }

    if (newMode === 'advanced' && mode === 'simple') {
      // Sync simple changes to sections before switching
      const updatedProject = updateFromSimpleMode();
      onUpdate(updatedProject);
    }

    setMode(newMode);
    setHasChanges(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-40 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Close Editor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    project.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : project.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.status}
                </span>
                {hasChanges && (
                  <span className="text-xs text-orange-600 font-medium">● Unsaved changes</span>
                )}
                {saving && <span className="text-xs text-blue-600 font-medium">Saving...</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => switchMode('simple')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  mode === 'simple'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => switchMode('advanced')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  mode === 'advanced'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Advanced
              </button>
            </div>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {project.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Validation Errors</h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'simple' ? (
          <SimpleEditor
            state={simpleState}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onChange={handleSimpleChange}
            onContentChange={handleContentChange}
          />
        ) : (
          <AdvancedEditor project={project} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

// Simple Mode Editor
function SimpleEditor({
  state,
  activeTab,
  onTabChange,
  onChange,
  onContentChange,
}: {
  state: any;
  activeTab: SimpleTab;
  onTabChange: (tab: SimpleTab) => void;
  onChange: (field: string, value: any) => void;
  onContentChange: (field: string, value: any) => void;
}) {
  return (
    <div className="flex h-full">
      {/* Tabs Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-1">
          <TabButton
            icon="📋"
            label="Basic Info"
            active={activeTab === 'basic'}
            onClick={() => onTabChange('basic')}
          />
          <TabButton
            icon="📝"
            label="Content"
            active={activeTab === 'content'}
            onClick={() => onTabChange('content')}
          />
          <TabButton
            icon="🖼️"
            label="Media"
            active={activeTab === 'media'}
            onClick={() => onTabChange('media')}
          />
          <TabButton
            icon="🔍"
            label="SEO"
            active={activeTab === 'seo'}
            onClick={() => onTabChange('seo')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'basic' && (
            <BasicInfoTab state={state} onChange={onChange} />
          )}
          {activeTab === 'content' && (
            <ContentTab state={state} onChange={onContentChange} />
          )}
          {activeTab === 'media' && (
            <MediaTab state={state} onChange={onChange} />
          )}
          {activeTab === 'seo' && (
            <SEOTab state={state} onChange={onChange} />
          )}
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-indigo-50 text-indigo-600 font-semibold'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Basic Info Tab
function BasicInfoTab({ state, onChange }: { state: any; onChange: (field: string, value: any) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={state.title}
          onChange={e => onChange('title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter project title"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Role <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={state.role}
          onChange={e => onChange('role', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Lead Designer, Full-Stack Developer"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          value={state.summary}
          onChange={e => onChange('summary', e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Brief project description (max 500 characters)"
        />
        <div className="text-sm text-gray-500 mt-1 text-right">
          {state.summary.length}/500 characters
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
        <select
          value={state.type}
          onChange={e => onChange('type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="case-study">Case Study</option>
          <option value="project">Project Showcase</option>
          <option value="image">Image Gallery</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <input
          type="text"
          value={state.tags.join(', ')}
          onChange={e => onChange('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., React, Design, E-commerce (comma separated)"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {state.tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <input
          type="checkbox"
          id="featured"
          checked={state.featured}
          onChange={e => onChange('featured', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="featured" className="flex-1 cursor-pointer">
          <div className="font-semibold text-gray-900">⭐ Featured Project</div>
          <div className="text-sm text-gray-600">
            Featured projects appear at the top of your portfolio
          </div>
        </label>
      </div>
    </div>
  );
}

// Content Tab
function ContentTab({
  state,
  onChange,
}: {
  state: any;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Content</h2>

        {/* Challenge */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">The Challenge</label>
          <textarea
            value={state.content.challenge}
            onChange={e => onChange('challenge', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the problem or challenge this project addressed..."
          />
        </div>

        {/* Solution */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">The Solution</label>
          <textarea
            value={state.content.solution}
            onChange={e => onChange('solution', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Explain how you solved the problem..."
          />
        </div>

        {/* Results */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Results & Impact</label>
          <textarea
            value={state.content.results}
            onChange={e => onChange('results', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share the outcomes and impact of the project..."
          />
        </div>

        {/* Process Steps */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Process Steps</label>
          <div className="space-y-2">
            {state.content.process.map((step: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">{i + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={e => {
                    const newProcess = [...state.content.process];
                    newProcess[i] = e.target.value;
                    onChange('process', newProcess);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Step ${i + 1}`}
                />
                <button
                  onClick={() => {
                    const newProcess = state.content.process.filter((_: any, idx: number) => idx !== i);
                    onChange('process', newProcess);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange('process', [...state.content.process, ''])}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              + Add Step
            </button>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
          <input
            type="text"
            value={state.content.technologies.join(', ')}
            onChange={e =>
              onChange('technologies', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., React, Node.js, PostgreSQL (comma separated)"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {state.content.technologies.map((tech: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Tab
function MediaTab({ state, onChange }: { state: any; onChange: (field: string, value: any) => void }) {
  return (
    <MediaSelector
      images={state.images || []}
      onChange={(images) => onChange('images', images)}
      maxImages={20}
    />
  );
}

// SEO Tab
function SEOTab({ state, onChange }: { state: any; onChange: (field: string, value: any) => void }) {
  const updateSEO = (field: string, value: any) => {
    onChange('seo', { ...state.seo, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">SEO & Metadata</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
        <input
          type="text"
          value={state.seo.metaTitle || ''}
          onChange={e => updateSEO('metaTitle', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Leave blank to use project title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
        <textarea
          value={state.seo.metaDescription || ''}
          onChange={e => updateSEO('metaDescription', e.target.value)}
          rows={3}
          maxLength={160}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Leave blank to use project summary"
        />
        <div className="text-sm text-gray-500 mt-1 text-right">
          {(state.seo.metaDescription || '').length}/160 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
        <input
          type="text"
          value={(state.seo.keywords || []).join(', ')}
          onChange={e =>
            updateSEO('keywords', e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Comma separated keywords"
        />
      </div>
    </div>
  );
}

// Advanced Mode Editor (placeholder - uses existing section-based editor)
function AdvancedEditor({
  project: _project,
  onUpdate: _onUpdate,
}: {
  project: UnifiedProject;
  onUpdate: (project: UnifiedProject) => void;
}) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <svg className="w-20 h-20 text-indigo-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Advanced Section Editor</h3>
        <p className="text-gray-600 mb-6">
          Advanced mode with drag-drop sections will be integrated in the next phase.
          For now, use Simple mode for editing content.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            <strong>Coming soon:</strong> Section-based editor with templates, drag-drop reordering, and custom layouts
          </p>
        </div>
      </div>
    </div>
  );
}
