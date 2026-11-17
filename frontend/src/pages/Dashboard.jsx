import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ListTodo,
  Clock,
  CheckCheck,
  FolderGit2,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Activity,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Modal from '../components/Modal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const {
    user,
    stats,
    subjects,
    tasks,
    projects,
    calendarEvents,
    markAttendanceRecord,
    addTask
  } = useApp();

  // Quick Action Modal states
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Quick Attendance Form State
  const [attForm, setAttForm] = useState({
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    status: 'Present',
    topic: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Quick Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    category: subjects[0]?.name || 'General Academic',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  });

  // Prepare chart data for Subject Attendance
  const attendanceChartData = subjects.map(s => {
    const pct = s.totalClasses > 0 ? Math.round((s.attended / s.totalClasses) * 100) : 0;
    return {
      name: s.code || s.name.substring(0, 10),
      fullName: s.name,
      Attended: s.attended,
      Missed: s.missed,
      Percentage: pct
    };
  });

  // Weekly Task Activity mock data
  const taskActivityData = [
    { day: 'Mon', completed: 3, pending: 4 },
    { day: 'Tue', completed: 5, pending: 3 },
    { day: 'Wed', completed: 2, pending: 5 },
    { day: 'Thu', completed: 6, pending: 2 },
    { day: 'Fri', completed: 4, pending: 4 },
    { day: 'Sat', completed: 7, pending: 1 },
    { day: 'Sun', completed: 2, pending: 3 }
  ];

  // Upcoming deadlines (sorted tasks & assignments)
  const upcomingDeadlines = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // Quick Attendance Submit
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    const selSubj = subjects.find(s => s.id === attForm.subjectId) || subjects[0];
    await markAttendanceRecord({
      ...attForm,
      subjectId: selSubj.id,
      subjectName: selSubj.name
    });
    setIsAttendanceModalOpen(false);
  };

  // Quick Task Submit
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    await addTask(taskForm);
    setTaskForm({
      title: '',
      description: '',
      category: subjects[0]?.name || 'General Academic',
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    });
    setIsTaskModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Hero Banner */}
      <section className="welcome-hero">
        <div className="welcome-text">
          <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
          <p>
            You have <strong style={{ color: '#ffffff' }}>{stats.pendingTasks} pending tasks</strong> and{' '}
            <strong style={{ color: '#ffffff' }}>{stats.activeProjects} active projects</strong>. Overall academic attendance is at{' '}
            <strong style={{ color: stats.overallAttendance >= 75 ? '#34d399' : '#f87171' }}>
              {stats.overallAttendance}%
            </strong>.
          </p>
        </div>

        <div className="welcome-quick-actions">
          <button
            className="btn btn-cta"
            onClick={() => setIsAttendanceModalOpen(true)}
          >
            <CheckCircle2 size={16} /> Mark Attendance
          </button>
          <button
            className="btn"
            onClick={() => setIsTaskModalOpen(true)}
          >
            <Plus size={16} /> New Task
          </button>
          <Link to="/projects" className="btn">
            <FolderGit2 size={16} /> Projects
          </Link>
        </div>
      </section>

      {/* Primary Stat Cards */}
      <section className="stats-grid">
        <StatCard
          title="Overall Attendance"
          value={`${stats.overallAttendance}%`}
          unit={`${stats.attendedClasses}/${stats.totalClasses} classes`}
          icon={CheckCircle2}
          variant={stats.overallAttendance >= 75 ? 'green' : 'rose'}
          trend={stats.overallAttendance >= 75 ? 'Safe Standing' : 'Below 75% Target'}
          trendType={stats.overallAttendance >= 75 ? 'positive' : 'negative'}
          footerText="Minimum: 75%"
        />

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          unit="assigned"
          icon={ListTodo}
          variant="blue"
          trend={`${stats.pendingTasks} to complete`}
          trendType="positive"
          footerText="All subjects"
        />

        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          unit="in queue"
          icon={Clock}
          variant="amber"
          trend={`${stats.inProgressTasks} in progress`}
          trendType="warning"
          footerText="Sprint load"
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          unit="tasks done"
          icon={CheckCheck}
          variant="purple"
          trend="Finished on schedule"
          trendType="positive"
          footerText="Total progress"
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          unit="collaborations"
          icon={FolderGit2}
          variant="blue"
          trend="All on track"
          trendType="positive"
          footerText="Team workspaces"
        />
      </section>

      {/* Charts Grid */}
      <section className="charts-grid">
        <ChartCard
          title="Subject Attendance Overview"
          subtitle="Total attended vs missed classes per subject"
          action={
            <Link to="/attendance" className="btn btn-sm btn-secondary">
              View Details <ArrowRight size={13} />
            </Link>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Attended" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="Missed" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekly Productivity & Task Flow"
          subtitle="Completed vs in-flight assignments this week"
          action={
            <Link to="/tasks" className="btn btn-sm btn-secondary">
              Kanban Board <ArrowRight size={13} />
            </Link>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={taskActivityData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
              <Area type="monotone" dataKey="pending" name="In Queue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Deadlines & Recent Activities */}
      <section className="dashboard-bottom-grid">
        {/* Upcoming Deadlines */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>
              <Clock size={18} color="var(--primary)" /> Upcoming Deadlines
            </h3>
            <Link to="/tasks" className="btn btn-sm btn-secondary">
              View All
            </Link>
          </div>

          <div className="deadlines-list">
            {upcomingDeadlines.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No immediate deadlines! You are all caught up.
              </p>
            ) : (
              upcomingDeadlines.map((task) => {
                const diffDays = Math.ceil(
                  (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={task.id} className="deadline-item">
                    <div className="deadline-item-left">
                      <div className="deadline-icon-pill">
                        <FileCheck size={18} />
                      </div>
                      <div className="deadline-info">
                        <h4>{task.title}</h4>
                        <span>{task.category}</span>
                      </div>
                    </div>

                    <div className="deadline-right">
                      <span className={`badge ${task.priority === 'High' ? 'badge-red' : task.priority === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {task.priority}
                      </span>
                      <span className="deadline-days-badge">
                        {diffDays <= 0 ? 'Due Today' : `In ${diffDays}d`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>
              <Activity size={18} color="var(--accent-purple)" /> Recent Academic Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time updates</span>
          </div>

          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-icon-badge" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>
                <CheckCircle2 size={16} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  Marked <strong>Present</strong> in <strong>Data Structures and Algorithms</strong> lecture.
                </p>
                <span className="activity-time">Today, 10:30 AM</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-badge" style={{ color: 'var(--accent-purple)', background: 'var(--accent-purple-light)' }}>
                <FolderGit2 size={16} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  New discussion in <strong>Campus Navigator</strong>: Samantha updated map render engine.
                </p>
                <span className="activity-time">Today, 10:15 AM</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-badge" style={{ color: 'var(--success)', background: 'var(--success-light)' }}>
                <CheckCheck size={16} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  Completed task <strong>"Packet Tracer Subnetting Lab Assignment"</strong>.
                </p>
                <span className="activity-time">Yesterday, 4:20 PM</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-badge" style={{ color: 'var(--warning)', background: 'var(--warning-light)' }}>
                <Calendar size={16} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  Added <strong>Operating Systems Midterm</strong> to Academic Calendar.
                </p>
                <span className="activity-time">Nov 15, 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Mark Attendance Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        title="Mark Class Attendance"
        subtitle="Log attendance record for today's lecture"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAttendanceModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAttendanceSubmit}
            >
              Save Attendance
            </button>
          </>
        }
      >
        <form onSubmit={handleAttendanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              value={attForm.subjectId}
              onChange={(e) => {
                const sub = subjects.find(s => s.id === e.target.value);
                setAttForm({
                  ...attForm,
                  subjectId: e.target.value,
                  subjectName: sub ? sub.name : ''
                });
              }}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.attended}/{s.totalClasses} classes
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={attForm.status}
                onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
              >
                <option value="Present">Present (Attended)</option>
                <option value="Absent">Absent (Missed)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={attForm.date}
                onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lecture Topic / Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Graph Algorithms, Chapter 4 Review"
              value={attForm.topic}
              onChange={(e) => setAttForm({ ...attForm, topic: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Academic Task"
        subtitle="Add a task, lab assignment, or study milestone"
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
              Create Task
            </button>
          </>
        }
      >
        <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Complete Lab 4 B-Tree implementation"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed instructions, requirements, or test scenarios..."
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject / Course</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="General Academic">General Academic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
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
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
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

export default Dashboard;
