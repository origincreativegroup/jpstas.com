import { $, component$, type QRL } from '@builder.io/qwik';

type ProgressDotsProps = {
  count: number;
  currentIndex: number;
  onSelect$?: QRL<(index: number) => void>;
  class?: string;
};

export const ProgressDots = component$<ProgressDotsProps>(({ count, currentIndex, onSelect$, class: className }) => {
  const handleClick = $(
    async (index: number, handler?: QRL<(active: number) => void>) => {
    if (handler) {
        await handler(index);
    }
    },
  );

  return (
    <div class={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === currentIndex ? 'true' : undefined}
          class={[
            'h-2 rounded-full transition-all duration-300',
            index === currentIndex ? 'w-8 bg-[#F6F5F2]' : 'w-2 bg-[#F6F5F2]/40 hover:bg-[#F6F5F2]/70 focus-visible:bg-[#F6F5F2]/70',
          ].join(' ')}
          onClick$={$(() => handleClick(index, onSelect$))}
        />
      ))}
    </div>
  );
});


