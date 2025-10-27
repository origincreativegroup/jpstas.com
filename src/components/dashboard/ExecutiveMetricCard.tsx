import { component$, useSignal, $ } from '@builder.io/qwik';
import { TrendIndicator } from './TrendIndicator';
import { ProgressRing } from './ProgressRing';
import { SparklineChart } from './SparklineChart';
import type { MetricCardProps } from '../../types/dashboard';

export const ExecutiveMetricCard = component$<MetricCardProps>(({ 
  metric, 
  expanded = false, 
  onExpand, 
  onCollapse,
  className = ''
}) => {
  const cardRef = useSignal<HTMLElement>();
  const hasAnimated = useSignal(false);

  // Simple animation state
  hasAnimated.value = true;

  const handleClick = $(() => {
    if (expanded) {
      onCollapse?.(metric.id);
    } else {
      onExpand?.(metric.id);
    }
  });

  const getPriorityStyles = () => {
    switch (metric.priority) {
      case 'high':
        return 'border-l-4 border-primary bg-primary/5';
      case 'medium':
        return 'border-l-4 border-secondary bg-secondary/5';
      case 'low':
        return 'border-l-4 border-gray-300 bg-gray-50';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  const getIconComponent = () => {
    switch (metric.icon) {
      case 'dollar':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'trending-up':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      case 'calendar':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'star':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'leaf':
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  return (
    <div 
      ref={cardRef}
      class={`
        dashboard-card group cursor-pointer transition-all duration-300 hover:shadow-xl
        ${expanded ? 'dashboard-card-detailed' : 'dashboard-card-executive'}
        ${getPriorityStyles()}
        ${className}
        ${hasAnimated.value ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${expanded ? 'scale-105' : 'scale-100'}
      `}
      onClick$={handleClick}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Executive View */}
      {!expanded && (
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class={`p-2 rounded-lg ${
                metric.priority === 'high' ? 'bg-primary/10 text-primary' :
                metric.priority === 'medium' ? 'bg-secondary/10 text-secondary' :
                'bg-gray-100 text-gray-600'
              }`}>
                {getIconComponent()}
              </div>
              <div>
                <h3 class="text-sm font-medium text-text-secondary uppercase tracking-wide">
                  {metric.label}
                </h3>
                <div class="text-2xl font-bold text-text-primary mt-1">
                  {metric.value}
                </div>
              </div>
            </div>
            {metric.trend && (
              <TrendIndicator 
                trend={metric.trend} 
                value={metric.trendValue}
              />
            )}
          </div>
          
          {/* Mini sparkline for trend visualization */}
          {metric.details?.chart && (
            <div class="mt-4">
              <SparklineChart 
                data={metric.details.chart.data}
                width={100}
                height={20}
                color={metric.priority === 'high' ? '#2E3192' : '#6B5D3F'}
              />
            </div>
          )}
        </div>
      )}

      {/* Detailed View */}
      {expanded && (
        <div class="p-8">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class={`p-3 rounded-xl ${
                metric.priority === 'high' ? 'bg-primary/10 text-primary' :
                metric.priority === 'medium' ? 'bg-secondary/10 text-secondary' :
                'bg-gray-100 text-gray-600'
              }`}>
                {getIconComponent()}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-text-secondary uppercase tracking-wide">
                  {metric.label}
                </h3>
                <div class="text-4xl font-bold text-text-primary mt-2">
                  {metric.value}
                </div>
                {metric.trend && (
                  <div class="mt-2">
                    <TrendIndicator 
                      trend={metric.trend} 
                      value={metric.trendValue}
                    />
                  </div>
                )}
              </div>
            </div>
            <button 
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick$={(e) => {
                e.stopPropagation();
                onCollapse?.(metric.id);
              }}
            >
              <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          {metric.details?.description && (
            <p class="text-text-secondary mb-6 leading-relaxed">
              {metric.details.description}
            </p>
          )}

          {/* Breakdown */}
          {metric.details?.breakdown && (
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Breakdown
              </h4>
              <div class="space-y-3">
                {metric.details.breakdown.map((item, index) => (
                  <div key={index} class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color === 'primary' ? '#2E3192' : 
                                               item.color === 'secondary' ? '#6B5D3F' : 
                                               item.color === 'highlight' ? '#D4A14A' : '#6B7280' }}
                      />
                      <span class="text-sm text-text-secondary">{item.label}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-text-primary">{item.value}</span>
                      {item.percentage && (
                        <ProgressRing 
                          percentage={item.percentage}
                          size={24}
                          strokeWidth={2}
                          color={item.color === 'primary' ? '#2E3192' : 
                                 item.color === 'secondary' ? '#6B5D3F' : 
                                 item.color === 'highlight' ? '#D4A14A' : '#6B7280'}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last updated */}
          {metric.details?.lastUpdated && (
            <div class="mt-6 pt-4 border-t border-gray-200">
              <p class="text-xs text-text-tertiary">
                Last updated: {new Date(metric.details.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
