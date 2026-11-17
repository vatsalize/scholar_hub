import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Plus,
  Send,
  Clock,
  Award,
  Layers,
  MessageSquare,
  Milestone,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    updateProject,
    deleteProject,
    addProjectTask,
    toggleProjectTask,
    addProjectComment,
    addProjectMember,
    user
  } = useApp();

  const project = projects.find(p => p.id === id);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // New Project Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    assignee: user.name,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  });

  // New Member Form
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: 'Collaborator',
    email: ''
  });

  // Discussion comment input state
  const [commentText, setCommentText] = useState('');

  if (!project) {
    return (
      <div className="empty-state" style={{ marginTop: '3rem' }}>
        <h3>Project not found</h3>
        <p>The project workspace you are looking for does not exist or was removed.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  // Handle Project Task Submit
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    await addProjectTask(project.id, taskForm);
    setTaskForm({
      title: '',
      assignee: user.name,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    });
    setIsTaskModalOpen(false);
  };

  // Handle Add Member Submit
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;
    await addProjectMember(project.id, memberForm);
    setMemberForm({
      name: '',
      role: 'Collaborator',
      email: ''
    });
    setIsMemberModalOpen(false);
  };

  // Handle Send Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addProjectComment(project.id, {
      author: user.name,
      role: user.department || 'Student',
      avatar: user.avatar,
      message: commentText.trim()
    });
    setCommentText('');
  };

  // Status badge class
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-green';
      case 'under review': return 'badge-purple';
      case 'in progress': return 'badge-blue';
      default: return 'badge-gray';
    }
  };

  const completedTasksCount = project.tasks?.filter(t => t.status === 'Completed').length || 0;
  const totalTasksCount = project.tasks?.length || 0;

  return (
    <div className="project-details-container">
      {/* Back link */}
      <div>
        <Link to="/projects" className="back-link">
          <ArrowLeft size={15} /> Back to Projects Overview
        </Link>
      </div>

      {/* Project Overview Card */}
      <section className="project-header-card">
        <div className="project-header-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="project-category-tag">{project.category}</span>
              <span className={`badge ${getStatusBadge(project.status)}`}>
                {project.status}
              </span>
            </div>
            <h1 className="project-title-large">{project.title}</h1>
            <p className="project-desc-full">{project.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="filter-select"
              style={{ width: 'auto' }}
              value={project.status}
              onChange={(e) => updateProject(project.id, { status: e.target.value })}
            >
              <option value="In Progress">Status: In Progress</option>
              <option value="Under Review">Status: Under Review</option>
              <option value="Completed">Status: Completed</option>
            </select>
            <button
              className="btn btn-secondary"
              style={{ color: 'var(--danger)' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this project workspace?')) {
                  deleteProject(project.id);
                  navigate('/projects');
                }
              }}
              title="Delete Project Workspace"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="project-metrics-bar">
          <div className="metric-item">
            <div className="metric-icon">
              <Award size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Milestone Progress</span>
              <span className="metric-value">{project.progress}% Complete</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon" style={{ color: 'var(--accent-purple)' }}>
              <Users size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Team Members</span>
              <span className="metric-value">{project.members?.length || 0} active</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon" style={{ color: 'var(--success)' }}>
              <CheckCircle2 size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Tasks Done</span>
              <span className="metric-value">{completedTasksCount} / {totalTasksCount}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon" style={{ color: 'var(--warning)' }}>
              <Calendar size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Deadline</span>
              <span className="metric-value">{project.deadline}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="project-progress-wrapper" style={{ marginTop: '0.5rem' }}>
          <div className="progress-bar-bg" style={{ height: '8px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Workspace 2-Column Grid */}
      <div className="project-workspace-grid">
        {/* Left Column: Tasks & Discussions */}
        <div className="workspace-column">
          {/* Project Deliverables / Tasks */}
          <div className="workspace-panel">
            <div className="panel-title-row">
              <h3>
                <CheckCircle2 size={18} color="var(--primary)" /> Project Tasks & Deliverables
              </h3>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <Plus size={14} /> Add Deliverable
              </button>
            </div>

            <div className="project-tasks-list">
              {project.tasks?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No tasks assigned to this project yet. Add one to track milestones!
                </p>
              ) : (
                project.tasks?.map((t) => (
                  <div key={t.id} className="project-task-row">
                    <div className="project-task-left">
                      <button
                        className={`task-checkbox-btn ${t.status === 'Completed' ? 'checked' : ''}`}
                        onClick={() => toggleProjectTask(project.id, t.id)}
                      >
                        {t.status === 'Completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <span className={`task-title-text ${t.status === 'Completed' ? 'done' : ''}`}>
                        {t.title}
                      </span>
                    </div>

                    <div className="project-task-right">
                      <span className="badge badge-gray">{t.assignee}</span>
                      <span>{t.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Real-time Team Discussion */}
          <div className="workspace-panel">
            <div className="panel-title-row">
              <h3>
                <MessageSquare size={18} color="var(--accent-purple)" /> Team Collaboration Feed
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {project.discussions?.length || 0} messages
              </span>
            </div>

            <div className="discussion-feed">
              {project.discussions?.map((msg) => (
                <div key={msg.id} className="comment-bubble">
                  <img
                    src={msg.avatar}
                    alt={msg.author}
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{msg.author}</span>
                      <span className="comment-time">{msg.timestamp}</span>
                    </div>
                    <p className="comment-message">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="comment-input-box">
              <input
                type="text"
                placeholder="Post a message or update to team..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" title="Send message">
                <Send size={15} /> Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Members & Milestone Timeline */}
        <div className="workspace-column">
          {/* Team Members */}
          <div className="workspace-panel">
            <div className="panel-title-row">
              <h3>
                <Users size={18} color="var(--accent-purple)" /> Team Members
              </h3>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setIsMemberModalOpen(true)}
              >
                <Plus size={14} /> Invite
              </button>
            </div>

            <div className="members-list">
              {project.members?.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-info-left">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="member-avatar-large"
                    />
                    <div className="member-names">
                      <h4>{member.name}</h4>
                      <span>{member.role}</span>
                    </div>
                  </div>
                  {member.name === user.name && (
                    <span className="badge badge-blue">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="workspace-panel">
            <div className="panel-title-row">
              <h3>
                <Milestone size={18} color="var(--primary)" /> Milestone Timeline
              </h3>
            </div>

            <div className="timeline-list">
              {project.timeline?.map((entry, idx) => (
                <div key={idx} className="timeline-entry">
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-date">{entry.date}</span>
                    <span className="timeline-title">{entry.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Project Task */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Project Deliverable"
        subtitle={`Assign a new task milestone for ${project.title}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleTaskSubmit}
            >
              Add Deliverable
            </button>
          </>
        }
      >
        <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Task Deliverable *</label>
            <input
              type="text"
              placeholder="e.g. Implement Raft Log Replication unit tests"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                value={taskForm.assignee}
                onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
              >
                {project.members?.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Due Date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Invite Team Member */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Invite Teammate to Workspace"
        subtitle="Add a student collaborator to this project"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsMemberModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleMemberSubmit}
            >
              Add Teammate
            </button>
          </>
        }
      >
        <form onSubmit={handleMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Member Name *</label>
            <input
              type="text"
              placeholder="e.g. Jordan Hayes"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role in Project</label>
            <input
              type="text"
              placeholder="e.g. Mobile Developer / Data Engineer"
              value={memberForm.role}
              onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
