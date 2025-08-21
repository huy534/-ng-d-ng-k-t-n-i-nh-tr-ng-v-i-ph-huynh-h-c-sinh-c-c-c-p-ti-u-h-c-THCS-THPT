
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  childrenIds?: string[]; // For parents
  classIds?: string[]; // For teachers
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  avatarUrl: string;
  parentId: string;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  studentIds: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // Could be user or group ID
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  author: string;
}

export interface Report {
  id: string;
  studentId: string;
  term: string;
  year: number;
  grades: { subject: string; score: number }[];
  comments: string;
  fileUrl: string;
}

export interface FeeItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id:string;
  studentId: string;
  month: number;
  year: number;
  items: FeeItem[];
  discount: number;
  total: number;
  isPaid: boolean;
}
