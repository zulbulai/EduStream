
import React, { useMemo } from 'react';
import { UserCircle, BookOpen, Award, Clock, DollarSign, Calendar, Download, UserCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ID Card Column */}
        <div className="w-full lg:w-96 shrink-0 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/20 border border-white/10">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-10">
                   <div className="bg-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">Student Pass</div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-indigo-300">EduStream Pro</p>
                      <p className="text-[7px] font-bold opacity-60">Digital ID v9.5</p>
                   </div>
                </div>
                
                <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl mb-8 ring-4 ring-indigo-500/30">
                   <img src={student.photo || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[2.5rem]" />
                </div>
                
                <h3 className="text-2xl font-black mb-1 tracking-tight">{student.firstName} {student.lastName}</h3>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-10">Class {student.admissionClass} - {student.section}</p>
                
                <div className="w-full grid grid-cols-2 gap-y-6 text-left p-6 bg-white/5 rounded-[2rem] border border-white/10">
                   <DetailItem label="Enrollment" value={student.admissionNo} />
                   <DetailItem label="Roll No" value={student.rollNo || 'N/A'} />
                   <DetailItem label="Blood Type" value={student.bloodGroup} />
                   <DetailItem label="Contact" value={student.mobile} />
                </div>
             </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Metrics</h4>
             <QuickStat icon={<UserCheck size={18}/>} label="Attendance" value={`${stats.attendance}%`} color="text-emerald-600" bg="bg-emerald-50" />
             <QuickStat icon={<DollarSign size={18}/>} label="Total Paid" value={`₹${stats.fees}`} color="text-indigo-600" bg="bg-indigo-50" />
             <QuickStat icon={<Award size={18}/>} label="Test Marks" value={stats.exams.toString()} color="text-amber-600" bg="bg-amber-50" />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-8">
           {/* Notices */}
           <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><AlertCircle size={150} /></div>
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                 <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                 Notice Board
              </h3>
              <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
                 {allNotifs.length > 0 ? allNotifs.map(n => (
                    <div key={n.id} className={`p-6 rounded-[2.5rem] border ${n.priority === 'Urgent' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/10'} hover:bg-white/10 transition-all`}>
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{n.date}</span>
                          <span className="text-[10px] font-black opacity-40 uppercase">By: {n.from}</span>
                       </div>
                       <h5 className="text-lg font-black mb-2">{n.title}</h5>
                       <p className="text-sm text-white/60 leading-relaxed">{n.message}</p>
                    </div>
                 )) : <p className="text-sm text-white/30 italic text-center py-10">No new school announcements.</p>}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Results */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-8">
                    <Award size={24} className="text-amber-500" />
                    Latest Scores
                 </h4>
                 <div className="space-y-4">
                    {allMarks.length > 0 ? allMarks.map(m => (
                       <div key={m.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.subject}</p>
                             <h5 className="text-sm font-black text-slate-800">{m.examName}</h5>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-indigo-600">{m.marksObtained}/{m.maxMarks}</p>
                          </div>
                       </div>
                    )) : <p className="text-sm text-slate-400 italic text-center py-10">No test marks recorded.</p>}
                 </div>
              </div>

              {/* Fees */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-8">
                    <DollarSign size={24} className="text-indigo-600" />
                    Fee History
                 </h4>
                 <div className="space-y-4">
                    {allFees.length > 0 ? allFees.slice(0, 4).map(f => (
                       <div key={f.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f.month}</p>
                             <h5 className="text-sm font-black text-slate-800">{f.feeType}</h5>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-slate-900">₹{f.totalAmount}</p>
                             <span className="text-[8px] font-black text-emerald-500 uppercase">Paid</span>
                          </div>
                       </div>
                    )) : <p className="text-sm text-slate-400 italic text-center py-10">No payments found.</p>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
   <div className="border-b border-white/10 pb-2">
      <span className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.2em] block mb-0.5">{label}</span>
      <span className="text-xs font-black tracking-tight">{value}</span>
   </div>
);

const QuickStat = ({ icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) => (
   <div className={`p-4 rounded-3xl ${bg} flex items-center justify-between border border-current/5`}>
      <div className="flex items-center gap-4">
         <div className={`p-3 bg-white rounded-2xl ${color} shadow-sm`}>{icon}</div>
         <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className={`text-lg font-black ${color}`}>{value}</span>
   </div>
);

export default StudentPortal;
