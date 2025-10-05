import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SaaSProjectEditor from '@/components/SaaSProjectEditor';

const SaaSDemo: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demos = [
    {
      id: 'portfolio-showcase',
      title: 'Portfolio Showcase',
      description: 'A clean, modern portfolio template perfect for showcasing your work',
      image: '/templates/portfolio-showcase-preview.jpg',
      features: ['Hero Section', 'Project Gallery', 'Testimonials', 'Contact Form'],
      category: 'Portfolio',
    },
    {
      id: 'case-study-detailed',
      title: 'Detailed Case Study',
      description: 'A comprehensive template for detailed project case studies',
      image: '/templates/case-study-preview.jpg',
      features: ['Project Overview', 'Process Timeline', 'Results & Metrics', 'Lessons Learned'],
      category: 'Case Study',
    },
    {
      id: 'creative-showcase',
      title: 'Creative Showcase',
      description: 'An artistic template for creative professionals and agencies',
      image: '/templates/creative-showcase-preview.jpg',
      features: ['Visual Gallery', 'Interactive Elements', 'Brand Story', 'Portfolio Grid'],
      category: 'Showcase',
    },
    {
      id: 'minimal-portfolio',
      title: 'Minimal Portfolio',
      description: 'A clean, minimal design focused on content and typography',
      image: '/templates/minimal-portfolio-preview.jpg',
      features: ['Typography Focus', 'Clean Layout', 'Subtle Animations', 'Mobile First'],
      category: 'Portfolio',
    },
  ];

  const features = [
    {
      icon: '🎨',
      title: 'Visual Editor',
      description: 'Drag-and-drop interface with live preview and real-time editing',
    },
    {
      icon: '🖼️',
      title: 'Media Integration',
      description: 'Seamless integration with global media library and drag-and-drop functionality',
    },
    {
      icon: '👥',
      title: 'Real-time Collaboration',
      description: 'Invite team members, leave comments, and collaborate in real-time',
    },
    {
      icon: '📚',
      title: 'Version Control',
      description: 'Automatic versioning, change tracking, and rollback capabilities',
    },
    {
      icon: '📤',
      title: 'Export & Import',
      description: 'Export to multiple formats and import existing projects',
    },
    {
      icon: '🎯',
      title: 'Template System',
      description: 'Pre-built templates and custom template creation',
    },
  ];

  const stats = [
    { label: 'Templates Available', value: '12+' },
    { label: 'Section Types', value: '7' },
    { label: 'Export Formats', value: '4' },
    { label: 'Collaboration Features', value: 'Unlimited' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-brand-dark">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-brand font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SaaS Portfolio Editor</h1>
                <p className="text-brand-light">Advanced project creation and collaboration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              >
                Admin Panel
              </Link>
              <button
                onClick={() => setShowEditor(true)}
                className="px-6 py-2 bg-accent text-brand rounded-lg font-semibold hover:bg-accent-dark transition-colors"
              >
                Try Editor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Create Stunning
              <span className="block text-accent">Portfolio Projects</span>
            </h2>
            <p className="text-xl text-brand-light mb-8 max-w-3xl mx-auto">
              The most advanced portfolio project editor with real-time collaboration, version
              control, and seamless media integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowEditor(true)}
                className="px-8 py-4 bg-accent text-brand rounded-lg font-semibold text-lg hover:bg-accent-dark transition-colors"
              >
                Start Creating
              </button>
              <button
                onClick={() => setSelectedDemo('portfolio-showcase')}
                className="px-8 py-4 border border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-brand-light">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Powerful Features</h3>
            <p className="text-xl text-brand-light">
              Everything you need to create professional portfolio projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-brand-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Professional Templates</h3>
            <p className="text-xl text-brand-light">
              Choose from our collection of professionally designed templates
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all cursor-pointer group"
                onClick={() => setSelectedDemo(demo.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📄</span>
                      </div>
                      <p className="text-sm text-neutral-600">Template Preview</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-accent text-brand px-4 py-2 rounded-lg font-medium transition-all duration-200">
                      View Template
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">{demo.title}</h4>
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                      {demo.category}
                    </span>
                  </div>
                  <p className="text-brand-light text-sm mb-4">{demo.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {demo.features.slice(0, 2).map(feature => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {demo.features.length > 2 && (
                      <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                        +{demo.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Create Amazing Projects?
            </h3>
            <p className="text-xl text-brand-light mb-8">
              Start building your portfolio projects with our advanced editor today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowEditor(true)}
                className="px-8 py-4 bg-accent text-brand rounded-lg font-semibold text-lg hover:bg-accent-dark transition-colors"
              >
                Get Started Now
              </button>
              <Link
                to="/admin"
                className="px-8 py-4 border border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Access Admin Panel
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-brand font-bold text-xl">JP</span>
            </div>
            <p className="text-brand-light">
              © 2024 JP Stas Portfolio. Advanced portfolio management made simple.
            </p>
          </div>
        </div>
      </footer>

      {/* SaaS Project Editor Modal */}
      {showEditor && (
        <SaaSProjectEditor
          onClose={() => setShowEditor(false)}
          onSave={project => {
            console.log('Project saved:', project);
            setShowEditor(false);
          }}
        />
      )}

      {/* Demo Modal */}
      {selectedDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {demos.find(d => d.id === selectedDemo)?.title} Template
              </h3>
              <button
                onClick={() => setSelectedDemo(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
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
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📄</span>
                  </div>
                  <p className="text-lg text-neutral-600">Template Preview</p>
                  <p className="text-sm text-neutral-500">Interactive preview coming soon</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Template Features</h4>
                  <ul className="space-y-2">
                    {demos
                      .find(d => d.id === selectedDemo)
                      ?.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3">Template Details</h4>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>
                      <span className="font-medium">Category:</span>{' '}
                      {demos.find(d => d.id === selectedDemo)?.category}
                    </p>
                    <p>
                      <span className="font-medium">Difficulty:</span> Intermediate
                    </p>
                    <p>
                      <span className="font-medium">Estimated Time:</span> 30-60 minutes
                    </p>
                    <p>
                      <span className="font-medium">Responsive:</span> Yes
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedDemo(null);
                    setShowEditor(true);
                  }}
                  className="px-6 py-2 bg-accent text-brand rounded-lg font-medium hover:bg-accent-dark transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaaSDemo;
