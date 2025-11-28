export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  skills?: Record<string, number>; // Skill name -> Score (0-100)
}

export interface Material {
  id: string;
  title: string;
  type: 'PDF' | 'PPTX' | 'DOCX' | 'VIDEO' | 'LINK';
  url: string;
  uploadedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // HTML/Markdown
  durationMinutes: number;
  materials: string[]; // Material IDs
  isPublished: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  skills: string[]; // Tags like "Data Modeling"
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string; // Text or file URL
  grade?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED' | 'LATE';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  instructorIds: string[];
  studentIds: string[];
  modules: Module[];
  materials: Material[];
  assignments: Assignment[];
}