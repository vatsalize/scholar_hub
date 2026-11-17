import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import '../styles/Projects.css';

const Projects = () => {
  const {
    projects,
    addProject,
    user,
    searchQuery: globalSearchQuery
  } = useApp();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'In Progress' | 'Under Review' | 'Completed'
  const [localSearch, setLocalSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Science Capstone',
    deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    memberEmail: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const initialMembers = [
      {
        id: 'm-lead',
        name: user.name,
        role: 'Team Lead',
        avatar: user.avatar
      }
    ];

    if (formData.memberEmail.trim()) {
      initialMembers.push({
        id: `m-${Date.now()}`,
        name: formData.memberEmail.split('@')[0],
        role: 'Collaborator',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.memberEmail)}`
      });
    }

    await addProject({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: formData.deadline,
      members: initialMembers
    });

    setFormData({
      title: '',
      description: '',
      category: 'Computer Science Capstone',
      deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      memberEmail: ''
    });

    setIsCreateModalOpen(false);
  };

  const activeSearch = (localSearch || globalSearchQuery || '').toLowerCase();

  const filteredProjects = projects.filter(p => {
    const matchesTab = activeTab === 'All' || p.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = !activeSearch ||
      p.title.toLowerCase().includes(activeSearch) ||
      p.description.toLowerCase().includes(activeSearch) ||
      p.category.toLowerCase().includes(activeSearch);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="projects-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Project Collaboration</h1>
          <p>Real-time collaborative workspaces, sprint deliverables, and team discussions.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* Filter & Status Bar */}
      <div className="projects-filter-bar">
        <div className="status-tabs">
          {['All', 'In Progress', 'Under Review', 'Completed'].map((tab) => (
            <button
              key={tab}
              className={`status-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="navbar-search" style={{ width: '260px' }}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FolderGit2 size={26} />
          </div>
          <h3>No projects found</h3>
          <p>Get started by creating your first group research or capstone project!</p>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Modal: Create Project */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Collaboration Project"
        subtitle="Set up a shared workspace for team assignments and capstone research"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateSubmit}
            >
              Create Workspace
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. Distributed Key-Value Store"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              rows={3}
              placeholder="Outline the scope, architecture, and core problem statement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Capstone Project">Capstone Project</option>
                <option value="Systems & Cloud">Systems & Cloud</option>
                <option value="Software Engineering Lab">Software Engineering Lab</option>
                <option value="Database Design">Database Design</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Final Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Invite Initial Teammate (Email / Username)</label>
            <input
              type="text"
              placeholder="e.g. david.kim@scholarhub.edu"
              value={formData.memberEmail}
              onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
            />
            <span className="form-helper">
              You can invite more collaborators and assign tasks once the project workspace is created.
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
