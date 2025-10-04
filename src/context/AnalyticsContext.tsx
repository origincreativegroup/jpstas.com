import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ProjectAnalytics } from '@/types/project';
import { debug } from '@/utils/debug';

interface AnalyticsData {
  projectId: string;
  analytics: ProjectAnalytics;
  views: Array<{
    id: string;
    timestamp: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
    device?: string;
  }>;
  interactions: Array<{
    id: string;
    type: 'like' | 'share' | 'download' | 'view_image' | 'view_video';
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}

interface AnalyticsContextType {
  analytics: AnalyticsData[];
  loading: boolean;
  error: string | null;
  trackView: (projectId: string, metadata?: Record<string, any>) => Promise<void>;
  trackInteraction: (projectId: string, type: string, metadata?: Record<string, any>) => Promise<void>;
  getProjectAnalytics: (projectId: string) => ProjectAnalytics | undefined;
  getAnalyticsData: (projectId: string) => AnalyticsData | undefined;
  refreshAnalytics: () => Promise<void>;
  getTopProjects: (limit?: number) => AnalyticsData[];
  getRecentActivity: (limit?: number) => Array<{ projectId: string; type: string; timestamp: string; metadata?: any }>;
  exportAnalytics: (projectId?: string) => Promise<string>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackView = useCallback(async (projectId: string, metadata?: Record<string, any>) => {
    debug.analytics.track('Tracking view', { projectId, metadata });
    
    try {
      const viewData = {
        id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        referrer: metadata?.referrer || document.referrer || 'direct',
        userAgent: navigator.userAgent,
        country: metadata?.country,
        device: metadata?.device || (window.innerWidth < 768 ? 'mobile' : 'desktop'),
      };

      if (import.meta.env.DEV) {
        // Mock tracking in development
        debug.info('Mock analytics tracking (dev mode)', { projectId, viewData });
        setAnalytics(prev => prev.map(data => 
          data.projectId === projectId 
            ? {
                ...data,
                analytics: {
                  ...data.analytics,
                  views: data.analytics.views + 1,
                  lastViewed: viewData.timestamp,
                },
                views: [...data.views, viewData],
              }
            : data
        ));
      } else {
        // Real API call
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, type: 'view', data: viewData }),
        });

        if (!response.ok) {
          throw new Error('Failed to track view');
        }
      }

