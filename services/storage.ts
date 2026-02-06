
import { Student, Staff, FeeTransaction, AttendanceRecord, SystemConfig, User, TimeSlot, ExamMark, Notification } from '../types';

const KEYS = {
  STUDENTS: 'edustream_students',
  STAFF: 'edustream_staff',
  FEES: 'edustream_fees',
  ATTENDANCE: 'edustream_attendance',
  CONFIG: 'edustream_config',
  AUTH: 'edustream_auth',
  SCHEDULE: 'edustream_schedule',
  MARKS: 'edustream_marks',
  NOTIFICATIONS: 'edustream_notifications'
};

export const StorageService = {
  getItem: (key: string) => JSON.parse(localStorage.getItem(key) || '[]'),
  setItem: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),

  getStudents: (): Student[] => StorageService.getItem(KEYS.STUDENTS),
  saveStudent: (student: Student) => {
    const items = StorageService.getStudents();
    const index = items.findIndex(s => s.id === student.id);
    if (index > -1) items[index] = student; else items.unshift(student);
    StorageService.setItem(KEYS.STUDENTS, items);
    StorageService.backgroundSync();
  },
  deleteStudent: (id: string) => {
    StorageService.setItem(KEYS.STUDENTS, StorageService.getStudents().filter(s => s.id !== id));
    StorageService.backgroundSync();
  },

  getStaff: (): Staff[] => StorageService.getItem(KEYS.STAFF),
  saveStaff: (member: Staff) => {
    const items = StorageService.getStaff();
    const index = items.findIndex(s => s.id === member.id);
    if (index > -1) items[index] = member; else items.unshift(member);
    StorageService.setItem(KEYS.STAFF, items);
    StorageService.backgroundSync();
  },
  deleteStaff: (id: string) => {
    StorageService.setItem(KEYS.STAFF, StorageService.getStaff().filter(s => s.id !== id));
    StorageService.backgroundSync();
  },
  
  getFees: (): FeeTransaction[] => StorageService.getItem(KEYS.FEES),
  saveFee: (fee: FeeTransaction) => {
    const items = StorageService.getFees();
    const index = items.findIndex(f => f.id === fee.id);
    if (index > -1) items[index] = fee; else items.unshift(fee);
    StorageService.setItem(KEYS.FEES, items);
    StorageService.backgroundSync();
  },

  getAttendance: (): AttendanceRecord[] => StorageService.getItem(KEYS.ATTENDANCE),
  saveAttendance: (records: AttendanceRecord[]) => {
    // Attendance is date-student based, so we check for existing day-student combos
    const current = StorageService.getAttendance();
    const updated = [...current];
    records.forEach(r => {
      const idx = updated.findIndex(u => u.date === r.date && u.studentId === r.studentId);
      if (idx > -1) updated[idx] = r; else updated.push(r);
    });
    StorageService.setItem(KEYS.ATTENDANCE, updated);
    StorageService.backgroundSync();
  },

  getMarks: (): ExamMark[] => StorageService.getItem(KEYS.MARKS),
  saveMark: (mark: ExamMark) => {
    const items = StorageService.getMarks();
    const idx = items.findIndex(m => m.id === mark.id);
    if(idx > -1) items[idx] = mark; else items.push(mark);
    StorageService.setItem(KEYS.MARKS, items);
    StorageService.backgroundSync();
  },

  getNotifications: (): Notification[] => StorageService.getItem(KEYS.NOTIFICATIONS),
  saveNotification: (notif: Notification) => {
    const items = StorageService.getNotifications();
    items.unshift(notif);
    StorageService.setItem(KEYS.NOTIFICATIONS, items.slice(0, 100)); // Keep last 100
    StorageService.backgroundSync();
  },

  getSchedule: (): TimeSlot[] => StorageService.getItem(KEYS.SCHEDULE),
  saveSchedule: (slots: TimeSlot[]) => StorageService.setItem(KEYS.SCHEDULE, slots),

  getConfig: (): SystemConfig => {
    const defaults = {
      schoolName: 'EduStream International School',
      appsScriptUrl: '',
      currentSession: '2025-26'
    };
    const stored = localStorage.getItem(KEYS.CONFIG);
    return stored ? JSON.parse(stored) : defaults;
  },
  saveConfig: (config: SystemConfig) => localStorage.setItem(KEYS.CONFIG, JSON.stringify(config)),

  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.AUTH) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.AUTH, JSON.stringify(user)),

  backgroundSync: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return;
    const data = {
      students: StorageService.getStudents(),
      fees: StorageService.getFees(),
      staff: StorageService.getStaff(),
      attendance: StorageService.getAttendance(),
      marks: StorageService.getMarks(),
      notifications: StorageService.getNotifications()
    };
    try {
      // Use text/plain to bypass CORS simple request preflight issues with GAS
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    } catch (e) { console.warn("Background Sync Failed", e); }
  },

  syncFromCloud: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return false;
    try {
      const response = await fetch(config.appsScriptUrl);
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const d = result.data;
        if (d.studentmaster) StorageService.setItem(KEYS.STUDENTS, d.studentmaster);
        if (d.feeledger) StorageService.setItem(KEYS.FEES, d.feeledger);
        if (d.staffdirectory) StorageService.setItem(KEYS.STAFF, d.staffdirectory);
        if (d.attendancelogs) StorageService.setItem(KEYS.ATTENDANCE, d.attendancelogs);
        if (d.exammarks) StorageService.setItem(KEYS.MARKS, d.exammarks);
        if (d.notifications) StorageService.setItem(KEYS.NOTIFICATIONS, d.notifications);
        return true;
      }
      return false;
    } catch (err) { 
      console.error("Cloud Pull Error", err);
      return false; 
    }
  }
};
