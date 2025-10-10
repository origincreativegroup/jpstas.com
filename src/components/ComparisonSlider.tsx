import { component$, useSignal, $ } from '@builder.io/qwik';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ComparisonSlider = component$<ComparisonSliderProps>(({ 
  beforeImage, 
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}) => {
  const sliderPosition = useSignal(50);
  const isDragging = useSignal(false);

  const handleMove = $((clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    sliderPosition.value = Math.max(0, Math.min(100, percentage));
  });

  const handleMouseMove = $((e: MouseEvent, rect: DOMRect) => {
    if (isDragging.value) {
      handleMove(e.clientX, rect);
    }
  });

  const handleTouchMove = $((e: TouchEvent, rect: DOMRect) => {
    if (isDragging.value && e.touches[0]) {
      handleMove(e.touches[0].clientX, rect);
    }
  });

  return (
    <div class="relative mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
      <div
        class="relative aspect-video w-full select-none"
        onMouseDown$={(e) => {
          isDragging.value = true;
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          handleMove(e.clientX, rect);
        }}
        onMouseUp$={() => (isDragging.value = false)}
        onMouseLeave$={() => (isDragging.value = false)}
        onMouseMove$={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          handleMouseMove(e, rect);
        }}
        onTouchStart$={(e) => {
          isDragging.value = true;
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          if (e.touches[0]) {
            handleMove(e.touches[0].clientX, rect);
          }
        }}
        onTouchEnd$={() => (isDragging.value = false)}
        onTouchMove$={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          handleTouchMove(e, rect);
        }}
      >
        {/* After Image (Full Width) */}
        <div class="absolute inset-0">
          <img
            src={afterImage}
            alt={afterLabel}
            class="h-full w-full object-cover"
            draggable={false}
          />
          <div class="absolute right-4 top-4 rounded-full bg-secondary/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          class="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition.value}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            class="h-full w-full object-cover"
            style={{ width: `${(100 / sliderPosition.value) * 100}%` }}
            draggable={false}
          />
          <div class="absolute left-4 top-4 rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Handle */}
        <div
          class="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition.value}%`, transform: 'translateX(-50%)' }}
        >
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl">
            <svg class="h-6 w-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});



