import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  FCP: 1800, // First Contentful Paint
  LCP: 2500, // Largest Contentful Paint
  INP: 200,  // Interaction to Next Paint (replaced FID)
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 800, // Time to First Byte
};

// Log metrics to console in development
const logMetric = (metric: Metric) => {
  if (import.meta.env.DEV) {
    const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
    const status = metric.value < threshold ? '✅' : '⚠️';
    console.log(`${status} ${metric.name}:`, metric.value.toFixed(2), metric.rating);
  }
};

// Send metrics to analytics in production
const sendToAnalytics = (metric: Metric) => {
  if (!import.meta.env.DEV) {
    // Send to your analytics service
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }
  }
};

// Combined handler
const handleMetric = (metric: Metric) => {
  logMetric(metric);
  sendToAnalytics(metric);
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  onCLS(handleMetric);
  onINP(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
};

// Report bundle loading performance
export const reportBundleLoad = (chunkName: string, loadTime: number) => {
  if (import.meta.env.DEV) {
    console.log(`📦 Chunk loaded: ${chunkName} (${loadTime.toFixed(2)}ms)`);
  }
};
