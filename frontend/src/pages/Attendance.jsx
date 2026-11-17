import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Calendar,
  Filter,
  Trash2,
  BookOpen,
  PieChart,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import '../styles/Attendance.css';

const Attendance = () => {
  const {
    subjects,
    attendanceRecords,
    stats,
    updateSubjectAttendance,
    deleteSubject,
    markAttendanceRecord,
    deleteAttendanceRecord,
    addSubject,
    searchQuery
  } = useApp();

  // Modals state
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);

  // Filters for History Table
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Mark Attendance Form State
  const [recordForm, setRecordForm] = useState({
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    status: 'Present',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 11:30 AM',
    topic: ''
  });

  // Add Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    instructor: '',
    room: '',
    totalClasses: 0,
    attended: 0,
    missed: 0,
    color: '#3b82f6'
  });

  // Calculate safe bunk / shortfall advice for a subject (75% threshold)
  const getAttendanceAdvice = (attended, total) => {
    if (total === 0) return { text: 'No lectures held yet.', type: 'safe' };
    const percentage = (attended / total) * 100;
    if (percentage >= 75) {
      // How many classes can be missed: attended / (total + x) >= 0.75 => x <= (attended / 0.75) - total
      const canMiss = Math.floor(attended / 0.75 - total);
      if (canMiss > 0) {
        return {
          text: `You can safely miss ${canMiss} more lecture${canMiss > 1 ? 's' : ''} and stay ≥ 75%.`,
          type: 'safe'
        };
      }
      return {
        text: 'On the border! Cannot miss the next lecture.',
        type: 'warning'
      };
    } else {
      // Need to attend: (attended + y) / (total + y) >= 0.75 => y >= 3*total - 4*attended
      const mustAttend = Math.ceil(3 * total - 4 * attended);
      return {
        text: `Attendance is low! Must attend next ${mustAttend} consecutive class${mustAttend > 1 ? 'es' : ''} to reach 75%.`,
        type: percentage >= 65 ? 'warning' : 'danger'
      };
    }
  };

  // Color helper based on percentage
  const getStatusColor = (percentage) => {
    if (percentage >= 75) return { color: '#10b981', label: 'Good Attendance', class: 'safe' };
    if (percentage >= 65) return { color: '#f59e0b', label: 'Needs Attention', class: 'warning' };
    return { color: '#ef4444', label: 'Low Attendance', class: 'danger' };
  };

  // Filtered subjects based on search query
  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered attendance history records
  const filteredRecords = attendanceRecords.filter(r => {
    const matchesSubject = subjectFilter === 'All' || r.subjectId === subjectFilter || r.subjectName === subjectFilter;
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = !searchQuery ||
      r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStatus && matchesSearch;
  });

  // Handle Mark Attendance submission
  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    const selSubj = subjects.find(s => s.id === recordForm.subjectId) || subjects[0];
    await markAttendanceRecord({
      ...recordForm,
      subjectId: selSubj.id,
      subjectName: selSubj.name
    });
    setIsMarkModalOpen(false);
    setRecordForm({
      ...recordForm,
      topic: ''
    });
  };

  // Handle Add Subject submission
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim()) return;
    await addSubject(subjectForm);
    setSubjectForm({
      name: '',
      code: '',
      instructor: '',
      room: '',
      totalClasses: 0,
      attended: 0,
      missed: 0,
      color: '#3b82f6'
    });
    setIsNewSubjectModalOpen(false);
  };

  return (
    <div className="attendance-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Attendance Management</h1>
          <p>Monitor your course attendance percentages, minimum 75% thresholds, and lecture logs.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setIsNewSubjectModalOpen(true)}
          >
            <Plus size={16} /> Add Subject
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsMarkModalOpen(true)}
          >
            <CheckCircle2 size={16} /> Mark Today's Attendance
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="attendance-summary-cards">
        <div className="attendance-kpi-card">
          <div className="kpi-icon-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <PieChart size={24} />
          </div>
          <div className="kpi-info">
            <h4>Overall Percentage</h4>
            <div className="kpi-value" style={{ color: stats.overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
              {stats.overallAttendance}%
            </div>
            <span>Academic Target: 75%</span>
          </div>
        </div>

        <div className="attendance-kpi-card">
          <div className="kpi-icon-pill" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="kpi-info">
            <h4>Classes Attended</h4>
            <div className="kpi-value">{stats.attendedClasses}</div>
            <span>Present across all courses</span>
          </div>
        </div>

        <div className="attendance-kpi-card">
          <div className="kpi-icon-pill" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <XCircle size={24} />
          </div>
          <div className="kpi-info">
            <h4>Classes Missed</h4>
            <div className="kpi-value">{stats.missedClasses}</div>
            <span>Unattended lectures</span>
          </div>
        </div>

        <div className="attendance-kpi-card">
          <div className="kpi-icon-pill" style={{ background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}>
            <BookOpen size={24} />
          </div>
          <div className="kpi-info">
            <h4>Enrolled Subjects</h4>
            <div className="kpi-value">{subjects.length}</div>
            <span>Active courses this term</span>
          </div>
        </div>
      </div>

      {/* Subject Wise Cards Grid */}
      <div>
        <div className="subjects-section-header">
          <h3>Subject-Wise Attendance Overview</h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Showing {filteredSubjects.length} courses
          </span>
        </div>

        <div className="subjects-grid">
          {filteredSubjects.map((subject) => {
            const pct = subject.totalClasses > 0
              ? Math.round((subject.attended / subject.totalClasses) * 1000) / 10
              : 0;
            const statusInfo = getStatusColor(pct);
            const advice = getAttendanceAdvice(subject.attended, subject.totalClasses);

            return (
              <div key={subject.id} className="subject-card">
                <div className="subject-card-header">
                  <div>
                    <span className="subject-code-tag">{subject.code}</span>
                    <h4 className="subject-title">{subject.name}</h4>
                    <span className="subject-instructor">
                      {subject.instructor} • {subject.room || 'Room TBA'}
                    </span>
                  </div>
                  <button
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${subject.name}?`)) {
                        deleteSubject(subject.id);
                      }
                    }}
                    title="Remove Subject"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="subject-stats-row">
                  <div className="stat-item">
                    <span className="stat-item-label">Total</span>
                    <span className="stat-item-val">{subject.totalClasses}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-item-label">Attended</span>
                    <span className="stat-item-val" style={{ color: 'var(--success)' }}>
                      {subject.attended}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-item-label">Missed</span>
                    <span className="stat-item-val" style={{ color: 'var(--danger)' }}>
                      {subject.missed}
                    </span>
                  </div>
                </div>

                <div className="subject-progress-container">
                  <div className="progress-header">
                    <span className={`badge ${statusInfo.class === 'safe' ? 'badge-green' : statusInfo.class === 'warning' ? 'badge-yellow' : 'badge-red'}`}>
                      {statusInfo.label}
                    </span>
                    <span className="percentage" style={{ color: statusInfo.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="subject-progress-bar">
                    <div
                      className="subject-progress-fill"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: statusInfo.color
                      }}
                    />
                  </div>
                </div>

                <div className={`attendance-advice ${advice.type}`}>
                  {advice.text}
                </div>

                <div className="subject-quick-actions">
                  <button
                    className="btn btn-sm btn-mark-present"
                    onClick={() => updateSubjectAttendance(subject.id, 'present')}
                    title="Quick log: attended lecture"
                  >
                    +1 Attended
                  </button>
                  <button
                    className="btn btn-sm btn-mark-absent"
                    onClick={() => updateSubjectAttendance(subject.id, 'absent')}
                    title="Quick log: missed lecture"
                  >
                    +1 Missed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date-wise Attendance Records / History Log */}
      <div className="attendance-history-card">
        <div className="history-filters-bar">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Attendance Records Log</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Recent date-wise lecture check-ins and absences
            </p>
          </div>

          <div className="filter-controls">
            <select
              className="filter-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>
        </div>

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Date</th>
                <th>Lecture Time</th>
                <th>Topic / Agenda</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No attendance records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600 }}>{rec.subjectName}</td>
                    <td>{rec.date}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rec.time || 'Regular Schedule'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rec.topic || 'Class Lecture'}</td>
                    <td>
                      <span className={`table-status-pill ${rec.status.toLowerCase()}`}>
                        {rec.status === 'Present' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        style={{ width: '26px', height: '26px', color: 'var(--danger)' }}
                        onClick={() => deleteAttendanceRecord(rec.id)}
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Mark Attendance */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Mark Attendance Record"
        subtitle="Record your attendance for a specific lecture session"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsMarkModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleMarkSubmit}
            >
              Save Record
            </button>
          </>
        }
      >
        <form onSubmit={handleMarkSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select
              value={recordForm.subjectId}
              onChange={(e) => {
                const sel = subjects.find(s => s.id === e.target.value);
                setRecordForm({
                  ...recordForm,
                  subjectId: e.target.value,
                  subjectName: sel ? sel.name : ''
                });
              }}
              required
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={recordForm.date}
                onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={recordForm.status}
                onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value })}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Class Timing</label>
            <input
              type="text"
              placeholder="e.g. 09:00 AM - 10:30 AM"
              value={recordForm.time}
              onChange={(e) => setRecordForm({ ...recordForm, time: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lecture Topic / Notes</label>
            <input
              type="text"
              placeholder="e.g. Dynamic Programming & Memoization"
              value={recordForm.topic}
              onChange={(e) => setRecordForm({ ...recordForm, topic: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Modal: Add New Subject */}
      <Modal
        isOpen={isNewSubjectModalOpen}
        onClose={() => setIsNewSubjectModalOpen(false)}
        title="Add New Academic Course"
        subtitle="Add a new enrolled course to monitor attendance"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsNewSubjectModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubjectSubmit}
            >
              Add Course
            </button>
          </>
        }
      >
        <form onSubmit={handleSubjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Course Name *</label>
            <input
              type="text"
              placeholder="e.g. Artificial Intelligence & Machine Learning"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input
                type="text"
                placeholder="e.g. CS401"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instructor</label>
              <input
                type="text"
                placeholder="e.g. Dr. Alan Turing"
                value={subjectForm.instructor}
                onChange={(e) => setSubjectForm({ ...subjectForm, instructor: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Initial Classes Attended</label>
              <input
                type="number"
                min="0"
                value={subjectForm.attended}
                onChange={(e) => {
                  const att = Number(e.target.value);
                  setSubjectForm({
                    ...subjectForm,
                    attended: att,
                    totalClasses: att + subjectForm.missed
                  });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Classes Missed</label>
              <input
                type="number"
                min="0"
                value={subjectForm.missed}
                onChange={(e) => {
                  const mis = Number(e.target.value);
                  setSubjectForm({
                    ...subjectForm,
                    missed: mis,
                    totalClasses: subjectForm.attended + mis
                  });
                }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
