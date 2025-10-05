import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { checkAuthStatus, setAuthenticated } from '@/config/auth';
import CMSAdmin from './CMSAdmin';
import AnalyticsDashboard from './AnalyticsDashboard';
import ImportExportManager from './ImportExportManager';
import ProjectManagement from './ProjectManagement';
import MediaManagement from './MediaManagement';
import WorkshopManagement from './WorkshopManagement';
import SaaSProjectEditor from './SaaSProjectEditor';
import { useToast } from '@/context/ToastContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';

const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    showToast('Login successful', 'success');
  };

  const handleLogout = async () => {
    try {
      await setAuthenticated(false);
      setIsAuthenticated(false);
      showToast('Logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>
          <p className="text-white font-medium">Loading Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-brand font-bold text-2xl">JP</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-brand-light">Sign in to manage your portfolio</p>
          </div>
          <LoginForm onSuccess={handleLogin} />
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      description: 'Overview and analytics',
    },
    {
      id: 'projects',
      title: 'Portfolio Projects',
      icon: '💼',
      description: 'Manage portfolio projects',
    },
    {
      id: 'saas-editor',
      title: 'SaaS Project Editor',
      icon: '🚀',
      description: 'Advanced project editor with templates',
    },
    {
      id: 'media',
      title: 'Media Library',
      icon: '🖼️',
      description: 'Upload and manage media',
    },
    {
      id: 'content',
      title: 'Page Content',
      icon: '📝',
      description: 'Edit page content and CMS',
    },
    {
      id: 'workshop',
      title: 'Workshop Sections',
      icon: '🔧',
      description: 'Manage workshop tools and processes',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: '📈',
      description: 'View detailed analytics',
    },
    {
      id: 'import-export',
      title: 'Import/Export',
      icon: '📤',
      description: 'Backup and restore data',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'projects':
        return <ProjectManagement />;
      case 'saas-editor':
        return <SaaSProjectEditor />;
      case 'media':
        return <MediaManagement />;
      case 'content':
        return <CMSAdmin onClose={() => {}} />;
      case 'workshop':
        return <WorkshopManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'import-export':
        return <ImportExportManager projects={[]} drafts={[]} media={[]} />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">JP</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-brand">Admin Portal</h1>
                  <p className="text-sm text-neutral-600">Portfolio Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-r border-neutral-200 overflow-hidden"
              >
                <nav className="p-6 space-y-2">
                  {adminSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === section.id
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-xl">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-neutral-500">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </AnalyticsProvider>
  );
};

export default AdminLayout;
