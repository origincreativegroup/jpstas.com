import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { LiveDataFeedProps, LiveDataPoint } from '../../types/dashboard';

const livePalette: Record<string, string> = {
  primary: '#b98f45',
  secondary: '#454529',
  highlight: '#6c3727',
};

const getPointColor = (token?: string) => (token ? livePalette[token] ?? '#b98f45' : '#b98f45');

export const LiveDataFeed = component$<LiveDataFeedProps>(({ 
  dataPoints, 
  updateInterval = 5000,
  animationDuration = 1000,
  showTrends = true,
  className = ''
}) => {
  const feedRef = useSignal<HTMLElement>();
  const currentData = useSignal<LiveDataPoint[]>(dataPoints);
  const isAnimating = useSignal(false);

  useVisibleTask$(({ cleanup }) => {
    if (typeof window === 'undefined' || !feedRef.value) return;

    const feed = feedRef.value;
    const interval = setInterval(() => {
      // Simulate real-time data updates
      const updatedData = currentData.value.map(point => ({
        ...point,
        previousValue: point.value,
        value: point.value + Math.floor(Math.random() * 10) - 5, // Random change
        timestamp: Date.now()
      }));

      currentData.value = updatedData;
      animateDataUpdate();
    }, updateInterval);

    const animateDataUpdate = () => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      const elements = feed.querySelectorAll('.data-point');
      
      // Add pulse animation class
      elements.forEach((el) => {
        el.classList.add('animate-pulse');
        setTimeout(() => el.classList.remove('animate-pulse'), 300);
      });

      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    };

    cleanup(() => {
      clearInterval(interval);
    });
  });

  const getTrendDirection = (point: LiveDataPoint) => {
    if (!point.previousValue) return 'neutral';
    return point.value > point.previousValue ? 'up' : 
           point.value < point.previousValue ? 'down' : 'neutral';
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
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

  return (
    <div 
      ref={feedRef}
      class={`space-y-4 ${className}`}
    >
      <div class="flex items-center gap-2 mb-6">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <h3 class="text-lg font-semibold text-text-primary">Live Data Feed</h3>
      </div>
      
      {currentData.value.map((point) => {
        const trendDirection = getTrendDirection(point);
        const trendColor = getTrendColor(trendDirection);
        
        return (
          <div 
            key={point.id}
            class="data-point flex items-center justify-between p-4 rounded-xl glass hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPointColor(point.color) }}
              />
              <div>
                <h4 class="text-sm font-medium text-text-secondary">{point.label}</h4>
                <div class="text-2xl font-bold text-text-primary">
                  {point.value.toLocaleString()}
                </div>
              </div>
            </div>
            
            {showTrends && point.previousValue && (
              <div class={`flex items-center gap-2 ${trendColor}`}>
                {getTrendIcon(trendDirection)}
                <span class="text-sm font-semibold">
                  {point.value > point.previousValue ? '+' : ''}
                  {point.value - point.previousValue}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
