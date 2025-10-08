import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useMedia } from '@/context/MediaContext';
import { MediaFile } from '@/types/media';

interface MediaLibraryViewProps {
  onSelectMedia?: (media: MediaFile) => void;
  compact?: boolean;
}

export default function MediaLibraryView({ onSelectMedia, compact = false }: MediaLibraryViewProps) {
  const { media, refreshMedia, getAllCollections } = useMedia();
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  const collections = getAllCollections();

  // Filter media
  const filteredMedia = media
    .filter(file => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = file.name.toLowerCase().includes(searchLower);
        const matchesTags = file.metadata?.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        );
        if (!matchesName && !matchesTags) return false;
      }

      // Collection filter
      if (selectedCollection !== 'all') {
        const fileCollections = file.metadata?.collections || [];
        if (!fileCollections.includes(selectedCollection)) return false;
      }

      return true;
    })
    .slice(0, compact ? 8 : 20); // Limit items in compact mode

  const recentUploads = media
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt || a.createdAt).getTime();
      const dateB = new Date(b.uploadedAt || b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 6);

  const handleMediaClick = (mediaFile: MediaFile) => {
    if (onSelectMedia) {
      onSelectMedia(mediaFile);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Media Library</h3>
          <NavLink
            to="/media"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </NavLink>
        </div>

        {/* Recent Uploads */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Uploads</h4>
          <div className="grid grid-cols-3 gap-2">
            {recentUploads.map(file => (
              <div
                key={file.id}
                onClick={() => handleMediaClick(file)}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={file.url} className="w-full h-full object-cover" preload="metadata" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Total Files</p>
            <p className="text-lg font-semibold text-gray-900">{media.length}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Collections</p>
            <p className="text-lg font-semibold text-gray-900">{collections.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Media Library</h2>
          <NavLink
            to="/media"
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Full Library
          </NavLink>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Collections Filter */}
      {collections.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCollection === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {collections.map(collection => (
              <button
                key={collection}
                onClick={() => setSelectedCollection(collection)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCollection === collection
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {collection}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="p-4">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 font-medium">No media found</p>
            <p className="text-sm text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filteredMedia.map(file => (
              <div
                key={file.id}
                onClick={() => handleMediaClick(file)}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
              >
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

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 text-white text-center p-2">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] font-medium rounded">
                  {file.type.startsWith('image/') ? 'IMG' : 'VID'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing {filteredMedia.length} of {media.length} files
          </span>
          <div className="flex gap-4">
            <span className="text-gray-600">
              Images: {media.filter(m => m.type.startsWith('image/')).length}
            </span>
            <span className="text-gray-600">
              Videos: {media.filter(m => m.type.startsWith('video/')).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
