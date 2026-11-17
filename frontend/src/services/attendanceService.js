import apiClient, { USE_MOCK_STORAGE } from './api';
import { initialSubjects, initialAttendanceRecords } from '../data/dummyData';

const SUBJECTS_KEY = 'scholarhub_subjects';
const RECORDS_KEY = 'scholarhub_attendance_records';

// Initialize localStorage with initial dummy data if empty
const getStoredSubjects = () => {
  const data = localStorage.getItem(SUBJECTS_KEY);
  if (!data) {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(initialSubjects));
    return initialSubjects;
  }
  return JSON.parse(data);
};

const getStoredRecords = () => {
  const data = localStorage.getItem(RECORDS_KEY);
  if (!data) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(initialAttendanceRecords));
    return initialAttendanceRecords;
  }
  return JSON.parse(data);
};

export const attendanceService = {
  // Fetch all academic subjects with attendance numbers
  async getSubjects(userId = null) {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const activeUserId = userId || currentUser.id || '11111111-1111-1111-1111-111111111111';
        const response = await apiClient.get(`/subjectNew/getAll/${activeUserId}`);
        if (response.data && response.data.length > 0) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local storage subjects');
      }
    }
    return getStoredSubjects();
  },

  // Add a new subject
  async addSubject(newSubject, userId = null) {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const activeUserId = userId || currentUser.id || '11111111-1111-1111-1111-111111111111';
        const response = await apiClient.post(`/subjectNew/add/${activeUserId}/${encodeURIComponent(newSubject.name)}`);
        if (response.data) {
          // Backend created successfully
        }
      } catch (err) {
        console.warn('Backend unavailable, saving subject locally');
      }
    }
    const subjects = getStoredSubjects();
    const created = {
      id: `sub-${Date.now()}`,
      name: newSubject.name,
      code: newSubject.code || `CS${Math.floor(300 + Math.random() * 90)}`,
      instructor: newSubject.instructor || 'TBA',
      room: newSubject.room || 'Room 101',
      totalClasses: Number(newSubject.totalClasses) || 0,
      attended: Number(newSubject.attended) || 0,
      missed: Number(newSubject.missed) || 0,
      color: newSubject.color || '#3b82f6',
      colorLight: '#eff6ff'
    };
    subjects.push(created);
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    return created;
  },

  // Update attendance count (+1 attended or +1 missed)
  async updateSubjectAttendance(subjectId, action) {
    const subjects = getStoredSubjects();
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        const total = s.totalClasses + 1;
        const attended = action === 'present' ? s.attended + 1 : s.attended;
        const missed = action === 'absent' ? s.missed + 1 : s.missed;
        return { ...s, totalClasses: total, attended, missed };
      }
      return s;
    });
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
    return updated.find(s => s.id === subjectId);
  },

  // Delete a subject
  async deleteSubject(subjectId) {
    if (!USE_MOCK_STORAGE) {
      try {
        await apiClient.delete(`/subjectNew/delete/${subjectId}`);
      } catch (err) {
        console.warn('Backend unavailable, removing subject locally');
      }
    }
    const subjects = getStoredSubjects().filter(s => s.id !== subjectId);
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    return true;
  },

  // Get date-wise attendance records log
  async getAttendanceRecords() {
    return getStoredRecords();
  },

  // Mark a new attendance record
  async markAttendance(recordData) {
    const records = getStoredRecords();
    const newRecord = {
      id: `att-rec-${Date.now()}`,
      subjectId: recordData.subjectId,
      subjectName: recordData.subjectName,
      date: recordData.date || new Date().toISOString().split('T')[0],
      status: recordData.status || 'Present',
      time: recordData.time || '10:00 AM - 11:30 AM',
      topic: recordData.topic || 'Class Lecture'
    };
    const updatedRecords = [newRecord, ...records];
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updatedRecords));

    // Also update subject stats
    await this.updateSubjectAttendance(recordData.subjectId, recordData.status.toLowerCase() === 'present' ? 'present' : 'absent');
    return newRecord;
  },

  // Delete attendance record
  async deleteRecord(recordId) {
    const records = getStoredRecords().filter(r => r.id !== recordId);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return true;
  }
};

export default attendanceService;
