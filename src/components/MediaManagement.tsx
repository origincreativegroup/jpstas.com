import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMedia } from '@/context/MediaContext';
import EnhancedFileUpload from './EnhancedFileUpload';
import LazyMedia from './LazyMedia';
import { useToast } from '@/context/ToastContext';

const MediaManagement: React.FC = () => {
  const { media, loading, removeMedia, bulkDelete } = useMedia();
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos' | 'documents'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const { showToast } = useToast();

  const filteredMedia = media.filter(file => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'images' && file.type.startsWith('image/')) ||
      (filter === 'videos' && file.type.startsWith('video/')) ||
      (filter === 'documents' &&
        !file.type.startsWith('image/') &&
        !file.type.startsWith('video/'));

    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedMedia.size === filteredMedia.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(filteredMedia.map(file => file.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedMedia.size} files?`)) return;

    try {
      await bulkDelete(Array.from(selectedMedia));
      setSelectedMedia(new Set());
      showToast(`${selectedMedia.size} files deleted successfully`, 'success');
    } catch (error) {
      console.error('Failed to delete files:', error);
      showToast('Failed to delete files', 'error');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await removeMedia(fileId);
      showToast('File deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete file:', error);
      showToast('Failed to delete file', 'error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📁';
  };

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
          <h2 className="text-2xl font-bold text-brand">Media Library</h2>
          <p className="text-neutral-600">Upload and manage your media files</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
        >
          Upload Files
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'images', 'videos', 'documents'] as const).map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-accent text-brand'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-brand'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-brand'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMedia.size > 0 && (
          <div className="mt-4 flex items-center justify-between bg-accent/10 rounded-lg p-4">
            <span className="text-sm font-medium text-accent">
              {selectedMedia.size} file{selectedMedia.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent/10 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map(file => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                selectedMedia.has(file.id) ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => {
                const newSelected = new Set(selectedMedia);
                if (newSelected.has(file.id)) {
                  newSelected.delete(file.id);
                } else {
                  newSelected.add(file.id);
                }
                setSelectedMedia(newSelected);
              }}
            >
              {/* File Preview */}
              <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                {file.type.startsWith('image/') || file.type.startsWith('video/') ? (
                  <LazyMedia
                    mediaFile={file}
                    className="w-full h-full"
                    alt={file.alt || file.name}
                    controls={false}
                    showThumbnail={true}
                    threshold={0.1}
                    rootMargin="50px"
                  />
                ) : (
                  <div className="text-4xl">{getFileIcon(file.type)}</div>
                )}
              </div>

              {/* File Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-brand truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">{formatFileSize(file.size)}</p>
                {file.alt && (
                  <p className="text-xs text-neutral-400 mt-1 truncate" title={file.alt}>
                    {file.alt}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedMedia.size === filteredMedia.length && filteredMedia.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-neutral-300 text-accent focus:ring-accent"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredMedia.map(file => (
                  <tr key={file.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMedia.has(file.id)}
                        onChange={() => {
                          const newSelected = new Set(selectedMedia);
                          if (newSelected.has(file.id)) {
                            newSelected.delete(file.id);
                          } else {
                            newSelected.add(file.id);
                          }
                          setSelectedMedia(newSelected);
                        }}
                        className="rounded border-neutral-300 text-accent focus:ring-accent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{getFileIcon(file.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-brand">{file.name}</div>
                          {file.alt && <div className="text-sm text-neutral-500">{file.alt}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{file.type}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(file.uploadedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {}}
                          className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No media found</h3>
          <p className="text-neutral-600 mb-4">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Upload your first media files to get started'}
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-accent text-brand rounded-lg hover:bg-accent-dark transition-colors font-medium"
          >
            Upload Files
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upload Media Files</h3>
                <button
                  onClick={() => setShowUpload(false)}
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
            <div className="p-6">
              <EnhancedFileUpload
                onUpload={() => {
                  setShowUpload(false);
                  showToast('Files uploaded successfully', 'success');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
