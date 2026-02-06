import React, { useState, useEffect } from 'react';
import { Award, Save, Loader2, AlertCircle } from 'lucide-react';
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
    
    // Default to existing marks or zero
    const existingMarks = StorageService.getMarks().filter(m => m.examName === examName && m.subject === subject);
    const initial: any = {};
    all.forEach(s => {
      const found = existingMarks.find(em => em.studentId === s.id);
      initial[s.id] = found ? found.marksObtained : 0;
    });
    setMarks(initial);
  }, [selectedClass, examName, subject]);

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
    
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    alert("Result synchronized successfully with student portals.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Gradebook</h2>
           <p className="text-slate-500 font-medium">Record metrics for <span className="text-indigo-600 font-bold">{selectedClass}</span> Students.</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={saving || students.length === 0}
           className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50"
        >
           {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Publish Result</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
         <InputGroup label="Target Class">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600">
               {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
         </InputGroup>
         <InputGroup label="Exam Name">
            <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </InputGroup>
         <InputGroup label="Subject">
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </InputGroup>
         <InputGroup label="Max Marks">
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:border-indigo-600" />
         </InputGroup>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         {students.length > 0 ? (
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <th className="px-10 py-6">Student Identity</th>
                     <th className="px-10 py-6 text-center">Marks Obtained ({maxMarks})</th>
                     <th className="px-10 py-6 text-right">Performance Indicator</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {students.map(s => (
                     <tr key={s.id} className="hover:bg-indigo-50/30 transition-all">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">{s.firstName[0]}</div>
                              <div>
                                 <p className="text-sm font-black text-slate-900">{s.firstName} {s.lastName}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase">{s.admissionNo}</p>
                              </div>
                           </div>
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
                                 {marks[s.id] >= maxMarks/2 ? 'Qualified' : 'Requires Review'}
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

// Fix: Made children optional to prevent TS errors in some environments where nested JSX children are not correctly associated with a required prop in the component's type definition.
const InputGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
   <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
   </div>
);

export default ExamManager;