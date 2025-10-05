import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCMS } from '@/context/CMSContext';
import Navigation from '../components/Navigation';
import { SEO } from '../components/SEO';

export default function Contact() {
  const { pageContent, fetchPageContent, loading } = useCMS();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    fetchPageContent('contact');
  }, [fetchPageContent]);

  const contact = pageContent?.contact;

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

  if (loading) {
    return (
      <>
        <SEO
          title="Contact"
          description="Get in touch with John P. Stas. Let's collaborate on your next project."
        />
        <Navigation />
        <section className="relative min-h-screen bg-brand text-white">
          <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-20">
            <div className="animate-pulse">
              <div className="h-16 bg-accent/30 rounded w-1/3 mb-6"></div>
              <div className="h-6 bg-accent/30 rounded w-2/3 mb-8"></div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="h-4 bg-accent/30 rounded w-full"></div>
                  <div className="h-4 bg-accent/30 rounded w-3/4"></div>
                </div>
                <div className="h-64 bg-accent/30 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <section className="relative min-h-screen bg-brand text-white">
        <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {contact?.title || 'Get In Touch'}
                </h1>
                <p className="text-xl text-brand-light">
                  {contact?.description ||
                    "Let's build something together. I'm open to creative tech roles and collaborations."}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {contact?.contactInfo?.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent">Email</h3>
                      <a
                        href={`mailto:${contact.contactInfo.email}`}
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        {contact.contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.contactInfo?.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent">Phone</h3>
                      <a
                        href={`tel:${contact.contactInfo.phone.replace(/[^0-9]/g, '')}`}
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        {contact.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.contactInfo?.website && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent">Website</h3>
                      <a
                        href={contact.contactInfo.website}
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        {contact.contactInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.contactInfo?.linkedin && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent">LinkedIn</h3>
                      <a
                        href={contact.contactInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-light hover:text-accent transition-colors"
                      >
                        {contact.contactInfo.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.contactInfo?.location && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent">Location</h3>
                      <p className="text-brand-light">{contact.contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Name</label>
                  <input
                    required
                    name="name"
                    className="w-full rounded-xl border border-accent/30 bg-white/10 text-white placeholder-brand-light px-4 py-3 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-xl border border-accent/30 bg-white/10 text-white placeholder-brand-light px-4 py-3 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Message</label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full rounded-xl border border-accent/30 bg-white/10 text-white placeholder-brand-light px-4 py-3 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                <button
                  disabled={status === 'sending'}
                  className="w-full px-6 py-3 rounded-xl bg-accent text-brand font-bold hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {status === 'sending' && <LoadingSpinner size="sm" />}
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>

                {status === 'sent' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <p className="text-green-400 font-medium">Thanks! I'll get back to you soon.</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-medium">
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
