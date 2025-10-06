import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/experience.css';
import App from './App';
import { AppProviders } from './context/AppProviders';
import { initPerformanceMonitoring } from './utils/performance';
import { pushDebug } from '@/components/DebugOverlay';

// Initialize performance monitoring and global error handlers
initPerformanceMonitoring();

window.addEventListener('error', (event) => {
  pushDebug('error', 'Global error', { message: event.message, source: event.filename, line: event.lineno, col: event.colno });
});

window.addEventListener('unhandledrejection', (event) => {
  pushDebug('error', 'Unhandled promise rejection', { reason: String(event.reason) });
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
