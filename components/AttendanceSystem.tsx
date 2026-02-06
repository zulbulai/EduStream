
import React, { useState, useEffect } from 'react';
import { Search, Send, Check, X, Filter, UserX, AlertTriangle, UserCheck } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student } from '../types';

const AttendanceSystem: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('1st');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [isSaving, setIsSaving] = useState(false);

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
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const records = students.map(s => ({
      date: new Date().toISOString().split('T')[0],
      classSection: selectedClass,
      studentId: s.id,
      status: attendance[s.id],
      markedBy: 'ADMIN'
    }));
    
    StorageService.saveAttendance(records);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    alert('Attendance Saved and Synced!');
  };

  const absentees = Object.values(attendance).filter(s => s === 'A').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Attendance Register</h2>
          <p className="text-slate-500 text-sm">Status tracking for class <span className="font-bold text-indigo-600">{selectedClass}</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            disabled={students.length === 0 || isSaving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Processing...' : <><Send size={18} /> Submit Today's Record</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl text-slate-400">
            <Filter size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Class</p>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-sm font-bold text-slate-900 outline-none bg-transparent"
            >
              {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-emerald-500 p-6 rounded-3xl text-white flex items-center gap-4">
          <UserCheck size={24} />
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Present</p>
            <p className="text-2xl font-black">{students.length - absentees}</p>
          </div>
        </div>

        <div className="bg-rose-500 p-6 rounded-3xl text-white flex items-center gap-4">
          <UserX size={24} />
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Absent</p>
            <p className="text-2xl font-black">{absentees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {students.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Admission ID</th>
                <th className="px-6 py-4 text-center">Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {s.firstName[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">#{s.admissionNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       {['P', 'A', 'L'].map(st => (
                         <button 
                          key={st}
                          onClick={() => toggleStatus(s.id, st as any)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${
                            attendance[s.id] === st 
                            ? (st === 'P' ? 'bg-emerald-500 text-white shadow-emerald-200' : st === 'A' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-amber-500 text-white shadow-amber-200')
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                         >
                           {st}
                         </button>
                       ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center opacity-30 space-y-4">
             <AlertTriangle size={64} className="mx-auto" />
             <p className="font-bold">No students registered in Class {selectedClass}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;
