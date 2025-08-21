
import { User, Student, Classroom, Message, Announcement, Report, Invoice, AdminStats, SupportRequest } from '../types';

const API_BASE_URL = '/api'; // Placeholder for the actual API server URL

// Helper to get the auth token from sessionStorage
const getAuthToken = () => sessionStorage.getItem('authToken');

// Helper for making authenticated API requests
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to parse error message from backend, otherwise use status text
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || response.statusText);
  }

  // If response has no content, return null, otherwise parse JSON
  if (response.status === 204) {
      return null;
  }
  return response.json();
};

export const api = {
  // Auth: Returns user and token from the backend
  login: async (email: string, pass: string): Promise<{ user: User; token: string }> => {
    // Backend would check PhuHuynh, GiaoVien, QuanTri tables
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
  },
  
  // Users
  getUser: async (userId: string): Promise<User> => {
    return apiFetch(`/users/${userId}`);
  },

  getAllUsers: async (): Promise<User[]> => {
    return apiFetch('/admin/users');
  },

  // Students
  getStudentsByParent: async (parentId: string): Promise<Student[]> => {
    return apiFetch(`/parents/${parentId}/students`);
  },

  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    return apiFetch(`/classes/${classId}/students`);
  },

  // Classrooms
  getClassroom: async (classId: string): Promise<Classroom> => {
    return apiFetch(`/classes/${classId}`);
  },

  getClassroomsByTeacher: async (teacherId: string): Promise<Classroom[]> => {
    return apiFetch(`/teachers/${teacherId}/classes`);
  },
  
  // Contacts - This endpoint would be implemented on the backend to get relevant users
  getContacts: async (): Promise<User[]> => {
    return apiFetch(`/me/contacts`);
  },

  // Messages (TinNhan)
  getMessages: async (contactId: string): Promise<Message[]> => {
    // Backend gets current user's ID from token
    return apiFetch(`/messages/${contactId}`);
  },

  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    // Backend gets senderId from token
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
  },

  // Announcements (ThongBao)
  getAnnouncements: async (): Promise<Announcement[]> => {
    // Backend could filter announcements based on user's school/class
    return apiFetch('/announcements');
  },
  
  createAnnouncement: async (content: string): Promise<Announcement> => {
    return apiFetch('/announcements', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Reports (derived from TinhHinhHocTap)
  getReports: async (studentId: string): Promise<Report[]> => {
    return apiFetch(`/students/${studentId}/reports`);
  },

  // Invoices (derived from HocPhi and ChiTietHocPhi)
  getInvoices: async (studentId: string): Promise<Invoice[]> => {
    return apiFetch(`/students/${studentId}/invoices`);
  },

  // Admin specific APIs
  getAdminDashboardStats: async (): Promise<AdminStats> => {
    return apiFetch('/admin/stats');
  },

  getSupportRequests: async (): Promise<SupportRequest[]> => {
    return apiFetch('/admin/support-requests');
  },

  updateSupportRequest: async (requestId: string, data: { status: string, response: string }): Promise<SupportRequest> => {
    return apiFetch(`/admin/support-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
