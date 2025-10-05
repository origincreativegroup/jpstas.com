import { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { PageContent, CMSSettings } from '@/types/cms';
import { useToast } from '@/context/ToastContext';
import { debug } from '@/utils/debug';

interface CMSAdminProps {
  onClose: () => void;
}

export default function CMSAdmin({ onClose }: CMSAdminProps) {
  const {
    pageContent,
    settings,
    loading,
    error,
    fetchPageContent,
    updatePageContent,
    publishPageContent,
    updateSettings,
    uploadHeroImage,
    uploadHeadshot,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'settings'>('home');
  const [editingContent, setEditingContent] = useState<Partial<PageContent>>({});
  const [editingSettings, setEditingSettings] = useState<Partial<CMSSettings>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (activeTab !== 'settings') {
      fetchPageContent(activeTab);
    }
  }, [activeTab, fetchPageContent]);

  useEffect(() => {
    if (pageContent) {
      setEditingContent(pageContent);
    }
  }, [pageContent]);

  useEffect(() => {
    if (settings) {
      setEditingSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      if (activeTab === 'settings') {
        await updateSettings(editingSettings);
        toast.success('Settings saved successfully!');
      } else {
        await updatePageContent(activeTab, editingContent);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content saved!`);
      }
    } catch (error) {
      debug.cms.error('Failed to save content', error as Error);
      toast.error('Failed to save content. Please try again.');
    }
  };

  const handlePublish = async () => {
    try {
      await publishPageContent(activeTab);
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} page published!`);
    } catch (error) {
      debug.cms.error('Failed to publish content', error as Error);
      toast.error('Failed to publish content. Please try again.');
    }
  };

  const handleImageUpload = async (file: File, type: 'hero' | 'headshot') => {
    setUploadingImage(true);
    try {
      const url = type === 'hero' ? await uploadHeroImage(file) : await uploadHeadshot(file);

      if (type === 'hero' && editingContent.hero) {
        setEditingContent(prev => ({
          ...prev,
          hero: {
            ...prev.hero!,
            backgroundImage: {
              url,
              alt: file.name,
            },
          },
        }));
      } else if (type === 'headshot' && editingContent.about) {
        setEditingContent(prev => ({
          ...prev,
          about: {
            ...prev.about!,
            headshot: {
              url,
              alt: file.name,
            },
          },
        }));
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      debug.cms.error('Failed to upload image', error as Error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const renderHeroSection = () => {
    const hero = editingContent.hero;
    if (!hero) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-neutral-800">Hero Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
            <input
              type="text"
              value={hero.title}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero!, title: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={hero.subtitle || ''}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero!, subtitle: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
          <textarea
            value={hero.description}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                hero: { ...prev.hero!, description: e.target.value },
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Primary CTA Text
            </label>
            <input
              type="text"
              value={hero.ctaPrimary.text}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero!,
                    ctaPrimary: { ...prev.hero!.ctaPrimary, text: e.target.value },
                  },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Primary CTA Link
            </label>
            <input
              type="text"
              value={hero.ctaPrimary.link}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero!,
                    ctaPrimary: { ...prev.hero!.ctaPrimary, link: e.target.value },
                  },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Hero Background Image
          </label>
          <div className="flex items-center gap-4">
            {hero.backgroundImage && (
              <img
                src={hero.backgroundImage.url}
                alt={hero.backgroundImage.alt}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'hero');
              }}
              disabled={uploadingImage}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            {uploadingImage && <span className="text-sm text-neutral-500">Uploading...</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderAboutSection = () => {
    const about = editingContent.about;
    if (!about) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-neutral-800">About Section</h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
          <input
            type="text"
            value={about.title}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                about: { ...prev.about!, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Bio</label>
          <textarea
            value={about.bio}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                about: { ...prev.about!, bio: e.target.value },
              }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Headshot</label>
          <div className="flex items-center gap-4">
            {about.headshot && (
              <img
                src={about.headshot.url}
                alt={about.headshot.alt}
                className="w-20 h-20 object-cover rounded-full"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'headshot');
              }}
              disabled={uploadingImage}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            {uploadingImage && <span className="text-sm text-neutral-500">Uploading...</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={about.skills.join(', ')}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                about: {
                  ...prev.about!,
                  skills: e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                },
              }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="UI/UX Design, Frontend Development, Product Strategy"
          />
        </div>
      </div>
    );
  };

  const renderContactSection = () => {
    const contact = editingContent.contact;
    if (!contact) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-neutral-800">Contact Section</h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
          <input
            type="text"
            value={contact.title}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                contact: { ...prev.contact!, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
          <textarea
            value={contact.description}
            onChange={e =>
              setEditingContent(prev => ({
                ...prev,
                contact: { ...prev.contact!, description: e.target.value },
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
            <input
              type="email"
              value={contact.contactInfo.email}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  contact: {
                    ...prev.contact!,
                    contactInfo: { ...prev.contact!.contactInfo, email: e.target.value },
                  },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
            <input
              type="tel"
              value={contact.contactInfo.phone}
              onChange={e =>
                setEditingContent(prev => ({
                  ...prev,
                  contact: {
                    ...prev.contact!,
                    contactInfo: { ...prev.contact!.contactInfo, phone: e.target.value },
                  },
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-neutral-800">Site Settings</h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Site Name</label>
          <input
            type="text"
            value={editingSettings.siteName || ''}
            onChange={e =>
              setEditingSettings(prev => ({
                ...prev,
                siteName: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Site Description
          </label>
          <textarea
            value={editingSettings.siteDescription || ''}
            onChange={e =>
              setEditingSettings(prev => ({
                ...prev,
                siteDescription: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Theme Colors</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Theme colors are managed through your Tailwind configuration and cannot be changed
                  here. To update colors, modify the{' '}
                  <code className="bg-blue-100 px-1 rounded">tailwind.config.ts</code> file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-800">CMS Admin</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex space-x-1">
            {(['home', 'about', 'contact', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-brand text-white'
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {activeTab === 'home' && renderHeroSection()}
          {activeTab === 'about' && renderAboutSection()}
          {activeTab === 'contact' && renderContactSection()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
          {activeTab !== 'settings' && (
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
