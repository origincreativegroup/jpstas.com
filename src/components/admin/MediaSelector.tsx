import { useState, useCallback, useRef } from 'react';
import { useMedia } from '@/context/MediaContext';
import { ProjectImage } from '@/types/unified-project';
import { MediaFile } from '@/types/media';
import MediaPicker from '@/components/MediaPicker';
import { useToast } from '@/context/ToastContext';

interface MediaSelectorProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  maxImages?: number;
}

export default function MediaSelector({ images, onChange, maxImages }: MediaSelectorProps) {
  const { uploadFile } = useMedia();
  const toast = useToast();
  const [showPicker, setShowPicker] = useState(false);
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert MediaFile to ProjectImage
  const mediaFileToProjectImage = (mediaFile: MediaFile): ProjectImage => {
    return {
      id: mediaFile.id,
      url: mediaFile.url,
      alt: mediaFile.alt || mediaFile.metadata?.alt || mediaFile.name,
      caption: mediaFile.caption || mediaFile.metadata?.caption || '',
      type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
      order: images.length,
    };
  };

  // Handle image selection from picker
  const handleSelectFromLibrary = (mediaFile: MediaFile) => {
    // Check if already selected
    if (images.some(img => img.id === mediaFile.id)) {
      toast.info('This image is already selected');
      return;
    }

    // Check max images limit
    if (maxImages && images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const projectImage = mediaFileToProjectImage(mediaFile);
    onChange([...images, projectImage]);
    toast.success('Image added to project');
  };

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (maxImages && images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    for (const file of files) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const mediaFile = await uploadFile(file);

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        const projectImage = mediaFileToProjectImage(mediaFile);
        onChange([...images, projectImage]);

        toast.success(`Uploaded ${file.name}`);

        // Clear progress after a short delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 1000);
      } catch (error) {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
        toast.error(`Failed to upload ${file.name}: ${(error as Error).message}`);
      }
    }
  };

  // Handle drag and drop upload
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/') || file.type.startsWith('video/')
      );

      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [images, maxImages]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const handleRemove = (id: string) => {
    onChange(images.filter(img => img.id !== id));
    toast.success('Image removed');
  };

  // Update image metadata
  const handleUpdateImage = (id: string, updates: Partial<ProjectImage>) => {
    onChange(images.map(img => (img.id === id ? { ...img, ...updates } : img)));
    setEditingImage(null);
    toast.success('Image updated');
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    if (!draggedImage) return; // Safety check

    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update order property
    const reordered = newImages.map((img, idx) => ({ ...img, order: idx }));
    onChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalSize = images.reduce((acc) => {
    // Estimate size (we don't have actual size in ProjectImage)
    return acc + 1000000; // 1MB estimate per image
  }, 0);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Media</h2>
          <p className="text-sm text-gray-500 mt-1">
            {images.length} {images.length === 1 ? 'image' : 'images'}
            {maxImages && ` (max ${maxImages})`}
            {images.length > 0 && ` • ~${formatSize(totalSize)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload
          </button>
          <button
            onClick={() => setShowPicker(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Browse Library
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{filename}</p>
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone or Image Grid */}
      {images.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer"
          onClick={() => setShowPicker(true)}
        >
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600 font-medium mb-2">No media added yet</p>
          <p className="text-sm text-gray-500">
            Click to browse library, or drag and drop files here
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-gray-100 rounded-lg overflow-hidden cursor-move transition-all ${
                draggedIndex === index ? 'opacity-50 scale-95' : 'hover:ring-2 hover:ring-indigo-500'
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-video bg-gray-200">
                {image.type === 'image' ? (
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={image.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                )}
              </div>

              {/* Order Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                #{index + 1}
              </div>

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                <button
                  onClick={() => setEditingImage(image)}
                  className="opacity-0 group-hover:opacity-100 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
                  title="Edit"
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
                  onClick={() => handleRemove(image.id)}
                  className="opacity-0 group-hover:opacity-100 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                  title="Remove"
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

              {/* Info */}
              {image.alt && (
                <div className="p-2 bg-white border-t border-gray-200">
                  <p className="text-xs text-gray-600 truncate" title={image.alt}>
                    {image.alt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media Picker Modal */}
      {showPicker && (
        <MediaPicker
          onSelect={handleSelectFromLibrary}
          onClose={() => setShowPicker(false)}
          multiple={false}
          accept="all"
          selectedIds={images.map(img => img.id)}
        />
      )}

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Image Details</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!editingImage) return;
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateImage(editingImage.id, {
                  alt: formData.get('alt')?.toString() || '',
                  caption: formData.get('caption')?.toString() || '',
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    name="alt"
                    defaultValue={editingImage.alt}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    name="caption"
                    defaultValue={editingImage.caption}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Optional caption for this image"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
