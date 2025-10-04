import React, { useState } from 'react';
import { ProjectDraft, ProjectSection } from '@/types/saas';

interface ProjectPreviewProps {
  project: ProjectDraft;
  device?: 'mobile' | 'tablet' | 'desktop';
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  device = 'desktop'
}) => {
  const [selectedDevice, setSelectedDevice] = useState(device);
  const [zoom, setZoom] = useState(100);

  const getDeviceDimensions = () => {
    switch (selectedDevice) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
        return { width: 1200, height: 800 };
      default:
        return { width: 1200, height: 800 };
    }
  };

  const renderSection = (section: ProjectSection) => {
    if (!section.visible) return null;

    const sectionStyle = {
      backgroundColor: section.content?.backgroundColor || 'transparent',
      color: section.content?.textColor || 'inherit',
      padding: section.content?.padding ? 
        `${section.content.padding.top}px ${section.content.padding.right}px ${section.content.padding.bottom}px ${section.content.padding.left}px` : 
        '20px',
      borderRadius: section.content?.borderRadius ? `${section.content.borderRadius}px` : '0px',
    };

    switch (section.type) {
      case 'hero':
        return (
          <div key={section.id} style={sectionStyle} className="hero-section">
            <div className="text-center py-20">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {section.content?.headline || 'Your Headline Here'}
              </h1>
              <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                {section.content?.subheadline || 'Your subheadline goes here'}
              </p>
              {section.content?.ctaText && (
                <button className="bg-accent text-brand px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
                  {section.content.ctaText}
                </button>
              )}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div key={section.id} style={sectionStyle} className="gallery-section">
            <div className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                {section.content?.title || 'Gallery'}
              </h2>
              {section.content?.description && (
                <p className="text-center text-neutral-600 mb-8 max-w-2xl mx-auto">
                  {section.content.description}
                </p>
              )}
              <div className={`grid gap-4 ${
                section.content?.columns === 1 ? 'grid-cols-1' :
                section.content?.columns === 2 ? 'grid-cols-2' :
                section.content?.columns === 3 ? 'grid-cols-3' :
                section.content?.columns === 4 ? 'grid-cols-4' :
                'grid-cols-3'
              }`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-500">Image {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={section.id} style={sectionStyle} className="text-section">
            <div className="py-12">
              <div 
                className="prose max-w-none"
                style={{ textAlign: section.content?.alignment || 'left' }}
              >
                <div dangerouslySetInnerHTML={{ 
                  __html: (section.content?.text || 'Your text content goes here').replace(/\n/g, '<br>')
                }} />
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div key={section.id} style={sectionStyle} className="video-section">
            <div className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                {section.content?.title || 'Video'}
              </h2>
              <div className="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
                {section.content?.videoUrl ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-neutral-600">Video Player</p>
                  </div>
                ) : (
                  <span className="text-neutral-500">Add video URL to preview</span>
                )}
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div key={section.id} style={sectionStyle} className="testimonial-section">
            <div className="py-12">
              <div className="max-w-4xl mx-auto text-center">
                <blockquote className="text-2xl font-medium mb-6">
                  "{section.content?.quote || 'This is a sample testimonial quote that demonstrates how testimonials will look in your project.'}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold">{section.content?.author || 'John Doe'}</p>
                    <p className="text-neutral-600">{section.content?.authorTitle || 'CEO'}</p>
                    {section.content?.company && (
                      <p className="text-sm text-neutral-500">{section.content.company}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div key={section.id} style={sectionStyle} className="stats-section">
            <div className="py-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                {section.content?.title || 'Statistics'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.content?.stats || [
                  { label: 'Projects', value: '50+' },
                  { label: 'Clients', value: '25+' },
                  { label: 'Years', value: '5+' }
                ]).map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">
                      {stat.value || '0'}
                    </div>
                    <div className="text-neutral-600">
                      {stat.label || 'Label'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div key={section.id} style={sectionStyle} className="timeline-section">
            <div className="py-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                {section.content?.title || 'Timeline'}
              </h2>
              <div className="max-w-4xl mx-auto">
                {(section.content?.items || [
                  { date: '2023', title: 'Project Launch', description: 'Successfully launched the project' },
                  { date: '2022', title: 'Development', description: 'Completed development phase' },
                  { date: '2021', title: 'Planning', description: 'Initial planning and research' }
                ]).map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 mb-8">
                    <div className="w-4 h-4 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-accent">{item.date || 'Date'}</span>
                        <h3 className="text-lg font-semibold">{item.title || 'Title'}</h3>
                      </div>
                      <p className="text-neutral-600">{item.description || 'Description'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={section.id} style={sectionStyle} className="custom-section">
            <div className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <p className="text-neutral-600">Custom section content</p>
            </div>
          </div>
        );
    }
  };

  const dimensions = getDeviceDimensions();

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Preview Header */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="p-1 hover:bg-neutral-100 rounded"
              disabled={zoom <= 25}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-neutral-600 min-w-[3rem] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-1 hover:bg-neutral-100 rounded"
              disabled={zoom >= 200}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Device Selector */}
        <div className="flex space-x-1">
          {[
            { id: 'mobile', label: 'Mobile', icon: '📱' },
            { id: 'tablet', label: 'Tablet', icon: '📱' },
            { id: 'desktop', label: 'Desktop', icon: '💻' }
          ].map(device => (
            <button
              key={device.id}
              onClick={() => setSelectedDevice(device.id as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedDevice === device.id
                  ? 'bg-accent text-brand'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <span className="mr-2">{device.icon}</span>
              {device.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: `${dimensions.width * (zoom / 100)}px`,
              height: `${dimensions.height * (zoom / 100)}px`,
              transform: 'scale(1)',
              transformOrigin: 'top center'
            }}
          >
            <div 
              className="w-full h-full overflow-auto"
              style={{
                backgroundColor: project.structure.theme.backgroundColor,
                color: project.structure.theme.textColor,
                fontFamily: project.structure.theme.fontFamily
              }}
            >
              {project.content.sections
                .filter(section => section.visible)
                .sort((a, b) => a.position - b.position)
                .map(renderSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
