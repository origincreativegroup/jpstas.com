import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useMedia } from '@/context/MediaContext';
import { MediaFilter } from '@/types/media';
import { useToast } from '@/context/ToastContext';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import BulkOperations from '@/components/BulkOperations';
import { LoadingPage } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import { debug } from '@/utils/debug';

export default function MediaLibraryEnhanced() {
  const {
    media,
    loading,
    error,
    addMedia,
    removeMedia,
    refreshMedia,
    toggleFavorite,
    bulkUpdate,
    bulkDelete,
    getAllTags,
    getAllCollections,
  } = useMedia();

  const toast = useToast();

  const [filter, setFilter] = useState<MediaFilter>({ type: 'all' });
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewMedia, setPreviewMedia] = useState<any>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Upload queue
  const { queue, addFiles, cancelUpload, clearCompleted, stats } = useMediaUpload({
    onUploadComplete: file => {
      addMedia(file);
      toast.success(`Uploaded ${file.name}`);
    },
    onUploadError: (file) => {
      toast.error(`Failed to upload ${file.name}`);
    },
    onQueueComplete: () => {
      toast.success('All uploads complete!');
    },
  });

  useEffect(() => {
    debug.component.mount('MediaLibraryEnhanced mounted');
    refreshMedia();

    return () => {
      debug.component.unmount('MediaLibraryEnhanced unmounted');
    };
  }, [refreshMedia]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - close preview/deselect
      if (e.key === 'Escape') {
        if (previewMedia) {
          debug.info('Keyboard: Escape - Closing preview', { mediaId: previewMedia.id });
          setPreviewMedia(null);
        } else if (selectedMedia.size > 0) {
          debug.info('Keyboard: Escape - Deselecting media', { count: selectedMedia.size });
          setSelectedMedia(new Set());
        }
      }

      // Ctrl/Cmd + A - select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        debug.info('Keyboard: Select All', { totalMedia: filteredMedia.length });
        setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
      }

      // Delete - delete selected
      if (e.key === 'Delete' && selectedMedia.size > 0) {
        e.preventDefault();
        debug.info('Keyboard: Delete - Triggering bulk delete', {
          count: selectedMedia.size,
        });
        handleBulkDelete();
      }

      // Ctrl/Cmd + D - deselect all
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        debug.info('Keyboard: Deselect All', { previousCount: selectedMedia.size });
        setSelectedMedia(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, previewMedia]);

  // Filter and sort media
  const filteredMedia = media
    .filter(file => {
      // Type filter
      if (filter.type && filter.type !== 'all') {
        if (filter.type === 'images' && !file.type.startsWith('image/')) return false;
        if (filter.type === 'videos' && !file.type.startsWith('video/')) return false;
      }

      // Search filter
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

      // Tag filter
      if (filter.tags && filter.tags.length > 0) {
        const fileTags = file.metadata?.tags || [];
        if (!filter.tags.every((tag: string) => fileTags.includes(tag))) return false;
      }

      // Collection filter
      if (filter.collections && filter.collections.length > 0) {
        const fileCollections = file.metadata?.collections || [];
        if (!filter.collections.every((col: string) => fileCollections.includes(col))) return false;
      }

      // Favorite filter
      if (filter.favorite && !file.favorite) return false;

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.uploadedAt || a.createdAt).getTime() - new Date(b.uploadedAt || b.createdAt).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      debug.file.read('File input changed', {
        fileCount: files.length,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });
      if (files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      debug.file.read('Files dropped', {
        fileCount: files.length,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });
      if (files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles]
  );

  const handleDelete = async (id: string) => {
    debug.media.delete('Deleting single file', { id });
    try {
      await removeMedia(id);
      toast.success('File deleted');
    } catch (err) {
      debug.media.error('Failed to delete file', err as Error, { id });
      toast.error('Failed to delete file');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) {
      debug.warn('Bulk delete called with no selection');
      return;
    }

    debug.media.delete('Bulk deleting files', {
      count: selectedMedia.size,
      ids: Array.from(selectedMedia),
    });

    try {
      await bulkDelete(Array.from(selectedMedia));
      setSelectedMedia(new Set());
      toast.success(`Deleted ${selectedMedia.size} file(s)`);
    } catch (err) {
      debug.media.error('Bulk delete failed', err as Error, {
        count: selectedMedia.size,
      });
      toast.error('Failed to delete files');
    }
  };

  const toggleSelect = (id: string, shiftKey: boolean = false) => {
    const newSelection = new Set(selectedMedia);

    if (shiftKey && newSelection.size > 0) {
      // Shift-click range select
      debug.info('Range selection via Shift+Click', {
        startSize: newSelection.size,
        clickedId: id,
      });

      const lastSelected = Array.from(newSelection).pop();
      const lastIndex = filteredMedia.findIndex(m => m.id === lastSelected);
      const currentIndex = filteredMedia.findIndex(m => m.id === id);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);

        for (let i = start; i <= end; i++) {
          const item = filteredMedia[i];
          if (item) {
            newSelection.add(item.id);
          }
        }

        debug.info('Range selection completed', {
          rangeStart: start,
          rangeEnd: end,
          totalSelected: newSelection.size,
        });
      }
    } else {
      if (newSelection.has(id)) {
        newSelection.delete(id);
        debug.media.select('Deselected media', { id, totalSelected: newSelection.size });
      } else {
        newSelection.add(id);
        debug.media.select('Selected media', { id, totalSelected: newSelection.size });
      }
    }

    setSelectedMedia(newSelection);
  };

  const selectAll = () => {
    setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
    toast.info(`Selected ${filteredMedia.length} file(s)`);
  };

  const deselectAll = () => {
    setSelectedMedia(new Set());
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      const file = media.find(m => m.id === id);
      toast.success(file?.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      toast.error('Failed to update favorite');
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

  const allTags = getAllTags();
  const allCollections = getAllCollections();

  if (loading && media.length === 0) {
    return <LoadingPage message="Loading media library..." />;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-neutral-600 mt-2">
              {filteredMedia.length} file{filteredMedia.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          </div>
          <div className="flex gap-4">
            <NavLink
              to="/admin"
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              ← Back to Admin
            </NavLink>
          </div>
        </div>

        {/* Upload Section */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="mb-8 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-brand/50 transition-colors"
        >
          <input
            type="file"
            id="file-upload"
            accept="image/*,video/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-left">
              <p className="text-lg font-medium text-neutral-700">Upload files</p>
              <p className="text-sm text-neutral-500">Drag and drop or click to select</p>
            </div>
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Choose Files
            </button>
          </div>
        </div>

        {/* Upload Queue */}
        {queue.length > 0 && (
          <div className="mb-8 bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                Upload Queue ({stats.uploading} uploading, {stats.completed} completed, {stats.failed} failed)
              </h3>
              <button
                onClick={clearCompleted}
                className="text-xs text-neutral-600 hover:text-neutral-900"
              >
                Clear Completed
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {queue.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="truncate">{item.file.name}</span>
                      <span className={`ml-2 ${
                        item.status === 'completed' ? 'text-green-600' :
                        item.status === 'failed' ? 'text-red-600' :
                        'text-brand'
                      }`}>
                        {item.status === 'completed' ? '✓' : item.status === 'failed' ? '✗' : `${item.progress}%`}
                      </span>
                    </div>
                    <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'failed' ? 'bg-red-500' :
                          'bg-brand'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  {item.status === 'uploading' && (
                    <button
                      onClick={() => cancelUpload(item.id)}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Row 1: Search and View Controls */}
            <div className="flex items-center gap-4 flex-wrap">
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

              {/* Type Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter({ ...filter, type: 'all' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.type === 'all'
                      ? 'bg-brand text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter({ ...filter, type: 'images' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.type === 'images'
                      ? 'bg-brand text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setFilter({ ...filter, type: 'videos' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.type === 'videos'
                      ? 'bg-brand text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setFilter({ ...filter, favorite: !filter.favorite })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter.favorite
                      ? 'bg-yellow-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  title="Favorites"
                >
                  ⭐
                </button>
              </div>

              {/* Sort Controls */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-100"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>

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

            {/* Row 2: Tag & Collection Filters */}
            {(allTags.length > 0 || allCollections.length > 0) && (
              <div className="flex gap-4 flex-wrap text-sm">
                {allTags.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-600 font-medium">Tags:</span>
                    {allTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() =>
                          setFilter(prev => ({
                            ...prev,
                            tags: prev.tags?.includes(tag)
                              ? prev.tags.filter((t: string) => t !== tag)
                              : [...(prev.tags || []), tag],
                          }))
                        }
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
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

          {/* Bulk Actions */}
          {selectedMedia.size > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                {selectedMedia.size} file{selectedMedia.size !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={deselectAll}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                >
                  Deselect All
                </button>
                <button
                  onClick={selectAll}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                >
                  Select All ({filteredMedia.length})
                </button>
                <button
                  onClick={() => setShowBulkEdit(true)}
                  className="px-3 py-1 text-sm bg-brand text-white rounded hover:bg-purple-700"
                >
                  Bulk Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mb-4 text-xs text-neutral-500">
          <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded">Ctrl+A</kbd> Select all •{' '}
          <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded">Esc</kbd> Deselect/Close •{' '}
          <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded">Del</kbd> Delete selected •{' '}
          <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded">Shift+Click</kbd> Range select
        </div>

        {/* Media Grid/List */}
        {filteredMedia.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
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
              {search || filter.tags?.length || filter.collections?.length
                ? 'Try adjusting your filters'
                : 'Upload some files to get started'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map(file => (
              <div
                key={file.id}
                className={`group relative bg-white rounded-lg border-2 overflow-hidden transition-all ${
                  selectedMedia.has(file.id)
                    ? 'border-brand ring-2 ring-brand/20'
                    : 'border-neutral-200 hover:border-brand/50'
                }`}
              >
                {/* Preview */}
                <div
                  className="aspect-video bg-neutral-100 cursor-pointer"
                  onClick={e => {
                    if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                      setPreviewMedia(file);
                    } else {
                      toggleSelect(file.id, e.shiftKey);
                    }
                  }}
                >
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.metadata?.alt || file.name} className="w-full h-full object-cover" />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  )}
                </div>

                {/* Favorite Star */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleFavorite(file.id);
                  }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                    file.favorite
                      ? 'bg-yellow-500 text-white'
                      : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
                  }`}
                  title={file.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg className="w-4 h-4" fill={file.favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setPreviewMedia(file);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-all"
                    title="Preview"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (file.url) copyUrl(file.url);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-all"
                    title="Copy URL"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedMedia.has(file.id)}
                    onChange={() => {}}
                    className="w-5 h-5 text-brand focus:ring-brand border-neutral-300 rounded"
                    onClick={e => {
                      e.stopPropagation();
                      toggleSelect(file.id, e.shiftKey);
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-3 border-t border-neutral-200">
                  <p className="text-sm font-medium text-neutral-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatFileSize(file.size)} • {formatDate(file.uploadedAt || file.createdAt)}
                  </p>
                  {file.metadata?.tags && file.metadata.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {file.metadata.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-1.5 py-0.5 text-xs bg-brand/10 text-brand rounded">
                          {tag}
                        </span>
                      ))}
                      {file.metadata.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 text-xs text-neutral-500">
                          +{file.metadata.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase w-12">
                    <input
                      type="checkbox"
                      checked={selectedMedia.size === filteredMedia.length && filteredMedia.length > 0}
                      onChange={() =>
                        selectedMedia.size === filteredMedia.length ? deselectAll() : selectAll()
                      }
                      className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase w-20">
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredMedia.map(file => (
                  <tr key={file.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedMedia.has(file.id)}
                        onChange={() => {}}
                        onClick={e => toggleSelect(file.id, e.shiftKey)}
                        className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.metadata?.alt || file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {file.favorite && <span className="text-yellow-500">⭐</span>}
                        <span className="text-sm text-neutral-900 max-w-xs truncate">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {file.type.startsWith('image/') ? 'Image' : 'Video'}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatDate(file.uploadedAt || file.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {file.metadata?.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-1.5 py-0.5 text-xs bg-brand/10 text-brand rounded">
                            {tag}
                          </span>
                        ))}
                        {file.metadata?.tags && file.metadata.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 text-xs text-neutral-500">
                            +{file.metadata.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFavorite(file.id)}
                          className={`p-1 rounded ${
                            file.favorite
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-neutral-400 hover:text-yellow-500'
                          }`}
                          title={file.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <svg className="w-4 h-4" fill={file.favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => file.url && copyUrl(file.url)}
                          className="p-1 text-neutral-600 hover:text-brand"
                          title="Copy URL"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        )}

        {/* Preview Modal */}
        {previewMedia && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewMedia(null)}
          >
            <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
              {previewMedia.type.startsWith('image/') ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.metadata?.alt || previewMedia.name}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )}
              <div className="mt-4 text-white text-center">
                <p className="font-medium">{previewMedia.name}</p>
                <p className="text-sm text-neutral-300">
                  {formatFileSize(previewMedia.size)} • {formatDate(previewMedia.uploadedAt)}
                </p>
                {previewMedia.metadata?.caption && (
                  <p className="text-sm text-neutral-300 mt-2">{previewMedia.metadata.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bulk Edit Modal */}
        {showBulkEdit && (
          <BulkOperations
            selectedIds={Array.from(selectedMedia)}
            allMedia={media}
            onUpdate={bulkUpdate}
            onDelete={bulkDelete}
            onClose={() => setShowBulkEdit(false)}
            onDeselectAll={deselectAll}
          />
        )}
      </div>
    </div>
    </>
  );
}
