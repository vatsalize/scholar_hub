// ScholarHub Initial Dummy / Fallback Data Fixtures

export const initialUserProfile = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Alex Morgan',
  email: 'alex.morgan@scholarhub.edu',
  role: 'STUDENT',
  studentId: 'CS-2024-0492',
  department: 'Computer Science & Engineering',
  semester: '5th Semester',
  university: 'Metropolitan Institute of Technology',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Junior CS Student passionate about Distributed Systems & Full-Stack Development.',
  targetAttendance: 75,
  phone: '+1 (555) 234-5678',
  address: 'Room 304, Campus Residence Hall A',
  createdAt: '2026-09-01'
};

export const initialProfessorProfile = {
  id: '22222222-2222-2222-2222-222222222222',
  name: 'Dr. Alistair Vance',
  email: 'dr.vance@scholarhub.edu',
  role: 'PROFESSOR',
  employeeId: 'FAC-CS-101',
  department: 'Computer Science & Engineering',
  designation: 'Professor & Department Chair',
  university: 'Metropolitan Institute of Technology',
  officeRoom: 'Faculty Block B, Room 412',
  officeHours: 'Mon & Wed: 02:00 PM - 04:30 PM',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  bio: 'Senior Professor of Computer Systems & Algorithms with 16 years of academic research and graduate teaching.',
  isVerified: true,
  createdAt: '2024-01-15'
};

export const initialSubjects = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    faculty: 'Dr. Alistair Vance',
    room: 'Hall 101',
    totalClasses: 36,
    attendedClasses: 31,
    targetAttendance: 75,
    credits: 4,
    color: '#3b82f6'
  },
  {
    id: 'sub-2',
    name: 'Database Management Systems',
    code: 'CS302',
    faculty: 'Prof. Evelyn Reed',
    room: 'Lab 3',
    totalClasses: 32,
    attendedClasses: 27,
    targetAttendance: 75,
    credits: 4,
    color: '#10b981'
  },
  {
    id: 'sub-3',
    name: 'Operating Systems',
    code: 'CS303',
    faculty: 'Dr. Marcus Sterling',
    room: 'Room 204',
    totalClasses: 30,
    attendedClasses: 22,
    targetAttendance: 75,
    credits: 3,
    color: '#f59e0b'
  },
  {
    id: 'sub-4',
    name: 'Computer Networks',
    code: 'CS304',
    faculty: 'Prof. Diana Chen',
    room: 'Hall 105',
    totalClasses: 28,
    attendedClasses: 23,
    targetAttendance: 75,
    credits: 3,
    color: '#8b5cf6'
  },
  {
    id: 'sub-5',
    name: 'Software Engineering',
    code: 'CS305',
    faculty: 'Dr. Robert Blake',
    room: 'Hall 201',
    totalClasses: 24,
    attendedClasses: 21,
    targetAttendance: 75,
    credits: 3,
    color: '#ec4899'
  }
];

