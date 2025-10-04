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
import MediaLibrary from './pages/MediaLibrary';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MediaProvider } from './context/MediaContext';

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
      { path: '/admin/media', element: <MediaLibrary /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MediaProvider>
        <RouterProvider router={router} />
      </MediaProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
