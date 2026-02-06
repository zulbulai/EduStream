
export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  ACCOUNTANT = 'Accountant',
  STUDENT = 'Student',
  PARENT = 'Parent'
}

export interface User {
  id: string;
  username: string; 
  role: UserRole;
  password?: string;
  name: string;
  linkedId?: string; 
}

export interface ExamMark {
  id: string;
  studentId: string;
  examName: string; 
  subject: string;
  marksObtained: number;
  maxMarks: number;
  date: string;
}

export interface Notification {
  id: string;
  from: string;
  to: 'ALL' | 'TEACHERS' | 'STUDENTS' | string; 
  title: string;
  message: string;
  date: string;
  priority: 'Normal' | 'Urgent';
}

export interface StudentDocument {
  type: 'Aadhar' | 'TC' | 'Marksheet' | 'BirthCertificate' | 'Other';
  name: string;
  data: string; // base64
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  email?: string;
  mobile: string;
  aadharNo: string;
  otherId?: string;
  fatherName: string;
  fatherMobile: string;
  motherName: string;
  admissionClass: string;
  section?: string;
  subjects: string[];
  address: string;
  city: string;
  bloodGroup: string;
  status: 'Active' | 'Alumni' | 'Suspended';
  photo?: string;
  admissionDate: string;
  previousSchool?: string;
  previousGrade?: string;
  tcNumber?: string;
  studentDocuments: StudentDocument[];
}

export interface Staff {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  mobile: string;
  assignedClass?: string; 
  salary: number;
  advanceAmount: number;
  joiningDate: string;
  qualification: string;
  presentDays: number;
  leaveDays: number;
}

export interface AttendanceRecord {
  date: string;
  classSection: string;
  studentId: string;
  status: 'P' | 'A' | 'L';
  markedBy: string;
}

export interface FeeTransaction {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  class: string;
  month: string;
  feeType: string;
  baseAmount: number;
  fineAmount: number;
  fineReason: string;
  totalAmount: number;
  mode: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  collectedBy: string;
  requestedBy: string; 
}

export interface SystemConfig {
  schoolName: string;
  appsScriptUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  currentSession: string;
}

// Added TimeSlot interface to support TimeTableManager requirements
export interface TimeSlot {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  subject: string;
  teacherId: string;
  startTime: string;
  endTime: string;
}
