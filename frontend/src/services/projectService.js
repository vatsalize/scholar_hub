import apiClient, { USE_MOCK_STORAGE } from './api';
import { initialProjects } from '../data/dummyData';

const PROJECTS_KEY = 'scholarhub_projects';

const getStoredProjects = () => {
  const data = localStorage.getItem(PROJECTS_KEY);
  if (!data) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  }
  return JSON.parse(data);
};

export const projectService = {
  // Get all projects
  async getProjects() {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const endpoint = currentUser.id ? `/project/getAll/${currentUser.id}` : '/project/getAll';
        const response = await apiClient.get(endpoint);
        if (response.data && response.data.length > 0) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local storage projects');
      }
    }
    return getStoredProjects();
  },

  // Get project by ID
  async getProjectById(id) {
    const projects = getStoredProjects();
    const proj = projects.find(p => p.id === id);
    if (!proj) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return proj;
  },

  // Create new project
  async createProject(projectData) {
    if (!USE_MOCK_STORAGE) {
      try {
        const response = await apiClient.post('/project/create', projectData);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, saving project locally');
      }
    }
    const projects = getStoredProjects();
    const newProject = {
      id: `proj-${Date.now()}`,
      title: projectData.title,
      description: projectData.description || 'No description provided',
      category: projectData.category || 'Academic Project',
      status: 'In Progress',
      progress: 0,
      deadline: projectData.deadline || '2026-12-30',
      startDate: new Date().toISOString().split('T')[0],
      members: projectData.members && projectData.members.length > 0 
        ? projectData.members 
        : [
            {
              id: 'm-1',
              name: 'Alex Morgan',
              role: 'Team Lead',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            }
          ],
      tasks: [],
      discussions: [
        {
          id: `disc-${Date.now()}`,
          author: 'Alex Morgan',
          role: 'Team Lead',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          timestamp: 'Just now',
          message: 'Project created! Let’s organize our sprint milestones and assign tasks.'
        }
      ],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: `Project workspace "${projectData.title}" initialized`
        }
      ]
    };

    const updated = [newProject, ...projects];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return newProject;
  },

  // Update project
  async updateProject(projectId, updates) {
    const projects = getStoredProjects();
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, ...updates };
      }
      return p;
    });
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated.find(p => p.id === projectId);
  },

  // Delete project
  async deleteProject(projectId) {
    const projects = getStoredProjects().filter(p => p.id !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return true;
  },

  // Add a task to project
  async addProjectTask(projectId, taskData) {
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const newTask = {
      id: `pt-${Date.now()}`,
      title: taskData.title,
      status: taskData.status || 'To Do',
      assignee: taskData.assignee || 'Alex Morgan',
      dueDate: taskData.dueDate || '2026-12-01'
    };

    const updatedTasks = [...(project.tasks || []), newTask];
    // Recalculate progress
    const completedCount = updatedTasks.filter(t => t.status === 'Completed').length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return updatedProject;
  },

  // Toggle or update status of project task
  async toggleProjectTask(projectId, taskId) {
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const updatedTasks = project.tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    const completedCount = updatedTasks.filter(t => t.status === 'Completed').length;
    const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return updatedProject;
  },

  // Add comment to project discussion
  async addComment(projectId, commentData) {
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const newComment = {
      id: `disc-${Date.now()}`,
      author: commentData.author || 'Alex Morgan',
      role: commentData.role || 'Student',
      avatar: commentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      timestamp: 'Just now',
      message: commentData.message
    };

    const updatedDiscussions = [...(project.discussions || []), newComment];
    const updatedProject = {
      ...project,
      discussions: updatedDiscussions
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return updatedProject;
  },

  // Add member to project
  async addMember(projectId, memberData) {
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const newMember = {
      id: `m-${Date.now()}`,
      name: memberData.name,
      role: memberData.role || 'Collaborator',
      avatar: memberData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberData.name)}`
    };

    const updatedMembers = [...(project.members || []), newMember];
    const updatedProject = {
      ...project,
      members: updatedMembers
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return updatedProject;
  }
};

export default projectService;
