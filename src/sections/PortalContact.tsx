import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PortalContact: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const handleRebootWorkshop = () => {
    navigate('/');
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/functions/submit-contact', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  };

  const contactMethods = [
    {
      name: 'Email',
      value: 'johnpstas@gmail.com',
      href: 'mailto:johnpstas@gmail.com',
      icon: '📧',
      description: 'Direct communication for projects and collaborations'
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/johnpstas',
      href: 'https://www.linkedin.com/in/johnpstas',
      icon: '💼',
      description: 'Professional network and career opportunities'
    },
    {
      name: 'GitHub',
      value: 'github.com/johnpstas',
      href: 'https://github.com/johnpstas',
      icon: '💻',
      description: 'Code repositories and open source contributions'
    },
    {
      name: 'Phone',
      value: '219-319-9788',
      href: 'tel:2193199788',
      icon: '📱',
      description: 'Voice calls for urgent matters'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToWorkshop}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Workshop
            </button>
            <div className="h-6 w-px bg-neutral-700"></div>
            <h1 className="text-2xl font-bold">Contact</h1>
          </div>
          <div className="text-sm text-neutral-400">
            Connect & Collaborate
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
              <p className="text-lg text-neutral-400 mb-8">
                Ready to collaborate on your next project? I'm always excited to work on innovative solutions that push the boundaries of what's possible.
              </p>
            </motion.div>

            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <a
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                          {method.name}
                        </h3>
                        <p className="text-purple-400 font-medium mb-2">
                          {method.value}
                        </p>
                        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                          {method.description}
                        </p>
                      </div>
                      <div className="text-neutral-500 group-hover:text-purple-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Resume Download */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-purple-400/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">📄</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Download Resume</h3>
                  <p className="text-sm text-neutral-300 mb-4">
                    Get a detailed overview of my experience and skills
                  </p>
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  required
                  name="name"
                  className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project or idea..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {status === 'sending' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                >
                  <p className="text-green-400 font-medium">Thanks! I'll get back to you soon.</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-400 font-medium">Something went wrong. Please try again.</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Reboot Workshop Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleRebootWorkshop}
            className="px-8 py-4 bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-purple-400/30 text-purple-300 font-semibold rounded-xl hover:from-purple-500/30 hover:to-orange-500/30 hover:border-purple-400/50 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reboot Workshop
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalContact;