      debug.analytics.complete('View tracked successfully', { projectId });
    } catch (err) {
      debug.analytics.error('Failed to track view', err as Error, { projectId });
      setError((err as Error).message);
    }
  }, []);

  const trackInteraction = useCallback(async (projectId: string, type: string, metadata?: Record<string, any>) => {
    debug.analytics.track('Tracking interaction', { projectId, type, metadata });
    
    try {
      const interactionData = {
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type as any,
        timestamp: new Date().toISOString(),
        metadata,
      };

      if (import.meta.env.DEV) {
        // Mock tracking in development
        debug.info('Mock analytics tracking (dev mode)', { projectId, interactionData });
        setAnalytics(prev => prev.map(data => 
          data.projectId === projectId 
            ? {
                ...data,
                analytics: {
                  ...data.analytics,
                  [type === 'like' ? 'likes' : type === 'share' ? 'shares' : 'views']: 
                    (data.analytics[type === 'like' ? 'likes' : type === 'share' ? 'shares' : 'views'] || 0) + 1,
                },
                interactions: [...data.interactions, interactionData],
              }
            : data
        ));
      } else {
        // Real API call
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, type, data: interactionData }),
        });

        if (!response.ok) {
          throw new Error('Failed to track interaction');
        }
      }

      debug.analytics.complete('Interaction tracked successfully', { projectId, type });
    } catch (err) {
      debug.analytics.error('Failed to track interaction', err as Error, { projectId, type });
      setError((err as Error).message);
    }
  }, []);

  const getProjectAnalytics = useCallback((projectId: string): ProjectAnalytics | undefined => {
    const data = analytics.find(a => a.projectId === projectId);
    return data?.analytics;
  }, [analytics]);

  const getAnalyticsData = useCallback((projectId: string): AnalyticsData | undefined => {
    return analytics.find(a => a.projectId === projectId);
  }, [analytics]);

  const refreshAnalytics = useCallback(async (): Promise<void> => {
    debug.analytics.fetch('Refreshing analytics data');
    setLoading(true);
    setError(null);

    try {
      if (import.meta.env.DEV) {
        // Mock analytics data in development
        debug.info('Using mock analytics data (dev mode)');
        const mockAnalytics: AnalyticsData[] = [
          {
            projectId: '1',
            analytics: {
              views: 1247,
              likes: 89,
              shares: 23,
              lastViewed: new Date(Date.now() - 3600000).toISOString(),
              engagementRate: 0.09,
              topReferrers: [
                { source: 'Google', count: 456 },
                { source: 'LinkedIn', count: 234 },
                { source: 'Direct', count: 189 },
                { source: 'Twitter', count: 123 },
                { source: 'Facebook', count: 89 },
              ],
            },
            views: Array.from({ length: 50 }, (_, i) => ({
              id: `view_${i}`,
              timestamp: new Date(Date.now() - i * 3600000).toISOString(),
              referrer: ['Google', 'LinkedIn', 'Direct', 'Twitter'][i % 4],
              device: ['desktop', 'mobile'][i % 2],
            })),
            interactions: Array.from({ length: 20 }, (_, i) => ({
              id: `interaction_${i}`,
              type: ['like', 'share', 'view_image'][i % 3] as any,
              timestamp: new Date(Date.now() - i * 1800000).toISOString(),
            })),
          },
          {
            projectId: '2',
            analytics: {
              views: 892,
              likes: 67,
              shares: 15,
              lastViewed: new Date(Date.now() - 7200000).toISOString(),
              engagementRate: 0.092,
              topReferrers: [
                { source: 'Google', count: 321 },
                { source: 'Direct', count: 234 },
                { source: 'LinkedIn', count: 189 },
                { source: 'Twitter', count: 98 },
                { source: 'Facebook', count: 50 },
              ],
            },
            views: Array.from({ length: 35 }, (_, i) => ({
              id: `view_${i}`,
              timestamp: new Date(Date.now() - i * 3600000).toISOString(),
              referrer: ['Google', 'Direct', 'LinkedIn'][i % 3],
              device: ['desktop', 'mobile'][i % 2],
            })),
            interactions: Array.from({ length: 15 }, (_, i) => ({
              id: `interaction_${i}`,
              type: ['like', 'share', 'view_image'][i % 3] as any,
              timestamp: new Date(Date.now() - i * 1800000).toISOString(),
            })),
          },
        ];
        setAnalytics(mockAnalytics);
      } else {
        // Real API call
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data.analytics || []);
      }

      debug.analytics.complete('Analytics refreshed successfully', { count: analytics.length });
    } catch (err) {
      debug.analytics.error('Failed to refresh analytics', err as Error);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [analytics.length]);

  const getTopProjects = useCallback((limit = 10): AnalyticsData[] => {
    return analytics
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, limit);
  }, [analytics]);

  const getRecentActivity = useCallback((limit = 20) => {
    const allActivities: Array<{ projectId: string; type: string; timestamp: string; metadata?: any }> = [];
    
    analytics.forEach(data => {
      data.views.forEach(view => {
        allActivities.push({
          projectId: data.projectId,
          type: 'view',
          timestamp: view.timestamp,
          metadata: { referrer: view.referrer, device: view.device },
        });
      });
      
      data.interactions.forEach(interaction => {
        allActivities.push({
          projectId: data.projectId,
          type: interaction.type,
          timestamp: interaction.timestamp,
          metadata: interaction.metadata,
        });
      });
    });

    return allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [analytics]);

  const exportAnalytics = useCallback(async (projectId?: string): Promise<string> => {
    debug.analytics.export('Exporting analytics data', { projectId });
    
    try {
      const dataToExport = projectId 
        ? analytics.filter(a => a.projectId === projectId)
        : analytics;


      const csv = convertToCSV(dataToExport);
      debug.analytics.complete('Analytics exported successfully', { projectId, recordCount: dataToExport.length });
      return csv;
    } catch (err) {
      debug.analytics.error('Failed to export analytics', err as Error, { projectId });
      setError((err as Error).message);
      throw err;
    }
  }, [analytics]);

  const convertToCSV = (data: AnalyticsData[]): string => {
    const headers = ['Project ID', 'Views', 'Likes', 'Shares', 'Engagement Rate', 'Last Viewed'];
    const rows = data.map(item => [
      item.projectId,
      item.analytics.views,
      item.analytics.likes,
      item.analytics.shares,
      item.analytics.engagementRate || 0,
      item.analytics.lastViewed || '',
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const value: AnalyticsContextType = {
    analytics,
    loading,
    error,
    trackView,
    trackInteraction,
    getProjectAnalytics,
    getAnalyticsData,
    refreshAnalytics,
    getTopProjects,
    getRecentActivity,
    exportAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
