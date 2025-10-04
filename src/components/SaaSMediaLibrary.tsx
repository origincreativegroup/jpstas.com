import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectDraft } from '@/types/saas';
import { MediaFile } from '@/types/media';
import { useMedia } from '@/context/MediaContext';

interface SaaSMediaLibraryProps {
  project: ProjectDraft;
  onAddMedia: (media: MediaFile, sectionId?: string) => void;
  onRemoveMedia: (mediaReferenceId: string) => void;
}

const SaaSMediaLibrary: React.FC<SaaSMediaLibraryProps> = ({
  project,
  onAddMedia,
  onRemoveMedia
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [draggedMedia, setDraggedMedia] = useState<MediaFile | null>(null);
  const { 
    media, 
    loading, 
    refreshMedia
  } = useMedia();

  // Refresh media when component mounts
  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  // Filter media based on search and type
  const filteredMedia = media.filter(mediaFile => {
    const matchesSearch = mediaFile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mediaFile.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'image' && mediaFile.type.startsWith('image/')) ||
                       (selectedType === 'video' && mediaFile.type.startsWith('video/')) ||
                       (selectedType === 'audio' && mediaFile.type.startsWith('audio/')) ||
                       (selectedType === 'document' && !mediaFile.type.startsWith('image/') && !mediaFile.type.startsWith('video/') && !mediaFile.type.startsWith('audio/'));
    return matchesSearch && matchesType;
  });

  // Get project sections for filtering
  const projectSections = project.content.sections.map(section => ({
    id: section.id,
    title: section.title,
    type: section.type
  }));

  const handleDragStart = (e: React.DragEvent, mediaFile: MediaFile) => {
    setDraggedMedia(mediaFile);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedMedia(null);
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    if (draggedMedia) {
      onAddMedia(draggedMedia, sectionId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const getMediaTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    return '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaInSection = (sectionId: string) => {
    return project.content.media.filter(mediaRef => 
      mediaRef.position && (mediaRef.position as any).sectionId === sectionId
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Media Library</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {viewMode === 'grid' ? '📋' : '⊞'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Sections</option>
            {projectSections.map(section => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Sections */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-neutral-600 uppercase tracking-wide">Project Sections</h4>
        {projectSections.map(section => {
          const sectionMedia = getMediaInSection(section.id);
          return (
            <div
              key={section.id}
              className="border border-neutral-200 rounded-lg p-3"
              onDrop={(e) => handleDrop(e, section.id)}
              onDragOver={handleDragOver}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">{section.title}</h5>
                <span className="text-xs text-neutral-500">
                  {sectionMedia.length} media
                </span>
              </div>
              
              {sectionMedia.length > 0 ? (
                <div className="flex space-x-2 overflow-x-auto">
                  {sectionMedia.map(mediaRef => {
                    const mediaFile = media.find(m => m.id === mediaRef.mediaId);
                    if (!mediaFile) return null;
                    
                    return (
                      <div key={mediaRef.id} className="flex-shrink-0 relative group">
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {mediaFile.type.startsWith('image/') ? (
                            <img
                              src={mediaFile.url}
                              alt={mediaFile.alt || mediaFile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{getMediaTypeIcon(mediaFile.type)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveMedia(mediaRef.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-neutral-500 text-sm">
                  Drop media here or drag from library
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Media Library */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-neutral-600 uppercase tracking-wide">
          Available Media ({filteredMedia.length})
        </h4>
        
        {filteredMedia.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖼️</span>
            </div>
            <p>No media found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
            {filteredMedia.map(mediaFile => (
              <motion.div
                key={mediaFile.id}
                draggable
                onDragStart={(e) => handleDragStart(e as any, mediaFile)}
                onDragEnd={handleDragEnd}
                className={`${
                  viewMode === 'grid' 
                    ? 'aspect-square' 
                    : 'flex items-center space-x-3 p-3'
                } border border-neutral-200 rounded-lg cursor-move hover:border-accent transition-colors group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {viewMode === 'grid' ? (
                  <div className="relative w-full h-full">
                    <div className="w-full h-full bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {mediaFile.type.startsWith('image/') ? (
                        <img
                          src={mediaFile.url}
                          alt={mediaFile.alt || mediaFile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{getMediaTypeIcon(mediaFile.type)}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => onAddMedia(mediaFile)}
                        className="opacity-0 group-hover:opacity-100 bg-accent text-brand px-3 py-1 rounded text-sm font-medium transition-all duration-200"
                      >
                        Add to Project
                      </button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {getMediaTypeIcon(mediaFile.type)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {mediaFile.type.startsWith('image/') ? (
                        <img
                          src={mediaFile.url}
                          alt={mediaFile.alt || mediaFile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">{getMediaTypeIcon(mediaFile.type)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="font-medium truncate">{mediaFile.name}</h6>
                      <p className="text-sm text-neutral-500 truncate">
                        {mediaFile.alt || 'No description'}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {formatFileSize(mediaFile.size)} • {mediaFile.type}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddMedia(mediaFile)}
                      className="px-3 py-1 bg-accent text-brand rounded text-sm font-medium hover:bg-accent-dark transition-colors"
                    >
                      Add
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Drag Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Drag & Drop</h4>
            <p className="text-sm text-blue-700 mt-1">
              Drag media from the library to any section to add it to your project. 
              You can also click the "Add" button for quick addition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSMediaLibrary;