export const initialAttendanceRecords = [
  { id: 'rec-1', subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', date: '2026-11-15', status: 'present', note: 'Lecture on Red-Black Trees' },
  { id: 'rec-2', subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', date: '2026-11-13', status: 'present', note: 'Heap algorithms' },
  { id: 'rec-3', subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', date: '2026-11-11', status: 'absent', note: 'Medical appointment' },
  { id: 'rec-4', subjectId: 'sub-2', subjectName: 'Database Management Systems', date: '2026-11-14', status: 'present', note: 'B+ Tree indexing' },
  { id: 'rec-5', subjectId: 'sub-2', subjectName: 'Database Management Systems', date: '2026-11-12', status: 'present', note: 'Query optimization' },
  { id: 'rec-6', subjectId: 'sub-3', subjectName: 'Operating Systems', date: '2026-11-14', status: 'present', note: 'Deadlock avoidance' },
  { id: 'rec-7', subjectId: 'sub-3', subjectName: 'Operating Systems', date: '2026-11-10', status: 'absent', note: 'Sick leave' },
  { id: 'rec-8', subjectId: 'sub-4', subjectName: 'Computer Networks', date: '2026-11-13', status: 'present', note: 'TCP congestion control' },
  { id: 'rec-9', subjectId: 'sub-5', subjectName: 'Software Engineering', date: '2026-11-12', status: 'present', note: 'Sprint planning simulation' }
];

export const initialTasks = [
  {
    id: 'task-1',
    title: 'Implement Dijkstra and A* graph search algorithms',
    description: 'Complete programming assignment 3 with benchmark runtime comparisons in Python/Java.',
    category: 'Data Structures & Algorithms',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-11-20',
    tags: ['Homework', 'Algorithms']
  },
  {
    id: 'task-2',
    title: 'Submit DBMS Normalization & Schema Proposal',
    description: 'Design BCNF tables for college event management system with ER diagram.',
    category: 'Database Management Systems',
    status: 'To Do',
    priority: 'High',
    dueDate: '2026-11-22',
    tags: ['Project', 'SQL']
  },
  {
    id: 'task-3',
    title: 'Read Operating Systems Chapter 7: Memory Management',
    description: 'Review paging, TLB caching, and inverted page tables before Friday quiz.',
    category: 'Operating Systems',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2026-11-24',
    tags: ['Reading']
  },
  {
    id: 'task-4',
    title: 'Configure Wireshark packet capture lab',
    description: 'Analyze 3-way TCP handshake and DNS query packets.',
    category: 'Computer Networks',
    status: 'Done',
    priority: 'Low',
    dueDate: '2026-11-14',
    tags: ['Lab']
  }
];

export const initialProjects = [
  {
    id: 'proj-1',
    name: 'Autonomous Robot Navigation (SLAM)',
    description: 'Simultaneous Localization and Mapping on ROS 2 with LiDAR and Depth Camera sensors.',
    role: 'leader',
    status: 'In Progress',
    membersCount: 4,
    members: [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Alex Morgan', role: 'leader' },
      { id: 'mem-2', name: 'Sarah Lin', role: 'member' },
      { id: 'mem-3', name: 'Devon Patel', role: 'member' },
      { id: 'mem-4', name: 'Liam Scott', role: 'member' }
    ],
    tasks: [
      { id: 'pt-1', title: 'Setup ROS 2 Iron environment on Raspberry Pi', status: 'Done' },
      { id: 'pt-2', title: 'Calibrate RPLiDAR A1 M8 sensor', status: 'In Progress' },
      { id: 'pt-3', title: 'Implement Cartographer SLAM algorithm', status: 'To Do' }
    ],
    createdAt: '2026-10-01'
  },
  {
    id: 'proj-2',
    name: 'ScholarHub Smart Campus Portal',
    description: 'Full-stack collaborative portal for academic tasks, attendance and professor announcements.',
    role: 'member',
    status: 'In Progress',
    membersCount: 3,
    members: [
      { id: 'mem-5', name: 'Rohan Verma', role: 'leader' },
      { id: '11111111-1111-1111-1111-111111111111', name: 'Alex Morgan', role: 'member' },
      { id: 'mem-6', name: 'Priya Sen', role: 'member' }
    ],
    tasks: [
      { id: 'pt-4', title: 'Design REST API endpoints with Spring Boot', status: 'Done' },
      { id: 'pt-5', title: 'Build React Vite frontend UI components', status: 'Done' }
    ],
    createdAt: '2026-10-15'
  }
];

export const initialCalendarEvents = [
  {
    id: 'evt-1',
    title: 'Data Structures Lab Exam',
    category: 'exam',
    date: '2026-11-25',
    time: '10:00 AM - 01:00 PM',
    subject: 'Data Structures & Algorithms',
    description: 'Practical lab exam covering balanced search trees and graph algorithms.'
  },
  {
    id: 'evt-2',
    title: 'Operating Systems Quiz 2',
    category: 'quiz',
    date: '2026-11-21',
    time: '02:00 PM - 03:00 PM',
    subject: 'Operating Systems',
    description: 'Multiple choice and short answer questions on scheduling and synchronization.'
  },
  {
    id: 'evt-3',
    title: 'ScholarHub Sprint 2 Demo',
    category: 'assignment',
    date: '2026-11-28',
    time: '04:00 PM - 05:30 PM',
    subject: 'Software Engineering',
    description: 'Present MVP iteration to department panel.'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Midterm Examination Schedule Released',
    message: 'Dr. Vance published the official mid-semester timetable. Exams start next Monday.',
    category: 'announcement',
    timestamp: '2 hours ago',
    read: false,
    link: '/dashboard'
  },
  {
    id: 'notif-2',
    title: 'Attendance Alert: Operating Systems',
    message: 'Your attendance is at 73.3%, which is below your 75% target threshold.',
    category: 'attendance',
    timestamp: '1 day ago',
    read: false,
    link: '/attendance'
  },
  {
    id: 'notif-3',
    title: 'New Assignment: Graph Search Benchmark',
    message: 'Assignment 3 has been posted in Data Structures & Algorithms. Due Nov 20.',
    category: 'assignment',
    timestamp: '2 days ago',
    read: true,
    link: '/tasks'
  }
];

export const initialProfessorSubjects = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    room: 'Hall 101',
    schedule: 'Mon, Wed, Fri (10:00 AM - 11:30 AM)',
    enrolledCount: 64,
    avgAttendance: 86.4,
    totalClasses: 36,
    color: '#3b82f6'
  },
  {
    id: 'sub-p2',
    name: 'Advanced Distributed Systems',
    code: 'CS502',
    department: 'Computer Science & Engineering',
    semester: '7th Semester',
    room: 'Hall 204',
    schedule: 'Tue, Thu (02:00 PM - 03:45 PM)',
    enrolledCount: 42,
    avgAttendance: 91.2,
    totalClasses: 28,
    color: '#8b5cf6'
  }
];

export const initialStudentsRoster = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Alex Morgan',
    studentId: 'CS-2024-0492',
    email: 'alex.morgan@scholarhub.edu',
    attendance: 86.1,
    grade: 'A',
    enrolledSubjects: ['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5']
  },
  {
    id: 'stu-2',
    name: 'Sarah Lin',
    studentId: 'CS-2024-0518',
    email: 'sarah.lin@scholarhub.edu',
    attendance: 94.4,
    grade: 'A+',
    enrolledSubjects: ['sub-1', 'sub-2', 'sub-3']
  },
  {
    id: 'stu-3',
    name: 'Devon Patel',
    studentId: 'CS-2024-0481',
    email: 'devon.patel@scholarhub.edu',
    attendance: 78.2,
    grade: 'B+',
    enrolledSubjects: ['sub-1', 'sub-3', 'sub-4']
  },
  {
    id: 'stu-4',
    name: 'Maya Henderson',
    studentId: 'CS-2024-0534',
    email: 'maya.h@scholarhub.edu',
    attendance: 68.5,
    grade: 'C',
    enrolledSubjects: ['sub-1', 'sub-5']
  }
];

