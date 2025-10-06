import React, { useState } from 'react';
import { PortfolioProject, TemplateSection } from '@/types/template';
import { MediaFile } from '@/types/media';
import { useMedia } from '@/context/MediaContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface ProjectEditorProps {
  project: PortfolioProject;
  onUpdate: (project: PortfolioProject) => void;
  onSave: () => void;
  onPublish: () => void;
  onClose: () => void;
}

export default function ProjectEditor({ project, onUpdate, onSave, onPublish, onClose }: ProjectEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>(project.sections[0]?.id || null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerForSection, setMediaPickerForSection] = useState<string | null>(null);
  const { media: allMedia } = useMedia();

  const handleSectionReorder = (result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(project.sections);
    const [removed] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, removed);

    // Update order values
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    onUpdate({ ...project, sections: updatedSections });
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    const newSections = project.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    onUpdate({ ...project, sections: newSections });
  };

  const deleteSection = (sectionId: string) => {
    const newSections = project.sections.filter(s => s.id !== sectionId);
    onUpdate({ ...project, sections: newSections });
    if (activeSection === sectionId) {
      setActiveSection(newSections[0]?.id || null);
    }
  };

  const duplicateSection = (sectionId: string) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newSection: TemplateSection = {
      ...JSON.parse(JSON.stringify(section)),
      id: `${Date.now()}-${Math.random()}`,
      order: project.sections.length,
    };

    onUpdate({ ...project, sections: [...project.sections, newSection] });
  };

  const addMediaToSection = (sectionId: string, media: MediaFile) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    const existingMedia = section.media || [];
    updateSection(sectionId, {
      media: [...existingMedia, media],
    });
  };

  const activeS = project.sections.find(s => s.id === activeSection);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-sm text-gray-600">
                {project.status === 'draft' ? 'Draft' : project.status === 'published' ? 'Published' : 'Archived'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={onPublish}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              {project.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sections List */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sections</h2>
            <DragDropContext onDragEnd={handleSectionReorder}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {project.sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              activeSection === section.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {section.title || section.type}
                                </div>
                                <div className="text-xs text-gray-500 capitalize">{section.type}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Section Editor */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeS ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Section Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={activeS.title || ''}
                      onChange={e => updateSection(activeS.id, { title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Section title..."
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => duplicateSection(activeS.id)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteSection(activeS.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Section Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 font-medium capitalize">
                    {activeS.type}
                  </div>
                </div>

                {/* Layout */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
                  <select
                    value={activeS.layout || 'default'}
                    onChange={e => updateSection(activeS.id, { layout: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="default">Default</option>
                    <option value="full-width">Full Width</option>
                    <option value="contained">Contained</option>
                    <option value="split-left">Split Left</option>
                    <option value="split-right">Split Right</option>
                  </select>
                </div>

                {/* Media */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                  <div className="grid grid-cols-3 gap-4">
                    {activeS.media?.map((m, idx) => (
                      <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                        {m.type === 'image' ? (
                          <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                        ) : (
                          <video src={m.url} className="w-full h-full object-cover" />
                        )}
                        <button
                          onClick={() => {
                            const newMedia = activeS.media?.filter((_, i) => i !== idx);
                            updateSection(activeS.id, { media: newMedia });
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setMediaPickerForSection(activeS.id);
                        setShowMediaPicker(true);
                      }}
                      className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={JSON.stringify(activeS.content || {}, null, 2)}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateSection(activeS.id, { content: parsed });
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Section content (JSON)..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No section selected</p>
                <p className="text-sm">Select a section from the left to edit</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && mediaPickerForSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Select Media</h3>
              <button onClick={() => setShowMediaPicker(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-3 gap-4">
                {allMedia.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      addMediaToSection(mediaPickerForSection, m);
                      setShowMediaPicker(false);
                      setMediaPickerForSection(null);
                    }}
                    className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-600 transition-all"
                  >
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

