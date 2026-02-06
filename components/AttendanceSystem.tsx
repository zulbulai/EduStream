
import React, { useState, useEffect } from 'react';
/* Added Loader2 to imports */
import { Search, Send, Check, X, Filter, UserX, AlertTriangle, UserCheck, CalendarDays, ShieldCheck, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, UserRole } from '../types';

const AttendanceSystem: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('1st');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const currentUser = StorageService.getCurrentUser();
  const canMark = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.TEACHER;

  useEffect(() => {
    const all = StorageService.getStudents();
    const classStudents = all.filter(s => s.admissionClass === selectedClass);
    setStudents(classStudents);
    
    // Initialize attendance to all present by default
    const initial: any = {};
    classStudents.forEach(s => initial[s.id] = 'P');
    setAttendance(initial);
  }, [selectedClass]);

  const toggleStatus = (id: string, status: 'P' | 'A' | 'L') => {
    if (!canMark) return;
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    if (!canMark) return;
    setIsSaving(true);
    const records = students.map(s => ({
      date: new Date().toISOString().split('T')[0],
      classSection: selectedClass,
      studentId: s.id,
      status: attendance[s.id],
      markedBy: currentUser?.name || 'ADMIN'
    }));
    
    StorageService.saveAttendance(records);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    alert('Attendance data has been synchronized with the cloud.');
  };

  const absentees = Object.values(attendance).filter(s => s === 'A').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Ledger</h2>
          <p className="text-slate-500 font-medium">Daily register for <span className="text-indigo-600 font-bold uppercase tracking-widest">{selectedClass}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <CalendarDays size={18} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          <button 
            onClick={handleSave} 
            disabled={students.length === 0 || isSaving || !canMark}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Sync Register</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-indigo-100 transition-all">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Filter size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Class</p>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-lg font-black text-slate-900 outline-none bg-transparent cursor-pointer"
            >
              {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
             <UserCheck size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Present</p>
             <p className="text-2xl font-black text-emerald-600">{students.length - absentees}</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="bg-rose-50 p-4 rounded-2xl text-rose-600">
             <UserX size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Absent</p>
             <p className="text-2xl font-black text-rose-600">{absentees}</p>
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 text-white">
           <div className="bg-indigo-600 p-4 rounded-2xl">
             <ShieldCheck size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Marked By</p>
             <p className="text-sm font-bold truncate max-w-[100px]">{currentUser?.name}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-slate-100">
        {!canMark && (
          <div className="bg-amber-50 p-4 flex items-center justify-center gap-3 border-b border-amber-100">
             <ShieldCheck size={18} className="text-amber-600" />
             <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Read Only Mode — Permissions restricted to Faculty/Admin</p>
          </div>
        )}
        
        {students.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                <th className="px-10 py-5">Profile Information</th>
                <th className="px-10 py-5">System Identity</th>
                <th className="px-10 py-5 text-center">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-indigo-50/30 transition-all">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100">
                        {s.firstName[0]}
                      </div>
                      <span className="text-sm font-black text-slate-900">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <span className="text-[10px] font-mono font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded">#{s.admissionNo}</span>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center justify-center gap-3">
                       {['P', 'A', 'L'].map(st => (
                         <button 
                          key={st}
                          onClick={() => toggleStatus(s.id, st as any)}
                          disabled={!canMark}
                          className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                            attendance[s.id] === st 
                            ? (st === 'P' ? 'bg-emerald-600 text-white shadow-emerald-200' : st === 'A' ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-amber-600 text-white shadow-amber-200')
                            : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'
                          }`}
                         >
                           {st === 'P' ? 'PRESENT' : st === 'A' ? 'ABSENT' : 'LEAVE'}
                         </button>
                       ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-40 text-center space-y-6">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border-2 border-dashed border-slate-100">
               <AlertTriangle size={40} />
             </div>
             <div>
               <p className="font-black text-slate-800 text-lg">No Enrollments in {selectedClass}</p>
               <p className="text-sm text-slate-400 font-medium">Register students to this class to begin daily attendance tracking.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;
