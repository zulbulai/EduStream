
import React, { useState } from 'react';
import { School, User as UserIcon, Loader2, KeyRound, Smartphone, Fingerprint, ShieldCheck, GraduationCap, ArrowLeft, ChevronRight } from 'lucide-react';
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
          setError('Student not found. Check Roll No or Mobile.');
        }
      } else {
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
          setError('Invalid Credentials. Access Denied.');
        }
      }
      setLoading(false);
    }, 1200);
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
             <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-500/20 ring-8 ring-white/5">
                <School size={44} strokeWidth={2} />
             </div>
             <h1 className="text-6xl font-black text-white tracking-tighter mb-4">EduStream <span className="text-indigo-500">Pro</span></h1>
             <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Cloud Education Ecosystem v12</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <SelectionCard 
              onClick={() => setMode('student')}
              icon={<UserIcon size={32} />}
              title="Student Portal"
              desc="Access your grades, fee receipts, and digital ID card using your registered mobile number."
              color="bg-indigo-500"
              label="Student Entrance"
            />
            <SelectionCard 
              onClick={() => setMode('staff')}
              icon={<GraduationCap size={32} />}
              title="Faculty Hub"
              desc="Comprehensive management suite for Teachers and Administrators to handle operations."
              color="bg-slate-800"
              label="Staff Login"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-[4rem] shadow-2xl p-12 relative z-10 border border-slate-100 animate-in zoom-in-95 duration-500">
        <button 
          onClick={() => { setMode('select'); setError(''); }}
          className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Gateway
        </button>

        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {mode === 'student' ? 'Student Sign-in' : 'Staff Secure Access'}
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Securing Educational Data</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Identifier</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                {mode === 'student' ? <Smartphone size={20} /> : <UserIcon size={20} />}
              </div>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                placeholder={mode === 'student' ? "Mobile or Admission No" : "Username or Staff ID"}
                required
              />
            </div>
          </div>

          {mode === 'staff' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Security Key</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 rounded-[1.5rem] border border-rose-100 flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase tracking-tight">
              <ShieldCheck size={16} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 text-white rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${mode === 'student' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'student' ? 'Enter Campus' : 'Authorize Session'} <ChevronRight size={18} /></>}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Institutional Infrastructure v12.1</p>
        </div>
      </div>
    </div>
  );
};

const SelectionCard = ({ onClick, icon, title, desc, color, label }: any) => (
  <button 
    onClick={onClick}
    className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] text-left hover:bg-white transition-all duration-700 shadow-2xl hover:-translate-y-4"
  >
    <div className={`${color} w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform shadow-2xl shadow-black/20`}>
      {icon}
    </div>
    <h3 className="text-3xl font-black text-white group-hover:text-slate-900 mb-4 transition-colors">{title}</h3>
    <p className="text-slate-400 group-hover:text-slate-500 font-medium leading-relaxed mb-10 transition-colors">{desc}</p>
    <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest group-hover:text-indigo-600 transition-colors">
       {label} <Fingerprint size={16} />
    </div>
  </button>
);

export default Login;
