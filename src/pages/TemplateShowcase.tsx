import { useState } from 'react';
import { DEFAULT_TEMPLATES } from '@/types/template';
import { mockProjects } from '@/utils/mockApi';
import MetricsInfographic from '@/components/infographics/MetricsInfographic';
import ProcessFlowInfographic from '@/components/infographics/ProcessFlowInfographic';
import TechnologyStackInfographic from '@/components/infographics/TechnologyStackInfographic';
import TimelineInfographic from '@/components/infographics/TimelineInfographic';
import CostSavingsInfographic from '@/components/infographics/CostSavingsInfographic';
import PerformanceInfographic from '@/components/infographics/PerformanceInfographic';
import ComparisonInfographic from '@/components/infographics/ComparisonInfographic';
import MasonryGallery from '@/components/galleries/MasonryGallery';
import BeforeAfterGallery from '@/components/galleries/BeforeAfterGallery';
import VideoGallery from '@/components/galleries/VideoGallery';
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection';
import TechStackSection from '@/components/sections/TechStackSection';
import ClientTestimonialCarousel from '@/components/sections/ClientTestimonialCarousel';
import ProjectImpactSection from '@/components/sections/ProjectImpactSection';
import RelatedProjectsSection from '@/components/sections/RelatedProjectsSection';

