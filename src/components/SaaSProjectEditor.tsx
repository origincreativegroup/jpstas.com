import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import { ProjectDraft, ProjectTemplate, ProjectSection } from '@/types/saas';
import { MediaFile } from '@/types/media';
import saasProjectService from '@/services/saasProjectService';
import SASTemplateSelector from './SASTemplateSelector';
import MediaPicker from './MediaPicker';
import ProjectPreview from './ProjectPreview';
import SectionEditor from './SectionEditor';
import SaaSMediaLibrary from './SaaSMediaLibrary';
import CollaborationPanel from './CollaborationPanel';

interface SaaSProjectEditorProps {
  projectId?: string;
  onSave?: (project: ProjectDraft) => void;
  onClose?: () => void;
}

const SaaSProjectEditor: React.FC<SaaSProjectEditorProps> = ({
  projectId,
  onSave,
  onClose
}) => {
  const [project, setProject] = useState<ProjectDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'media' | 'settings' | 'preview' | 'collaborate'>('design');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Initialize editor
  useEffect(() => {
    initializeEditor();
  }, [projectId]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !project) return;

    const interval = setInterval(() => {
      handleSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [autoSave, project]);

  const initializeEditor = async () => {
    try {
      setLoading(true);
      
      if (projectId) {
        // Load existing project
        const existingProject = await saasProjectService.getProject(projectId);
        if (existingProject) {
          setProject(existingProject);
        } else {
          showToast('Project not found', 'error');
          onClose?.();
          return;
        }
      } else {
        // Load templates for new project
        setShowTemplateSelector(true);
      }
    } catch (error) {
      console.error('Failed to initialize editor:', error);
      showToast('Failed to initialize editor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (template: ProjectTemplate, title: string, description: string) => {
    try {
      const newProject = await saasProjectService.createProject(template, title, description);
      setProject(newProject);
      setShowTemplateSelector(false);
      showToast('Project created successfully', 'success');
    } catch (error) {
      console.error('Failed to create project:', error);
      showToast('Failed to create project', 'error');
    }
  };

  const handleSave = useCallback(async () => {
    if (!project) return;

    try {
      setSaving(true);
      const updatedProject = await saasProjectService.updateProject(project.id, project);
      setProject(updatedProject);
      onSave?.(updatedProject);
      showToast('Project saved', 'success');
    } catch (error) {
      console.error('Failed to save project:', error);
      showToast('Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  }, [project, onSave]);

  const handleSectionUpdate = (sectionId: string, updates: Partial<ProjectSection>) => {
    if (!project) return;

    const updatedSections = project.content.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    setProject({
      ...project,
      content: {
        ...project.content,
        sections: updatedSections
      }
    });
  };

  const handleAddMedia = async (mediaFile: MediaFile, sectionId?: string) => {
    if (!project) return;

    try {
      await saasProjectService.addMediaToProject(
        project.id,
        mediaFile,
        sectionId || 'global',
        { x: 0, y: 0 }
      );

      // Refresh project data
      const updatedProject = await saasProjectService.getProject(project.id);
      if (updatedProject) {
        setProject(updatedProject);
      }

      showToast('Media added to project', 'success');
    } catch (error) {
      console.error('Failed to add media:', error);
      showToast('Failed to add media', 'error');
    }
  };

  const handleRemoveMedia = async (mediaReferenceId: string) => {
    if (!project) return;

    try {
      await saasProjectService.removeMediaFromProject(project.id, mediaReferenceId);
      
      // Refresh project data
      const updatedProject = await saasProjectService.getProject(project.id);
      if (updatedProject) {
        setProject(updatedProject);
      }

      showToast('Media removed from project', 'success');
    } catch (error) {
      console.error('Failed to remove media:', error);
      showToast('Failed to remove media', 'error');
    }
  };

  const handlePublish = async () => {
    if (!project) return;

    try {
      const updatedProject = await saasProjectService.updateProject(project.id, {
        status: 'published',
        metadata: {
          ...project.metadata,
          published: true,
          publishDate: new Date().toISOString()
        }
      });
      setProject(updatedProject);
      showToast('Project published successfully', 'success');
    } catch (error) {
      console.error('Failed to publish project:', error);
      showToast('Failed to publish project', 'error');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
          <span className="text-lg font-medium">Loading editor...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
          <p className="text-neutral-600 mb-6">Choose a template to get started with your portfolio project.</p>
          <SASTemplateSelector
            onSelectTemplate={(template) => {
              const title = prompt('Enter project title:') || 'Untitled Project';
              const description = prompt('Enter project description:') || '';
              handleCreateProject(template, title, description);
            }}
            onCancel={() => onClose?.()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-brand font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-sm text-neutral-600">
                {project.status === 'draft' ? 'Draft' : 
                 project.status === 'published' ? 'Published' : 
                 project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                {saving && ' • Saving...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handlePublish}
              disabled={project.status === 'published'}
              className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-neutral-200 bg-neutral-50 flex flex-col">
            {/* Tab Navigation */}
            <div className="p-4 border-b border-neutral-200">
              <nav className="flex space-x-1">
                {[
                  { id: 'design', label: 'Design', icon: '🎨' },
                  { id: 'content', label: 'Content', icon: '📝' },
                  { id: 'media', label: 'Media', icon: '🖼️' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' },
                  { id: 'collaborate', label: 'Team', icon: '👥' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-brand'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'design' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Design Settings</h3>
                  
                  {/* Theme Configuration */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Primary Color</label>
                    <input
                      type="color"
                      value={project.structure.theme.primaryColor}
                      onChange={(e) => setProject({
                        ...project,
                        structure: {
                          ...project.structure,
                          theme: { ...project.structure.theme, primaryColor: e.target.value }
                        }
                      })}
                      className="w-full h-10 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Font Family</label>
                    <select
                      value={project.structure.theme.fontFamily}
                      onChange={(e) => setProject({
                        ...project,
                        structure: {
                          ...project.structure,
                          theme: { ...project.structure.theme, fontFamily: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Layout Spacing</label>
                    <select
                      value={project.structure.layout.spacing}
                      onChange={(e) => setProject({
                        ...project,
                        structure: {
                          ...project.structure,
                          layout: { ...project.structure.layout, spacing: e.target.value as any }
                        }
                      })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Content Sections</h3>
                    <button
                      onClick={() => setShowMediaPicker(true)}
                      className="px-3 py-1 text-sm bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Add Media
                    </button>
                  </div>

                  <div className="space-y-2">
                    {project.content.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSection === section.id
                            ? 'border-accent bg-accent/10'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-neutral-600 capitalize">{section.type}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-neutral-500">#{index + 1}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              section.visible ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <SaaSMediaLibrary
                  project={project}
                  onAddMedia={handleAddMedia}
                  onRemoveMedia={handleRemoveMedia}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Project Settings</h3>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => setProject({ ...project, title: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => setProject({ ...project, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={project.status}
                      onChange={(e) => setProject({ ...project, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Visibility</label>
                    <select
                      value={project.metadata.visibility}
                      onChange={(e) => setProject({
                        ...project,
                        metadata: { ...project.metadata, visibility: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="unlisted">Unlisted</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="h-4 w-4 text-accent focus:ring-accent border-neutral-300 rounded"
                    />
                    <label htmlFor="autoSave" className="text-sm text-neutral-700">
                      Auto-save every 30 seconds
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'collaborate' && (
                <CollaborationPanel projectId={project.id} />
              )}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {selectedSection ? (
              <SectionEditor
                section={project.content.sections.find(s => s.id === selectedSection)!}
                onUpdate={(updates) => handleSectionUpdate(selectedSection, updates)}
                onClose={() => setSelectedSection(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-neutral-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Select a Section to Edit</h3>
                  <p className="text-neutral-600">Choose a content section from the sidebar to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-96 border-l border-neutral-200 bg-neutral-50">
              <ProjectPreview project={project} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTemplateSelector && (
        <SASTemplateSelector
          onSelectTemplate={(template) => {
            const title = prompt('Enter project title:') || 'Untitled Project';
            const description = prompt('Enter project description:') || '';
            handleCreateProject(template, title, description);
          }}
          onCancel={() => setShowTemplateSelector(false)}
        />
      )}

      {showMediaPicker && (
        <MediaPicker
          onSelect={handleAddMedia}
          onClose={() => setShowMediaPicker(false)}
          multiple={true}
          accept="all"
        />
      )}
    </div>
  );
};

export default SaaSProjectEditor;
