import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '@/services/analytics';

// Hook for automatic page view tracking
export const usePageTracking = () => {
  const location = useLocation();
  const previousPath = useRef<string>();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't track if it's the same path
    if (previousPath.current === currentPath) return;
    
    // Determine content groups based on path
    let contentGroup1 = 'home';
    let contentGroup2 = '';

    if (currentPath.startsWith('/workshop')) {
      contentGroup1 = 'workshop';
      if (currentPath.includes('/design')) contentGroup2 = 'design-bench';
      else if (currentPath.includes('/development')) contentGroup2 = 'development-desk';
      else if (currentPath.includes('/innovation')) contentGroup2 = 'innovation-bay';
      else if (currentPath.includes('/story')) contentGroup2 = 'story-forge';
      else if (currentPath.includes('/skills')) contentGroup2 = 'skill-console';
      else if (currentPath.includes('/contact')) contentGroup2 = 'contact';
    } else if (currentPath.startsWith('/portfolio')) {
      contentGroup1 = 'portfolio';
      contentGroup2 = 'projects';
    } else if (currentPath.startsWith('/about')) {
      contentGroup1 = 'about';
    } else if (currentPath.startsWith('/resume')) {
      contentGroup1 = 'resume';
    } else if (currentPath.startsWith('/admin')) {
      contentGroup1 = 'admin';
    }

    // Track page view
    analytics.trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: currentPath,
      content_group1: contentGroup1,
      content_group2: contentGroup2,
    });

    previousPath.current = currentPath;
  }, [location]);
};

// Hook for tracking user engagement
export const useEngagementTracking = () => {
  const startTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);

  // Track time on page
  useEffect(() => {
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      analytics.trackTimeOnPage(window.location.pathname, timeSpent);
    };

    // Track time when user leaves page
    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    // Track time every 30 seconds
    const interval = setInterval(trackTimeOnPage, 30000);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackTimeOnPage(); // Final time tracking
    };
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // Track at 25%, 50%, 75%, and 100%
      if (scrollPercent >= 25 && maxScrollDepth.current < 25) {
        analytics.trackScrollDepth(window.location.pathname, 25);
        maxScrollDepth.current = 25;
      } else if (scrollPercent >= 50 && maxScrollDepth.current < 50) {
        analytics.trackScrollDepth(window.location.pathname, 50);
        maxScrollDepth.current = 50;
      } else if (scrollPercent >= 75 && maxScrollDepth.current < 75) {
        analytics.trackScrollDepth(window.location.pathname, 75);
        maxScrollDepth.current = 75;
      } else if (scrollPercent >= 100 && maxScrollDepth.current < 100) {
        analytics.trackScrollDepth(window.location.pathname, 100);
        maxScrollDepth.current = 100;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// Hook for tracking clicks and interactions
export const useClickTracking = () => {
  const trackClick = useCallback((element: string, details?: Record<string, any>) => {
    analytics.trackEngagement('click', {
      element,
      ...details,
    });
  }, []);

  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    analytics.trackEngagement('button_click', {
      button_name: buttonName,
      location: location || window.location.pathname,
    });
  }, []);

  const trackLinkClick = useCallback((linkText: string, linkUrl: string, isExternal: boolean = false) => {
    if (isExternal) {
      analytics.trackExternalLink(linkUrl, linkText);
    } else {
      analytics.trackEngagement('internal_link_click', {
        link_text: linkText,
        link_url: linkUrl,
      });
    }
  }, []);

  return {
    trackClick,
    trackButtonClick,
    trackLinkClick,
  };
};

// Hook for tracking form interactions
export const useFormTracking = () => {
  const trackFormStart = useCallback((formName: string) => {
    analytics.trackEngagement('form_start', {
      form_name: formName,
    });
  }, []);

  const trackFormSubmit = useCallback((formName: string, success: boolean, details?: Record<string, any>) => {
    analytics.trackFormSubmission(formName, success, details);
  }, []);

  const trackFormFieldFocus = useCallback((formName: string, fieldName: string) => {
    analytics.trackEngagement('form_field_focus', {
      form_name: formName,
      field_name: fieldName,
    });
  }, []);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormFieldFocus,
  };
};

// Hook for tracking portfolio interactions
export const usePortfolioTracking = () => {
  const trackProjectView = useCallback((projectId: string, projectTitle: string) => {
    analytics.trackPortfolioInteraction(projectId, 'project_view', {
      project_title: projectTitle,
    });
  }, []);

  const trackProjectInteraction = useCallback((projectId: string, action: string, details?: Record<string, any>) => {
    analytics.trackPortfolioInteraction(projectId, action, details);
  }, []);

  const trackProjectFilter = useCallback((filterType: string, filterValue: string) => {
    analytics.trackEngagement('portfolio_filter', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }, []);

  return {
    trackProjectView,
    trackProjectInteraction,
    trackProjectFilter,
  };
};

// Hook for tracking workshop interactions
export const useWorkshopTracking = () => {
  const trackSectionView = useCallback((section: string) => {
    analytics.trackWorkshopInteraction(section, 'section_view');
  }, []);

  const trackToolUse = useCallback((toolName: string, section: string) => {
    analytics.trackWorkshopInteraction(section, 'tool_use', {
      tool_name: toolName,
    });
  }, []);

  const trackProcessStep = useCallback((stepName: string, section: string) => {
    analytics.trackWorkshopInteraction(section, 'process_step', {
      step_name: stepName,
    });
  }, []);

  return {
    trackSectionView,
    trackToolUse,
    trackProcessStep,
  };
};

// Hook for tracking admin actions
export const useAdminTracking = () => {
  const trackAdminAction = useCallback((action: string, details?: Record<string, any>) => {
    analytics.trackAdminAction(action, details);
  }, []);

  const trackContentUpdate = useCallback((contentType: string, contentId: string) => {
    analytics.trackAdminAction('content_update', {
      content_type: contentType,
      content_id: contentId,
    });
  }, []);

  const trackMediaUpload = useCallback((fileType: string, fileSize: number) => {
    analytics.trackAdminAction('media_upload', {
      file_type: fileType,
      file_size: fileSize,
    });
  }, []);

  return {
    trackAdminAction,
    trackContentUpdate,
    trackMediaUpload,
  };
};

// Hook for tracking search
export const useSearchTracking = () => {
  const trackSearch = useCallback((query: string, resultsCount?: number) => {
    analytics.trackSearch(query, resultsCount);
  }, []);

  return { trackSearch };
};
