import { useState } from 'react';
import { MediaFile } from '@/context/MediaContext';

interface BulkOperationsProps {
  selectedIds: string[];
  allMedia: MediaFile[];
  onUpdate: (ids: string[], updates: Partial<MediaFile>) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
  onClose: () => void;
  onDeselectAll: () => void;
}

export default function BulkOperations({
  selectedIds,
  allMedia,
  onUpdate,
  onDelete,
  onClose,
  onDeselectAll,
}: BulkOperationsProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'collections' | 'metadata'>('tags');
  const [tags, setTags] = useState<string>('');
  const [collections, setCollections] = useState<string>('');
  const [alt, setAlt] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const selectedMedia = allMedia.filter(m => selectedIds.includes(m.id));

  const handleAddTags = async () => {
    if (!tags.trim()) return;

    setProcessing(true);
    try {
      const newTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      // Merge with existing tags for each file
      const updates: Record<string, Partial<MediaFile>> = {};
      selectedMedia.forEach(file => {
        const existingTags = file.metadata?.tags || [];
        const mergedTags = Array.from(new Set([...existingTags, ...newTags]));
        updates[file.id] = {
          metadata: {
            ...file.metadata,
            tags: mergedTags,
          },
        };
      });

      for (const id of selectedIds) {
        if (updates[id]) {
          await onUpdate([id], updates[id]);
        }
      }

      setTags('');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddCollections = async () => {
    if (!collections.trim()) return;

    setProcessing(true);
    try {
      const newCollections = collections
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

      const updates: Record<string, Partial<MediaFile>> = {};
      selectedMedia.forEach(file => {
        const existingCollections = file.metadata?.collections || [];
        const mergedCollections = Array.from(new Set([...existingCollections, ...newCollections]));
        updates[file.id] = {
          metadata: {
            ...file.metadata,
            collections: mergedCollections,
          },
        };
      });

      for (const id of selectedIds) {
        if (updates[id]) {
          await onUpdate([id], updates[id]);
        }
      }

      setCollections('');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!alt.trim() && !caption.trim()) return;

    setProcessing(true);
    try {
      const updates: Partial<MediaFile> = {
        metadata: {},
      };

      if (alt.trim()) {
        updates.metadata!.alt = alt;
      }
      if (caption.trim()) {
        updates.metadata!.caption = caption;
      }

      await onUpdate(selectedIds, updates);
      setAlt('');
      setCaption('');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} file(s)? This action cannot be undone.`)) return;

    setProcessing(true);
    try {
      await onDelete(selectedIds);
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Bulk Edit</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Editing {selectedIds.length} file{selectedIds.length !== 1 ? 's' : ''}
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

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('tags')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tags'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tags
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'collections'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'metadata'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Metadata
            </button>
          </div>

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Add Tags</label>
                <p className="text-xs text-neutral-500 mb-3">
                  Enter comma-separated tags to add to all selected files
                </p>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g., product, featured, banner"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddTags}
                disabled={processing || !tags.trim()}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Adding...' : 'Add Tags'}
              </button>

              {/* Current tags preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Current Tags</h4>
                <div className="space-y-2">
                  {selectedMedia.slice(0, 3).map(file => (
                    <div key={file.id} className="text-sm">
                      <span className="font-medium truncate block">{file.name}</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {(file.metadata?.tags || []).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-brand/10 text-brand rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {(!file.metadata?.tags || file.metadata.tags.length === 0) && (
                          <span className="text-xs text-neutral-400">No tags</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {selectedMedia.length > 3 && (
                    <p className="text-xs text-neutral-500">
                      +{selectedMedia.length - 3} more file{selectedMedia.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Add to Collections</label>
                <p className="text-xs text-neutral-500 mb-3">
                  Enter comma-separated collections to add files to
                </p>
                <input
                  type="text"
                  value={collections}
                  onChange={e => setCollections(e.target.value)}
                  placeholder="e.g., homepage, portfolio, client-work"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddCollections}
                disabled={processing || !collections.trim()}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Adding...' : 'Add to Collections'}
              </button>

              {/* Current collections preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Current Collections</h4>
                <div className="space-y-2">
                  {selectedMedia.slice(0, 3).map(file => (
                    <div key={file.id} className="text-sm">
                      <span className="font-medium truncate block">{file.name}</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {(file.metadata?.collections || []).map(col => (
                          <span
                            key={col}
                            className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full"
                          >
                            {col}
                          </span>
                        ))}
                        {(!file.metadata?.collections || file.metadata.collections.length === 0) && (
                          <span className="text-xs text-neutral-400">No collections</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {selectedMedia.length > 3 && (
                    <p className="text-xs text-neutral-500">
                      +{selectedMedia.length - 3} more file{selectedMedia.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alt Text</label>
                <p className="text-xs text-neutral-500 mb-3">
                  Set the same alt text for all selected images
                </p>
                <input
                  type="text"
                  value={alt}
                  onChange={e => setAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Caption</label>
                <p className="text-xs text-neutral-500 mb-3">
                  Set the same caption for all selected files
                </p>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Add a descriptive caption"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <button
                onClick={handleUpdateMetadata}
                disabled={processing || (!alt.trim() && !caption.trim())}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Updating...' : 'Update Metadata'}
              </button>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between gap-4">
          <button
            onClick={onDeselectAll}
            className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-100"
          >
            Deselect All
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={processing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Delete Selected
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
