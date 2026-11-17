import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialUserProfile } from '../data/dummyData';
import attendanceService from '../services/attendanceService';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import calendarService from '../services/calendarService';
import notificationService from '../services/notificationService';
import authService from '../services/authService';
import professorService from '../services/professorService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scholarhub_theme') || 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scholarhub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // User Profile (synced with authenticated user)
  const [user, setUser] = useState(() => {
    const current = authService.getCurrentUser();
    if (current) return current;
    const saved = localStorage.getItem('scholarhub_user_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // Student State data
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Professor State data
  const [profSubjects, setProfSubjects] = useState([]);
  const [profAssignments, setProfAssignments] = useState([]);
  const [profSubmissions, setProfSubmissions] = useState([]);
  const [profAnnouncements, setProfAnnouncements] = useState([]);
  const [profStudents, setProfStudents] = useState([]);
  
  // UI & Global state
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info' | 'error' }

  // Load all initial data from services / storage
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [
          subjs, records, tks, projs, evts, notifs,
          pSubjs, pAsgns, pSubms, pAnns, pStudents
        ] = await Promise.all([
          attendanceService.getSubjects(),
          attendanceService.getAttendanceRecords(),
          taskService.getTasks(),
          projectService.getProjects(),
          calendarService.getEvents(),
          notificationService.getNotifications(),
          // Professor data
          professorService.getSubjects(),
          professorService.getAssignments(),
          professorService.getAllSubmissions(),
          professorService.getAnnouncements(),
          professorService.getStudents()
        ]);

        setSubjects(subjs);
        setAttendanceRecords(records);
        setTasks(tks);
        setProjects(projs);
        setCalendarEvents(evts);
        setNotifications(notifs);

        setProfSubjects(pSubjs);
        setProfAssignments(pAsgns);
        setProfSubmissions(pSubms);
        setProfAnnouncements(pAnns);
        setProfStudents(pStudents);
      } catch (error) {
        console.error('Error loading initial application data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- Authentication Methods ---
  const login = async (email, password, expectedRole = null, rememberMe = false) => {
    const res = await authService.login(email, password, expectedRole, rememberMe);
    setCurrentUser(res.user);
    setUser(res.user);
    showToast(`Welcome back, ${res.user.name.split(' ')[0]}!`, 'success');
    return res;
  };

  const register = async (registrationData) => {
    const res = await authService.register(registrationData);
    setCurrentUser(res.user);
    setUser(res.user);
    const roleTitle = res.user.role === 'PROFESSOR' ? 'Professor' : 'Student';
    showToast(`Account created! Welcome to Scholar Hub ${roleTitle} Portal, ${res.user.name.split(' ')[0]}.`, 'success');
    return res;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Signed out of Scholar Hub.', 'info');
  };

  const forgotPassword = async (email) => {
    const res = await authService.forgotPassword(email);
    showToast('Password reset link dispatched.', 'info');
    return res;
  };

  // User Profile Updater
  const updateUserProfile = (newProfile) => {
    const updated = { ...user, ...newProfile };
    setUser(updated);
    if (currentUser) {
      setCurrentUser(updated);
      localStorage.setItem('scholarhub_current_user', JSON.stringify(updated));
    }
    localStorage.setItem('scholarhub_user_profile', JSON.stringify(updated));
    showToast('Profile settings updated successfully!', 'success');
  };

  // --- Student Attendance Handlers ---
  const addSubject = async (subjectData) => {
    const created = await attendanceService.addSubject(subjectData);
    setSubjects(prev => [...prev, created]);
    showToast(`Subject "${created.name}" added successfully.`);
    return created;
  };

  const updateSubjectAttendance = async (subjectId, action) => {
    const updated = await attendanceService.updateSubjectAttendance(subjectId, action);
    setSubjects(prev => prev.map(s => s.id === subjectId ? updated : s));
    showToast(`Updated attendance for ${updated.name}: ${action === 'present' ? '+1 Attended' : '+1 Missed'}`);
  };

  const deleteSubject = async (subjectId) => {
    await attendanceService.deleteSubject(subjectId);
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    showToast('Subject deleted.');
  };

  const markAttendanceRecord = async (recordData) => {
    const record = await attendanceService.markAttendance(recordData);
    setAttendanceRecords(prev => [record, ...prev]);
    const updatedSubjects = await attendanceService.getSubjects();
    setSubjects(updatedSubjects);
    showToast(`Attendance marked as ${record.status} for ${record.subjectName}`);
  };

  const deleteAttendanceRecord = async (recordId) => {
    await attendanceService.deleteRecord(recordId);
    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    showToast('Attendance record removed.');
  };

  // --- Task Handlers ---
  const addTask = async (taskData) => {
    const created = await taskService.createTask(taskData);
    setTasks(prev => [created, ...prev]);
    showToast(`Task "${created.title}" created.`);
    return created;
  };

  const updateTask = async (taskId, updates) => {
    const updated = await taskService.updateTask(taskId, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    showToast(`Task "${updated.title}" updated.`);
    return updated;
  };

  const toggleTaskComplete = async (taskId) => {
    const updated = await taskService.toggleComplete(taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    showToast(updated.completed ? 'Task marked as completed! 🎉' : 'Task reopened.');
    return updated;
  };

  const deleteTask = async (taskId) => {
    await taskService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task deleted successfully.');
  };

  // --- Project Handlers ---
  const addProject = async (projectData) => {
    const created = await projectService.createProject(projectData);
    setProjects(prev => [created, ...prev]);
    showToast(`Project "${created.title}" created!`);
    return created;
  };

  const updateProject = async (projectId, updates) => {
    const updated = await projectService.updateProject(projectId, updates);
    setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
    showToast(`Project "${updated.title}" updated.`);
    return updated;
  };

  const deleteProject = async (projectId) => {
    await projectService.deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    showToast('Project removed.');
  };

  const addProjectTask = async (projectId, taskData) => {
    const updatedProject = await projectService.addProjectTask(projectId, taskData);
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    showToast('Project task added.');
    return updatedProject;
  };

  const toggleProjectTask = async (projectId, taskId) => {
    const updatedProject = await projectService.toggleProjectTask(projectId, taskId);
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    return updatedProject;
  };

  const addProjectComment = async (projectId, commentData) => {
    const updatedProject = await projectService.addComment(projectId, commentData);
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    return updatedProject;
  };

  const addProjectMember = async (projectId, memberData) => {
    const updatedProject = await projectService.addMember(projectId, memberData);
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    showToast(`${memberData.name} added to project team!`);
    return updatedProject;
  };

  // --- Calendar Event Handlers ---
  const addCalendarEvent = async (eventData) => {
    const created = await calendarService.addEvent(eventData);
    setCalendarEvents(prev => [created, ...prev]);
    showToast(`Event "${created.title}" scheduled.`);
    return created;
  };

  const deleteCalendarEvent = async (eventId) => {
    await calendarService.deleteEvent(eventId);
    setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Event removed from calendar.');
  };

  // --- Notification Handlers ---
  const markNotificationAsRead = async (id) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markAllNotificationsAsRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
    showToast('All notifications marked as read.');
  };

  const clearAllNotifications = async () => {
    const updated = await notificationService.clearAll();
    setNotifications(updated);
    showToast('Notification inbox cleared.');
  };

  // ==========================================
  // --- PROFESSOR PORTAL SPECIFIC HANDLERS ---
  // ==========================================

  // Create Professor Subject
  const createProfSubject = async (subjectData) => {
    const created = await professorService.createSubject(subjectData);
    setProfSubjects(prev => [created, ...prev]);
    showToast(`Course "${created.name}" created successfully.`);
    return created;
  };

  const updateProfSubject = async (subjectId, updates) => {
    const updated = await professorService.updateSubject(subjectId, updates);
    setProfSubjects(prev => prev.map(s => s.id === subjectId ? updated : s));
    showToast(`Course "${updated.name}" updated.`);
    return updated;
  };

  const deleteProfSubject = async (subjectId) => {
    await professorService.deleteSubject(subjectId);
    setProfSubjects(prev => prev.filter(s => s.id !== subjectId));
    showToast('Course removed.');
  };

  // Create Professor Assignment
  const createProfAssignment = async (assignmentData) => {
    const created = await professorService.createAssignment(assignmentData);
    setProfAssignments(prev => [created, ...prev]);
    showToast(`Assignment "${created.title}" ${created.status === 'Draft' ? 'saved as draft' : 'published to students'}!`);
    return created;
  };

  const updateProfAssignment = async (id, updates) => {
    const updated = await professorService.updateAssignment(id, updates);
    setProfAssignments(prev => prev.map(a => a.id === id ? updated : a));
    showToast(`Assignment "${updated.title}" updated.`);
    return updated;
  };

  const deleteProfAssignment = async (id) => {
    await professorService.deleteAssignment(id);
    setProfAssignments(prev => prev.filter(a => a.id !== id));
    showToast('Assignment deleted.');
  };

  // Evaluate Student Submission
  const evaluateSubmission = async (submissionId, score, feedback) => {
    const updated = await professorService.evaluateSubmission(submissionId, score, feedback);
    setProfSubmissions(prev => prev.map(s => s.id === submissionId ? updated : s));
    showToast(`Evaluation saved: Score ${score}/${updated.maxMarks}`);
    return updated;
  };

  // Student submits an assignment (Shared workflow)
  const submitStudentAssignment = async (submissionData) => {
    const newSubmission = await professorService.submitAssignment(submissionData);
    setProfSubmissions(prev => [newSubmission, ...prev]);
    // Refresh assignments count
    const updatedAsgns = await professorService.getAssignments();
    setProfAssignments(updatedAsgns);
    showToast(`Assignment "${submissionData.assignmentTitle}" submitted successfully! 🎉`);
    return newSubmission;
  };

  // Professor marks class attendance
  const markClassAttendance = async (subjectId, date, attendanceMap) => {
    const entry = await professorService.markClassAttendance(subjectId, date, attendanceMap);
    showToast(`Class attendance recorded for ${Object.keys(attendanceMap).length} students.`);
    return entry;
  };

  // Create Announcement
  const createAnnouncement = async (annData) => {
    const created = await professorService.createAnnouncement(annData);
    setProfAnnouncements(prev => [created, ...prev]);
    showToast(`Announcement "${created.title}" broadcast to students.`);
    return created;
  };

  const deleteAnnouncement = async (annId) => {
    await professorService.deleteAnnouncement(annId);
    setProfAnnouncements(prev => prev.filter(a => a.id !== annId));
    showToast('Announcement removed.');
  };

  // Computed Student Statistics
  const stats = useMemo(() => {
    let totalClasses = 0;
    let attendedClasses = 0;
    let missedClasses = 0;

    subjects.forEach(s => {
      totalClasses += s.totalClasses || 0;
      attendedClasses += s.attended || 0;
      missedClasses += s.missed || 0;
    });

    const overallAttendance = totalClasses > 0 
      ? Math.round((attendedClasses / totalClasses) * 1000) / 10 
      : 0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed || t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const activeProjects = projects.filter(p => p.status !== 'Completed').length;

    return {
      totalClasses,
      attendedClasses,
      missedClasses,
      overallAttendance,
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      activeProjects
    };
  }, [subjects, tasks, projects]);

  // Computed Professor Statistics
  const profStats = useMemo(() => {
    const totalStudents = profStudents.length > 0 ? 148 : 0; // realistic enrolled total
    const totalSubjects = profSubjects.length;
    const totalAssignments = profAssignments.length;
    const pendingSubmissions = profSubmissions.filter(s => s.status === 'Pending').length;
    const evaluatedAssignments = profSubmissions.filter(s => s.status === 'Evaluated').length;
    const activeProjects = projects.filter(p => p.status !== 'Completed').length;

    return {
      totalStudents,
      totalSubjects,
      totalAssignments,
      pendingSubmissions,
      evaluatedAssignments,
      activeProjects
    };
  }, [profStudents, profSubjects, profAssignments, profSubmissions, projects]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const value = {
    // Theme
    theme,
    toggleTheme,
    // Auth State
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isProfessor: currentUser?.role === 'PROFESSOR',
    isStudent: currentUser?.role === 'STUDENT' || !currentUser?.role,
    login,
    register,
    logout,
    forgotPassword,
    // Profile
    user,
    updateUserProfile,
    // Student Data State
    subjects,
    attendanceRecords,
    tasks,
    projects,
    calendarEvents,
    notifications,
    unreadNotificationsCount,
    searchQuery,
    setSearchQuery,
    loading,
    toast,
    showToast,
    stats,
    // Student Handlers
    addSubject,
    updateSubjectAttendance,
    deleteSubject,
    markAttendanceRecord,
    deleteAttendanceRecord,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    addProjectTask,
    toggleProjectTask,
    addProjectComment,
    addProjectMember,
    addCalendarEvent,
    deleteCalendarEvent,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    // Professor Data & Handlers
    profSubjects,
    profAssignments,
    profSubmissions,
    profAnnouncements,
    profStudents,
    profStats,
    createProfSubject,
    updateProfSubject,
    deleteProfSubject,
    createProfAssignment,
    updateProfAssignment,
    deleteProfAssignment,
    evaluateSubmission,
    submitStudentAssignment,
    markClassAttendance,
    createAnnouncement,
    deleteAnnouncement
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
