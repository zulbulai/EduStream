

export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  ACCOUNTANT = 'Accountant',
  STUDENT = 'Student',
  PARENT = 'Parent'
}

export interface User {
  id: string;
  username: string; // Used for Email/Mobile login
  role: UserRole;
  password?: string;
  name: string;
  linkedId?: string; // Links to Student ID or Staff ID
}

export interface ExamMark {
  id: string;
  studentId: string;
  examName: string; // Unit Test 1, Final, etc.
  subject: string;
  marksObtained: number;
  maxMarks: number;
  date: string;
}

export interface Notification {
  id: string;
  from: string;
  to: 'ALL' | 'TEACHERS' | 'STUDENTS' | string; // Role or Specific Class
  title: string;
  message: string;
  date: string;
  priority: 'Normal' | 'Urgent';
}

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dob: string;
  age: number;
  religion: string;
  category: string;
  bloodGroup: string;
  motherTongue: string;
  email?: string;
  mobile: string;
  
  // Family
  fatherName: string;
  fatherOccupation: string;
  fatherMobile: string;
  motherName: string;
  motherMobile?: string;
  
  // Academic
  admissionClass: string;
  section?: string;
  rollNo?: string;
  subjects: string[];
  
  // Address & Emergency
  address: string;
  city: string;
  state: string;
  pinCode: string;
  emergencyContactMobile: string;
  
  status: 'Active' | 'Alumni' | 'Suspended';
  photo?: string;
  admissionDate: string;
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
  // Added missing fields baseAmount, fineAmount, and fineReason to match usage in FeeManagement component
  baseAmount: number;
  fineAmount: number;
  fineReason: string;
  totalAmount: number;
  mode: string;
  status: string;
  collectedBy: string;
}

export interface TimeSlot {
  id: string;
  classId: string;
  day: string;
  periodNumber: number; 
  subject: string;
  teacherId: string;
  startTime: string;
  endTime: string;
}

export interface SystemConfig {
  schoolName: string;
  appsScriptUrl: string;
  currentSession: string;
}