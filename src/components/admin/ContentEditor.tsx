import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';
import { PageContent, HeroSection, AboutSection, ContactSection } from '@/types/cms';

interface ContentEditorProps {
  pageType: 'homepage' | 'about' | 'contact';
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ContentEditor({ pageType, onSave, onCancel }: ContentEditorProps) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    loadContent();
  }, [pageType]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map pageType to CMS page identifier
      const pageMap: Record<string, 'home' | 'about' | 'contact'> = {
        homepage: 'home',
        about: 'about',
        contact: 'contact'
      };
      
      const page = pageMap[pageType];
      
      // Try to get existing page content, or create a default one
      try {
        const pageContent = await api.getPageContent(page as string);
        setContent(pageContent);
      } catch {
        // Create default page content if it doesn't exist
        const defaultContent: PageContent = {
          id: `${page}-${Date.now()}`,
          page: page as 'home' | 'about' | 'contact' | 'portfolio' | 'resume',
          seo: {
            title: '',
            description: '',
            keywords: [],
          },
          lastUpdated: new Date().toISOString(),
          published: false,
        };
        
        // Add default section based on page type
        if (page === 'home') {
          defaultContent.hero = {
            id: 'hero-1',
            title: 'Welcome',
            description: 'Portfolio description',
            ctaPrimary: { text: 'View Portfolio', link: '/portfolio' },
          };
        } else if (page === 'about') {
          defaultContent.about = {
            id: 'about-1',
            title: 'About Me',
            bio: 'Your bio here',
            skills: [],
            experience: [],
          };
        } else if (page === 'contact') {
          defaultContent.contact = {
            id: 'contact-1',
            title: 'Get In Touch',
            description: 'Contact description',
            contactInfo: {
              email: 'hello@example.com',
              phone: '',
              website: '',
              linkedin: '',
            },
            formSettings: {
              enabled: false,
              fields: [],
            },
          };
        }
        
        setContent(defaultContent);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      setError(null);
      await api.updatePageContent(content.page, content);
      setHasChanges(false);
      onSave?.();
    } catch (err) {
      console.error('Failed to save content:', err);
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;

    try {
      setSaving(true);
      setError(null);
      const publishedContent = { ...content, published: true, lastUpdated: new Date().toISOString() };
      await api.updatePageContent(content.page, publishedContent);
      await api.publishPageContent(content.page);
      setContent(publishedContent);
      setHasChanges(false);
      onSave?.();
    } catch (err) {
      console.error('Failed to publish content:', err);
      setError('Failed to publish content');
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSection = (updates: Partial<HeroSection>) => {
    if (!content || !content.hero) return;
    setContent({
      ...content,
      hero: { ...content.hero, ...updates },
      lastUpdated: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const updateAboutSection = (updates: Partial<AboutSection>) => {
    if (!content || !content.about) return;
    setContent({
      ...content,
      about: { ...content.about, ...updates },
      lastUpdated: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const updateContactSection = (updates: Partial<ContactSection>) => {
    if (!content || !content.contact) return;
    setContent({
      ...content,
      contact: { ...content.contact, ...updates },
      lastUpdated: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const updateSEO = (field: keyof PageContent['seo'], value: any) => {
    if (!content) return;
    setContent({
      ...content,
      seo: { ...content.seo, [field]: value },
      lastUpdated: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading content...</span>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Failed to load content for {pageType}</p>
        <button
          onClick={loadContent}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const pageTitle = pageType.charAt(0).toUpperCase() + pageType.slice(1).replace('page', ' Page');

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{pageTitle} Content</h2>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {new Date(content.lastUpdated).toLocaleString()}
            {content.published && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Published
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Preview
            </button>
          </div>
          
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="space-y-6">
          {/* Page-specific content */}
          {pageType === 'homepage' && content.hero && (
            <HomepageEditor hero={content.hero} onUpdate={updateHeroSection} />
          )}
          
          {pageType === 'about' && content.about && (
            <AboutEditor about={content.about} onUpdate={updateAboutSection} />
          )}
          
          {pageType === 'contact' && content.contact && (
            <ContactEditor contact={content.contact} onUpdate={updateContactSection} />
          )}

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={content.seo.title}
                  onChange={(e) => updateSEO('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="SEO page title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={content.seo.description}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={content.seo.keywords.join(', ')}
                  onChange={(e) => updateSEO('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="prose max-w-none">
            <p className="text-gray-600">Preview mode - content display coming soon</p>
          </div>
        </div>
      )}

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
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Homepage Editor Component
function HomepageEditor({ hero, onUpdate }: { hero: HeroSection; onUpdate: (updates: Partial<HeroSection>) => void }) {
  return (
    <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Hero Section</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={hero.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={hero.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter hero subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={hero.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter hero description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary CTA Text
          </label>
          <input
            type="text"
            value={hero.ctaPrimary.text}
            onChange={(e) => onUpdate({ ctaPrimary: { ...hero.ctaPrimary, text: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Button text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary CTA Link
          </label>
          <input
            type="text"
            value={hero.ctaPrimary.link}
            onChange={(e) => onUpdate({ ctaPrimary: { ...hero.ctaPrimary, link: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="/path or URL"
          />
        </div>
      </div>
    </div>
  );
}

// About Editor Component
function AboutEditor({ about, onUpdate }: { about: AboutSection; onUpdate: (updates: Partial<AboutSection>) => void }) {
  return (
    <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">About Section</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={about.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="About section title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={about.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter your bio"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <input
          type="text"
          value={about.skills.join(', ')}
          onChange={(e) => onUpdate({ skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Skill 1, Skill 2, Skill 3"
        />
        <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
      </div>
    </div>
  );
}

// Contact Editor Component
function ContactEditor({ contact, onUpdate }: { contact: ContactSection; onUpdate: (updates: Partial<ContactSection>) => void }) {
  return (
    <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Contact Section</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={contact.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Contact section title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={contact.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Contact description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={contact.contactInfo.email}
            onChange={(e) => onUpdate({ contactInfo: { ...contact.contactInfo, email: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={contact.contactInfo.phone}
            onChange={(e) => onUpdate({ contactInfo: { ...contact.contactInfo, phone: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={contact.contactInfo.website}
            onChange={(e) => onUpdate({ contactInfo: { ...contact.contactInfo, website: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://yoursite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            value={contact.contactInfo.linkedin}
            onChange={(e) => onUpdate({ contactInfo: { ...contact.contactInfo, linkedin: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
    </div>
  );
}
