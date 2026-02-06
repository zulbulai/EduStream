
import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  CheckSquare, 
  Wallet, 
  GraduationCap, 
  Settings, 
  Cpu, 
  FileCode,
  School,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admission', label: 'Admission', icon: UserPlus },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'fees', label: 'Fee Management', icon: Wallet },
    { id: 'staff', label: 'Staff Master', icon: GraduationCap },
    { id: 'insights', label: 'AI Smart Insights', icon: Cpu },
    { id: 'script', label: 'Apps Script Tool', icon: FileCode },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-indigo-900 h-full flex flex-col text-indigo-100 shadow-xl z-50`}>
      <div className="p-4 flex items-center justify-between border-b border-indigo-800 h-20">
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'hidden'}`}>
          <div className="bg-white p-2 rounded-lg text-indigo-900">
            <School size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg whitespace-nowrap">EduStream Pro</span>
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
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'hover:bg-indigo-800 text-indigo-200'
            }`}
          >
            <item.icon size={22} className={`${activeTab === item.id ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} />
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button className="flex items-center gap-4 px-4 py-3 w-full hover:bg-indigo-800 rounded-xl transition-colors">
          <Settings size={22} className="text-indigo-300" />
          {isOpen && <span className="font-medium text-indigo-200">System Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
