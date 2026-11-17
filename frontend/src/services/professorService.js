import apiClient, { USE_MOCK_STORAGE } from './api';
import {
  initialProfessorSubjects,
  initialStudentsRoster,
  initialAssignments,
  initialSubmissions,
  initialAnnouncements
} from '../data/dummyData';

const PROF_SUBJECTS_KEY = 'scholarhub_prof_subjects';
const PROF_ASSIGNMENTS_KEY = 'scholarhub_prof_assignments';
const PROF_SUBMISSIONS_KEY = 'scholarhub_prof_submissions';
const PROF_ANNOUNCEMENTS_KEY = 'scholarhub_prof_announcements';
const PROF_STUDENTS_KEY = 'scholarhub_prof_students';
const CLASS_ATTENDANCE_KEY = 'scholarhub_class_attendance';

// Helper get / init localStorage
const getStored = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
};

export const professorService = {
  // --- Subject Management ---
  async getSubjects(professorId = null) {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const activeProfId = professorId || currentUser.id || '22222222-2222-2222-2222-222222222222';
        const res = await apiClient.get(`/subjectNew/getAll/${activeProfId}`);
        if (res.data && res.data.length > 0) return res.data;
      } catch (e) {
        console.warn('Backend unavailable, falling back to local professor subjects');
      }
    }
    return getStored(PROF_SUBJECTS_KEY, initialProfessorSubjects);
  },

  async createSubject(subjectData) {
    const list = getStored(PROF_SUBJECTS_KEY, initialProfessorSubjects);
    const newSubj = {
      id: `sub-${Date.now()}`,
      name: subjectData.name,
      code: subjectData.code || `CS${Math.floor(300 + Math.random() * 90)}`,
      department: subjectData.department || 'Computer Science & Engineering',
      semester: subjectData.semester || '5th Semester',
      room: subjectData.room || 'Room TBA',
      schedule: subjectData.schedule || 'TBA',
      enrolledCount: 0,
      avgAttendance: 100,
      totalClasses: 0,
      color: subjectData.color || '#3b82f6'
    };
    const updated = [newSubj, ...list];
    localStorage.setItem(PROF_SUBJECTS_KEY, JSON.stringify(updated));
    return newSubj;
  },

  async updateSubject(subjectId, updates) {
    const list = getStored(PROF_SUBJECTS_KEY, initialProfessorSubjects);
    const updated = list.map(s => s.id === subjectId ? { ...s, ...updates } : s);
    localStorage.setItem(PROF_SUBJECTS_KEY, JSON.stringify(updated));
    return updated.find(s => s.id === subjectId);
  },

  async deleteSubject(subjectId) {
    const list = getStored(PROF_SUBJECTS_KEY, initialProfessorSubjects);
    const filtered = list.filter(s => s.id !== subjectId);
    localStorage.setItem(PROF_SUBJECTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // --- Student Management ---
  async getStudents() {
    return getStored(PROF_STUDENTS_KEY, initialStudentsRoster);
  },

  async getStudentsBySubject(subjectId) {
    const students = getStored(PROF_STUDENTS_KEY, initialStudentsRoster);
    if (!subjectId || subjectId === 'all') return students;
    return students.filter(s => s.enrolledSubjects?.includes(subjectId));
  },

  async enrollStudent(subjectId, studentData) {
    const students = getStored(PROF_STUDENTS_KEY, initialStudentsRoster);
    const updated = students.map(s => {
      if (s.id === studentData.id) {
        const subjects = s.enrolledSubjects ? [...new Set([...s.enrolledSubjects, subjectId])] : [subjectId];
        return { ...s, enrolledSubjects: subjects };
      }
      return s;
    });
    localStorage.setItem(PROF_STUDENTS_KEY, JSON.stringify(updated));
    return true;
  },

  // --- Assignment Management ---
  async getAssignments(professorId = null) {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const activeProfId = professorId || currentUser.id || '22222222-2222-2222-2222-222222222222';
        const res = await apiClient.get(`/professor/assignments/getAll/${activeProfId}`);
        if (res.data && res.data.length > 0) return res.data;
      } catch (e) {
        console.warn('Backend unavailable, falling back to local assignments');
      }
    }
    return getStored(PROF_ASSIGNMENTS_KEY, initialAssignments);
  },

  async createAssignment(assignmentData) {
    const list = getStored(PROF_ASSIGNMENTS_KEY, initialAssignments);
    const newAsgn = {
      id: `asgn-${Date.now()}`,
      subjectId: assignmentData.subjectId,
      subjectName: assignmentData.subjectName,
      title: assignmentData.title,
      description: assignmentData.description || '',
      maxMarks: Number(assignmentData.maxMarks) || 100,
      startDate: assignmentData.startDate || new Date().toISOString().split('T')[0],
      deadline: assignmentData.deadline,
      status: assignmentData.status || 'Published', // Published, Draft
      totalSubmissions: 0,
      attachment: assignmentData.attachment || 'Assignment_Guidelines.pdf'
    };
    const updated = [newAsgn, ...list];
    localStorage.setItem(PROF_ASSIGNMENTS_KEY, JSON.stringify(updated));
    return newAsgn;
  },

  async updateAssignment(id, updates) {
    const list = getStored(PROF_ASSIGNMENTS_KEY, initialAssignments);
    const updated = list.map(a => a.id === id ? { ...a, ...updates } : a);
    localStorage.setItem(PROF_ASSIGNMENTS_KEY, JSON.stringify(updated));
    return updated.find(a => a.id === id);
  },

  async deleteAssignment(id) {
    const list = getStored(PROF_ASSIGNMENTS_KEY, initialAssignments);
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(PROF_ASSIGNMENTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // --- Submission Management ---
  async getAllSubmissions() {
    return getStored(PROF_SUBMISSIONS_KEY, initialSubmissions);
  },

  async getSubmissionsByAssignment(assignmentId) {
    const list = getStored(PROF_SUBMISSIONS_KEY, initialSubmissions);
    return list.filter(s => s.assignmentId === assignmentId);
  },

  async evaluateSubmission(submissionId, score, feedback) {
    if (!USE_MOCK_STORAGE) {
      try {
        const res = await apiClient.put(`/professor/submissions/evaluate/${submissionId}`, { score, feedback });
        return res.data;
      } catch (e) {
        console.warn('Backend unavailable, evaluating submission locally');
      }
    }
    const list = getStored(PROF_SUBMISSIONS_KEY, initialSubmissions);
    const updated = list.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          score: Number(score),
          feedback: feedback || '',
          status: 'Evaluated'
        };
      }
      return s;
    });
    localStorage.setItem(PROF_SUBMISSIONS_KEY, JSON.stringify(updated));
    return updated.find(s => s.id === submissionId);
  },

  // Student submits an assignment
  async submitAssignment(submissionData) {
    const list = getStored(PROF_SUBMISSIONS_KEY, initialSubmissions);
    const newSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId: submissionData.assignmentId,
      assignmentTitle: submissionData.assignmentTitle,
      subjectId: submissionData.subjectId,
      subjectName: submissionData.subjectName,
      studentId: submissionData.studentId || 'stu-1',
      studentName: submissionData.studentName || 'Alex Morgan',
      studentEmail: submissionData.studentEmail || 'alex.morgan@scholarhub.edu',
      avatar: submissionData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOnTime: true,
      fileUrl: submissionData.fileName || 'assignment_submission.zip',
      fileSize: '1.2 MB',
      notes: submissionData.notes || '',
      status: 'Pending',
      score: null,
      maxMarks: submissionData.maxMarks || 100,
      feedback: ''
    };
    const updated = [newSubmission, ...list];
    localStorage.setItem(PROF_SUBMISSIONS_KEY, JSON.stringify(updated));

    // Update assignment submission count
    const assignments = getStored(PROF_ASSIGNMENTS_KEY, initialAssignments);
    const updatedAsgns = assignments.map(a => a.id === submissionData.assignmentId ? { ...a, totalSubmissions: (a.totalSubmissions || 0) + 1 } : a);
    localStorage.setItem(PROF_ASSIGNMENTS_KEY, JSON.stringify(updatedAsgns));

    return newSubmission;
  },

  // --- Attendance Management ---
  async markClassAttendance(subjectId, date, attendanceMap) {
    const records = getStored(CLASS_ATTENDANCE_KEY, []);
    const key = `${subjectId}_${date}`;
    const newEntry = {
      key,
      subjectId,
      date,
      attendance: attendanceMap, // { [studentId]: 'Present' | 'Absent' }
      timestamp: new Date().toISOString()
    };
    const filtered = records.filter(r => r.key !== key);
    filtered.push(newEntry);
    localStorage.setItem(CLASS_ATTENDANCE_KEY, JSON.stringify(filtered));
    return newEntry;
  },

  async getClassAttendance(subjectId, date) {
    const records = getStored(CLASS_ATTENDANCE_KEY, []);
    return records.find(r => r.subjectId === subjectId && r.date === date);
  },

  // --- Announcements ---
  async getAnnouncements(professorId = 'prof-1') {
    if (!USE_MOCK_STORAGE) {
      try {
        const res = await apiClient.get(`/professor/announcements/getAll/${professorId}`);
        return res.data;
      } catch (e) {
        console.warn('Backend unavailable, falling back to local announcements');
      }
    }
    return getStored(PROF_ANNOUNCEMENTS_KEY, initialAnnouncements);
  },

  async createAnnouncement(announcementData) {
    const list = getStored(PROF_ANNOUNCEMENTS_KEY, initialAnnouncements);
    const newAnn = {
      id: `ann-${Date.now()}`,
      subjectId: announcementData.subjectId || 'all',
      subjectName: announcementData.subjectName || 'All Courses',
      title: announcementData.title,
      content: announcementData.content,
      priority: announcementData.priority || 'Normal', // Normal, Important, Urgent
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: announcementData.author || 'Dr. Alistair Vance'
    };
    const updated = [newAnn, ...list];
    localStorage.setItem(PROF_ANNOUNCEMENTS_KEY, JSON.stringify(updated));
    return newAnn;
  },

  async deleteAnnouncement(id) {
    const list = getStored(PROF_ANNOUNCEMENTS_KEY, initialAnnouncements);
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(PROF_ANNOUNCEMENTS_KEY, JSON.stringify(filtered));
    return true;
  }
};

export default professorService;
