
import React, { useState, useEffect } from 'react';
import { Award, Search, Save, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, ExamMark } from '../types';

const ExamManager: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('1st');
  const [examName, setExamName] = useState('Unit Test 1');
  const [subject, setSubject] = useState('Mathematics');
  const [maxMarks, setMaxMarks] = useState(50);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const all = StorageService.getStudents().filter(s => s.admissionClass === selectedClass);
    setStudents(all);
    
    // Reset marks
    const initial: any = {};
    all.forEach(s => initial[s.id] = 0);
    setMarks(initial);
  }, [selectedClass]);

  const handleSave = async () => {
    setSaving(true);
    students.forEach(s => {
      const m: ExamMark = {
        id: `MRK-${s.id}-${examName}-${subject}`,
        studentId: s.id,
        examName,
        subject,
        marksObtained: marks[s.id] || 0,
        maxMarks,
        date: new Date().toISOString().split('T')[0]
      };
      StorageService.saveMark(m);
    });
    
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    alert("Academic Marks synchronized successfully.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Grading Manager</h2>
           <p className="text-slate-500 font-medium">Record and analyze performance metrics for your class.</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={saving || students.length === 0}
           className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50"
        >
           {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Sync Marksheet</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600">
               {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Type</label>
            <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         {students.length > 0 ? (
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <th className="px-10 py-6">Student Identity</th>
                     <th className="px-10 py-6">Class / Admission</th>
                     <th className="px-10 py-6 text-center">Marks Obtained ({maxMarks})</th>
                     <th className="px-10 py-6 text-right">Result Pulse</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {students.map(s => (
                     <tr key={s.id} className="hover:bg-indigo-50/30 transition-all">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">{s.firstName[0]}</div>
                              <span className="text-sm font-black text-slate-900">{s.firstName} {s.lastName}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">
                           {s.admissionClass} • {s.admissionNo}
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex justify-center">
                              <input 
                                 type="number" 
                                 value={marks[s.id]} 
                                 max={maxMarks}
                                 onChange={(e) => setMarks({...marks, [s.id]: parseInt(e.target.value) || 0})}
                                 className="w-24 p-3 bg-white border-2 border-slate-100 rounded-xl font-black text-center text-indigo-600 focus:border-indigo-600 outline-none"
                              />
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex flex-col items-end">
                              <span className={`text-[10px] font-black uppercase ${marks[s.id] >= maxMarks/2 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                 {marks[s.id] >= maxMarks/2 ? 'Qualifying' : 'Action Needed'}
                              </span>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                 <div className={`h-full ${marks[s.id] >= maxMarks/2 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${(marks[s.id]/maxMarks)*100}%` }}></div>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         ) : (
            <div className="py-40 text-center space-y-4">
               <AlertCircle size={48} className="mx-auto text-slate-200" />
               <p className="text-slate-400 font-black uppercase text-xs">No students enrolled in this class.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default ExamManager;
