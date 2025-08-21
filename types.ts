
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

// Maps to PhuHuynh, GiaoVien, or QuanTri tables
export interface User {
  id: string; // MaPhuHuynh, MaGiaoVien, or MaQuanTri
  name: string; // HoTen
  email: string; // Email
  phone: string; // SoDienThoai
  gender?: string; // GioiTinh
  role: UserRole;
  avatarUrl: string; // Not in DB schema, assumed to exist
}

// Maps to HocSinh table
export interface Student {
  id: string; // MaHocSinh
  name: string; // HoTen
  dateOfBirth: string; // NgaySinh
  gender: string; // GioiTinh
  parentId: string; // MaPhuHuynh
  classId: string; // MaLop
  avatarUrl: string; // Not in DB schema, assumed to exist
}

// Maps to LopHoc table
export interface Classroom {
  id: string; // MaLop
  name: string; // TenLop
  teacherId: string; // MaGiaoVien (homeroom teacher)
  teacherRole?: string; // Frontend-specific: Describes the current user's role in this class
}

// Maps to TinNhan table
export interface Message {
  id: string; // MaTinNhan
  senderId: string; // MaPhuHuynh or MaGiaoVien
  receiverId: string; // MaPhuHuynh or MaGiaoVien
  content: string; // NoiDung
  timestamp: Date; // ThoiGianGui
}

// Maps to ThongBao table
export interface Announcement {
  id: string; // MaThongBao
  content: string; // NoiDung
  timestamp: Date; // Not in DB schema, assumed for UI
  schoolId: string; // MaTruong
}

// Represents one subject's performance from TinhHinhHocTap
export interface AcademicRecord {
    subjectName: string; // From MonHoc.TenMonHoc
    averageScore: number; // DiemTrungBinh
    absences: number; // SoBuoiNghi
    conduct: string; // HanhKiem
}

// Represents an aggregated report for a term, derived from TinhHinhHocTap
export interface Report {
  id: string; // Composite key or generated ID
  studentId: string; // MaHocSinh
  term: string; // e.g., "Học kỳ 1" - Derived concept
  year: number; // e.g., 2024 - Derived concept
  records: AcademicRecord[];
  teacherComments?: string; // General comments, not in schema but useful
}

// Maps to ChiTietHocPhi table
export interface FeeItem {
  description: string; // TenKhoanThu
  amount: number; // SoTienCanDong
}

// Maps to HocPhi table
export interface Invoice {
  id: string; // MaHocPhi
  studentId: string; // Derived via MaPhuHuynh
  month: number; // Derived from a date field
  year: number; // Derived from a date field
  items: FeeItem[];
  total: number; // Calculated sum of items.amount
  isPaid: boolean; // Status field, assumed to exist
}

// For Admin Dashboard
export interface AdminStats {
  totalTeachers: number;
  totalParents: number;
  totalStudents: number;
  pendingSupportRequests: number;
}

// Maps to YeuCauHoTroKiThuat table
export interface SupportRequest {
  id: string; // MaYeuCau
  content: string; // NoiDung
  status: 'Mới' | 'Đang xử lý' | 'Đã giải quyết'; // TrangThai
  response?: string; // XuLy
  requesterId: string; // MaNguoiYeuCau
  requesterType: 'PHUHUYNH' | 'GIAOVIEN'; // LoaiNguoiYeuCau
  createdAt: Date; // NgayTao
  requesterInfo?: User; // Joined user info
}

// Maps to ThoiKhoaBieu table
export interface TimetableEntry {
  dayOfWeek: number; // 2 for Monday, 3 for Tuesday, etc.
  period: number; // 1, 2, 3...
  subjectName: string;
}

export interface Timetable {
  studentId: string; // For parents to distinguish between children
  studentName: string;
  classId: string;
  className: string;
  entries: TimetableEntry[];
}

// Payload for creating a new student
export interface NewStudentPayload {
  classId: string;
  studentName: string;
  studentDateOfBirth: string;
  studentGender: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

// Payload for updating an existing student
export interface UpdateStudentPayload {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}