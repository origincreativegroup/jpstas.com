import { MediaFile } from '@/types/media';

interface MediaBreadcrumbsProps {
  media: MediaFile;
  projects?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

/**
 * MediaBreadcrumbs Component
 * Shows where a media file is being used across projects
 * Fulfills requirement: "if a file is uploaded to a project it should also show up breadcrumbed in the media manager"
 */
export default function MediaBreadcrumbs({ media, projects = [] }: MediaBreadcrumbsProps) {
  // Get projects from media usage or from props
  const projectsList = projects.length > 0 ? projects : media.usage?.projectIds || [];

  if (!projectsList || projectsList.length === 0) {
    return (
      <div className="text-xs text-gray-400 italic">
        Not used in any projects yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-600 mb-1">
        Used in:
      </div>
      <div className="flex flex-wrap gap-1">
        {projectsList.map((project, index) => {
          const projectTitle = typeof project === 'string' ? project : project.title;
          const projectSlug = typeof project === 'string' ? project : project.slug;

          return (
            <div
              key={typeof project === 'string' ? project : project.id || index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span>{projectTitle}</span>
              {projectSlug && (
                <a
                  href={`/portfolio/${projectSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={e => e.stopPropagation()}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {media.usage?.useCount && media.usage.useCount > 0 && (
          <span>Used {media.usage.useCount} time{media.usage.useCount > 1 ? 's' : ''}</span>
        )}
        {media.usage?.lastUsed && (
          <span className="ml-2">
            • Last used: {new Date(media.usage.lastUsed).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for list views
 */
export function MediaBreadcrumbsCompact({ media, projects = [] }: MediaBreadcrumbsProps) {
  const projectsList = projects.length > 0 ? projects : media.usage?.projectIds || [];

  if (!projectsList || projectsList.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
      <span>{projectsList.length} project{projectsList.length > 1 ? 's' : ''}</span>
    </div>
  );
}

