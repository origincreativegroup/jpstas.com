import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { ContentProvider } from './context/ContentContext';
import { CMSProvider } from './context/CMSContext';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import BootSequence from './components/experience/BootSequence';
import WorkshopHub from './pages/WorkshopHub';
import DesignBench from './sections/DesignBench';
import DevelopmentDesk from './sections/DevelopmentDesk';
import InnovationBay from './sections/InnovationBay';
import StoryForge from './sections/StoryForge';
import SkillConsole from './sections/SkillConsole';
import PortalContact from './sections/PortalContact';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';
import Admin from './pages/Admin';
import SaaSDemo from './pages/SaaSDemo';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AnalyticsProvider>
          <CMSProvider>
            <ProjectsProvider>
              <ContentProvider>
                <div className="min-h-screen">
                  <Routes>
                    {/* Boot Sequence - Default Entry Point */}
                    <Route path="/" element={<BootSequence />} />

                    {/* Workshop Hub */}
                    <Route path="/workshop" element={<WorkshopHub />} />

                    {/* Workshop Sections */}
                    <Route path="/workshop/design" element={<DesignBench />} />
                    <Route path="/workshop/development" element={<DevelopmentDesk />} />
                    <Route path="/workshop/innovation" element={<InnovationBay />} />
                    <Route path="/workshop/story" element={<StoryForge />} />
                    <Route path="/workshop/skills" element={<SkillConsole />} />
                    <Route path="/workshop/contact" element={<PortalContact />} />

                    {/* Admin Panel */}
                    <Route path="/admin" element={<Admin />} />

                    {/* SaaS Demo */}
                    <Route path="/saas-demo" element={<SaaSDemo />} />

                    {/* Legacy Routes (for backward compatibility) */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/resume" element={<Resume />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </ContentProvider>
            </ProjectsProvider>
          </CMSProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
