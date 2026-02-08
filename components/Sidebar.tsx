
import React from 'react';
import { 
  LayoutDashboard, UserPlus, Users, CheckSquare, Wallet, GraduationCap, Settings as SettingsIcon, 
  Cpu, FileCode, School, ChevronLeft, ChevronRight, CalendarClock, Award, Megaphone 
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle, userRole }) => {
  const getMenuItems = () => {
    if (userRole === UserRole.STUDENT) {
      return [
        { id: 'dashboard', label: 'My Portal', icon: LayoutDashboard },
        { id: 'timetable', label: 'Class Schedule', icon: CalendarClock },
      ];
    }
    if (userRole === UserRole.TEACHER) {
      return [
        { id: 'dashboard', label: 'Teacher Hub', icon: LayoutDashboard },
        { id: 'attendance', label: 'Take Attendance', icon: CheckSquare },
        { id: 'notifications', label: 'Notices', icon: Megaphone },
        { id: 'marks', label: 'Exam Grading', icon: Award },
        { id: 'timetable', label: 'Schedule', icon: CalendarClock },
      ];
    }
    // Admin / Accountant
    return [
      { id: 'dashboard', label: 'Executive View', icon: LayoutDashboard },
      { id: 'admission', label: 'Admission', icon: UserPlus },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: CheckSquare },
      { id: 'notifications', label: 'Notices', icon: Megaphone },
      { id: 'timetable', label: 'Scheduling', icon: CalendarClock },
      { id: 'marks', label: 'Marks Hub', icon: Award },
      { id: 'fees', label: 'Fees Manager', icon: Wallet },
      { id: 'staff', label: 'Staff Master', icon: GraduationCap },
      { id: 'insights', label: 'AI Analytics', icon: Cpu },
      { id: 'script', label: 'Cloud Tool', icon: FileCode },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-indigo-900 h-full flex flex-col text-indigo-100 shadow-xl z-50`}>
      <div className="p-4 flex items-center justify-between border-b border-indigo-800 h-20">
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'hidden'}`}>
          <div className="bg-white p-2 rounded-xl text-indigo-900 shadow-lg shadow-indigo-900/50">
            <School size={24} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg whitespace-nowrap tracking-tight">EduStream</span>
        </div>
        <button onClick={toggle} className="p-2 hover:bg-indigo-800 rounded-lg transition-colors">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                : 'hover:bg-indigo-800 text-indigo-200'
            }`}
          >
            <item.icon size={20} className={`${activeTab === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} />
            {isOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-4 px-4 py-3 w-full rounded-2xl transition-all duration-200 ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-indigo-800 text-indigo-200'
          }`}
        >
          <SettingsIcon size={20} className={activeTab === 'settings' ? 'text-white' : 'text-indigo-400'} />
          {isOpen && <span className="font-bold text-xs uppercase tracking-widest">Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
