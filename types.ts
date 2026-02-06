
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
  aadharNo: string;
  sssmId: string;
  bloodGroup: string;
  motherTongue: string;
  email?: string;
  mobile?: string;
  fatherName: string;
  fatherOccupation: string;
  fatherMobile: string;
  motherName: string;
  motherMobile?: string;
  admissionClass: string;
  stream?: string;
  transportRequired: boolean;
  busRoute?: string;
  status: 'Active' | 'Alumni' | 'Suspended';
  rollNo?: string;
  section?: string;
  photo?: string; // Base64
  documents: {
    type: string;
    url: string; // Base64 or Link
    name: string;
  }[];
  admissionDate: string;
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
  feeType: 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Transport Fee' | 'Library Fee' | 'Uniform Fee' | 'Other';
  baseAmount: number;
  fineAmount: number;
  totalAmount: number;
  fineReason?: string;
  mode: 'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer';
  status: 'Pending' | 'Verified';
  collectedBy: string;
}

export interface Staff {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  mobile: string;
  assignedClass?: string;
  salary: number;
  joiningDate: string;
  qualification: string;
}

export interface SystemConfig {
  schoolName: string;
  appsScriptUrl: string;
  currentSession: string;
}
