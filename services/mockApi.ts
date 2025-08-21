import { User, Student, Classroom, Message, Announcement, Report, Invoice, AdminStats, SupportRequest, UserRole, AcademicRecord, Timetable, TimetableEntry, NewStudentPayload, UpdateStudentPayload } from '../types';
import Chance from 'chance';

const chance = new Chance('edconnect-seed');

// ===================================================================
// MOCK DATABASE - Dữ liệu giả lập
// ===================================================================

const db: {
  users: User[];
  students: Student[];
  classrooms: Classroom[];
  messages: Message[];
  announcements: Announcement[];
  reports: Report[];
  invoices: Invoice[];
  supportRequests: SupportRequest[];
  subjects: { id: string; name: string }[];
  timetables: { classId: string; dayOfWeek: number; period: number; subjectId: string }[];
  phanCongGiangDay: { teacherId: string; classId: string; subjectId: string }[];
} = {
  users: [],
  students: [],
  classrooms: [],
  messages: [],
  announcements: [],
  reports: [],
  invoices: [],
  supportRequests: [],
  subjects: [
    { id: 'subj-1', name: 'Toán' },
    { id: 'subj-2', name: 'Tiếng Việt' },
    { id: 'subj-3', name: 'Kỹ năng sống' },
    { id: 'subj-4', name: 'Âm nhạc' },
  ],
  timetables: [],
  phanCongGiangDay: [],
};

