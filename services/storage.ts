
import { Student, Staff, FeeTransaction, AttendanceRecord, SystemConfig, User, ExamMark, Notification, TimeSlot } from '../types';

const KEYS = {
  STUDENTS: 'edustream_students',
  STAFF: 'edustream_staff',
  FEES: 'edustream_fees',
  ATTENDANCE: 'edustream_attendance',
  CONFIG: 'edustream_config',
  AUTH: 'edustream_auth',
  MARKS: 'edustream_marks',
  NOTIFICATIONS: 'edustream_notifications',
  SCHEDULE: 'edustream_schedule'
};

export const StorageService = {
  // Utility for LocalStorage
  getItem: (key: string) => JSON.parse(localStorage.getItem(key) || '[]'),
  setItem: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),

  // Student Methods
  getStudents: (): Student[] => StorageService.getItem(KEYS.STUDENTS),
  saveStudent: (student: Student) => {
    const items = StorageService.getStudents();
    const index = items.findIndex(s => s.id === student.id);
    if (index > -1) items[index] = student; else items.unshift(student);
    StorageService.setItem(KEYS.STUDENTS, items);
    StorageService.autoSync();
  },
  deleteStudent: (id: string) => {
    StorageService.setItem(KEYS.STUDENTS, StorageService.getStudents().filter(s => s.id !== id));
    StorageService.autoSync();
  },

  // Staff Methods
  getStaff: (): Staff[] => StorageService.getItem(KEYS.STAFF),
  saveStaff: (member: Staff) => {
    const items = StorageService.getStaff();
    const index = items.findIndex(s => s.id === member.id);
    if (index > -1) items[index] = member; else items.unshift(member);
    StorageService.setItem(KEYS.STAFF, items);
    StorageService.autoSync();
  },
  // Added deleteStaff method to fix property missing error in StaffList.tsx
  deleteStaff: (id: string) => {
    StorageService.setItem(KEYS.STAFF, StorageService.getStaff().filter(s => s.id !== id));
    StorageService.autoSync();
  },

  // Fee Methods
  getFees: (): FeeTransaction[] => StorageService.getItem(KEYS.FEES),
  saveFee: (fee: FeeTransaction) => {
    const items = StorageService.getFees();
    const index = items.findIndex(f => f.id === fee.id);
    if (index > -1) items[index] = fee; else items.unshift(fee);
    StorageService.setItem(KEYS.FEES, items);
    StorageService.autoSync();
  },

  // Attendance Methods
  getAttendance: (): AttendanceRecord[] => StorageService.getItem(KEYS.ATTENDANCE),
  saveAttendance: (records: AttendanceRecord[]) => {
    const current = StorageService.getAttendance();
    const updated = [...current];
    records.forEach(r => {
      const idx = updated.findIndex(u => u.date === r.date && u.studentId === r.studentId);
      if (idx > -1) updated[idx] = r; else updated.push(r);
    });
    StorageService.setItem(KEYS.ATTENDANCE, updated);
    StorageService.autoSync();
  },

  // Config Methods
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

  // Auth Methods
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.AUTH) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.AUTH, JSON.stringify(user)),

  // Marks & Notifications
  getMarks: (): ExamMark[] => StorageService.getItem(KEYS.MARKS),
  saveMark: (mark: ExamMark) => {
    const items = StorageService.getMarks();
    const idx = items.findIndex(m => m.id === mark.id);
    if(idx > -1) items[idx] = mark; else items.push(mark);
    StorageService.setItem(KEYS.MARKS, items);
    StorageService.autoSync();
  },
  getNotifications: (): Notification[] => StorageService.getItem(KEYS.NOTIFICATIONS),
  saveNotification: (notif: Notification) => {
    const items = StorageService.getNotifications();
    items.unshift(notif);
    StorageService.setItem(KEYS.NOTIFICATIONS, items.slice(0, 50));
    StorageService.autoSync();
  },

  // Added Schedule Methods to fix missing property errors in TimeTableManager.tsx
  getSchedule: (): TimeSlot[] => StorageService.getItem(KEYS.SCHEDULE),
  saveSchedule: (schedule: TimeSlot[]) => {
    StorageService.setItem(KEYS.SCHEDULE, schedule);
    StorageService.autoSync();
  },

  /**
   * REFINED AUTO-SYNC LOGIC
   * This sends data to whatever backend is configured.
   */
  autoSync: async () => {
    const config = StorageService.getConfig();
    
    // Fallback to Apps Script if available
    if (config.appsScriptUrl) {
      const data = {
        students: StorageService.getStudents(),
        fees: StorageService.getFees(),
        staff: StorageService.getStaff(),
        attendance: StorageService.getAttendance(),
        marks: StorageService.getMarks(),
        notifications: StorageService.getNotifications(),
        // Included schedule in auto-sync data
        schedule: StorageService.getSchedule()
      };
      try {
        await fetch(config.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Essential for Apps Script
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        console.log("Cloud Sync Triggered");
      } catch (e) { console.error("Sync Error", e); }
    }
  },

  /**
   * FORCE PULL FROM CLOUD
   * Fixes the "Dashboard data not fetching" issue by deep-refreshing local state.
   */
  syncFromCloud: async (): Promise<boolean> => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return false;

    try {
      const response = await fetch(config.appsScriptUrl);
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        const d = result.data;
        // Mapping sheet names to our local keys
        if (d.studentmaster) StorageService.setItem(KEYS.STUDENTS, d.studentmaster);
        if (d.feeledger) StorageService.setItem(KEYS.FEES, d.feeledger);
        if (d.staffdirectory) StorageService.setItem(KEYS.STAFF, d.staffdirectory);
        if (d.attendancelogs) StorageService.setItem(KEYS.ATTENDANCE, d.attendancelogs);
        if (d.exammarks) StorageService.setItem(KEYS.MARKS, d.exammarks);
        if (d.notifications) StorageService.setItem(KEYS.NOTIFICATIONS, d.notifications);
        // Included timetable in sync mapping
        if (d.timetable) StorageService.setItem(KEYS.SCHEDULE, d.timetable);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Critical: Cloud Fetch Failed", err);
      return false;
    }
  }
};
