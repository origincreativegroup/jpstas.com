import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useMedia } from '@/context/MediaContext';
import FileUpload from '@/components/FileUpload';
import LoadingSpinner, { LoadingPage } from '@/components/LoadingSpinner';

export default function MediaLibrary() {
  const { media, loading, error, addMedia, removeMedia, refreshMedia } = useMedia();
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewMedia, setPreviewMedia] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  const filteredMedia = media.filter(file => {
    // Filter by type
    if (filter === 'images' && !file.type.startsWith('image/')) return false;
    if (filter === 'videos' && !file.type.startsWith('video/')) return false;

    // Filter by search
    if (search && !file.name.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  const handleUpload = async (file: any) => {
    addMedia(file);

    // Save to backend
    try {
      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file }),
      });
    } catch (err) {
      console.error('Failed to save media metadata:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file? This action cannot be undone.')) return;

    setDeleting(true);
    try {
      await removeMedia(id);
    } catch (err) {
      alert('Failed to delete file: ' + (err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;
    if (!confirm(`Delete ${selectedMedia.size} file(s)? This action cannot be undone.`)) return;

    setDeleting(true);
    for (const id of selectedMedia) {
      try {
        await removeMedia(id);
      } catch (err) {
        console.error('Failed to delete:', id, err);
      }
    }
    setSelectedMedia(new Set());
    setDeleting(false);
  };

  const toggleSelect = (id: string) => {
    const newSelection = new Set(selectedMedia);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedMedia(newSelection);
  };

  const selectAll = () => {
    setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
  };

  const deselectAll = () => {
    setSelectedMedia(new Set());
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
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

  if (loading && media.length === 0) {
    return <LoadingPage message="Loading media library..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-neutral-600 mt-2">
              {filteredMedia.length} file{filteredMedia.length !== 1 ? 's' : ''}
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
        <div className="mb-8">
          <FileUpload onUpload={handleUpload} multiple={true} />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
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

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('images')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'images'
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setFilter('videos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'videos'
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Videos
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
                  Select All
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={deleting}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Selected'}
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
            <p className="text-neutral-600">Upload some files to get started</p>
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
                onClick={() => toggleSelect(file.id)}
              >
                {/* Preview */}
                <div className="aspect-video bg-neutral-100">
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  )}
                </div>

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
                      copyUrl(file.url);
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
                    onChange={() => toggleSelect(file.id)}
                    className="w-5 h-5 text-brand focus:ring-brand border-neutral-300 rounded"
                    onClick={e => e.stopPropagation()}
                  />
                </div>

                {/* Info */}
                <div className="p-3 border-t border-neutral-200">
                  <p className="text-sm font-medium text-neutral-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedMedia.size === filteredMedia.length}
                      onChange={() =>
                        selectedMedia.size === filteredMedia.length ? deselectAll() : selectAll()
                      }
                      className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                    />
                  </th>
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
                        onChange={() => toggleSelect(file.id)}
                        className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
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
                    <td className="px-4 py-3 text-sm text-neutral-900 max-w-xs truncate">
                      {file.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {file.type.startsWith('image/') ? 'Image' : 'Video'}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyUrl(file.url)}
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
                  alt={previewMedia.name}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
