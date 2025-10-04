import Navigation from '../components/Navigation';

export default function Resume() {
  return (
    <>
      <Navigation />
      <section className="relative min-h-screen bg-brand text-white">
      <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
      <div className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                JOHN STAS <span className="text-accent text-2xl">(JP)</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-accent mb-6">
                CREATIVE TECHNOLOGIST • DESIGNER • PROCESS INNOVATOR
              </h2>
              <p className="text-lg leading-relaxed text-brand-light max-w-2xl">
                Multidisciplinary professional with 8+ years building systems that bridge design,
                technology, and business. Proven track record in creative branding, SaaS
                development, production systems, and digital platforms. Expert in converting complex
                processes into scalable, efficient solutions.
              </p>
            </div>

            {/* Skills Sections */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">CREATIVE TECHNOLOGIST</h3>
                  <ul className="space-y-2 text-brand-light">
                    <li>• Managed in-house print studio (vehicle wraps, signage, apparel)</li>
                    <li>• Designed visual identities and marketing campaigns</li>
                    <li>• Proficient in Adobe Creative Suite (Illustrator, Photoshop, Audition)</li>
                    <li>• Vector-based design and production workflows</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">DIGITAL PLATFORMS & TECHNOLOGY</h3>
                  <ul className="space-y-2 text-brand-light">
                    <li>• Migrated CRM systems and launched e-commerce site ($100k+ revenue)</li>
                    <li>• Designed digital-first tools (payment portals, HR/onboarding flows)</li>
                    <li>• Proven ability to learn and reverse engineer new software</li>
                    <li>• Full-stack development with modern frameworks</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">PROCESS & OPERATIONS INNOVATION</h3>
                  <ul className="space-y-2 text-brand-light">
                    <li>• Converted paper forms to digital using Formstack</li>
                    <li>• Planned and executed Mailchimp campaigns (15-30% click-through rates)</li>
                    <li>• Developed social media strategies (Facebook, Instagram, YouTube)</li>
                    <li>• Built repeatable systems for efficiency and brand consistency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Info */}
          <div className="space-y-8">
            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">EXPERIENCE</h3>
              </div>
              <div className="space-y-3 pl-9">
                <div className="border-l-2 border-accent pl-4">
                  <div className="font-semibold">Caribbean Pools & Spas</div>
                  <div className="text-sm text-brand-light">
                    Business Development & Creative Lead
                  </div>
                  <div className="text-xs text-accent">2014-2025</div>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <div className="font-semibold">Origin Creative Group</div>
                  <div className="text-sm text-brand-light">Proprietor/Designer</div>
                  <div className="text-xs text-accent">2013-2014</div>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <div className="font-semibold">Halo Ventures</div>
                  <div className="text-sm text-brand-light">Director of Operations</div>
                  <div className="text-xs text-accent">2012-2013</div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 1 1 0 00.2-.85L2.38 13.4a1 1 0 00-.9-.9 1 1 0 01-.2-.85L3.31 9.397zM9 3.25l-1.714.857a1 1 0 00-.286.257l-.259.515a1 1 0 00.966 1.4 1 1 0 001.4-.966l.515-.259a1 1 0 00.257-.286L9 3.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">EDUCATION</h3>
              </div>
              <div className="pl-9">
                <div className="font-semibold">Indiana University</div>
                <div className="text-sm text-brand-light">Herron School of Art & Design</div>
                <div className="text-xs text-accent">BA, Visual Communications (2012)</div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">CERTIFICATIONS</h3>
              </div>
              <div className="pl-9">
                <div className="font-semibold">FAA Part 107</div>
                <div className="text-sm text-brand-light">Remote Pilot Certificate</div>
              </div>
            </div>

            {/* Download Button */}
            <div className="pt-4">
              <a
                href="/John_P_Stas_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-brand font-bold rounded-lg hover:bg-accent-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
