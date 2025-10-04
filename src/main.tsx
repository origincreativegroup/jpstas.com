import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import MediaLibraryEnhanced from './pages/MediaLibraryEnhanced';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MediaProvider } from './context/MediaContext';
import { ToastProvider } from './context/ToastContext';
import { ContentProvider } from './context/ContentContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '/portfolio', element: <Portfolio /> },
      { path: '/about', element: <About /> },
      { path: '/resume', element: <Resume /> },
      { path: '/contact', element: <Contact /> },
      { path: '/admin', element: <Admin /> },
      { path: '/admin/media', element: <MediaLibraryEnhanced /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <MediaProvider>
          <ContentProvider>
            <RouterProvider router={router} />
          </ContentProvider>
        </MediaProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
