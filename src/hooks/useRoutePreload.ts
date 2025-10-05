import { useCallback } from 'react';

/**
 * Preloads route chunks on hover for instant navigation
 * Uses dynamic import to trigger chunk loading
 */
export function useRoutePreload() {
  const preloadRoute = useCallback((routePath: string) => {
    // Map route paths to their lazy-loaded components
    const routeMap: Record<string, () => Promise<any>> = {
      '/': () => import('../pages/Home'),
      '/portfolio': () => import('../pages/Portfolio'),
      '/about': () => import('../pages/About'),
      '/contact': () => import('../pages/Contact'),
      '/resume': () => import('../pages/Resume'),
      '/admin': () => import('../pages/Admin'),
      '/auth/signin': () => import('../pages/SignIn'),
      '/auth/signup': () => import('../pages/SignUp'),
    };

    const loader = routeMap[routePath];
    if (loader) {
      // Trigger chunk loading but don't wait for it
      loader().catch(() => {
        // Silently fail - will load on actual navigation
      });
    }
  }, []);

  return { preloadRoute };
}
