import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SimpleAuthProvider } from './SimpleAuthContext';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import { CMSProvider } from './CMSContext';
import { ProjectsProvider } from './ProjectsContext';
import { ContentProvider } from './ContentContext';
import { MediaProvider } from './MediaContext';
import { ToastProvider } from './ToastContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Consolidated app providers for better performance and reduced nesting
 * Wraps all context providers in optimal order
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SimpleAuthProvider>
          <ToastProvider>
            <MediaProvider>
              <ContentProvider>
                <CMSProvider>
                  <ProjectsProvider>
                    <AnalyticsProvider>
                      {children}
                    </AnalyticsProvider>
                  </ProjectsProvider>
                </CMSProvider>
              </ContentProvider>
            </MediaProvider>
          </ToastProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
