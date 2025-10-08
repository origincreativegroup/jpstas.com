import { useState, useEffect } from 'react';

interface SettingsData {
  site: {
    title: string;
    tagline: string;
    description: string;
    url: string;
    author: string;
    email: string;
  };
  seo: {
    keywords: string[];
    googleAnalyticsId: string;
    googleSiteVerification: string;
  };
  media: {
    maxFileSize: number;
    allowedImageTypes: string[];
    allowedVideoTypes: string[];
    imageQuality: number;
  };
  admin: {
    username: string;
    email: string;
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
  integrations: {
    cloudflareAccountId: string;
    cloudflareApiToken: string;
    githubRepo: string;
    deployBranch: string;
  };
  build: {
    autoDeploy: boolean;
    buildCommand: string;
    outputDirectory: string;
  };
}

interface SettingsPanelProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export default function SettingsPanel({ onSave, onCancel }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsData>({
    site: {
      title: 'JP Stas Portfolio',
      tagline: 'Designer & Developer',
      description: 'Personal portfolio showcasing design and development work',
      url: 'https://jpstas.com',
      author: 'JP Stas',
      email: 'hello@jpstas.com'
    },
    seo: {
      keywords: ['portfolio', 'design', 'development', 'web'],
      googleAnalyticsId: '',
      googleSiteVerification: ''
    },
    media: {
      maxFileSize: 104857600, // 100MB
      allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      allowedVideoTypes: ['mp4', 'webm', 'mov'],
      imageQuality: 85
    },
    admin: {
      username: 'admin',
      email: 'admin@jpstas.com',
      notifications: true,
      twoFactorEnabled: false
    },
    integrations: {
      cloudflareAccountId: '',
      cloudflareApiToken: '',
      githubRepo: '',
      deployBranch: 'main'
    },
    build: {
      autoDeploy: true,
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('site');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load from localStorage for now
      const stored = localStorage.getItem('site_settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Save to localStorage for now
      localStorage.setItem('site_settings', JSON.stringify(settings));
      
      // TODO: Save to API when settings endpoint is available
      // await api.updateSettings(settings);
      
      setHasChanges(false);
      onSave?.();
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (section: keyof SettingsData, field: string, value: string[]) => {
    handleSettingChange(section, field, value);
  };

  const sections = [
    { id: 'site', label: 'Site Settings', icon: '🌐' },
    { id: 'seo', label: 'SEO & Analytics', icon: '📈' },
    { id: 'media', label: 'Media Settings', icon: '🖼️' },
    { id: 'admin', label: 'Admin Account', icon: '👤' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'build', label: 'Build & Deploy', icon: '🚀' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure your site settings and preferences
          </p>
        </div>
        
        {hasChanges && (
          <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">Settings Categories</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeSection === section.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
            </div>

            <div className="p-6">
              {activeSection === 'site' && (
                <SiteSettings
                  settings={settings.site}
                  onChange={(field, value) => handleSettingChange('site', field, value)}
                />
              )}

              {activeSection === 'seo' && (
                <SEOSettings
                  settings={settings.seo}
                  onChange={(field, value) => handleSettingChange('seo', field, value)}
                  onArrayChange={(field, value) => handleArrayChange('seo', field, value)}
                />
              )}

              {activeSection === 'media' && (
                <MediaSettings
                  settings={settings.media}
                  onChange={(field, value) => handleSettingChange('media', field, value)}
                  onArrayChange={(field, value) => handleArrayChange('media', field, value)}
                />
              )}

              {activeSection === 'admin' && (
                <AdminSettings
                  settings={settings.admin}
                  onChange={(field, value) => handleSettingChange('admin', field, value)}
                />
              )}

              {activeSection === 'integrations' && (
                <IntegrationsSettings
                  settings={settings.integrations}
                  onChange={(field, value) => handleSettingChange('integrations', field, value)}
                />
              )}

              {activeSection === 'build' && (
                <BuildSettings
                  settings={settings.build}
                  onChange={(field, value) => handleSettingChange('build', field, value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Site Settings Component
function SiteSettings({ settings, onChange }: { settings: SettingsData['site']; onChange: (field: string, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Title
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your Site Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your Tagline"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Brief description of your site"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.url}
            onChange={(e) => onChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://yoursite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Name
          </label>
          <input
            type="text"
            value={settings.author}
            onChange={(e) => onChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="hello@yoursite.com"
        />
      </div>
    </div>
  );
}

// SEO Settings Component
function SEOSettings({ 
  settings, 
  onChange, 
  onArrayChange 
}: { 
  settings: SettingsData['seo']; 
  onChange: (field: string, value: string) => void;
  onArrayChange: (field: string, value: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords
        </label>
        <textarea
          value={settings.keywords.join(', ')}
          onChange={(e) => onArrayChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Analytics ID
        </label>
        <input
          type="text"
          value={settings.googleAnalyticsId}
          onChange={(e) => onChange('googleAnalyticsId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="G-XXXXXXXXXX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Site Verification
        </label>
        <input
          type="text"
          value={settings.googleSiteVerification}
          onChange={(e) => onChange('googleSiteVerification', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="verification-code"
        />
      </div>
    </div>
  );
}

// Media Settings Component
function MediaSettings({ 
  settings, 
  onChange, 
  onArrayChange 
}: { 
  settings: SettingsData['media']; 
  onChange: (field: string, value: any) => void;
  onArrayChange: (field: string, value: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum File Size (MB)
        </label>
        <input
          type="number"
          value={Math.round(settings.maxFileSize / (1024 * 1024))}
          onChange={(e) => onChange('maxFileSize', parseInt(e.target.value) * 1024 * 1024)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          min="1"
          max="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allowed Image Types
        </label>
        <textarea
          value={settings.allowedImageTypes.join(', ')}
          onChange={(e) => onArrayChange('allowedImageTypes', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="jpg, jpeg, png, webp, svg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allowed Video Types
        </label>
        <textarea
          value={settings.allowedVideoTypes.join(', ')}
          onChange={(e) => onArrayChange('allowedVideoTypes', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="mp4, webm, mov"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Quality ({settings.imageQuality}%)
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.imageQuality}
          onChange={(e) => onChange('imageQuality', parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Admin Settings Component
function AdminSettings({ settings, onChange }: { settings: SettingsData['admin']; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={settings.username}
            onChange={(e) => onChange('username', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="admin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="admin@yoursite.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive email notifications for admin activities</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => onChange('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={(e) => onChange('twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Integrations Settings Component
function IntegrationsSettings({ settings, onChange }: { settings: SettingsData['integrations']; onChange: (field: string, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cloudflare Account ID
          </label>
          <input
            type="text"
            value={settings.cloudflareAccountId}
            onChange={(e) => onChange('cloudflareAccountId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your Cloudflare Account ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository
          </label>
          <input
            type="text"
            value={settings.githubRepo}
            onChange={(e) => onChange('githubRepo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="username/repository"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cloudflare API Token
        </label>
        <input
          type="password"
          value={settings.cloudflareApiToken}
          onChange={(e) => onChange('cloudflareApiToken', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Your Cloudflare API Token"
        />
        <p className="text-sm text-gray-500 mt-1">Used for media uploads and CDN management</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deploy Branch
        </label>
        <input
          type="text"
          value={settings.deployBranch}
          onChange={(e) => onChange('deployBranch', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="main"
        />
        <p className="text-sm text-gray-500 mt-1">Git branch to deploy from</p>
      </div>
    </div>
  );
}

// Build Settings Component
function BuildSettings({ settings, onChange }: { settings: SettingsData['build']; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Auto Deploy</h4>
          <p className="text-sm text-gray-500">Automatically deploy when changes are pushed</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoDeploy}
            onChange={(e) => onChange('autoDeploy', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Build Command
        </label>
        <input
          type="text"
          value={settings.buildCommand}
          onChange={(e) => onChange('buildCommand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="npm run build"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Directory
        </label>
        <input
          type="text"
          value={settings.outputDirectory}
          onChange={(e) => onChange('outputDirectory', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="dist"
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Build Actions</h4>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Clear Cache
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
            Trigger Build
          </button>
        </div>
      </div>
    </div>
  );
}
