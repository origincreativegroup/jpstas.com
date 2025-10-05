// Google Analytics 4 Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
  content_group1?: string; // Section (e.g., 'workshop', 'portfolio')
  content_group2?: string; // Subsection (e.g., 'design-bench', 'projects')
}

class GoogleAnalytics {
  private measurementId: string;
  private isInitialized: boolean = false;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
  }

  // Initialize Google Analytics
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure Google Analytics
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false, // We'll send page views manually
      });

      this.isInitialized = true;
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  public trackPageView(event: PageViewEvent): void {
    if (!this.isInitialized) {
      console.warn('Google Analytics not initialized');
      return;
    }

    try {
      window.gtag('event', 'page_view', {
        page_title: event.page_title,
        page_location: event.page_location,
        page_path: event.page_path,
        content_group1: event.content_group1,
        content_group2: event.content_group2,
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  // Track custom events
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Google Analytics not initialized');
      return;
    }

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Track user engagement
  public trackEngagement(action: string, details?: Record<string, any>): void {
    this.trackEvent({
      action,
      category: 'engagement',
      custom_parameters: details,
    });
  }

  // Track portfolio interactions
  public trackPortfolioInteraction(
    projectId: string,
    action: string,
    details?: Record<string, any>
  ): void {
    this.trackEvent({
      action,
      category: 'portfolio',
      label: projectId,
      custom_parameters: {
        project_id: projectId,
        ...details,
      },
    });
  }

  // Track workshop interactions
  public trackWorkshopInteraction(
    section: string,
    action: string,
    details?: Record<string, any>
  ): void {
    this.trackEvent({
      action,
      category: 'workshop',
      label: section,
      custom_parameters: {
        workshop_section: section,
        ...details,
      },
    });
  }

  // Track admin actions
  public trackAdminAction(action: string, details?: Record<string, any>): void {
    this.trackEvent({
      action,
      category: 'admin',
      custom_parameters: details,
    });
  }

  // Track form submissions
  public trackFormSubmission(
    formName: string,
    success: boolean,
    details?: Record<string, any>
  ): void {
    this.trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'form',
      label: formName,
      custom_parameters: {
        form_name: formName,
        success,
        ...details,
      },
    });
  }

  // Track file downloads
  public trackDownload(fileName: string, fileType: string, fileSize?: number): void {
    this.trackEvent({
      action: 'file_download',
      category: 'download',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
      },
    });
  }

  // Track external link clicks
  public trackExternalLink(url: string, linkText?: string): void {
    this.trackEvent({
      action: 'external_link_click',
      category: 'outbound',
      label: url,
      custom_parameters: {
        link_url: url,
        link_text: linkText,
      },
    });
  }

  // Track search queries
  public trackSearch(query: string, resultsCount?: number): void {
    this.trackEvent({
      action: 'search',
      category: 'search',
      label: query,
      custom_parameters: {
        search_term: query,
        results_count: resultsCount,
      },
    });
  }

  // Track time on page
  public trackTimeOnPage(page: string, timeInSeconds: number): void {
    this.trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      label: page,
      value: timeInSeconds,
      custom_parameters: {
        page,
        time_seconds: timeInSeconds,
      },
    });
  }

  // Track scroll depth
  public trackScrollDepth(page: string, depth: number): void {
    this.trackEvent({
      action: 'scroll_depth',
      category: 'engagement',
      label: page,
      value: depth,
      custom_parameters: {
        page,
        scroll_depth: depth,
      },
    });
  }

  // Track conversion events
  public trackConversion(conversionType: string, value?: number, currency?: string): void {
    this.trackEvent({
      action: 'conversion',
      category: 'conversion',
      label: conversionType,
      value,
      custom_parameters: {
        conversion_type: conversionType,
        currency: currency || 'USD',
      },
    });
  }
}

// Create singleton instance
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const analytics = new GoogleAnalytics(measurementId);

// Auto-initialize in production
if (import.meta.env.PROD && measurementId !== 'G-XXXXXXXXXX') {
  analytics.initialize();
}

export default analytics;
