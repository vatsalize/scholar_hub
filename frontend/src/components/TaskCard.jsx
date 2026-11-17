import React from 'react';
import {
  Calendar,
  CheckCircle,
  Circle,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import '../styles/Components.css';

const TaskCard = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'badge-red';
      case 'medium': return 'badge-yellow';
      case 'low': return 'badge-green';
      default: return 'badge-gray';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-green';
      case 'in progress': return 'badge-purple';
      case 'to do': return 'badge-blue';
      default: return 'badge-gray';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority} Priority
        </span>
      </div>

      <div className="task-card-title-row">
        <button
          className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>
        <h4 className="task-card-title">{task.title}</h4>
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
          <Calendar size={13} />
          {task.dueDate} {isOverdue && '(Overdue)'}
        </span>

        <div className="task-card-actions">
          {onEdit && (
            <button
              className="btn-icon"
              style={{ width: '26px', height: '26px' }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit Task"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              className="btn-icon"
              style={{ width: '26px', height: '26px', color: 'var(--danger)' }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Delete Task"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
