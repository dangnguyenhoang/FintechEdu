import { Course, User, Submission, Assignment } from '../types';

// --- SEED DATA ---

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@fintech.edu', role: 'ADMIN', avatar: 'https://picsum.photos/id/64/100/100' },
  { id: 'u2', name: 'Dr. Sarah Smith', email: 'sarah@fintech.edu', role: 'INSTRUCTOR', avatar: 'https://picsum.photos/id/65/100/100' },
  { id: 'u3', name: 'Prof. John Doe', email: 'john@fintech.edu', role: 'INSTRUCTOR', avatar: 'https://picsum.photos/id/66/100/100' },
  // Students
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `s${i}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@edu.com`,
    role: 'STUDENT' as const,
    avatar: `https://picsum.photos/id/${100 + i}/100/100`,
    skills: {
      'Financial Modeling': Math.floor(Math.random() * 40) + 60,
      'Compliance': Math.floor(Math.random() * 50) + 50,
      'Python': Math.floor(Math.random() * 60) + 40,
    }
  }))
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    code: 'FIN-101',
    title: 'Introduction to Fintech Architecture',
    description: 'Learn the foundational building blocks of modern financial technology systems.',
    instructorIds: ['u2'],
    studentIds: ['s0', 's1', 's2', 's3', 's4'],
    materials: [
      { id: 'm1', title: 'Course Syllabus', type: 'PDF', url: '#', uploadedAt: '2023-09-01' },
      { id: 'm2', title: 'Lecture 1 Slides', type: 'PPTX', url: '#', uploadedAt: '2023-09-02' }
    ],
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Payment Systems',
        lessons: [
          { id: 'l1', title: 'History of Payments', content: '<p>From barter to Bitcoin...</p>', durationMinutes: 45, materials: ['m2'], isPublished: true },
          { id: 'l2', title: 'SWIFT & SEPA', content: '<p>Understanding cross-border transfers.</p>', durationMinutes: 60, materials: [], isPublished: true }
        ]
      },
      {
        id: 'mod2',
        title: 'Module 2: Blockchain Fundamentals',
        lessons: [
          { id: 'l3', title: 'Distributed Ledgers', content: '<p>How consensus works.</p>', durationMinutes: 90, materials: [], isPublished: false }
        ]
      }
    ],
    assignments: [
      { id: 'a1', courseId: 'c1', title: 'Payment Flow Diagram', description: 'Draw a sequence diagram for a credit card auth.', dueDate: '2023-10-15', maxPoints: 100, skills: ['Architecture', 'Payments'] },
      { id: 'a2', courseId: 'c1', title: 'Blockchain Essay', description: 'Discuss the trilemma.', dueDate: '2023-11-01', maxPoints: 50, skills: ['Blockchain', 'Writing'] }
    ]
  },
  {
    id: 'c2',
    code: 'DEV-200',
    title: 'Full Stack Finance',
    description: 'Building secure ledgers with Node.js and SQL.',
    instructorIds: ['u3'],
    studentIds: ['s5', 's6', 's7', 's8', 's9'],
    materials: [],
    modules: [],
    assignments: [
      { id: 'a3', courseId: 'c2', title: 'Ledger Database Schema', description: 'Design a double-entry schema.', dueDate: '2023-10-20', maxPoints: 100, skills: ['Database', 'SQL'] }
    ]
  }
];

export const SUBMISSIONS: Submission[] = [
  { id: 'sub1', assignmentId: 'a1', studentId: 's0', studentName: 'Student 1', submittedAt: '2023-10-14', content: 'Here is my diagram: [Link]', status: 'PENDING' },
  { id: 'sub2', assignmentId: 'a1', studentId: 's1', studentName: 'Student 2', submittedAt: '2023-10-15', content: 'Attached file.', grade: 85, feedback: 'Good work, but missed the settlement phase.', status: 'GRADED' },
  { id: 'sub3', assignmentId: 'a3', studentId: 's5', studentName: 'Student 6', submittedAt: '2023-10-19', content: 'CREATE TABLE ledger...', status: 'PENDING' },
];

// --- MOCK API ---

export const MockAPI = {
  getCurrentUser: () => {
    // Simulating a logged in instructor for demo purposes
    return USERS[1]; 
  },
  getCourses: () => Promise.resolve(COURSES),
  getCourse: (id: string) => Promise.resolve(COURSES.find(c => c.id === id)),
  getSubmissions: (assignmentId: string) => Promise.resolve(SUBMISSIONS.filter(s => s.assignmentId === assignmentId)),
  updateGrade: (submissionId: string, grade: number, feedback: string) => {
    const sub = SUBMISSIONS.find(s => s.id === submissionId);
    if (sub) {
      sub.grade = grade;
      sub.feedback = feedback;
      sub.status = 'GRADED';
    }
    return Promise.resolve(sub);
  },
  createAssignment: (courseId: string, assignment: Partial<Assignment>) => {
    const course = COURSES.find(c => c.id === courseId);
    if(course) {
        const newAssignment: Assignment = {
            id: `a${Date.now()}`,
            courseId,
            title: assignment.title || 'New Assignment',
            description: assignment.description || '',
            dueDate: assignment.dueDate || '',
            maxPoints: assignment.maxPoints || 100,
            skills: assignment.skills || []
        };
        course.assignments.push(newAssignment);
        return Promise.resolve(newAssignment);
    }
    return Promise.reject('Course not found');
  }
};