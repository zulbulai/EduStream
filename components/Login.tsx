
import React, { useState } from 'react';
import { School, ShieldCheck, Lock, User as UserIcon, Loader2 } from 'lucide-react';
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

    // Demo Auth logic
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        const user: User = {
          id: 'admin-01',
          username: 'admin',
          role: UserRole.ADMIN,
          name: 'Super Admin'
        };
        StorageService.setCurrentUser(user);
        onLogin(user);
      } else if (username === 'teacher' && password === 'teacher') {
        const user: User = {
          id: 'teacher-01',
          username: 'teacher',
          role: UserRole.TEACHER,
          name: 'Kavita Singh'
        };
        StorageService.setCurrentUser(user);
        onLogin(user);
      } else {
        setError('Invalid username or password. (Hint: admin/admin)');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative z-10 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6">
            <School size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">EduStream Pro</h1>
          <p className="text-slate-500 font-medium mt-1">School Management ERP</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium" 
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In to Portal'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Secured by EduStream Cloud Infrastructure
        </p>
      </div>
    </div>
  );
};

export default Login;
