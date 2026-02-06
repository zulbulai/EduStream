
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
    const students = StorageService.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index > -1) students[index] = student; else students.push(student);
    StorageService.setItem(KEYS.STUDENTS, students);
    StorageService.backgroundSync();
  },
  deleteStudent: (id: string) => {
    StorageService.setItem(KEYS.STUDENTS, StorageService.getStudents().filter(s => s.id !== id));
    StorageService.backgroundSync();
  },

  getStaff: (): Staff[] => StorageService.getItem(KEYS.STAFF),
  saveStaff: (member: Staff) => {
    const staff = StorageService.getStaff();
    const index = staff.findIndex(s => s.id === member.id);
    if (index > -1) staff[index] = member; else staff.push(member);
    StorageService.setItem(KEYS.STAFF, staff);
    StorageService.backgroundSync();
  },
  deleteStaff: (id: string) => {
    StorageService.setItem(KEYS.STAFF, StorageService.getStaff().filter(s => s.id !== id));
    StorageService.backgroundSync();
  },
  
  getFees: (): FeeTransaction[] => StorageService.getItem(KEYS.FEES),
  saveFee: (fee: FeeTransaction) => {
    StorageService.setItem(KEYS.FEES, [fee, ...StorageService.getFees()]);
    StorageService.backgroundSync();
  },

  getAttendance: (): AttendanceRecord[] => StorageService.getItem(KEYS.ATTENDANCE),
  saveAttendance: (records: AttendanceRecord[]) => {
    StorageService.setItem(KEYS.ATTENDANCE, [...StorageService.getAttendance(), ...records]);
    StorageService.backgroundSync();
  },

  getMarks: (): ExamMark[] => StorageService.getItem(KEYS.MARKS),
  saveMark: (mark: ExamMark) => {
    const marks = StorageService.getMarks();
    const idx = marks.findIndex(m => m.id === mark.id);
    if(idx > -1) marks[idx] = mark; else marks.push(mark);
    StorageService.setItem(KEYS.MARKS, marks);
    StorageService.backgroundSync();
  },

  getNotifications: (): Notification[] => StorageService.getItem(KEYS.NOTIFICATIONS),
  saveNotification: (notif: Notification) => {
    StorageService.setItem(KEYS.NOTIFICATIONS, [notif, ...StorageService.getNotifications()]);
    StorageService.backgroundSync();
  },

  getSchedule: (): TimeSlot[] => StorageService.getItem(KEYS.SCHEDULE),
  saveSchedule: (slots: TimeSlot[]) => StorageService.setItem(KEYS.SCHEDULE, slots),

  getConfig: (): SystemConfig => JSON.parse(localStorage.getItem(KEYS.CONFIG) || JSON.stringify({
    schoolName: 'EduStream International School',
    appsScriptUrl: '',
    currentSession: '2025-26'
  })),
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
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    } catch (e) { console.warn("Cloud Sync Error", e); }
  },

  syncFromCloud: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) throw new Error("Cloud URL missing");
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
    } catch (err) { throw err; }
  }
};
