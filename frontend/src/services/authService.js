import apiClient, { USE_MOCK_STORAGE, API_BASE_URL } from './api';
import { initialUserProfile, initialProfessorProfile } from '../data/dummyData';

const TOKEN_KEY = 'scholarhub_auth_token';
const CURRENT_USER_KEY = 'scholarhub_current_user';
const USERS_KEY = 'scholarhub_registered_users';
const REMEMBER_KEY = 'scholarhub_remember_email';

// Default Student Demo Account
const defaultDemoStudent = {
  id: '11111111-1111-1111-1111-111111111111',
  name: initialUserProfile.name || 'Alex Morgan',
  email: initialUserProfile.email || 'alex.morgan@scholarhub.edu',
  password: 'password123',
  role: 'STUDENT',
  studentId: initialUserProfile.studentId || 'CS-2024-0492',
  department: initialUserProfile.department || 'Computer Science & Engineering',
  semester: initialUserProfile.semester || '5th Semester',
  university: initialUserProfile.university || 'Metropolitan Institute of Technology',
  avatar: initialUserProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: initialUserProfile.bio || 'Junior CS Student passionate about Distributed Systems & Full-Stack Development.',
  targetAttendance: 75,
  createdAt: '2026-09-01'
};

// Default Professor Demo Account
const defaultDemoProfessor = {
  id: '22222222-2222-2222-2222-222222222222',
  name: initialProfessorProfile?.name || 'Dr. Alistair Vance',
  email: initialProfessorProfile?.email || 'dr.vance@scholarhub.edu',
  password: 'password123',
  role: 'PROFESSOR',
  employeeId: initialProfessorProfile?.employeeId || 'FAC-CS-101',
  department: initialProfessorProfile?.department || 'Computer Science & Engineering',
  designation: initialProfessorProfile?.designation || 'Professor & Department Chair',
  university: initialProfessorProfile?.university || 'Metropolitan Institute of Technology',
  officeRoom: initialProfessorProfile?.officeRoom || 'Faculty Block B, Room 412',
  officeHours: initialProfessorProfile?.officeHours || 'Mon & Wed: 02:00 PM - 04:30 PM',
  avatar: initialProfessorProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  bio: initialProfessorProfile?.bio || 'Senior Professor of Computer Systems & Algorithms with 16 years of academic research and graduate teaching.',
  isVerified: true,
  createdAt: '2024-01-15'
};

// Helper: retrieve registered users list from localStorage
const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    let list = raw ? JSON.parse(raw) : [];

    // Ensure default demo student is present
    if (!list.some(u => u.email.toLowerCase() === defaultDemoStudent.email.toLowerCase())) {
      list.push(defaultDemoStudent);
    }
    // Ensure default demo professor is present
    if (!list.some(u => u.email.toLowerCase() === defaultDemoProfessor.email.toLowerCase())) {
      list.push(defaultDemoProfessor);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    return [defaultDemoStudent, defaultDemoProfessor];
  }
};

/**
 * Authentication Service
 * 
 * Note: The localStorage authentication implementation is a client-side simulation 
 * for demonstration and development purposes. It is NOT intended to be production-secure.
 * In production, authentication must be validated via the Spring Boot backend using JWT/Session tokens.
 */
