import React, { useState, useEffect } from 'react';
import { useMedia } from '@/context/MediaContext';
import VideoPlayer from '@/components/VideoPlayer';
import { MediaFile } from '@/types/media';

interface GlobalMediaPickerProps {
  onSelect: (media: MediaFile) => void;
  onClose: () => void;
  filter?: 'all' | 'images' | 'videos';
  multiple?: boolean;
  onSelectMultiple?: (media: MediaFile[]) => void;
  className?: string;
}

export default function GlobalMediaPicker({
  onSelect,
  onClose,
  filter = 'all',
  multiple = false,
  onSelectMultiple,
  className = '',
}: GlobalMediaPickerProps) {
  const { media, loading, refreshMedia } = useMedia();
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  // Filter and sort media
  const filteredMedia = media
    .filter(file => {
      // Filter by type
      if (filter === 'images' && !file.type.startsWith('image/')) return false;
      if (filter === 'videos' && !file.type.startsWith('video/')) return false;

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = file.name.toLowerCase().includes(searchLower);
        const matchesAlt = file.metadata?.alt?.toLowerCase().includes(searchLower);
        const matchesCaption = file.metadata?.caption?.toLowerCase().includes(searchLower);
        const matchesTags = file.metadata?.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        );
        if (!matchesName && !matchesAlt && !matchesCaption && !matchesTags) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison =
            new Date(a.uploadedAt || a.createdAt).getTime() -
            new Date(b.uploadedAt || b.createdAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSelect = (file: MediaFile) => {
    if (multiple) {
      const newSelection = new Set(selectedMedia);
      if (newSelection.has(file.id)) {
        newSelection.delete(file.id);
      } else {
        newSelection.add(file.id);
      }
      setSelectedMedia(newSelection);
    } else {
      onSelect(file);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && onSelectMultiple) {
      const selectedFiles = media.filter(m => selectedMedia.has(m.id));
      onSelectMultiple(selectedFiles);
      onClose();
    }
  };

  const toggleSelectAll = () => {
    if (selectedMedia.size === filteredMedia.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand border-t-transparent"></div>
            <span>Loading media...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Select Media</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {multiple ? 'Select multiple files' : 'Choose a file to use'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-100"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </button>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Multiple Selection Controls */}
          {multiple && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                >
                  {selectedMedia.size === filteredMedia.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-neutral-600">
                  {selectedMedia.size} of {filteredMedia.length} selected
                </span>
              </div>
              {selectedMedia.size > 0 && (
                <button
                  onClick={handleConfirmSelection}
                  className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700"
                >
                  Select {selectedMedia.size} file{selectedMedia.size !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Media Grid/List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No files found</h3>
              <p className="text-neutral-600">
                {search ? 'Try adjusting your search terms' : 'No media files available'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map(file => (
                <div
                  key={file.id}
                  className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedMedia.has(file.id)
                      ? 'border-brand ring-2 ring-brand/20'
                      : 'border-neutral-200 hover:border-brand/50'
                  }`}
                  onClick={() => handleSelect(file)}
                >
                  {/* Preview */}
                  <div className="aspect-video bg-neutral-100">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : file.type.startsWith('video/') ? (
                      <VideoPlayer
                        mediaFile={file}
                        className="w-full h-full"
                        controls={false}
                        showThumbnail={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto text-neutral-400 mb-2">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-xs text-neutral-500">{file.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {multiple && (
                    <div className="absolute top-2 left-2">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedMedia.has(file.id)
                            ? 'bg-brand border-brand'
                            : 'bg-white border-neutral-300'
                        }`}
                      >
                        {selectedMedia.has(file.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-3 border-t border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt || file.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    {multiple && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        <input
                          type="checkbox"
                          checked={selectedMedia.size === filteredMedia.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Uploaded
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredMedia.map(file => (
                    <tr 
                      key={file.id} 
                      className="hover:bg-neutral-50 cursor-pointer"
                      onClick={() => handleSelect(file)}
                    >
                      {multiple && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedMedia.has(file.id)}
                            onChange={() => handleSelect(file)}
                            className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                            onClick={e => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : file.type.startsWith('video/') ? (
                            <VideoPlayer
                              mediaFile={file}
                              className="w-full h-full"
                              controls={false}
                              showThumbnail={true}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 max-w-xs truncate">
                        {file.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {file.type.startsWith('image/') ? 'Image' : file.type.startsWith('video/') ? 'Video' : 'File'}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {formatDate(file.uploadedAt || file.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
