
import React, { useState } from 'react';
import { School, User as UserIcon, Loader2, Phone, Mail, ShieldCheck, GraduationCap, ArrowLeft, KeyRound, Smartphone, Fingerprint } from 'lucide-react';
import { UserRole, User } from '../types';
import { StorageService } from '../services/storage';

interface LoginProps {
  onLogin: (user: User) => void;
}

type LoginMode = 'select' | 'student' | 'staff';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<LoginMode>('select');
  const [identifier, setIdentifier] = useState('');
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

      if (mode === 'student') {
        // Password-less login for students
        const foundStudent = students.find(s => 
          s.email === identifier || 
          s.mobile === identifier || 
          s.admissionNo === identifier
        );

        if (foundStudent) {
          const user: User = { 
            id: foundStudent.id, 
            username: identifier, 
            role: UserRole.STUDENT, 
            name: `${foundStudent.firstName} ${foundStudent.lastName}`, 
            linkedId: foundStudent.id 
          };
          StorageService.setCurrentUser(user);
          return onLogin(user);
        } else {
          setError('Student not found. Please check your Roll No, Mobile or Email.');
        }
      } else {
        // Staff/Admin Login
        if (identifier === 'admin' && password === 'admin') {
          const user: User = { id: 'admin-01', username: 'admin', role: UserRole.ADMIN, name: 'Super Admin' };
          StorageService.setCurrentUser(user);
          return onLogin(user);
        }

        const foundStaff = staff.find(s => (s.id === identifier || s.mobile === identifier || s.email === identifier) && password === 'teacher');
        if (foundStaff) {
          const user: User = { 
            id: foundStaff.id, 
            username: identifier, 
            role: foundStaff.role, 
            name: foundStaff.name, 
            linkedId: foundStaff.id 
          };
          StorageService.setCurrentUser(user);
          return onLogin(user);
        } else {
          setError('Invalid Staff credentials. Use your Staff ID/Mobile and password.');
        }
      }
      setLoading(false);
    }, 1000);
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse animation-delay-2000"></div>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="col-span-full text-center mb-8">
             <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                <School size={48} strokeWidth={1.5} />
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter mb-2">EduStream Pro <span className="text-indigo-400">v10</span></h1>
             <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">The Digital Campus Ecosystem</p>
          </div>

          {/* Student Card */}
          <button 
            onClick={() => setMode('student')}
            className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[4rem] text-left hover:bg-white hover:border-white transition-all duration-500 shadow-2xl hover:-translate-y-4"
          >
            <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-500/20">
              <UserIcon size={36} />
            </div>
            <h3 className="text-3xl font-black text-white group-hover:text-slate-900 mb-2">Student Portal</h3>
            <p className="text-slate-400 group-hover:text-slate-500 font-medium leading-relaxed">
              Login using your Roll Number or Mobile. No password required. Access your ID card, marks, and fees.
            </p>
            <div className="mt-10 flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest group-hover:text-indigo-600">
               Enter Student Portal <Fingerprint size={16} />
            </div>
          </button>

          {/* Staff Card */}
          <button 
            onClick={() => setMode('staff')}
            className="group bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[4rem] text-left hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-500 shadow-2xl hover:-translate-y-4"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-500/20">
              <GraduationCap size={36} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Faculty Hub</h3>
            <p className="text-slate-400 group-hover:text-indigo-100 font-medium leading-relaxed">
              For Teachers and Admin. Manage attendance, grading, and broadcast school-wide notifications.
            </p>
            <div className="mt-10 flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-widest group-hover:text-white">
               Enter Faculty Portal <ShieldCheck size={16} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl p-12 relative z-10 animate-in slide-in-from-bottom-8 duration-500">
        <button 
          onClick={() => { setMode('select'); setError(''); }}
          className="mb-8 p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Go Back
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {mode === 'student' ? 'Student Entry' : 'Staff Access'}
          </h2>
          <p className="text-slate-500 font-bold mt-1 text-xs uppercase tracking-widest">
            {mode === 'student' ? 'Access your academic records' : 'Institutional Management Portal'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              {mode === 'student' ? 'Roll No / Mobile / Email' : 'Staff ID / Mobile / Email'}
            </label>
            <div className="relative">
              {mode === 'student' ? <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> : <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900" 
                placeholder={mode === 'student' ? "Enter Roll or Phone" : "Staff Identifier"}
                required
              />
            </div>
          </div>

          {mode === 'staff' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">System Password</label>
              <div className="relative">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase tracking-tight">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 text-white rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${mode === 'student' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : mode === 'student' ? 'Login Now' : 'Authorize & Enter'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <div className="flex flex-col gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Academic Session 2025-26</span>
                <span className="text-indigo-400">EduStream Pro ERP System</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Login;