export default function TemplateShowcase() {
  const [activeTab, setActiveTab] = useState<'templates' | 'infographics' | 'galleries' | 'sections'>('templates');

  // Use actual case study data from mockApi
  const ecommerceProject = mockProjects[0]; // Caribbean Pools E-commerce
  // const printProject = mockProjects[1]; // Print Studio
  // const aiProject = mockProjects[2]; // AI-Integrated Workflows
  // const mediaProject = mockProjects[3]; // Training & Educational Media

  // Sample data from E-commerce project
  const sampleMetrics = [
    { label: 'First Year Revenue', value: 100, prefix: '$', suffix: 'k+', icon: <span className="text-4xl">💰</span>, description: ecommerceProject?.content.results.split('.')[0] },
    { label: 'Call Time Reduction', value: 25, suffix: '%', icon: <span className="text-4xl">📞</span>, description: 'Per customer' },
    { label: 'Online Adoption', value: 500, suffix: '+', icon: <span className="text-4xl">👥</span>, description: 'Customers using platform' },
  ];

  const sampleProcessNodes = ecommerceProject?.content.process.slice(0, 4).map((step, i) => ({
    id: String(i + 1),
    label: step.split(':')[0] || '',
    description: step.split(':')[1]?.trim() || '',
    color: ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600'][i] || '',
  })) || [];

  const sampleTechnologies = ecommerceProject?.content.technologies.map((tech, i) => ({
    name: tech,
    category: ['WordPress', 'WooCommerce'].includes(tech) ? 'Platform' : 'Integration',
    proficiency: 90 - (i * 5),
    description: `Expert in ${tech}`,
  })) || [];

  const sampleTimeline = ecommerceProject?.content.process.slice(0, 5).map((step, i) => ({
    id: String(i + 1),
    date: `Phase ${i + 1}`,
    title: step.split(':')[0] || '',
    description: step.split(':')[1]?.trim() || '',
    tags: ecommerceProject.content.skills.slice(i, i + 2),
    color: ['blue', 'purple', 'green', 'orange', 'pink'][i] || '',
  })) || [];

  const sampleCosts = [
    { category: 'Marketing Spend', before: 50000, after: 30000, label: 'Reduced by automation' },
    { category: 'Print Outsourcing', before: 250000, after: 0, label: 'From Print Studio project' },
    { category: 'Support Calls', before: 100, after: 60, label: 'Per week reduction' },
  ];

  const samplePerformance = [
    { label: 'Page Load Time', value: 1.2, unit: 's', target: 2, trend: 'up' as const },
    { label: 'Conversion Rate', value: 8.5, unit: '%', target: 10, trend: 'up' as const },
    { label: 'Bounce Rate', value: 32, unit: '%', target: 40, trend: 'down' as const },
  ];

  const sampleComparison = [
    {
      label: 'Response Time',
      before: 3.5,
      after: 0.8,
      improvement: '77% faster',
      isNumeric: true,
    },
    {
      label: 'Customer Support',
      before: '8 hours',
      after: '2 hours',
      improvement: '75% reduction',
      isNumeric: false,
    },
  ];

  const sampleImages = ecommerceProject?.images.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    caption: img.caption,
    category: ecommerceProject.type,
  })) || [];

  const sampleBeforeAfter = [
    {
      id: '1',
      before: '/images/placeholder.svg',
      after: '/images/placeholder.svg',
      alt: 'Website Redesign',
      caption: 'Homepage transformation',
    },
  ];

  const sampleVideos = [
    {
      id: '1',
      url: '/videos/sample.mp4',
      thumbnail: '/images/placeholder.svg',
      title: 'Product Demo',
      description: 'Complete walkthrough of key features',
      duration: '3:45',
    },
  ];

  const sampleTestimonials = [
    {
      id: '1',
      quote: 'This solution transformed our business operations completely.',
      author: 'Jane Doe',
      role: 'CEO',
      company: 'Tech Corp',
      rating: 5,
    },
    {
      id: '2',
      quote: 'Outstanding quality and professional service throughout.',
      author: 'John Smith',
      role: 'CTO',
      company: 'Digital Solutions',
      rating: 5,
    },
  ];

  const sampleImpact = [
    { label: 'ROI Increase', value: 250, suffix: '%', prefix: '+' },
    { label: 'Time Saved', value: 15, suffix: ' hrs/week' },
    { label: 'Cost Reduction', value: 40, suffix: '%' },
  ];

  const sampleProjects = mockProjects.slice(0, 3).map(project => ({
    id: project.id,
    title: project.title,
    description: project.summary,
    image: project.images[0]?.url || '/images/placeholder.svg',
    category: project.type,
    tags: project.tags.slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Template Showcase</h1>
          <p className="text-slate-600">Preview all new templates, infographics, galleries, and sections</p>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { key: 'templates', label: 'Templates', count: DEFAULT_TEMPLATES.length },
              { key: 'infographics', label: 'Infographics', count: 7 },
              { key: 'galleries', label: 'Galleries', count: 3 },
              { key: 'sections', label: 'Sections', count: 5 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'templates' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-sm text-slate-600 font-medium">{template.sections.length} Sections</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 rounded">{template.category}</span>
                      <span>{template.sections.length} sections</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'infographics' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Metrics Infographic</h2>
              <MetricsInfographic
                title="Project Performance"
                subtitle="Key metrics and achievements"
                metrics={sampleMetrics}
                columns={3}
                variant="card"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Process Flow Infographic</h2>
              <ProcessFlowInfographic
                title="Development Process"
                subtitle="From concept to launch"
                nodes={sampleProcessNodes}
                layout="horizontal"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Technology Stack Infographic</h2>
              <TechnologyStackInfographic
                title="Tech Stack"
                subtitle="Technologies we use"
                technologies={sampleTechnologies}
                layout="grid"
                showProficiency
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Timeline Infographic</h2>
              <TimelineInfographic
                title="Project Timeline"
                subtitle="Milestones and phases"
                events={sampleTimeline}
                orientation="vertical"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cost Savings Infographic</h2>
              <CostSavingsInfographic
                title="Cost Optimization"
                subtitle="Achieved through automation"
                costs={sampleCosts}
                layout="comparison"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Performance Infographic</h2>
              <PerformanceInfographic
                title="Performance Metrics"
                subtitle="Real-time monitoring"
                metrics={samplePerformance}
                layout="dashboard"
                showTrend
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Comparison Infographic</h2>
              <ComparisonInfographic
                title="Before & After"
                subtitle="Dramatic improvements"
                items={sampleComparison}
                layout="side-by-side"
              />
            </div>
          </div>
        )}

        {activeTab === 'galleries' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Masonry Gallery</h2>
              <MasonryGallery images={sampleImages} columns={3} showCaptions enableLightbox />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Before/After Gallery</h2>
              <BeforeAfterGallery images={sampleBeforeAfter} layout="grid" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Video Gallery</h2>
              <VideoGallery videos={sampleVideos} columns={2} showDescription />
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Interactive Hero Section</h2>
              <InteractiveHeroSection
                title="Transform Your Business"
                subtitle="Professional Solutions"
                description="Cutting-edge technology meets exceptional design"
                variant="gradient"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Tech Stack Section</h2>
              <TechStackSection
                title="Technologies We Use"
                technologies={sampleTechnologies.map(t => ({
                  ...t,
                  description: `Expert in ${t.name}`,
                }))}
                layout="grid"
                showTooltips
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Client Testimonial Carousel</h2>
              <ClientTestimonialCarousel
                testimonials={sampleTestimonials}
                title="What Our Clients Say"
                autoPlay={false}
                showRating
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Impact Section</h2>
              <ProjectImpactSection
                title="Measurable Impact"
                metrics={sampleImpact}
                layout="grid"
                theme="gradient"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Projects Section</h2>
              <RelatedProjectsSection
                title="More Projects"
                projects={sampleProjects}
                columns={2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
