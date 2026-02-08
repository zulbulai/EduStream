
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

const STORAGE_EVENT = 'edustream_data_updated';

export const StorageService = {
  notifyUpdate: () => window.dispatchEvent(new CustomEvent(STORAGE_EVENT)),
  subscribe: (callback: () => void) => {
    window.addEventListener(STORAGE_EVENT, callback);
    return () => window.removeEventListener(STORAGE_EVENT, callback);
  },

  getItem: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  setItem: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    StorageService.notifyUpdate();
  },

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

  getStaff: (): Staff[] => StorageService.getItem(KEYS.STAFF),
  saveStaff: (member: Staff) => {
    const items = StorageService.getStaff();
    const index = items.findIndex(s => s.id === member.id);
    if (index > -1) items[index] = member; else items.unshift(member);
    StorageService.setItem(KEYS.STAFF, items);
    StorageService.autoSync();
  },
  deleteStaff: (id: string) => {
    StorageService.setItem(KEYS.STAFF, StorageService.getStaff().filter(s => s.id !== id));
    StorageService.autoSync();
  },

  getFees: (): FeeTransaction[] => StorageService.getItem(KEYS.FEES),
  saveFee: (fee: FeeTransaction) => {
    const items = StorageService.getFees();
    const index = items.findIndex(f => f.id === fee.id);
    if (index > -1) items[index] = fee; else items.unshift(fee);
    StorageService.setItem(KEYS.FEES, items);
    StorageService.autoSync();
  },

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

  getConfig: (): SystemConfig => {
    const defaults = {
      schoolName: 'EduStream International School',
      appsScriptUrl: '',
      currentSession: '2025-26'
    };
    try {
      const stored = localStorage.getItem(KEYS.CONFIG);
      return stored ? JSON.parse(stored) : defaults;
    } catch (e) {
      return defaults;
    }
  },
  saveConfig: (config: SystemConfig) => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    StorageService.notifyUpdate();
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.AUTH, JSON.stringify(user)),

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

  getSchedule: (): TimeSlot[] => StorageService.getItem(KEYS.SCHEDULE),
  saveSchedule: (schedule: TimeSlot[]) => {
    StorageService.setItem(KEYS.SCHEDULE, schedule);
    StorageService.autoSync();
  },

  autoSync: async () => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return;
    
    const data = {
      students: StorageService.getStudents(),
      fees: StorageService.getFees(),
      staff: StorageService.getStaff(),
      attendance: StorageService.getAttendance(),
      marks: StorageService.getMarks(),
      notifications: StorageService.getNotifications(),
      schedule: StorageService.getSchedule()
    };

    try {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn("Background sync paused");
    }
  },

  syncFromCloud: async (): Promise<boolean> => {
    const config = StorageService.getConfig();
    if (!config.appsScriptUrl) return false;

    try {
      const response = await fetch(config.appsScriptUrl);
      if (!response.ok) throw new Error("Cloud Error");
      
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const d = result.data;
        if (d.studentmaster) localStorage.setItem(KEYS.STUDENTS, JSON.stringify(d.studentmaster));
        if (d.feeledger) localStorage.setItem(KEYS.FEES, JSON.stringify(d.feeledger));
        if (d.staffdirectory) localStorage.setItem(KEYS.STAFF, JSON.stringify(d.staffdirectory));
        if (d.attendancelogs) localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(d.attendancelogs));
        if (d.exammarks) localStorage.setItem(KEYS.MARKS, JSON.stringify(d.exammarks));
        if (d.notifications) localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(d.notifications));
        if (d.timetable) localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(d.timetable));
        
        StorageService.notifyUpdate();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Fetch Error", err);
      return false;
    }
  }
};
