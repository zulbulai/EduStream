
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
  // Helpers
  getItem: (key: string) => JSON.parse(localStorage.getItem(key) || '[]'),
  setItem: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),

  // Students
  getStudents: (): Student[] => StorageService.getItem(KEYS.STUDENTS),
  saveStudent: (student: Student) => {
    const students = StorageService.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index > -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    StorageService.setItem(KEYS.STUDENTS, students);
    // Explicitly wait for background sync or just fire it
    StorageService.backgroundSync();
  },
  deleteStudent: (id: string) => {
    const students = StorageService.getStudents().filter(s => s.id !== id);
    StorageService.setItem(KEYS.STUDENTS, students);
    StorageService.backgroundSync();
  },

  // Staff
  getStaff: (): Staff[] => StorageService.getItem(KEYS.STAFF),
  saveStaff: (member: Staff) => {
    const staff = StorageService.getStaff();
    const index = staff.findIndex(s => s.id === member.id);
    if (index > -1) {
      staff[index] = member;
    } else {
      staff.push(member);
    }
    StorageService.setItem(KEYS.STAFF, staff);
    StorageService.backgroundSync();
  },
  deleteStaff: (id: string) => {
    const staff = StorageService.getStaff().filter(s => s.id !== id);
    StorageService.setItem(KEYS.STAFF, staff);
    StorageService.backgroundSync();
  },
  
  // Fees
  getFees: (): FeeTransaction[] => StorageService.getItem(KEYS.FEES),
  saveFee: (fee: FeeTransaction) => {
    const fees = StorageService.getFees();
    StorageService.setItem(KEYS.FEES, [fee, ...fees]);
    StorageService.backgroundSync();
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => StorageService.getItem(KEYS.ATTENDANCE),
  saveAttendance: (records: AttendanceRecord[]) => {
    const existing = StorageService.getAttendance();
    StorageService.setItem(KEYS.ATTENDANCE, [...existing, ...records]);
    StorageService.backgroundSync();
  },

  // Schedule
  getSchedule: (): TimeSlot[] => StorageService.getItem(KEYS.SCHEDULE),
  saveSchedule: (slots: TimeSlot[]) => StorageService.setItem(KEYS.SCHEDULE, slots),

  // Config
  getConfig: (): SystemConfig => JSON.parse(localStorage.getItem(KEYS.CONFIG) || JSON.stringify({
    schoolName: 'EduStream International School',
    appsScriptUrl: '',
    currentSession: '2025-26'
  })),
  saveConfig: (config: SystemConfig) => localStorage.setItem(KEYS.CONFIG, JSON.stringify(config)),

  // Auth
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.AUTH) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.AUTH, JSON.stringify(user)),

  /**
   * Cloud Sync Engine v7.0
   * Uses plain text POST to bypass CORS pre-flight while delivering JSON.
   */
  backgroundSync: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return;
    
    const data = {
      students: StorageService.getStudents(),
      fees: StorageService.getFees(),
      staff: StorageService.getStaff(),
      attendance: StorageService.getAttendance()
    };

    try {
      // We send it as a simple POST to avoid pre-flight CORS issues
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
      });
      console.log("Cloud Push Successful");
    } catch (e) {
      console.warn("Cloud Push Failed", e);
    }
  },

  syncFromCloud: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) throw new Error("Cloud URL missing");

    try {
      const response = await fetch(config.appsScriptUrl);
      if (!response.ok) throw new Error("Network error");
      
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        const { studentmaster, feeledger, staffdirectory, attendancelogs } = result.data;
        if (studentmaster) StorageService.setItem(KEYS.STUDENTS, studentmaster);
        if (feeledger) StorageService.setItem(KEYS.FEES, feeledger);
        if (staffdirectory) StorageService.setItem(KEYS.STAFF, staffdirectory);
        if (attendancelogs) StorageService.setItem(KEYS.ATTENDANCE, attendancelogs);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Cloud Pull Error:", err);
      throw err;
    }
  }
};
