import React, { useState, useEffect } from 'react';
import { ProjectSection } from '@/types/saas';

interface SectionEditorProps {
  section: ProjectSection;
  onUpdate: (updates: Partial<ProjectSection>) => void;
  onClose: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'responsive' | 'animations'>('content');
  const [content, setContent] = useState(section.content || {});

  useEffect(() => {
    setContent(section.content || {});
  }, [section]);

  const handleContentUpdate = (updates: any) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Headline</label>
              <input
                type="text"
                value={content.headline || ''}
                onChange={(e) => handleContentUpdate({ headline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subheadline</label>
              <textarea
                value={content.subheadline || ''}
                onChange={(e) => handleContentUpdate({ subheadline: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your subheadline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Call to Action Text</label>
              <input
                type="text"
                value={content.ctaText || ''}
                onChange={(e) => handleContentUpdate({ ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., View Portfolio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Call to Action URL</label>
              <input
                type="url"
                value={content.ctaUrl || ''}
                onChange={(e) => handleContentUpdate({ ctaUrl: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter gallery title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Description</label>
              <textarea
                value={content.description || ''}
                onChange={(e) => handleContentUpdate({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter gallery description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Layout Type</label>
              <select
                value={content.layout || 'grid'}
                onChange={(e) => handleContentUpdate({ layout: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="grid">Grid</option>
                <option value="masonry">Masonry</option>
                <option value="carousel">Carousel</option>
                <option value="slider">Slider</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Columns</label>
              <input
                type="number"
                min="1"
                max="6"
                value={content.columns || 3}
                onChange={(e) => handleContentUpdate({ columns: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Content</label>
              <textarea
                value={content.text || ''}
                onChange={(e) => handleContentUpdate({ text: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your text content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Alignment</label>
              <select
                value={content.alignment || 'left'}
                onChange={(e) => handleContentUpdate({ alignment: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={content.videoUrl || ''}
                onChange={(e) => handleContentUpdate({ videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Autoplay</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={content.autoplay || false}
                  onChange={(e) => handleContentUpdate({ autoplay: e.target.checked })}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">Enable autoplay</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Show Controls</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={content.showControls !== false}
                  onChange={(e) => handleContentUpdate({ showControls: e.target.checked })}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">Show video controls</span>
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quote</label>
              <textarea
                value={content.quote || ''}
                onChange={(e) => handleContentUpdate({ quote: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter testimonial quote"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Author Name</label>
              <input
                type="text"
                value={content.author || ''}
                onChange={(e) => handleContentUpdate({ author: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Author Title</label>
              <input
                type="text"
                value={content.authorTitle || ''}
                onChange={(e) => handleContentUpdate({ authorTitle: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter author title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={content.company || ''}
                onChange={(e) => handleContentUpdate({ company: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter company name"
              />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stats Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter stats title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statistics</label>
              <div className="space-y-2">
                {(content.stats || []).map((stat: any, index: number) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...(content.stats || [])];
                        newStats[index] = { ...newStats[index], label: e.target.value };
                        handleContentUpdate({ stats: newStats });
                      }}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => {
                        const newStats = [...(content.stats || [])];
                        newStats[index] = { ...newStats[index], value: e.target.value };
                        handleContentUpdate({ stats: newStats });
                      }}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Value"
                    />
                    <button
                      onClick={() => {
                        const newStats = (content.stats || []).filter((_: any, i: number) => i !== index);
                        handleContentUpdate({ stats: newStats });
                      }}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newStats = [...(content.stats || []), { label: '', value: '' }];
                    handleContentUpdate({ stats: newStats });
                  }}
                  className="w-full px-3 py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-accent hover:text-accent transition-colors"
                >
                  + Add Statistic
                </button>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timeline Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter timeline title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timeline Items</label>
              <div className="space-y-2">
                {(content.items || []).map((item: any, index: number) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          newItems[index] = { ...newItems[index], date: e.target.value };
                          handleContentUpdate({ items: newItems });
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Date"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          handleContentUpdate({ items: newItems });
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Title"
                      />
                    </div>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        handleContentUpdate({ items: newItems });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Description"
                    />
                    <button
                      onClick={() => {
                        const newItems = (content.items || []).filter((_: any, i: number) => i !== index);
                        handleContentUpdate({ items: newItems });
                      }}
                      className="mt-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(content.items || []), { date: '', title: '', description: '' }];
                    handleContentUpdate({ items: newItems });
                  }}
                  className="w-full px-3 py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-accent hover:text-accent transition-colors"
                >
                  + Add Timeline Item
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-neutral-600">No specific editor available for this section type.</p>
          </div>
        );
    }
  };

  const renderStyleEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          type="color"
          value={content.backgroundColor || '#ffffff'}
          onChange={(e) => handleContentUpdate({ backgroundColor: e.target.value })}
          className="w-full h-10 border border-neutral-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <input
          type="color"
          value={content.textColor || '#000000'}
          onChange={(e) => handleContentUpdate({ textColor: e.target.value })}
          className="w-full h-10 border border-neutral-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Padding</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={content.padding?.top || 0}
            onChange={(e) => handleContentUpdate({ 
              padding: { ...content.padding, top: parseInt(e.target.value) || 0 }
            })}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Top"
          />
          <input
            type="number"
            value={content.padding?.bottom || 0}
            onChange={(e) => handleContentUpdate({ 
              padding: { ...content.padding, bottom: parseInt(e.target.value) || 0 }
            })}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Bottom"
          />
          <input
            type="number"
            value={content.padding?.left || 0}
            onChange={(e) => handleContentUpdate({ 
              padding: { ...content.padding, left: parseInt(e.target.value) || 0 }
            })}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Left"
          />
          <input
            type="number"
            value={content.padding?.right || 0}
            onChange={(e) => handleContentUpdate({ 
              padding: { ...content.padding, right: parseInt(e.target.value) || 0 }
            })}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Right"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Border Radius</label>
        <input
          type="range"
          min="0"
          max="20"
          value={content.borderRadius || 0}
          onChange={(e) => handleContentUpdate({ borderRadius: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-neutral-600 text-center">{content.borderRadius || 0}px</div>
      </div>
    </div>
  );

  const renderResponsiveEditor = () => (
    <div className="space-y-4">
      {['mobile', 'tablet', 'desktop'].map(device => (
        <div key={device} className="border border-neutral-200 rounded-lg p-4">
          <h4 className="font-medium capitalize mb-3">{device} Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={section.responsive[device as keyof typeof section.responsive].visible}
                onChange={(e) => onUpdate({
                  responsive: {
                    ...section.responsive,
                    [device]: {
                      ...section.responsive[device as keyof typeof section.responsive],
                      visible: e.target.checked
                    }
                  }
                })}
                className="h-4 w-4 text-accent focus:ring-accent border-neutral-300 rounded"
              />
              <span className="text-sm text-neutral-700">Visible on {device}</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="6"
                value={section.responsive[device as keyof typeof section.responsive].columns}
                onChange={(e) => onUpdate({
                  responsive: {
                    ...section.responsive,
                    [device]: {
                      ...section.responsive[device as keyof typeof section.responsive],
                      columns: parseInt(e.target.value) || 1
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Spacing</label>
              <input
                type="number"
                min="0"
                max="100"
                value={section.responsive[device as keyof typeof section.responsive].spacing}
                onChange={(e) => onUpdate({
                  responsive: {
                    ...section.responsive,
                    [device]: {
                      ...section.responsive[device as keyof typeof section.responsive],
                      spacing: parseInt(e.target.value) || 0
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnimationsEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Animation Type</label>
        <select
          value={content.animation?.type || 'none'}
          onChange={(e) => handleContentUpdate({ 
            animation: { ...content.animation, type: e.target.value }
          })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="slide-left">Slide Left</option>
          <option value="slide-right">Slide Right</option>
          <option value="scale">Scale</option>
        </select>
      </div>
      {content.animation?.type && content.animation.type !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Duration (ms)</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={content.animation?.duration || 500}
              onChange={(e) => handleContentUpdate({ 
                animation: { ...content.animation, duration: parseInt(e.target.value) || 500 }
              })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Delay (ms)</label>
            <input
              type="number"
              min="0"
              max="1000"
              value={content.animation?.delay || 0}
              onChange={(e) => handleContentUpdate({ 
                animation: { ...content.animation, delay: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <p className="text-sm text-neutral-600 capitalize">{section.type} Section</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="p-4 border-b border-neutral-200">
        <nav className="flex space-x-1">
          {[
            { id: 'content', label: 'Content', icon: '📝' },
            { id: 'style', label: 'Style', icon: '🎨' },
            { id: 'responsive', label: 'Responsive', icon: '📱' },
            { id: 'animations', label: 'Animations', icon: '✨' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-brand'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && renderContentEditor()}
        {activeTab === 'style' && renderStyleEditor()}
        {activeTab === 'responsive' && renderResponsiveEditor()}
        {activeTab === 'animations' && renderAnimationsEditor()}
      </div>
    </div>
  );
};

export default SectionEditor;
