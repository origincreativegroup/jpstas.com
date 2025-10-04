import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import CMSAdmin from './CMSAdmin';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmsAdminOpen, setCmsAdminOpen] = useState(false);

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/resume', label: 'Resume' },
    { to: '/saas-demo', label: 'SaaS Editor' },
    { to: '/workshop/contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-accent/20 transition-all duration-300 ${
          scrolled ? 'bg-brand/98 backdrop-blur-md shadow-lg' : 'bg-brand/95 backdrop-blur'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 z-50" onClick={handleLinkClick}>
            <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-brand font-bold text-sm">JP</span>
            </div>
            <span className="font-bold tracking-tight text-white">John P. Stas</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold text-accent'
                    : 'text-white hover:text-accent transition-colors'
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* CMS Admin Button */}
            <button
              onClick={() => setCmsAdminOpen(true)}
              className="px-3 py-1 text-xs bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
              title="Open CMS Admin"
            >
              CMS
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white hover:text-accent transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 origin-center ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 origin-center ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <nav
        className={`fixed top-0 right-0 bottom-0 w-64 bg-brand border-l border-accent/20 z-40 md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-brand'
                      : 'text-white hover:bg-white/10 hover:text-accent'
                  }`
                }
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none',
                }}
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* CMS Admin Button */}
            <button
              onClick={() => {
                setCmsAdminOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 rounded-lg text-lg font-medium text-white hover:bg-white/10 hover:text-accent transition-all duration-200"
            >
              CMS Admin
            </button>
          </div>

          {/* Social Links */}
          <div className="mt-auto pb-8 pt-8 border-t border-accent/20">
            <p className="text-xs text-brand-light font-semibold uppercase tracking-wide mb-4">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:johnpstas@gmail.com"
                className="flex items-center gap-3 text-white hover:text-accent transition-colors"
                onClick={handleLinkClick}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/johnpstas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-accent transition-colors"
                onClick={handleLinkClick}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-accent transition-colors"
                onClick={handleLinkClick}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* CMS Admin Modal */}
      {cmsAdminOpen && (
        <CMSAdmin onClose={() => setCmsAdminOpen(false)} />
      )}
    </>
  );
}
