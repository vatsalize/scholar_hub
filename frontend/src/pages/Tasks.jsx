import React, { useState } from 'react';
import {
  Plus,
  Kanban,
  List,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import '../styles/Tasks.css';

const Tasks = () => {
  const {
    tasks,
    subjects,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    searchQuery: globalSearchQuery
  } = useApp();

  // Local View state: Kanban or List
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Local filter states
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('date-asc'); // 'date-asc' | 'date-desc'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: subjects[0]?.name || 'General Academic',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  });

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      category: subjects[0]?.name || 'General Academic',
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    });
    setEditingTask(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    });
    setIsCreateModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await addTask(formData);
    }

    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  // Quick Move Task across status columns
  const handleMoveStatus = (taskId, newStatus) => {
    updateTask(taskId, {
      status: newStatus,
      completed: newStatus === 'Completed'
    });
  };

  // Active query combination (global search + local search)
  const activeSearch = (search || globalSearchQuery || '').toLowerCase();

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = !activeSearch ||
      t.title.toLowerCase().includes(activeSearch) ||
      (t.description && t.description.toLowerCase().includes(activeSearch)) ||
      t.category.toLowerCase().includes(activeSearch);

    const matchesPriority = priorityFilter === 'All' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'date-asc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.dueDate) - new Date(a.dueDate);
  });

  // Group into Kanban columns
  const todoTasks = filteredTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  return (
    <div className="tasks-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Task Management</h1>
          <p>Organize homework, lab assignments, and study goals with your interactive Kanban board.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="tasks-control-bar">
        <div className="tasks-filter-group">
          <div className="navbar-search tasks-search-input" style={{ width: '220px' }}>
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
            <option value="General Academic">General Academic</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="date-asc">Due Date: Soonest First</option>
            <option value="date-desc">Due Date: Latest First</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="view-toggle-btns">
          <button
            className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban size={15} /> Kanban
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={15} /> List
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {/* Column: To Do */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="column-title-pill">
                <span className="column-dot todo" />
                <h3 className="column-title">To Do</h3>
              </div>
              <span className="column-count">{todoTasks.length}</span>
            </div>

            <div className="kanban-cards-list">
              {todoTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <p>No tasks to do!</p>
                </div>
              ) : (
                todoTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                    />
                    <div className="move-task-menu">
                      <button
                        className="move-tag-btn"
                        onClick={() => handleMoveStatus(task.id, 'In Progress')}
                      >
                        Start → In Progress
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="column-title-pill">
                <span className="column-dot inprogress" />
                <h3 className="column-title">In Progress</h3>
              </div>
              <span className="column-count">{inProgressTasks.length}</span>
            </div>

            <div className="kanban-cards-list">
              {inProgressTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <p>No active tasks in progress.</p>
                </div>
              ) : (
                inProgressTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                    />
                    <div className="move-task-menu">
                      <button
                        className="move-tag-btn"
                        onClick={() => handleMoveStatus(task.id, 'To Do')}
                      >
                        ← Back to To Do
                      </button>
                      <button
                        className="move-tag-btn"
                        style={{ color: 'var(--success)' }}
                        onClick={() => handleMoveStatus(task.id, 'Completed')}
                      >
                        Mark Done →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="column-title-pill">
                <span className="column-dot completed" />
                <h3 className="column-title">Completed</h3>
              </div>
              <span className="column-count">{completedTasks.length}</span>
            </div>

            <div className="kanban-cards-list">
              {completedTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <p>No completed tasks yet.</p>
                </div>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                    />
                    <div className="move-task-menu">
                      <button
                        className="move-tag-btn"
                        onClick={() => handleMoveStatus(task.id, 'In Progress')}
                      >
                        ← Reopen Task
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View Alternative */
        <div className="tasks-list-view">
          <table className="tasks-list-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Done</th>
                <th>Task Title</th>
                <th>Course / Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No tasks found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <button
                        className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td>{task.category}</td>
                    <td>
                      <span className={`badge ${task.priority === 'High' ? 'badge-red' : task.priority === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${task.status === 'Completed' ? 'badge-green' : task.status === 'In Progress' ? 'badge-purple' : 'badge-blue'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        {task.dueDate}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          className="btn-icon"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => openEditModal(task)}
                          title="Edit Task"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create or Edit Task */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Academic Task'}
        subtitle={editingTask ? `Updating task #${editingTask.id}` : 'Assign a new assignment or study milestone'}
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
              onClick={handleSubmit}
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Implement Dijkstra Algorithm in Java"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea
              rows={3}
              placeholder="Include rubric details, test scenarios, or notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject / Course</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="General Academic">General Academic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
