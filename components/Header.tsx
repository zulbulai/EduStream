
import React from 'react';
import { Bell, Search, UserCircle, Menu, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentUser, onLogout }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md ml-4">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search database..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">System Online</span>
        </div>

        <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</p>
            <p className="text-[10px] font-black text-indigo-600 mt-1 uppercase tracking-widest">{currentUser.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center border border-slate-200 transition-all shadow-sm"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
