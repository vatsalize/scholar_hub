import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';
import '../styles/Components.css';

const ProjectCard = ({ project }) => {
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-green';
      case 'under review': return 'badge-purple';
      case 'in progress': return 'badge-blue';
      default: return 'badge-gray';
    }
  };

  const completedTasks = project.tasks?.filter(t => t.status === 'Completed').length || 0;
  const totalTasks = project.tasks?.length || 0;

  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <div className="project-card-top">
        <div className="project-card-meta">
          <span className="project-category-tag">{project.category}</span>
          <span className={`badge ${getStatusBadgeClass(project.status)}`}>
            {project.status}
          </span>
        </div>

        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.description}</p>
      </div>

      <div className="project-progress-wrapper">
        <div className="project-progress-labels">
          <span>Sprint Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="project-card-bottom">
        <div className="project-members-stack" title={`${project.members?.length || 0} team members`}>
          {project.members?.slice(0, 3).map((member) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="member-avatar"
              title={`${member.name} (${member.role})`}
            />
          ))}
          {project.members?.length > 3 && (
            <span className="more-members-count">
              +{project.members.length - 3}
            </span>
          )}
        </div>

        <div className="project-deadline">
          <Calendar size={13} />
          <span>Due {project.deadline}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
