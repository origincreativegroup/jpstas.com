import { useState } from 'react';
import MediaGallery from './ImageGallery';

interface Project {
  id: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  type: string;
  featured: boolean;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    caption: string;
    type?: 'image' | 'video';
  }>;
  content: {
    challenge: string;
    solution: string;
    results: string;
    process: string[];
    technologies: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface CaseStudyTemplateProps {
  project: Project;
  variant?: 'card' | 'detailed' | 'minimal';
}

export default function CaseStudyTemplate({ project, variant = 'card' }: CaseStudyTemplateProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === 'minimal') {
    return (
      <article className="group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
          <div className="flex-1">
            <h3 className="font-semibold group-hover:text-brand transition-colors">{project.title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{project.role}</p>
            <p className="text-sm text-neutral-700 mt-2">{project.summary}</p>
            <div className="flex gap-2 flex-wrap mt-3">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-neutral-100 border border-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-neutral-400 group-hover:text-brand transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'card') {
    return (
      <article className="card group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold group-hover:text-brand transition-colors">{project.title}</h3>
            <div className="text-sm text-neutral-600 mt-1">{project.role}</div>
          </div>
          {project.featured && (
            <span className="px-2 py-1 text-xs bg-accent text-white rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-neutral-700 mb-4">{project.summary}</p>
        
        <div className="flex gap-2 flex-wrap mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-neutral-100 border border-neutral-200">
              {tag}
            </span>
          ))}
        </div>

        {project.images.length > 0 && (
          <div className="mb-4">
            <MediaGallery images={project.images.slice(0, 3)} className="grid-cols-3" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            {project.content.results && (
              <span className="font-medium text-green-600">
                {project.content.results.split('.')[0]}.
              </span>
            )}
          </div>
          <div className="text-neutral-400 group-hover:text-brand transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    );
  }

  // Detailed variant
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
            <p className="text-xl text-neutral-600">{project.role}</p>
          </div>
          {project.featured && (
            <span className="px-3 py-1 text-sm bg-accent text-white rounded-full">
              Featured Project
            </span>
          )}
        </div>
        
        <p className="text-lg text-neutral-700 mb-6">{project.summary}</p>
        
        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-sm rounded-full bg-neutral-100 border border-neutral-200">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Media */}
      {project.images.length > 0 && (
        <section className="mb-12">
          <MediaGallery images={project.images} />
        </section>
      )}

      {/* Case Study Content */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
          {project.content.challenge && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand">The Challenge</h2>
              <p className="text-neutral-700 leading-relaxed">{project.content.challenge}</p>
            </section>
          )}

          {project.content.solution && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand">The Solution</h2>
              <p className="text-neutral-700 leading-relaxed">{project.content.solution}</p>
            </section>
          )}

          {project.content.process && project.content.process.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand">Process</h2>
              <ol className="space-y-3">
                {project.content.process.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-neutral-700">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {project.content.results && (
            <div className="card">
              <h3 className="text-lg font-bold mb-3 text-green-600">Results</h3>
              <p className="text-neutral-700">{project.content.results}</p>
            </div>
          )}

          {project.content.technologies && project.content.technologies.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.content.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs rounded bg-neutral-100 border border-neutral-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-bold mb-3">Project Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-neutral-600">Created:</span>
                <span className="ml-2">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-neutral-600">Updated:</span>
                <span className="ml-2">{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
