import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  caption: string;
  type?: 'image' | 'video';
}

interface SortableMediaGridProps {
  items: MediaItem[];
  onReorder: (items: MediaItem[]) => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  onRemove: (id: string) => void;
}

function SortableMediaItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: MediaItem;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  onRemove: (id: string) => void;
}) {
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Media Preview */}
      <div
        className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden cursor-move border-2 border-neutral-200 hover:border-brand/50 transition-colors"
        {...attributes}
        {...listeners}
      >
        {item.type === 'video' ? (
          <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
        ) : (
          <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
          {item.type === 'video' ? 'Video' : 'Image'}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove (Delete key)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Drag Handle Indicator */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>
      </div>

      {/* Alt Text */}
      <div className="mt-2">
        {isEditingAlt ? (
          <input
            type="text"
            placeholder="Alt text (for accessibility)"
            value={item.alt}
            onChange={e => onUpdate(item.id, { alt: e.target.value })}
            onBlur={() => setIsEditingAlt(false)}
            onKeyDown={e => {
              if (e.key === 'Enter') setIsEditingAlt(false);
              if (e.key === 'Escape') setIsEditingAlt(false);
            }}
            className="w-full px-2 py-1 text-sm border border-brand rounded focus:ring-2 focus:ring-brand focus:border-transparent"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditingAlt(true)}
            className="px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 rounded cursor-text min-h-[28px]"
            title="Click to edit alt text"
          >
            {item.alt || <span className="text-neutral-400">Add alt text...</span>}
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="mt-1">
        {isEditingCaption ? (
          <input
            type="text"
            placeholder="Caption (optional)"
            value={item.caption}
            onChange={e => onUpdate(item.id, { caption: e.target.value })}
            onBlur={() => setIsEditingCaption(false)}
            onKeyDown={e => {
              if (e.key === 'Enter') setIsEditingCaption(false);
              if (e.key === 'Escape') setIsEditingCaption(false);
            }}
            className="w-full px-2 py-1 text-xs border border-brand rounded focus:ring-1 focus:ring-brand focus:border-transparent"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditingCaption(true)}
            className="px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded cursor-text min-h-[24px]"
            title="Click to edit caption"
          >
            {item.caption || <span className="text-neutral-400">Add caption...</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SortableMediaGrid({
  items,
  onReorder,
  onUpdate,
  onRemove,
}: SortableMediaGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-neutral-300 rounded-lg">
        <div className="w-12 h-12 mx-auto mb-3 text-neutral-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-neutral-700">No media added yet</p>
        <p className="text-xs text-neutral-500 mt-1">
          Click &quot;Browse Media Library&quot; to add files
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-neutral-700">Selected Media ({items.length})</h4>
        <p className="text-xs text-neutral-500">
          Drag to reorder • Click to edit • Hover to remove
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map(item => (
              <SortableMediaItem
                key={item.id}
                item={item}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
