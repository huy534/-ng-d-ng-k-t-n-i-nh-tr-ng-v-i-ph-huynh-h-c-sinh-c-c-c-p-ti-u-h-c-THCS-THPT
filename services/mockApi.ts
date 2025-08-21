import { User, Student, Classroom, Message, Announcement, Report, Invoice, AdminStats, SupportRequest, UserRole, AcademicRecord } from '../types';

// The base URL for your backend API.
// In development, this might point to a local server.
// In production, this would be your deployed API endpoint.
const API_BASE_URL = '/api';

/**
 * A helper function to make authenticated API requests.
 * It automatically adds the Authorization header with the JWT token.
 * It also handles JSON parsing and error reporting.
 * @param endpoint The API endpoint to call (e.g., '/users/me')
 * @param options The options for the fetch request (method, body, etc.)
 * @returns The JSON response from the API.
 */
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = sessionStorage.getItem('authToken');
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to parse a meaningful error message from the backend
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message || 'An unknown API error occurred.');
    }

    // Handle responses that don't have a body (e.g., 204 No Content)
    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API fetch error to ${endpoint}:`, error);
    // Re-throw the error so it can be caught by the calling component
    throw error;
  }
};

export const api = {
  // Auth
  login: (email: string, pass: string): Promise<{ user: User; token: string }> => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
  },
  
  // Users
  getUser: (userId: string): Promise<User> => apiFetch(`/users/${userId}`),
  getAllUsers: (): Promise<User[]> => apiFetch('/admin/users'),

  // Students
  getStudent: (studentId: string): Promise<Student> => apiFetch(`/students/${studentId}`),
  getStudentsByParent: (): Promise<Student[]> => apiFetch('/me/students'), // Backend infers parent from token
  getStudentsByClass: (classId: string): Promise<Student[]> => apiFetch(`/classes/${classId}/students`),

  // Classrooms
  getClassroom: (classId: string): Promise<Classroom> => apiFetch(`/classes/${classId}`),
  getClassroomsByTeacher: (): Promise<Classroom[]> => apiFetch('/me/classes'), // Backend infers teacher from token
  
  // Contacts
  getContacts: (): Promise<User[]> => apiFetch('/me/contacts'), // Backend infers user and determines contacts

  // Messages
  getMessages: (contactId: string): Promise<Message[]> => apiFetch(`/messages/${contactId}`),
  sendMessage: (receiverId: string, content: string): Promise<Message> => {
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
  },

  // Announcements
  getAnnouncements: (): Promise<Announcement[]> => apiFetch('/announcements'),
  createAnnouncement: (content: string): Promise<Announcement> => {
    return apiFetch('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Reports
  getReports: (studentId: string): Promise<Report[]> => apiFetch(`/students/${studentId}/reports`),
  updateReport: (reportId: string, updatedData: { records: AcademicRecord[], teacherComments: string }): Promise<Report> => {
    return apiFetch(`/reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
  },

  // Invoices
  getInvoices: (studentId: string): Promise<Invoice[]> => apiFetch(`/students/${studentId}/invoices`),

  // Admin specific APIs
  getAdminDashboardStats: (): Promise<AdminStats> => apiFetch('/admin/stats'),
  getSupportRequests: (): Promise<SupportRequest[]> => apiFetch('/admin/support-requests'),
  updateSupportRequest: (requestId: string, data: { status: SupportRequest['status'], response: string }): Promise<SupportRequest> => {
    return apiFetch(`/admin/support-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
