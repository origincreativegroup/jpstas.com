import { useState } from 'react';
import { useSimpleAuth } from '../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import ProjectManagement from '../components/ProjectManagement';
import MediaManagement from '../components/MediaManagement';
import WorkshopManagement from '../components/WorkshopManagement';

export default function Admin() {
  const { isAuthenticated, user, signOut, isLoading } = useSimpleAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'media' | 'workshop'>('projects');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'projects', name: 'Projects', component: ProjectManagement },
                { id: 'media', name: 'Media', component: MediaManagement },
                { id: 'workshop', name: 'Workshop', component: WorkshopManagement },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && <ProjectManagement />}
        {activeTab === 'media' && <MediaManagement />}
        {activeTab === 'workshop' && <WorkshopManagement />}
      </div>
    </div>
  );
}