export const initialAssignments = [
  {
    id: 'asgn-1',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    title: 'Assignment 3: Red-Black Trees & Search Benchmarks',
    description: 'Implement self-balancing binary search trees and submit runtime complexity analysis.',
    maxMarks: 100,
    startDate: '2026-11-10',
    deadline: '2026-11-20',
    status: 'Published',
    totalSubmissions: 58,
    attachment: 'Assignment3_RB_Trees.pdf'
  },
  {
    id: 'asgn-2',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    title: 'Assignment 4: Dijkstra & Floyd-Warshall Graph Solvers',
    description: 'Implement shortest path graph algorithms with unit tests for edge cases.',
    maxMarks: 100,
    startDate: '2026-11-18',
    deadline: '2026-12-02',
    status: 'Draft',
    totalSubmissions: 0,
    attachment: 'Assignment4_Graph_Algorithms.pdf'
  }
];

export const initialSubmissions = [
  {
    id: 'subm-1',
    assignmentId: 'asgn-1',
    studentId: '11111111-1111-1111-1111-111111111111',
    studentName: 'Alex Morgan',
    submittedAt: '2026-11-16 14:32',
    fileName: 'AlexMorgan_CS301_Assignment3.zip',
    score: 95,
    status: 'Graded',
    feedback: 'Excellent implementation of tree rotations and clean automated benchmarks.'
  },
  {
    id: 'subm-2',
    assignmentId: 'asgn-1',
    studentId: 'stu-2',
    studentName: 'Sarah Lin',
    submittedAt: '2026-11-17 09:15',
    fileName: 'SarahLin_Assignment3.zip',
    score: null,
    status: 'Pending',
    feedback: ''
  }
];

export const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'Midterm Examination Schedule Released',
    content: 'The midterm examinations will commence from next Monday. Please review syllabus modules 1 to 4.',
    priority: 'HIGH',
    author: 'Dr. Alistair Vance',
    date: '2026-11-16'
  },
  {
    id: 'ann-2',
    title: 'Guest Lecture: Scalable Cloud Architecture',
    content: 'Dr. Katherine Bell from CloudScale Labs will deliver an invited lecture this Thursday at 3 PM in Auditorium B.',
    priority: 'NORMAL',
    author: 'Dr. Alistair Vance',
    date: '2026-11-14'
  }
];
