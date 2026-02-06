
import React, { useState } from 'react';
import { School, Lock, User as UserIcon, Loader2, Phone, Mail, ShieldCheck } from 'lucide-react';
import { UserRole, User } from '../types';
import { StorageService } from '../services/storage';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const students = StorageService.getStudents();
      const staff = StorageService.getStaff();

      // 1. Admin Logic
      if (username === 'admin' && password === 'admin') {
        const user: User = { id: 'admin-01', username: 'admin', role: UserRole.ADMIN, name: 'Super Admin' };
        StorageService.setCurrentUser(user);
        return onLogin(user);
      }

      // 2. Teacher Login (Check Mobile or Email)
      const foundTeacher = staff.find(s => (s.email === username || s.mobile === username) && password === 'teacher');
      if (foundTeacher) {
        const user: User = { 
          id: foundTeacher.id, 
          username: username, 
          role: foundTeacher.role, 
          name: foundTeacher.name, 
          linkedId: foundTeacher.id 
        };
        StorageService.setCurrentUser(user);
        return onLogin(user);
      }

      // 3. Student Login (Check Roll No, Mobile, or Email)
      const foundStudent = students.find(s => (s.email === username || s.mobile === username || s.admissionNo === username) && password === 'student');
      if (foundStudent) {
        const user: User = { 
          id: foundStudent.id, 
          username: username, 
          role: UserRole.STUDENT, 
          name: foundStudent.firstName, 
          linkedId: foundStudent.id 
        };
        StorageService.setCurrentUser(user);
        return onLogin(user);
      }

      setError('Authentication failed. Check your ID/Email/Mobile and Password.');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 relative z-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 mb-6">
            <School size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">EduStream Pro</h1>
          <p className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest">Global ERP Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email / Mobile / Roll No</label>
            <div className="relative">
              <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900" 
                placeholder="User Identifier"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Access Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-black uppercase tracking-tight">
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Enter Platform'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center space-y-2">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Demo Credentials</p>
            <div className="flex flex-col gap-1 text-[9px] font-bold text-indigo-400 uppercase">
                <span>Admin: admin / admin</span>
                <span>Teacher: (registered mobile) / teacher</span>
                <span>Student: (roll no) / student</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