// --- Create Users ---
const adminUser: User = { id: 'admin-1', name: 'Admin EdConnect', email: 'admin@edconnect.com', phone: 'N/A', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=admin-1' };
const teacherUser1: User = { id: 'teacher-1', name: 'Cô Mai', email: 'co.mai@edconnect.com', phone: '0912345678', role: UserRole.TEACHER, avatarUrl: 'https://i.pravatar.cc/150?u=teacher-1' };
const teacherUser2: User = { id: 'teacher-2', name: 'Thầy Hùng', email: 'thay.hung@edconnect.com', phone: '0987654321', role: UserRole.TEACHER, avatarUrl: 'https://i.pravatar.cc/150?u=teacher-2' };
const parentUser1: User = { id: 'parent-1', name: 'Phụ huynh An', email: 'phu.huynh.an@edconnect.com', phone: '0901112222', role: UserRole.PARENT, avatarUrl: 'https://i.pravatar.cc/150?u=parent-1' };
const parentUser2: User = { id: 'parent-2', name: 'Phụ huynh Bình', email: 'phu.huynh.binh@edconnect.com', phone: '0903334444', role: UserRole.PARENT, avatarUrl: 'https://i.pravatar.cc/150?u=parent-2' };
const parentUser3: User = { id: 'parent-3', name: 'Phụ huynh Cường', email: 'phu.huynh.cuong@edconnect.com', phone: '0905556666', role: UserRole.PARENT, avatarUrl: 'https://i.pravatar.cc/150?u=parent-3' };
db.users.push(adminUser, teacherUser1, teacherUser2, parentUser1, parentUser2, parentUser3);

// --- Create Classrooms ---
const class1: Classroom = { id: 'class-1', name: 'Lớp Mầm 1', teacherId: teacherUser1.id };
const class2: Classroom = { id: 'class-2', name: 'Lớp Chồi 2', teacherId: teacherUser2.id };
db.classrooms.push(class1, class2);

// --- Create Students ---
const student1: Student = { id: 'student-1', name: 'Bé An', dateOfBirth: '2021-05-10', gender: 'Nữ', parentId: parentUser1.id, classId: class1.id, avatarUrl: 'https://i.pravatar.cc/150?u=student-1' };
const student2: Student = { id: 'student-2', name: 'Bé Bình', dateOfBirth: '2021-06-15', gender: 'Nam', parentId: parentUser2.id, classId: class1.id, avatarUrl: 'https://i.pravatar.cc/150?u=student-2' };
const student3: Student = { id: 'student-3', name: 'Bé Cường', dateOfBirth: '2020-03-20', gender: 'Nam', parentId: parentUser3.id, classId: class2.id, avatarUrl: 'https://i.pravatar.cc/150?u=student-3' };
db.students.push(student1, student2, student3);

// --- Create PhanCongGiangDay (Teacher Assignments) ---
// Thầy Hùng (teacher-2) teaches Âm nhạc (subj-4) in Lớp Mầm 1 (class-1)
db.phanCongGiangDay.push({ teacherId: teacherUser2.id, classId: class1.id, subjectId: 'subj-4' });


// --- Create Messages ---
db.messages.push(
  { id: chance.guid(), senderId: parentUser1.id, receiverId: teacherUser1.id, content: 'Chào cô, cô cho em hỏi tình hình học tập tuần này của bé An với ạ.', timestamp: new Date('2024-05-20T09:00:00') },
  { id: chance.guid(), senderId: teacherUser1.id, receiverId: parentUser1.id, content: 'Chào chị, tuần này bé An ăn ngoan, học tốt ạ.', timestamp: new Date('2024-05-21T14:30:00') },
);

// --- Create Announcements ---
db.announcements.push(
  { id: chance.guid(), schoolId: 'school-1', content: 'Thông báo nghỉ lễ 30/4 - 1/5. Nhà trường sẽ cho các bé nghỉ từ ngày 29/04/2024 đến hết ngày 01/05/2024.', timestamp: new Date('2024-04-25T09:00:00') },
  { id: chance.guid(), schoolId: 'school-1', content: 'Nhà trường sẽ tổ chức buổi dã ngoại tại Thảo Cầm Viên vào thứ Sáu tuần này. Kính mong quý phụ huynh đăng ký cho các bé tham gia.', timestamp: new Date('2024-05-15T14:30:00') }
);

// --- Create Reports ---
const report1: Report = {
  id: 'report-s1-t1', studentId: student1.id, term: 'Học kỳ 1', year: 2024,
  records: [
    { subjectName: 'Toán', averageScore: 8.5, absences: 0, conduct: 'Tốt' },
    { subjectName: 'Tiếng Việt', averageScore: 9.0, absences: 1, conduct: 'Tốt' },
    { subjectName: 'Kỹ năng sống', averageScore: 0, absences: 0, conduct: 'Đạt' },
  ],
  teacherComments: 'Bé An có tiến bộ rõ rệt trong học kỳ này, đặc biệt ở môn Tiếng Việt. Bé ngoan, lễ phép với thầy cô và hòa đồng với bạn bè.'
};
db.reports.push(report1);

// --- Create Invoices ---
const invoice1: Invoice = {
  id: 'invoice-s1-m4', studentId: student1.id, month: 4, year: 2024, isPaid: true,
  items: [ { description: 'Học phí tháng 4', amount: 3500000 }, { description: 'Tiền ăn', amount: 500000 }],
  total: 4000000
};
const invoice2: Invoice = {
  id: 'invoice-s1-m5', studentId: student1.id, month: 5, year: 2024, isPaid: false,
  items: [ { description: 'Học phí tháng 5', amount: 3500000 }, { description: 'Tiền ăn', amount: 500000 }],
  total: 4000000
};
db.invoices.push(invoice1, invoice2);

// --- Create Support Requests ---
db.supportRequests.push(
  { id: 'sr-1', requesterId: parentUser2.id, requesterType: 'PHUHUYNH', content: 'Tôi không xem được báo cáo học tập của con.', status: 'Mới', createdAt: new Date('2024-05-22T10:00:00'), requesterInfo: parentUser2 },
  { id: 'sr-2', requesterId: teacherUser1.id, requesterType: 'GIAOVIEN', content: 'Ứng dụng bị chậm khi gửi tin nhắn.', status: 'Đang xử lý', createdAt: new Date('2024-05-20T15:00:00'), requesterInfo: teacherUser1 },
);

// --- Create Timetables ---
db.timetables.push(
  // Lớp Mầm 1
  { classId: 'class-1', dayOfWeek: 2, period: 1, subjectId: 'subj-1' }, // T2, Tiet 1, Toán
  { classId: 'class-1', dayOfWeek: 2, period: 2, subjectId: 'subj-2' }, // T2, Tiet 2, Tiếng Việt
  { classId: 'class-1', dayOfWeek: 3, period: 1, subjectId: 'subj-3' }, // T3, Tiet 1, Kỹ năng sống
  { classId: 'class-1', dayOfWeek: 3, period: 2, subjectId: 'subj-4' }, // T3, Tiet 2, Âm nhạc
  { classId: 'class-1', dayOfWeek: 4, period: 1, subjectId: 'subj-2' }, // T4, Tiet 1, Tiếng Việt
  { classId: 'class-1', dayOfWeek: 4, period: 2, subjectId: 'subj-1' }, // T4, Tiet 2, Toán
  { classId: 'class-1', dayOfWeek: 5, period: 1, subjectId: 'subj-1' }, // T5, Tiet 1, Toán
  { classId: 'class-1', dayOfWeek: 5, period: 2, subjectId: 'subj-3' }, // T5, Tiet 2, Kỹ năng sống
  { classId: 'class-1', dayOfWeek: 6, period: 1, subjectId: 'subj-4' }, // T6, Tiet 1, Âm nhạc
  // Lớp Chồi 2
  { classId: 'class-2', dayOfWeek: 2, period: 1, subjectId: 'subj-3' }, 
  { classId: 'class-2', dayOfWeek: 2, period: 2, subjectId: 'subj-4' },
  { classId: 'class-2', dayOfWeek: 4, period: 1, subjectId: 'subj-1' }, 
  { classId: 'class-2', dayOfWeek: 4, period: 2, subjectId: 'subj-2' }
);


// ===================================================================
// API SIMULATION
// ===================================================================

// Store the currently logged-in user
let currentUser: User | null = null;

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const findUserByEmail = (email: string) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

export const api = {
  // Auth
  login: async (email: string, pass: string): Promise<{ user: User; token: string }> => {
    await simulateDelay(500);
    const user = findUserByEmail(email);
    if (user) {
      currentUser = user;
      const token = `fake-jwt-token-for-${user.id}`;
      return Promise.resolve({ user, token });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  // Users
  getUser: async (userId: string): Promise<User> => {
    await simulateDelay(200);
    const user = db.users.find(u => u.id === userId);
    if (user) return Promise.resolve(user);
    return Promise.reject(new Error('User not found'));
  },
  getAllUsers: async (): Promise<User[]> => {
    await simulateDelay(500);
    if (currentUser?.role !== UserRole.ADMIN) return Promise.reject(new Error('Unauthorized'));
    return Promise.resolve(db.users.filter(u => u.role !== UserRole.ADMIN));
  },
  
  // Subjects
  getAllSubjects: async (): Promise<{ id: string; name: string }[]> => {
    await simulateDelay(100);
    return Promise.resolve(db.subjects);
  },

  // Students
  getStudent: async (studentId: string): Promise<Student> => {
    await simulateDelay(200);
    const student = db.students.find(s => s.id === studentId);
    if (student) return Promise.resolve(student);
    return Promise.reject(new Error("Student not found"));
  },
  getStudentsByParent: async (): Promise<Student[]> => {
    await simulateDelay(300);
    if (currentUser?.role !== UserRole.PARENT) return Promise.resolve([]);
    return Promise.resolve(db.students.filter(s => s.parentId === currentUser!.id));
  },
  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    await simulateDelay(300);
    if (currentUser?.role !== UserRole.TEACHER) return Promise.reject(new Error('Unauthorized'));
    const classroom = db.classrooms.find(c => c.id === classId);
    if (!classroom) return Promise.reject(new Error("Class not found"));

    // A teacher can see students if they are homeroom OR subject teacher for that class
    const isHomeroomTeacher = classroom.teacherId === currentUser.id;
    const isSubjectTeacher = db.phanCongGiangDay.some(a => a.classId === classId && a.teacherId === currentUser!.id);

    if (!isHomeroomTeacher && !isSubjectTeacher) {
        return Promise.reject(new Error("Unauthorized access to class"));
    }
    return Promise.resolve(db.students.filter(s => s.classId === classId));
  },
  addStudentToClass: async (payload: NewStudentPayload): Promise<Student> => {
      await simulateDelay(800);
      if (currentUser?.role !== UserRole.TEACHER) return Promise.reject(new Error('Unauthorized'));

      const classroom = db.classrooms.find(c => c.id === payload.classId);
      // ONLY homeroom teacher can add students
      if (!classroom || classroom.teacherId !== currentUser.id) {
          return Promise.reject(new Error("Only homeroom teacher can add students"));
      }

      let parent = db.users.find(u => u.email.toLowerCase() === payload.parentEmail.toLowerCase());
      if (!parent) {
          parent = {
              id: `parent-${chance.guid()}`,
              name: payload.parentName,
              email: payload.parentEmail,
              phone: payload.parentPhone,
              role: UserRole.PARENT,
              avatarUrl: `https://i.pravatar.cc/150?u=${payload.parentEmail}`
          };
          db.users.push(parent);
      }

      const newStudent: Student = {
          id: `student-${chance.guid()}`,
          name: payload.studentName,
          dateOfBirth: payload.studentDateOfBirth,
          gender: payload.studentGender,
          parentId: parent.id,
          classId: payload.classId,
          avatarUrl: `https://i.pravatar.cc/150?u=${payload.studentName.replace(/\s/g, '')}`
      };
      db.students.push(newStudent);

      return Promise.resolve(newStudent);
  },
  updateStudent: async (payload: UpdateStudentPayload): Promise<Student> => {
      await simulateDelay(500);
      if (currentUser?.role !== UserRole.TEACHER) return Promise.reject(new Error('Unauthorized'));

      const studentIndex = db.students.findIndex(s => s.id === payload.id);
      if (studentIndex === -1) {
          return Promise.reject(new Error("Student not found"));
      }
      
      const student = db.students[studentIndex];
      const classroom = db.classrooms.find(c => c.id === student.classId);
      // ONLY homeroom teacher can edit students
      if (!classroom || classroom.teacherId !== currentUser.id) {
          return Promise.reject(new Error("Only homeroom teacher can edit students"));
      }

      const updatedStudent = { ...student, ...payload };
      db.students[studentIndex] = updatedStudent;
      
      return Promise.resolve(updatedStudent);
  },
  deleteStudent: async (studentId: string): Promise<{ success: boolean }> => {
    await simulateDelay(500);
    if (currentUser?.role !== UserRole.TEACHER) return Promise.reject(new Error('Unauthorized'));

    const studentIndex = db.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        return Promise.reject(new Error("Student not found"));
    }

    const student = db.students[studentIndex];
    const classroom = db.classrooms.find(c => c.id === student.classId);
     // ONLY homeroom teacher can delete students
    if (!classroom || classroom.teacherId !== currentUser.id) {
        return Promise.reject(new Error("Only homeroom teacher can delete students"));
    }

    db.students.splice(studentIndex, 1);
    
    return Promise.resolve({ success: true });
  },

  // Classrooms
  getClassroom: async (classId: string): Promise<Classroom> => {
    await simulateDelay(200);
    const classroom = db.classrooms.find(c => c.id === classId);
    if (classroom) return Promise.resolve(classroom);
    return Promise.reject(new Error("Classroom not found"));
  },
  getClassroomsByTeacher: async (): Promise<Classroom[]> => {
    await simulateDelay(300);
    if (currentUser?.role !== UserRole.TEACHER) return Promise.resolve([]);

    const teacherId = currentUser.id;
    const classroomsMap = new Map<string, Classroom>();
    const rolesMap = new Map<string, string[]>();

    // Find classes where the user is the homeroom teacher
    db.classrooms.forEach(c => {
        if (c.teacherId === teacherId) {
            if (!classroomsMap.has(c.id)) classroomsMap.set(c.id, c);
            if (!rolesMap.has(c.id)) rolesMap.set(c.id, []);
            // Use unshift to make "Chủ nhiệm" appear first
            rolesMap.get(c.id)!.unshift('Chủ nhiệm');
        }
    });

    // Find classes where the user is a subject teacher
    db.phanCongGiangDay.forEach(assignment => {
        if (assignment.teacherId === teacherId) {
            const classroom = db.classrooms.find(c => c.id === assignment.classId);
            if (classroom) {
                if (!classroomsMap.has(classroom.id)) classroomsMap.set(classroom.id, classroom);
                if (!rolesMap.has(classroom.id)) rolesMap.set(classroom.id, []);
                const subject = db.subjects.find(s => s.id === assignment.subjectId);
                rolesMap.get(classroom.id)!.push(`GV môn ${subject?.name || 'không xác định'}`);
            }
        }
    });

    const result: Classroom[] = Array.from(classroomsMap.values()).map(c => ({
        ...c,
        teacherRole: [...new Set(rolesMap.get(c.id)!)].join(', ') || 'Không xác định'
    }));

    return Promise.resolve(result);
  },

  // Contacts
  getContacts: async (): Promise<User[]> => {
    await simulateDelay(300);
    if (!currentUser) return Promise.resolve([]);
    if (currentUser.role === UserRole.PARENT) {
      const students = db.students.filter(s => s.parentId === currentUser!.id);
      const classIds = [...new Set(students.map(s => s.classId))];
      const teacherIds = new Set<string>();

      classIds.forEach(classId => {
          // Add homeroom teacher
          const classroom = db.classrooms.find(c => c.id === classId);
          if (classroom?.teacherId) {
              teacherIds.add(classroom.teacherId);
          }
          // Add all subject teachers for that class
          db.phanCongGiangDay.forEach(assignment => {
              if (assignment.classId === classId && assignment.teacherId) {
                  teacherIds.add(assignment.teacherId);
              }
          });
      });

      const uniqueTeacherIds = Array.from(teacherIds);
      const teachers = db.users.filter(u => uniqueTeacherIds.includes(u.id));
      return Promise.resolve(teachers);
    }
    if (currentUser.role === UserRole.TEACHER) {
      const classrooms = await api.getClassroomsByTeacher();
      const classIds = classrooms.map(c => c.id);
      const studentParentIds = db.students.filter(s => classIds.includes(s.classId)).map(s => s.parentId);
      const uniqueParentIds = [...new Set(studentParentIds)];
      const parents = db.users.filter(u => uniqueParentIds.includes(u.id));
      return Promise.resolve(parents);
    }
    return Promise.resolve([]);
  },
  
  // Messages
  getMessages: async (contactId: string): Promise<Message[]> => {
    await simulateDelay(400);
    if (!currentUser) return Promise.resolve([]);
    return Promise.resolve(db.messages.filter(m =>
      (m.senderId === currentUser!.id && m.receiverId === contactId) ||
      (m.senderId === contactId && m.receiverId === currentUser!.id)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  },
  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    await simulateDelay(200);
    if (!currentUser) return Promise.reject(new Error('Not logged in'));
    const newMessage: Message = {
      id: chance.guid(),
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date()
    };
    db.messages.push(newMessage);
    return Promise.resolve(newMessage);
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    await simulateDelay(500);
    return Promise.resolve([...db.announcements]);
  },
   createAnnouncement: async (content: string): Promise<Announcement> => {
    await simulateDelay(500);
    if (currentUser?.role !== UserRole.ADMIN) return Promise.reject(new Error('Unauthorized'));
    const newAnnouncement: Announcement = {
        id: chance.guid(),
        schoolId: 'school-1',
        content,
        timestamp: new Date(),
    };
    db.announcements.unshift(newAnnouncement);
    return Promise.resolve(newAnnouncement);
  },

  // Reports
  getReports: async (studentId: string): Promise<Report[]> => {
    await simulateDelay(600);
    // Security check: Only allow parent of the student or teacher of the class
    const student = db.students.find(s => s.id === studentId);
    if (!student) return Promise.reject(new Error("Student not found"));
    const classroom = db.classrooms.find(c => c.id === student.classId);
    const isParent = currentUser?.role === UserRole.PARENT && student.parentId === currentUser.id;
    const isTeacher = currentUser?.role === UserRole.TEACHER && (classroom?.teacherId === currentUser.id || db.phanCongGiangDay.some(a => a.teacherId === currentUser!.id && a.classId === classroom?.id));
    
    if (!isParent && !isTeacher) {
        return Promise.reject(new Error("Unauthorized access to reports"));
    }

    return Promise.resolve(db.reports.filter(r => r.studentId === studentId));
  },
  updateReport: async (updatedReport: Report): Promise<Report> => {
    await simulateDelay(700);
    if (currentUser?.role !== UserRole.TEACHER) return Promise.reject(new Error('Unauthorized'));

    const student = db.students.find(s => s.id === updatedReport.studentId);
    const classroom = db.classrooms.find(c => c.id === student?.classId);
    const isAssignedTeacher = classroom?.teacherId === currentUser.id || db.phanCongGiangDay.some(a => a.teacherId === currentUser!.id && a.classId === classroom?.id);

    if (!student || !classroom || !isAssignedTeacher) {
        return Promise.reject(new Error("Unauthorized to update this report"));
    }

    const reportIndex = db.reports.findIndex(r => r.id === updatedReport.id);
    
    if (reportIndex !== -1) {
        db.reports[reportIndex] = { ...db.reports[reportIndex], ...updatedReport };
        return Promise.resolve(db.reports[reportIndex]);
    } else {
        const newReport: Report = {
            ...updatedReport,
            id: `report-${updatedReport.studentId}-${new Date().getTime()}`,
        };
        db.reports.push(newReport);
        return Promise.resolve(newReport);
    }
  },

  // Invoices
  getInvoices: async (studentId: string): Promise<Invoice[]> => {
    await simulateDelay(400);
     const student = db.students.find(s => s.id === studentId);
     if (!student) return Promise.reject(new Error("Student not found"));
     if (currentUser?.role !== UserRole.PARENT || student.parentId !== currentUser.id) {
        return Promise.reject(new Error("Unauthorized access to invoices"));
     }
    return Promise.resolve(db.invoices.filter(i => i.studentId === studentId));
  },
  payInvoice: async (invoiceId: string): Promise<Invoice> => {
    await simulateDelay(2000); // Simulate payment processing time
    const invoiceIndex = db.invoices.findIndex(i => i.id === invoiceId);
    if (invoiceIndex === -1) {
        return Promise.reject(new Error("Invoice not found"));
    }

    const invoice = db.invoices[invoiceIndex];
    const student = db.students.find(s => s.id === invoice.studentId);
    if (!student || currentUser?.role !== UserRole.PARENT || student.parentId !== currentUser.id) {
        return Promise.reject(new Error("Unauthorized: You can only pay invoices for your own child."));
    }

    invoice.isPaid = true;
    return Promise.resolve({ ...invoice });
  },

  // Timetable
  getTimetablesForCurrentUser: async (): Promise<Timetable[]> => {
    await simulateDelay(500);
    if (!currentUser) return Promise.reject(new Error('Unauthorized'));

    const results: Timetable[] = [];

    if (currentUser.role === UserRole.TEACHER) {
      const classrooms = await api.getClassroomsByTeacher(); // Use the updated function
      for (const classroom of classrooms) {
        const entries: TimetableEntry[] = db.timetables
          .filter(t => t.classId === classroom.id)
          .map(t => ({
            dayOfWeek: t.dayOfWeek,
            period: t.period,
            subjectName: db.subjects.find(s => s.id === t.subjectId)?.name || 'N/A'
          }));
        
        results.push({
          studentId: `teacher-view-${classroom.id}`,
          studentName: '',
          classId: classroom.id,
          className: classroom.name,
          entries
        });
      }
    } else if (currentUser.role === UserRole.PARENT) {
      const students = db.students.filter(s => s.parentId === currentUser!.id);
      for (const student of students) {
        const classroom = db.classrooms.find(c => c.id === student.classId);
        if (classroom) {
          const entries = db.timetables
            .filter(t => t.classId === student.classId)
            .map(t => ({
              dayOfWeek: t.dayOfWeek,
              period: t.period,
              subjectName: db.subjects.find(s => s.id === t.subjectId)?.name || 'N/A'
            }));

          results.push({
            studentId: student.id,
            studentName: student.name,
            classId: classroom.id,
            className: classroom.name,
            entries
          });
        }
      }
    }
    
    return Promise.resolve(results);
  },


  // Admin specific APIs
  getAdminDashboardStats: async (): Promise<AdminStats> => {
    await simulateDelay(500);
    if (currentUser?.role !== UserRole.ADMIN) return Promise.reject(new Error('Unauthorized'));
    return Promise.resolve({
      totalTeachers: db.users.filter(u => u.role === UserRole.TEACHER).length,
      totalParents: db.users.filter(u => u.role === UserRole.PARENT).length,
      totalStudents: db.students.length,
      pendingSupportRequests: db.supportRequests.filter(r => r.status !== 'Đã giải quyết').length,
    });
  },
  getSupportRequests: async (): Promise<SupportRequest[]> => {
    await simulateDelay(600);
    if (currentUser?.role !== UserRole.ADMIN) return Promise.reject(new Error('Unauthorized'));
    return Promise.resolve(db.supportRequests.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  },
  updateSupportRequest: async (requestId: string, data: { status: SupportRequest['status'], response: string }): Promise<SupportRequest> => {
    await simulateDelay(500);
    if (currentUser?.role !== UserRole.ADMIN) return Promise.reject(new Error('Unauthorized'));
    const requestIndex = db.supportRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return Promise.reject(new Error('Request not found'));
    db.supportRequests[requestIndex] = { ...db.supportRequests[requestIndex], ...data };
    return Promise.resolve(db.supportRequests[requestIndex]);
  }
};