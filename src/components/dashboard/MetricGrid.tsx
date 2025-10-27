import { component$, useSignal, $ } from '@builder.io/qwik';
import { ExecutiveMetricCard } from './ExecutiveMetricCard';
import type { Metric, MetricGridProps } from '../../types/dashboard';

export const MetricGrid = component$<MetricGridProps>(({ 
  metrics, 
  selectedMetric, 
  onMetricSelect,
  layout = 'executive',
  maxColumns = 4
}) => {
  const gridRef = useSignal<HTMLElement>();
  // Cards will animate via CSS classes

  const handleMetricClick = $((metricId: string) => {
    onMetricSelect?.(metricId);
  });

  const getGridClasses = () => {
    switch (layout) {
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(maxColumns, 4)} gap-6`;
      case 'list':
        return 'space-y-4';
      case 'executive':
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(maxColumns, 4)} gap-6`;
      default:
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(maxColumns, 4)} gap-6`;
    }
  };

  const getCardClasses = (metric: Metric) => {
    const baseClasses = 'transition-all duration-300';
    
    if (selectedMetric === metric.id) {
      return `${baseClasses} metric-highlight`;
    } else if (selectedMetric && selectedMetric !== metric.id) {
      return `${baseClasses} metric-dim`;
    }
    
    return baseClasses;
  };

  return (
    <div 
      ref={gridRef}
      class={getGridClasses()}
    >
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          class={getCardClasses(metric)}
        >
          <ExecutiveMetricCard
            metric={metric}
            expanded={selectedMetric === metric.id}
            onExpand={handleMetricClick}
            onCollapse={$(() => onMetricSelect?.(undefined as any))}
          />
        </div>
      ))}
    </div>
  );
});
