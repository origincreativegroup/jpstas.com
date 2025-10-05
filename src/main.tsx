import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/experience.css';
import App from './App';
import { AppProviders } from './context/AppProviders';
import { initPerformanceMonitoring } from './utils/performance';

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
