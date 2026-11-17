import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Trash2,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import '../styles/Calendar.css';

const Calendar = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, subjects } = useApp();

  // Current view date (defaults to Nov 2026 or current system date)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDateStr, setSelectedDateStr] = useState('2026-11-20');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'assignment',
    date: '2026-11-20',
    time: '11:59 PM',
    subject: subjects[0]?.name || 'Data Structures and Algorithms',
    description: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dayNumber: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNumber: i, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete 35 or 42 cells
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNumber: i, dateStr, isCurrentMonth: false });
  }

  // Filter events for selected date
  const selectedDateEvents = calendarEvents.filter(e => e.date === selectedDateStr);

  // Handle Add Event Submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    await addCalendarEvent(eventForm);
    setIsAddModalOpen(false);
    setEventForm({
      title: '',
      category: 'assignment',
      date: selectedDateStr,
      time: '11:59 PM',
      subject: subjects[0]?.name || 'General Academic',
      description: ''
    });
  };

  return (
    <div className="calendar-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Academic Calendar</h1>
          <p>Schedule and track exam dates, homework deadlines, and team deliverables.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEventForm(prev => ({ ...prev, date: selectedDateStr }));
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Calendar Controls & Legend */}
      <div className="calendar-controls-card">
        <div className="month-navigation">
          <h2 className="month-title">{monthNames[month]} {year}</h2>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button className="btn-icon" onClick={handlePrevMonth} title="Previous month">
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-sm btn-secondary" onClick={handleToday}>
              Today
            </button>
            <button className="btn-icon" onClick={handleNextMonth} title="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Categories Legend */}
        <div className="calendar-category-legend">
          <div className="legend-item">
            <span className="legend-dot assignment" />
            <span>Assignments</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot project" />
            <span>Projects</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot exam" />
            <span>Exams & Tests</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot event" />
            <span>Campus Events</span>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid & Day Details */}
      <div className="calendar-main-grid">
        {/* Month View Table */}
        <div className="calendar-table-card">
          <div className="days-header-row">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="day-header-cell">{d}</div>
            ))}
          </div>

          <div className="month-days-grid">
            {calendarDays.map((cell, idx) => {
              const dayEvents = calendarEvents.filter(e => e.date === cell.dateStr);
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={idx}
                  className={`day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                >
                  <span className="day-number">{cell.dayNumber}</span>
                  <div className="day-events-stack">
                    {dayEvents.slice(0, 3).map(ev => (
                      <span
                        key={ev.id}
                        className={`event-chip ${ev.category}`}
                        title={`${ev.title} (${ev.time})`}
                      >
                        {ev.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="day-details-panel">
          <div className="day-details-header">
            <div>
              <h3>Agenda for {selectedDateStr}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedDateEvents.length} event{selectedDateEvents.length === 1 ? '' : 's'} scheduled
              </span>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setEventForm(prev => ({ ...prev, date: selectedDateStr }));
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="day-events-detailed-list">
            {selectedDateEvents.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <CalendarIcon size={24} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                <p>No events scheduled for this day.</p>
              </div>
            ) : (
              selectedDateEvents.map(ev => (
                <div key={ev.id} className="detailed-event-item">
                  <div className="detailed-event-top">
                    <span className={`badge ${ev.category === 'exam' ? 'badge-red' : ev.category === 'assignment' ? 'badge-purple' : ev.category === 'project' ? 'badge-blue' : 'badge-yellow'}`}>
                      {ev.category}
                    </span>
                    <button
                      className="btn-icon"
                      style={{ width: '22px', height: '22px', color: 'var(--danger)' }}
                      onClick={() => deleteCalendarEvent(ev.id)}
                      title="Delete Event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <h4 className="detailed-event-title">{ev.title}</h4>

                  <div className="detailed-event-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {ev.time}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <BookOpen size={12} /> {ev.subject}
                    </span>
                  </div>

                  {ev.description && (
                    <p className="detailed-event-desc">{ev.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Calendar Event */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Academic Event"
        subtitle="Add a new assignment deadline, exam date, or event to your schedule"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleEventSubmit}
            >
              Schedule Event
            </button>
          </>
        }
      >
        <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              placeholder="e.g. Operating Systems Final Lab Exam"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
              >
                <option value="assignment">Assignment Deadline</option>
                <option value="project">Project Milestone</option>
                <option value="exam">Examination / Quiz</option>
                <option value="event">Academic / Campus Event</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Course</label>
              <select
                value={eventForm.subject}
                onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="General Academic">General Academic</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="text"
                placeholder="e.g. 11:59 PM or 10:00 AM"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea
              rows={3}
              placeholder="Room location, syllabus chapters, or submission portal link..."
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Calendar;
