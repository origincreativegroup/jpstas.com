import { useState, useEffect, useCallback } from 'react';
import { useMedia, MediaFile, MediaFilter } from '@/context/MediaContext';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useToast } from '@/context/ToastContext';

interface MediaPickerProps {
  onSelect: (file: MediaFile) => void;
  onClose: () => void;
  multiple?: boolean;
  accept?: 'all' | 'images' | 'videos';
  selectedIds?: string[];
}

export default function MediaPicker({
  onSelect,
  onClose,
  multiple = false,
  accept = 'all',
  selectedIds = [],
}: MediaPickerProps) {
  const { media, refreshMedia, addMedia, getAllTags, getAllCollections } = useMedia();
  const toast = useToast();
  const [view, setView] = useState<'browse' | 'upload'>('browse');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MediaFilter>({ type: accept });
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(selectedIds));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { queue, addFiles, stats } = useMediaUpload({
    onUploadComplete: file => {
      addMedia(file);
      toast.success(`Uploaded ${file.name}`);
    },
    onUploadError: (file, error) => {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    },
  });

  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        addFiles(files);
        setView('upload');
      }
    },
    [addFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        addFiles(files);
        setView('upload');
      }
    },
    [addFiles]
  );

  const toggleSelect = (id: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (!multiple) {
        newSelection.clear();
      }
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const handleConfirmSelection = () => {
    const selected = media.filter(m => selectedFiles.has(m.id));
    selected.forEach(file => onSelect(file));
    onClose();
  };

  // Apply filters
  const filteredMedia = media.filter(file => {
    // Type filter
    if (filter.type && filter.type !== 'all') {
      if (filter.type === 'images' && !file.type.startsWith('image/')) return false;
      if (filter.type === 'videos' && !file.type.startsWith('video/')) return false;
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesName = file.name.toLowerCase().includes(searchLower);
      const matchesTags = file.metadata?.tags?.some(tag =>
        tag.toLowerCase().includes(searchLower)
      );
      if (!matchesName && !matchesTags) return false;
    }

    // Tag filter
    if (filter.tags && filter.tags.length > 0) {
      const fileTags = file.metadata?.tags || [];
      if (!filter.tags.some(tag => fileTags.includes(tag))) return false;
    }

    // Collection filter
    if (filter.collections && filter.collections.length > 0) {
      const fileCollections = file.metadata?.collections || [];
      if (!filter.collections.some(col => fileCollections.includes(col))) return false;
    }

    return true;
  });

  const allTags = getAllTags();
  const allCollections = getAllCollections();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">Select Media</h2>
            <p className="text-sm text-neutral-600 mt-1">
              {selectedFiles.size > 0
                ? `${selectedFiles.size} file${selectedFiles.size !== 1 ? 's' : ''} selected`
                : 'Choose from your media library or upload new files'}
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

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-neutral-200 flex-shrink-0">
          <button
            onClick={() => setView('browse')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              view === 'browse'
                ? 'border-brand text-brand'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Browse Library ({filteredMedia.length})
          </button>
          <button
            onClick={() => setView('upload')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              view === 'upload'
                ? 'border-brand text-brand'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Upload New
            {stats.total > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-brand text-white rounded-full">
                {stats.uploading > 0 ? `${stats.uploading} uploading` : `${stats.completed} done`}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {view === 'browse' ? (
            <div className="p-6">
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-4 items-center flex-wrap">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />

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

                {/* Tag & Collection Filters */}
                {(allTags.length > 0 || allCollections.length > 0) && (
                  <div className="flex gap-4 flex-wrap">
                    {allTags.length > 0 && (
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-neutral-600">Tags:</span>
                        {allTags.slice(0, 5).map(tag => (
                          <button
                            key={tag}
                            onClick={() =>
                              setFilter(prev => ({
                                ...prev,
                                tags: prev.tags?.includes(tag)
                                  ? prev.tags.filter(t => t !== tag)
                                  : [...(prev.tags || []), tag],
                              }))
                            }
                            className={`px-2 py-1 text-xs rounded-full transition-colors ${
                              filter.tags?.includes(tag)
                                ? 'bg-brand text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Media Grid */}
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
                  <p className="text-neutral-600">Try adjusting your filters or upload new files</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map(file => (
                    <div
                      key={file.id}
                      onClick={() => toggleSelect(file.id)}
                      className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                        selectedFiles.has(file.id)
                          ? 'border-brand ring-2 ring-brand/20'
                          : 'border-neutral-200 hover:border-brand/50'
                      }`}
                    >
                      <div className="aspect-square bg-neutral-100">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.metadata?.alt || file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video src={file.url} className="w-full h-full object-cover" preload="metadata" />
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => toggleSelect(file.id)}
                          className="w-5 h-5 text-brand focus:ring-brand border-neutral-300 rounded"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 bg-white border-t border-neutral-200">
                        <p className="text-xs font-medium text-neutral-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="divide-y divide-neutral-200">
                    {filteredMedia.map(file => (
                      <div
                        key={file.id}
                        onClick={() => toggleSelect(file.id)}
                        className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                          selectedFiles.has(file.id) ? 'bg-brand/5' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => toggleSelect(file.id)}
                          className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.metadata?.alt || file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video src={file.url} className="w-full h-full object-cover" preload="metadata" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                          <p className="text-xs text-neutral-500">
                            {file.type.startsWith('image/') ? 'Image' : 'Video'} •{' '}
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {/* Upload Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-brand/50 transition-colors"
              >
                <input
                  type="file"
                  id="file-upload"
                  accept={accept === 'images' ? 'image/*' : accept === 'videos' ? 'video/*' : 'image/*,video/*'}
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-neutral-700 mb-2">Upload files</p>
                <p className="text-sm text-neutral-500 mb-4">Drag and drop files here, or click to select</p>
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Choose Files
                </button>
              </div>

              {/* Upload Queue */}
              {queue.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium text-neutral-900">Upload Queue</h3>
                  {queue.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 truncate">{item.file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                item.status === 'completed'
                                  ? 'bg-green-500'
                                  : item.status === 'failed'
                                  ? 'bg-red-500'
                                  : 'bg-brand'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-neutral-500">{item.progress}%</span>
                        </div>
                      </div>
                      <div className="text-xs font-medium">
                        {item.status === 'completed' && (
                          <span className="text-green-600">✓ Done</span>
                        )}
                        {item.status === 'uploading' && (
                          <span className="text-brand">Uploading...</span>
                        )}
                        {item.status === 'failed' && <span className="text-red-600">Failed</span>}
                        {item.status === 'pending' && (
                          <span className="text-neutral-500">Pending...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-neutral-600">
            {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={selectedFiles.size === 0}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedFiles.size > 0 ? `(${selectedFiles.size})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
