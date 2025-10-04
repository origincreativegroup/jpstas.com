import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles/experience.css';
import App from './App';
import { MediaProvider } from './context/MediaContext';
import { ToastProvider } from './context/ToastContext';
import { ContentProvider } from './context/ContentContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <MediaProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </MediaProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
