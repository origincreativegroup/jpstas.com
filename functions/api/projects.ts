// Projects API for Cloudflare Pages
interface Project {
  id: string;
  title: string;
  slug: string;
  role: string;
  summary: string;
  tags: string[];
  type: string;
  featured: boolean;
  images: any[];
  content: any;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// KV storage key
const PROJECTS_KEY = 'portfolio:projects';

// Get all projects from KV
async function getProjectsFromKV(env: any): Promise<Project[]> {
  const projectsJson = await env.PORTFOLIO_DATA?.get(PROJECTS_KEY);
  return projectsJson ? JSON.parse(projectsJson) : [];
}

// Save projects to KV
async function saveProjectsToKV(env: any, projects: Project[]): Promise<void> {
  await env.PORTFOLIO_DATA?.put(PROJECTS_KEY, JSON.stringify(projects));
}

// GET /api/projects - Get all projects
export const onRequestGet: PagesFunction = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/').pop();

    // Check if requesting a single project
    if (projectId && projectId !== 'projects') {
      const projects = await getProjectsFromKV(env);
      const project = projects.find(p => p.id === projectId);

      if (!project) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ project }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all projects with optional filtering
    const status = url.searchParams.get('status');
    const featured = url.searchParams.get('featured');
    const type = url.searchParams.get('type');

    let projects = await getProjectsFromKV(env);

    // Apply filters
    if (status && status !== 'all') {
      projects = projects.filter(p => p.status === status);
    }
    if (featured !== null && featured !== undefined) {
      const isFeatured = featured === 'true';
      projects = projects.filter(p => p.featured === isFeatured);
    }
    if (type) {
      projects = projects.filter(p => p.type === type);
    }

    // Sort by updatedAt descending
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return new Response(JSON.stringify({ projects }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/projects - Create new project
export const onRequestPost: PagesFunction = async ({ env, request }) => {
  try {
    const data = await request.json();

    // Generate ID if not provided
    const projectId = data.id || `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newProject: Project = {
      id: projectId,
      title: data.title || 'Untitled Project',
      slug: data.slug || projectId,
      role: data.role || '',
      summary: data.summary || '',
      tags: data.tags || [],
      type: data.type || 'project',
      featured: data.featured || false,
      images: data.images || [],
      content: data.content || {},
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projects = await getProjectsFromKV(env);
    projects.push(newProject);
    await saveProjectsToKV(env, projects);

    return new Response(JSON.stringify({ project: newProject }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({ error: 'Failed to create project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PATCH /api/projects/:id - Update project
export const onRequestPatch: PagesFunction = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/').pop();

    if (!projectId || projectId === 'projects') {
      return new Response(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates = await request.json();
    const projects = await getProjectsFromKV(env);
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update project
    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      id: projectId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    projects[projectIndex] = updatedProject;
    await saveProjectsToKV(env, projects);

    return new Response(JSON.stringify({ project: updatedProject }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/projects/:id - Delete project
export const onRequestDelete: PagesFunction = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/').pop();

    if (!projectId || projectId === 'projects') {
      return new Response(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const projects = await getProjectsFromKV(env);
    const filteredProjects = projects.filter(p => p.id !== projectId);

    if (filteredProjects.length === projects.length) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await saveProjectsToKV(env, filteredProjects);

    return new Response(JSON.stringify({ success: true, message: 'Project deleted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

