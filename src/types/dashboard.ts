export interface Metric {
  id: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  priority?: 'high' | 'medium' | 'low';
  icon?: string;
  details?: MetricDetails;
}

export interface MetricDetails {
  description: string;
  chart?: ChartData;
  breakdown?: BreakdownItem[];
  lastUpdated?: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'sparkline';
  data: number[];
  labels?: string[];
  color?: string;
}

export interface BreakdownItem {
  label: string;
  value: string | number;
  percentage?: number;
  color?: string;
}

export interface LiveDataPoint {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  timestamp: number;
  color?: string;
}

export interface DashboardConfig {
  updateInterval: number;
  animationDuration: number;
  maxVisibleMetrics: number;
  autoRefresh: boolean;
}

export interface MetricCardProps {
  metric: Metric;
  expanded?: boolean;
  onExpand?: (metricId: string) => void;
  onCollapse?: (metricId: string) => void;
  className?: string;
}

export interface MetricGridProps {
  metrics: Metric[];
  selectedMetric?: string;
  onMetricSelect?: (metricId: string) => void;
  layout?: 'grid' | 'list' | 'executive';
  maxColumns?: number;
}

export interface LiveDataFeedProps {
  dataPoints: LiveDataPoint[];
  updateInterval?: number;
  animationDuration?: number;
  showTrends?: boolean;
  className?: string;
}

export interface DashboardPanelProps {
  title: string;
  children: any;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

