import { lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavigationTransitionProvider } from './components/NavigationTransition';
import { SuspenseErrorBoundary } from './components/SuspenseErrorBoundary';
import { PageTransition } from './components/PageTransition';

// Lazy load core portfolio pages
const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Resume = lazy(() => import('./pages/Resume'));
// Media & Admin pages (hidden from public navigation)
const MediaLibrary = lazy(() => import('./pages/MediaLibrary'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Enhanced loading fallback component with skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <div className="text-white text-lg font-medium">Loading...</div>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();

  return (
    <NavigationTransitionProvider>
      <div className="min-h-screen">
        <SuspenseErrorBoundary fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Core Portfolio Pages */}
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <PageTransition>
                    <Portfolio />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageTransition>
                    <Contact />
                  </PageTransition>
                }
              />
              <Route
                path="/resume"
                element={
                  <PageTransition>
                    <Resume />
                  </PageTransition>
                }
              />

              {/* Admin & Media Routes (Hidden from public) */}
              <Route
                path="/media"
                element={
                  <PageTransition>
                    <MediaLibrary />
                  </PageTransition>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageTransition>
                    <Admin />
                  </PageTransition>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                }
              />
              <Route
                path="/auth/signin"
                element={
                  <PageTransition>
                    <SignIn />
                  </PageTransition>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <PageTransition>
                    <SignUp />
                  </PageTransition>
                }
              />

              {/* 404 Not Found */}
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </SuspenseErrorBoundary>
      </div>
    </NavigationTransitionProvider>
  );
}