export const authService = {
  // Login user with role check
  async login(email, password, expectedRole = null, rememberMe = false) {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. If backend API integration is active:
    if (!USE_MOCK_STORAGE) {
      try {
        const response = await apiClient.post('/auth/login', {
          email: normalizedEmail,
          password
        });
        const data = response.data;
        const user = data.user || data;
        const token = data.token || `scholarhub_jwt_${user.id || 'session'}_${Date.now()}`;
        if (user && (user.id || user.email)) {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          localStorage.setItem('scholarhub_user_profile', JSON.stringify(user));
          if (rememberMe) {
            localStorage.setItem(REMEMBER_KEY, normalizedEmail);
          } else {
            localStorage.removeItem(REMEMBER_KEY);
          }
          return { success: true, user, token };
        }
      } catch (err) {
        console.warn('[authService] Backend login call failed, falling back to local credentials validation:', err.message);
      }
    }

    // 2. Local fallback authentication (demo mode)
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getRegisteredUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!matchedUser) {
      throw new Error('No academic account found with this email address.');
    }

    if (matchedUser.password !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    // Role validation
    if (expectedRole && matchedUser.role && matchedUser.role.toUpperCase() !== expectedRole.toUpperCase()) {
      const actualRole = matchedUser.role === 'PROFESSOR' ? 'Professor' : 'Student';
      const wantedRole = expectedRole === 'PROFESSOR' ? 'Professor' : 'Student';
      throw new Error(`This account is registered as a ${actualRole}. Please select "${wantedRole} Login" instead.`);
    }

    // Check professor verification status
    if (matchedUser.role === 'PROFESSOR' && matchedUser.isVerified === false) {
      throw new Error('Your professor account is pending institutional approval. Please contact administration.');
    }

    // Generate simulated JWT auth token
    const simulatedToken = `scholarhub_jwt_${matchedUser.id}_${Date.now()}`;
    const safeUser = { ...matchedUser };
    delete safeUser.password;

    localStorage.setItem(TOKEN_KEY, simulatedToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem('scholarhub_user_profile', JSON.stringify(safeUser));

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, normalizedEmail);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    return {
      success: true,
      user: safeUser,
      token: simulatedToken
    };
  },

  // Register a new user account (Student or Professor)
  async register(registrationData) {
    const normalizedEmail = registrationData.email.trim().toLowerCase();
    const role = (registrationData.role || 'STUDENT').toUpperCase();

    // 1. If backend API integration is active:
    if (!USE_MOCK_STORAGE) {
      try {
        const response = await apiClient.post('/auth/register', registrationData);
        const data = response.data;
        const user = data.user || data;
        const token = data.token || `scholarhub_jwt_${user.id || 'session'}_${Date.now()}`;
        if (user && (user.id || user.email)) {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          localStorage.setItem('scholarhub_user_profile', JSON.stringify(user));
          return { success: true, user, token };
        }
      } catch (err) {
        console.warn('[authService] Backend registration failed, falling back to local storage:', err.message);
      }
    }

    // 2. Local fallback registration
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // Generate avatar seed from user's initials
    const avatarSeed = encodeURIComponent(registrationData.name.trim());
    const isProfessor = role === 'PROFESSOR';

    const newUser = {
      id: `${isProfessor ? 'prof' : 'stu'}-${Date.now()}`,
      name: registrationData.name.trim(),
      email: normalizedEmail,
      password: registrationData.password,
      role: role,
      department: registrationData.department?.trim() || 'Computer Science & Engineering',
      university: registrationData.university?.trim() || 'Metropolitan Institute of Technology',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
      createdAt: new Date().toISOString().split('T')[0],
      // Student specific
      ...(isProfessor ? {} : {
        studentId: registrationData.studentId?.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        semester: registrationData.semester || '1st Semester',
        targetAttendance: 75,
        bio: `Undergraduate student in ${registrationData.department || 'Computer Science'}.`
      }),
      // Professor specific
      ...(isProfessor ? {
        employeeId: registrationData.employeeId?.trim() || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        designation: registrationData.designation || 'Assistant Professor',
        officeRoom: registrationData.officeRoom || 'Room 302',
        officeHours: registrationData.officeHours || 'Tue & Thu: 02:00 PM - 04:00 PM',
        bio: `${registrationData.designation || 'Faculty Member'} in the Department of ${registrationData.department || 'Computer Science'}.`,
        isVerified: true // Auto-approved for development/demo
      } : {})
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login after registration
    const simulatedToken = `scholarhub_jwt_${newUser.id}_${Date.now()}`;
    const safeUser = { ...newUser };
    delete safeUser.password;

    localStorage.setItem(TOKEN_KEY, simulatedToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem('scholarhub_user_profile', JSON.stringify(safeUser));

    return {
      success: true,
      user: safeUser,
      token: simulatedToken
    };
  },

  // Forgot password request (simulates reset link dispatch)
  async forgotPassword(email) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!USE_MOCK_STORAGE) {
      try {
        const response = await apiClient.post('/auth/forgot-password', { email: normalizedEmail });
        return response.data;
      } catch (err) {
        console.warn('[authService] Backend forgot-password call failed, continuing locally:', err.message);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getRegisteredUsers();
    const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);

    if (!exists) {
      throw new Error('No academic account associated with this email address was found.');
    }

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${normalizedEmail}.`
    };
  },

  // Logout user
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  },

  // Check if currently authenticated
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return Boolean(token && user);
  },

  // Get current session user
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Get current auth token
  getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get remembered email if any
  getRememberedEmail() {
    return localStorage.getItem(REMEMBER_KEY) || '';
  }
};

export default authService;
