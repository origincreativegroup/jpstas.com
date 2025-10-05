import { useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import Navigation from '../components/Navigation';
import { SEO } from '../components/SEO';

export default function About() {
  const { pageContent, fetchPageContent, loading } = useCMS();

  useEffect(() => {
    fetchPageContent('about');
  }, [fetchPageContent]);

  const about = pageContent?.about;

  if (loading) {
    return (
      <>
        <SEO
          title="About"
          description="Learn about John P. Stas - Creative Technologist, Designer, and Process Innovator."
        />
        <Navigation />
        <section className="relative min-h-screen bg-brand text-white">
          <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
          <div className="relative max-w-4xl mx-auto px-4 py-20">
            <div className="animate-pulse">
              <div className="h-16 bg-accent/30 rounded w-1/3 mx-auto mb-6"></div>
              <div className="h-6 bg-accent/30 rounded w-2/3 mx-auto mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-accent/30 rounded w-full"></div>
                <div className="h-4 bg-accent/30 rounded w-3/4"></div>
                <div className="h-4 bg-accent/30 rounded w-1/2"></div>
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{about?.title || 'About Me'}</h1>
            {about?.subtitle && (
              <p className="text-xl text-brand-light max-w-2xl mx-auto mb-8">{about.subtitle}</p>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Headshot */}
            {about?.headshot && (
              <div className="lg:col-span-1">
                <div className="relative">
                  <img
                    src={about.headshot.url}
                    alt={about.headshot.alt}
                    className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                  />
                  {about.headshot.caption && (
                    <p className="text-sm text-brand-light text-center mt-4">
                      {about.headshot.caption}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`${about?.headshot ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="prose prose-lg prose-invert max-w-none">
                {/* Bio */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                  <p className="text-brand-light leading-relaxed text-lg">
                    {about?.bio ||
                      "I'm a creative technologist with 8+ years of experience building digital experiences that bridge design and development. I specialize in creating systems that are both beautiful and functional, scalable and user-friendly."}
                  </p>
                </div>

                {/* Skills */}
                {about?.skills && about.skills.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-accent mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {about.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {about?.experience && about.experience.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-accent mb-6">Experience</h3>
                    <div className="space-y-6">
                      {about.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-accent/30 pl-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">
                              {exp.role}{' '}
                              {exp.current && (
                                <span className="text-accent text-sm">(Current)</span>
                              )}
                            </h4>
                            <span className="text-brand-light text-sm">{exp.period}</span>
                          </div>
                          <p className="text-brand-light font-medium mb-1">{exp.company}</p>
                          <p className="text-brand-light text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {about?.education && about.education.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-accent mb-6">Education</h3>
                    <div className="space-y-4">
                      {about.education.map((edu, index) => (
                        <div key={index}>
                          <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                          <p className="text-brand-light font-medium">{edu.institution}</p>
                          <p className="text-brand-light text-sm">{edu.period}</p>
                          {edu.description && (
                            <p className="text-brand-light text-sm mt-1">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {about?.achievements && about.achievements.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-accent mb-6">Key Achievements</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {about.achievements.map((achievement, index) => (
                        <div key={index} className="border border-accent/20 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-1">{achievement.title}</h4>
                          <p className="text-brand-light text-sm">{achievement.description}</p>
                          {achievement.year && (
                            <span className="text-accent text-xs font-medium">
                              {achievement.year}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
