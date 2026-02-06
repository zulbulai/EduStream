
import React, { useState } from 'react';
import { UserCheck, DollarSign, Send, MessageSquare, GraduationCap, Users, Edit3, ShieldAlert, Plus, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Staff, Student, FeeTransaction, Notification } from '../types';

interface TeacherPortalProps {
  staffId: string;
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ staffId }) => {
  const staff = StorageService.getStaff();
  const member = staff.find(s => s.id === staffId);
  const students = StorageService.getStudents().filter(s => s.admissionClass === member?.assignedClass);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditStudent = (s: Student) => {
    setSelectedStudent(s);
  };

  const handleUpdateStudent = () => {
    if(selectedStudent) {
      StorageService.saveStudent(selectedStudent);
      alert("Student records updated successfully.");
      setSelectedStudent(null);
      window.location.reload();
    }
  };

  const sendNotification = () => {
    if(!notifTitle || !notifMsg) return;
    const n: Notification = {
      id: `NTF-${Date.now()}`,
      from: member?.name || 'Teacher',
      to: member?.assignedClass || 'ALL',
      title: notifTitle,
      message: notifMsg,
      date: new Date().toISOString().split('T')[0],
      priority: 'Normal'
    };
    StorageService.saveNotification(n);
    alert("Notice sent to Class " + member?.assignedClass);
    setNotifTitle('');
    setNotifMsg('');
  };

  if (!member) return <div className="p-20 text-center font-black">Staff Record Missing</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Teacher Profile & Info */}
         <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl text-center">
               <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] mx-auto flex items-center justify-center font-black text-3xl mb-6 shadow-2xl">
                  {member.name[0]}
               </div>
               <h3 className="text-2xl font-black text-slate-900">{member.name}</h3>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">Class Teacher: {member.assignedClass}</p>
               
               <div className="mt-10 space-y-4 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Qualification</p>
                  <p className="text-sm font-black text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-100">{member.qualification}</p>
               </div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-[3rem] text-white shadow-2xl">
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Class Notice Broadcaster</h4>
               <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Subject" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-4 text-sm font-bold outline-none focus:border-indigo-400" />
               <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Message..." rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 text-sm font-bold outline-none focus:border-indigo-400 resize-none" />
               <button onClick={sendNotification} className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><Send size={16} /> Send to Students</button>
            </div>
         </div>

         {/* Class Student Management */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl">
               <div className="flex items-center justify-between mb-10">
                  <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                     <Users className="text-indigo-600" /> My Students ({students.length})
                  </h4>
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Academic Session 2025</div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map(s => (
                     <div key={s.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{s.firstName[0]}</div>
                           <div>
                              <p className="text-sm font-black text-slate-900">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {s.admissionNo}</p>
                           </div>
                        </div>
                        <button onClick={() => handleEditStudent(s)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 shadow-sm transition-all"><Edit3 size={16} /></button>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-center gap-6">
               <div className="w-16 h-16 bg-amber-200 rounded-3xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={32} className="text-amber-700" />
               </div>
               <div>
                  <h5 className="font-black text-amber-900 text-lg">Financial Recording Policy</h5>
                  <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase">
                     Teachers can collect and submit fees via the 'Fee Manager' tab, but every entry MUST be authorized by the Super Admin before appearing as verified.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Basic Student Edit Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-black mb-8">Basic Record Adjustment</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Student Name</label>
                    <input value={selectedStudent.firstName} onChange={e => setSelectedStudent({...selectedStudent, firstName: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Father's Name</label>
                       <input value={selectedStudent.fatherName} onChange={e => setSelectedStudent({...selectedStudent, fatherName: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Mobile</label>
                       <input value={selectedStudent.fatherMobile} onChange={e => setSelectedStudent({...selectedStudent, fatherMobile: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black" />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setSelectedStudent(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black">Cancel</button>
                    <button onClick={handleUpdateStudent} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Apply Changes</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPortal;
