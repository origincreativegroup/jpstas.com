import { component$, useSignal } from '@builder.io/qwik';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'neutral';
  value?: string;
  className?: string;
}

export const TrendIndicator = component$<TrendIndicatorProps>(({ 
  trend, 
  value, 
  className = '' 
}) => {
  const iconRef = useSignal<HTMLElement>();

  // Icon will animate via CSS classes

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      default:
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
          </svg>
        );
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div class={`flex items-center gap-1 ${className}`}>
      <div 
        ref={iconRef}
        class={`${getTrendColor()} transition-all duration-300 animate-bounce`}
      >
        {getTrendIcon()}
      </div>
      {value && (
        <span class={`text-sm font-semibold ${getTrendColor()}`}>
          {value}
        </span>
      )}
    </div>
  );
});
