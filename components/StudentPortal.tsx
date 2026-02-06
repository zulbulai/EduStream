
import React, { useMemo } from 'react';
import { UserCircle, BookOpen, Award, Clock, DollarSign, MapPin, Phone, Calendar, Download, ShieldCheck, Heart, UserCheck, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, FeeTransaction, AttendanceRecord, ExamMark, Notification } from '../types';

interface StudentPortalProps {
  studentId: string;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ studentId }) => {
  const students = StorageService.getStudents();
  const student = students.find(s => s.id === studentId);
  
  const allFees = StorageService.getFees().filter(f => f.studentId === studentId);
  const allAttendance = StorageService.getAttendance().filter(a => a.studentId === studentId);
  const allMarks = StorageService.getMarks().filter(m => m.studentId === studentId);
  const allNotifs = StorageService.getNotifications().filter(n => 
    n.to === 'ALL' || n.to === 'STUDENTS' || n.to === student?.admissionClass
  );

  const stats = useMemo(() => {
    const present = allAttendance.filter(a => a.status === 'P').length;
    const perc = allAttendance.length > 0 ? Math.round((present / allAttendance.length) * 100) : 100;
    const totalFees = allFees.reduce((acc, f) => acc + f.totalAmount, 0);
    return { attendance: perc, fees: totalFees, exams: allMarks.length };
  }, [allFees, allAttendance, allMarks]);

  if (!student) return <div className="p-20 text-center font-black">Student Profile Not Found</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Col: Digital ID Card */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/20">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-900 mb-6 font-black text-xs">EPS</div>
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl mb-6">
                   <img src={student.photo || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[2rem]" />
                </div>
                <h3 className="text-xl font-black mb-1">{student.firstName} {student.lastName}</h3>
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6">Student Identity Card</p>
                
                <div className="w-full space-y-4 text-left">
                   <IDItem label="Roll No" value={student.admissionNo} />
                   <IDItem label="Class" value={`${student.admissionClass} - ${student.section}`} />
                   <IDItem label="Blood" value={student.bloodGroup} />
                   <IDItem label="Mobile" value={student.mobile} />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 w-full flex justify-center">
                   <div className="w-16 h-16 bg-white p-2 rounded-xl">
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><Clock size={24}/></div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Stats</h4>
             <StatItem icon={<UserCheck size={14}/>} label="Attendance" value={`${stats.attendance}%`} color="text-emerald-600" />
             <StatItem icon={<DollarSign size={14}/>} label="Fee Paid" value={`₹${stats.fees}`} color="text-indigo-600" />
             <StatItem icon={<Award size={14}/>} label="Exams Done" value={stats.exams.toString()} color="text-amber-600" />
          </div>
        </div>

        {/* Right Col: Dashboard Content */}
        <div className="flex-1 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                 My Academic Progress
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subjects Enrolled</h4>
                    <div className="flex flex-wrap gap-2">
                       {student.subjects.map(s => (
                          <span key={s} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-100">{s}</span>
                       ))}
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enrolled Documents</h4>
                    <div className="grid grid-cols-1 gap-2">
                       {['Birth Certificate', 'Aadhar Card', 'Previous Marksheet'].map(d => (
                          <div key={d} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                             <span className="text-xs font-bold text-slate-600">{d}</span>
                             <Download size={14} className="text-indigo-400" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notifications */}
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><AlertCircle size={100} /></div>
                 <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                    <div className="w-2 h-4 bg-indigo-500 rounded-full"></div>
                    Notice Board
                 </h4>
                 <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {allNotifs.length > 0 ? allNotifs.map(n => (
                       <div key={n.id} className={`p-4 rounded-2xl border ${n.priority === 'Urgent' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{n.date}</p>
                          <h5 className="font-black text-sm mb-1">{n.title}</h5>
                          <p className="text-xs text-white/60 leading-relaxed">{n.message}</p>
                       </div>
                    )) : <p className="text-xs text-white/30 italic">No new notifications.</p>}
                 </div>
              </div>

              {/* Exam Marks */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                 <h4 className="text-xl font-black mb-6 text-slate-900 flex items-center gap-3">
                    <div className="w-2 h-4 bg-amber-500 rounded-full"></div>
                    Latest Exam Scores
                 </h4>
                 <div className="space-y-3">
                    {allMarks.length > 0 ? allMarks.map(m => (
                       <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.subject}</p>
                             <h5 className="text-sm font-black text-slate-800">{m.examName}</h5>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-indigo-600">{m.marksObtained}/{m.maxMarks}</p>
                             <p className="text-[9px] font-black text-emerald-500 uppercase">{Math.round((m.marksObtained/m.maxMarks)*100)}% Result</p>
                          </div>
                       </div>
                    )) : <p className="text-xs text-slate-400 italic">Marks not uploaded yet.</p>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const IDItem = ({ label, value }: { label: string, value: string }) => (
   <div className="flex justify-between items-center border-b border-white/10 pb-2">
      <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-black">{value}</span>
   </div>
);

const StatItem = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
   <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className={`p-2 bg-slate-50 rounded-lg ${color}`}>{icon}</div>
         <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className={`text-sm font-black ${color}`}>{value}</span>
   </div>
);

export default StudentPortal;
