import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePageTracking, useEngagementTracking } from '@/hooks/useAnalytics';
import analytics from '@/services/analytics';

interface AnalyticsContextType {
  trackEvent: (event: any) => void;
  trackPageView: (event: any) => void;
  trackEngagement: (action: string, details?: Record<string, any>) => void;
  trackPortfolioInteraction: (
    projectId: string,
    action: string,
    details?: Record<string, any>
  ) => void;
  trackWorkshopInteraction: (
    section: string,
    action: string,
    details?: Record<string, any>
  ) => void;
  trackAdminAction: (action: string, details?: Record<string, any>) => void;
  trackFormSubmission: (formName: string, success: boolean, details?: Record<string, any>) => void;
  trackDownload: (fileName: string, fileType: string, fileSize?: number) => void;
  trackExternalLink: (url: string, linkText?: string) => void;
  trackSearch: (query: string, resultsCount?: number) => void;
  trackConversion: (conversionType: string, value?: number, currency?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Initialize analytics tracking
  usePageTracking();
  useEngagementTracking();

  // Initialize analytics on mount
  useEffect(() => {
    analytics.initialize();
  }, []);

  const contextValue: AnalyticsContextType = {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackPortfolioInteraction: analytics.trackPortfolioInteraction.bind(analytics),
    trackWorkshopInteraction: analytics.trackWorkshopInteraction.bind(analytics),
    trackAdminAction: analytics.trackAdminAction.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackExternalLink: analytics.trackExternalLink.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
  };

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
