
import { UserRole, User, Student, Classroom, Message, Announcement, Report, Invoice } from '../types';

// MOCK DATABASE
const users: User[] = [
  { id: 'user-1', name: 'Cô Mai', email: 'teacher@example.com', phone: '0901234567', role: UserRole.TEACHER, avatarUrl: 'https://picsum.photos/seed/teacher/100', classIds: ['class-1'] },
  { id: 'user-2', name: 'Anh Hùng', email: 'parent@example.com', phone: '0908765432', role: UserRole.PARENT, avatarUrl: 'https://picsum.photos/seed/parent/100', childrenIds: ['student-1'] },
  { id: 'user-3', name: 'Admin', email: 'admin@example.com', phone: '0909999999', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin/100' },
  { id: 'user-4', name: 'Chị Lan', email: 'parent2@example.com', phone: '0901112222', role: UserRole.PARENT, avatarUrl: 'https://picsum.photos/seed/parent2/100', childrenIds: ['student-2'] },
];

const students: Student[] = [
  { id: 'student-1', name: 'Bé An', classId: 'class-1', parentId: 'user-2', avatarUrl: 'https://picsum.photos/seed/student1/100' },
  { id: 'student-2', name: 'Bé Bình', classId: 'class-1', parentId: 'user-4', avatarUrl: 'https://picsum.photos/seed/student2/100' },
];

const classrooms: Classroom[] = [
  { id: 'class-1', name: 'Lớp Mầm 1', subject: 'Khám Phá', teacherId: 'user-1', studentIds: ['student-1', 'student-2'] },
];

const messages: Message[] = [
  { id: 'msg-1', senderId: 'user-1', receiverId: 'user-2', content: 'Chào anh Hùng, bé An hôm nay ở lớp rất ngoan ạ.', timestamp: new Date(Date.now() - 86400000), isRead: true },
  { id: 'msg-2', senderId: 'user-2', receiverId: 'user-1', content: 'Cảm ơn cô Mai, gia đình mừng lắm ạ.', timestamp: new Date(Date.now() - 86000000), isRead: true },
  { id: 'msg-3', senderId: 'user-1', receiverId: 'user-2', content: 'Cuối tuần trường có tổ chức dã ngoại, anh cho bé tham gia nhé.', timestamp: new Date(), isRead: false },
];

const announcements: Announcement[] = [
    { id: 'ann-1', title: 'Thông báo nghỉ lễ 30/4 - 1/5', content: 'Toàn thể học sinh được nghỉ lễ từ ngày 30/4 đến hết ngày 1/5. Chúc quý phụ huynh và các bé có một kỳ nghỉ vui vẻ!', timestamp: new Date(Date.now() - 2 * 86400000), author: 'Ban Giám Hiệu' },
    { id: 'ann-2', title: 'Lịch dã ngoại công viên tháng 5', content: 'Trường sẽ tổ chức buổi dã ngoại tại Công viên Tao Đàn vào ngày 15/5. Phụ huynh vui lòng đăng ký cho các bé trước ngày 10/5.', timestamp: new Date(), author: 'Cô Mai' },
];

const reports: Report[] = [
    { id: 'rep-1', studentId: 'student-1', term: 'Học kỳ 1', year: 2023, grades: [{ subject: 'Toán', score: 9 }, { subject: 'Vẽ', score: 10 }], comments: 'Bé An tiếp thu nhanh, rất sáng tạo.', fileUrl: '#' },
];

const invoices: Invoice[] = [
    { id: 'inv-1', studentId: 'student-1', month: 5, year: 2024, items: [{id: 'fee-1', description: 'Học phí tháng 5', amount: 3000000}, {id: 'fee-2', description: 'Tiền ăn', amount: 1000000}], discount: 0, total: 4000000, isPaid: false },
];


// MOCK API FUNCTIONS
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  login: async (email: string, pass: string): Promise<User | null> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    // In a real app, you'd check the password hash
    return user || null;
  },
  
  getUser: async (userId: string): Promise<User | undefined> => {
    await delay(200);
    return users.find(u => u.id === userId);
  },

  getStudentsByParent: async (parentId: string): Promise<Student[]> => {
    await delay(300);
    return students.filter(s => s.parentId === parentId);
  },

  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    await delay(300);
    return students.filter(s => s.classId === classId);
  },

  getClassroom: async (classId: string): Promise<Classroom | undefined> => {
    await delay(200);
    return classrooms.find(c => c.id === classId);
  },

  getClassroomsByTeacher: async (teacherId: string): Promise<Classroom[]> => {
    await delay(300);
    return classrooms.filter(c => c.teacherId === teacherId);
  },
  
  getContacts: async (user: User): Promise<User[]> => {
    await delay(400);
    if (user.role === UserRole.TEACHER) {
      const parentIds = students.map(s => s.parentId);
      return users.filter(u => parentIds.includes(u.id));
    }
    if (user.role === UserRole.PARENT) {
      // Find the teacher of the parent's child
      const child = students.find(s => s.parentId === user.id);
      if (child) {
        const classroom = classrooms.find(c => c.id === child.classId);
        if (classroom) {
          return users.filter(u => u.id === classroom.teacherId);
        }
      }
    }
    return [];
  },

  getMessages: async (userId1: string, userId2: string): Promise<Message[]> => {
    await delay(200);
    return messages
      .filter(m => (m.senderId === userId1 && m.receiverId === userId2) || (m.senderId === userId2 && m.receiverId === userId1))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  sendMessage: async (senderId: string, receiverId: string, content: string): Promise<Message> => {
    await delay(300);
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      isRead: false,
    };
    messages.push(newMessage);
    return newMessage;
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    await delay(400);
    return announcements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  getReports: async (studentId: string): Promise<Report[]> => {
    await delay(400);
    return reports.filter(r => r.studentId === studentId);
  },

  getInvoices: async (studentId: string): Promise<Invoice[]> => {
    await delay(400);
    return invoices.filter(i => i.studentId === studentId);
  }
};
