
import { Student, Staff, FeeTransaction, AttendanceRecord, SystemConfig, User, TimeSlot } from '../types';

const KEYS = {
  STUDENTS: 'edustream_students',
  STAFF: 'edustream_staff',
  FEES: 'edustream_fees',
  ATTENDANCE: 'edustream_attendance',
  CONFIG: 'edustream_config',
  AUTH: 'edustream_auth',
  SCHEDULE: 'edustream_schedule'
};

export const StorageService = {
  // Students
  getStudents: (): Student[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  saveStudent: (student: Student) => {
    const students = StorageService.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index > -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },
  deleteStudent: (id: string) => {
    const students = StorageService.getStudents().filter(s => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },

  // Staff
  getStaff: (): Staff[] => JSON.parse(localStorage.getItem(KEYS.STAFF) || '[]'),
  saveStaff: (member: Staff) => {
    const staff = StorageService.getStaff();
    const index = staff.findIndex(s => s.id === member.id);
    if (index > -1) {
      staff[index] = member;
    } else {
      staff.push(member);
    }
    localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
  },
  deleteStaff: (id: string) => {
    const staff = StorageService.getStaff().filter(s => s.id !== id);
    localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
  },
  
  // Fees
  getFees: (): FeeTransaction[] => JSON.parse(localStorage.getItem(KEYS.FEES) || '[]'),
  saveFee: (fee: FeeTransaction) => {
    const fees = StorageService.getFees();
    localStorage.setItem(KEYS.FEES, JSON.stringify([fee, ...fees]));
  },
  updateFeeStatus: (id: string, status: 'Verified') => {
    const fees = StorageService.getFees().map(f => f.id === id ? { ...f, status } : f);
    localStorage.setItem(KEYS.FEES, JSON.stringify(fees));
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || '[]'),
  saveAttendance: (records: AttendanceRecord[]) => {
    const existing = StorageService.getAttendance();
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([...existing, ...records]));
  },

  // Schedule / Timetable
  getSchedule: (): TimeSlot[] => JSON.parse(localStorage.getItem(KEYS.SCHEDULE) || '[]'),
  saveSchedule: (slots: TimeSlot[]) => {
    localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(slots));
  },
  addSlot: (slot: TimeSlot) => {
    const schedule = StorageService.getSchedule();
    schedule.push(slot);
    localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
  },

  // Config
  getConfig: (): SystemConfig => JSON.parse(localStorage.getItem(KEYS.CONFIG) || JSON.stringify({
    schoolName: 'EduStream International School',
    appsScriptUrl: '',
    currentSession: '2025-26'
  })),
  saveConfig: (config: SystemConfig) => localStorage.setItem(KEYS.CONFIG, JSON.stringify(config)),

  // Auth
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.AUTH) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.AUTH, JSON.stringify(user))
};
