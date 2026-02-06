
import React, { useState } from 'react';
import { UserCheck, Clock, DollarSign, Send, MessageSquare, GraduationCap, Users, Calendar, AlertTriangle, Briefcase, TrendingUp } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Staff, Notification } from '../types';

interface TeacherPortalProps {
  staffId: string;
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ staffId }) => {
  const staff = StorageService.getStaff();
  const member = staff.find(s => s.id === staffId);
  const students = StorageService.getStudents().filter(s => s.admissionClass === member?.assignedClass);
  
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

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
         {/* Profile Card */}
         <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl text-center relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full transition-transform duration-700 group-hover:scale-150"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl mb-6 shadow-2xl ring-8 ring-indigo-50">
                     {member.name[0]}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Senior Faculty</span>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-slate-100 space-y-5 text-left">
                  <HRDetail label="Highest Degree" value={member.qualification} icon={<GraduationCap size={16}/>} />
                  <HRDetail label="Class Teacher" value={member.assignedClass || 'None'} icon={<Users size={16}/>} />
                  <HRDetail label="Staff ID" value={member.id} icon={<Briefcase size={16}/>} />
                  <HRDetail label="Member Since" value={member.joiningDate} icon={<Calendar size={16}/>} />
               </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <DollarSign size={16} /> HR & Payroll
               </h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold opacity-60">Gross Salary</span>
                     <span className="text-2xl font-black text-emerald-400">₹{member.salary}</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-white/10">
                     <span className="text-sm font-bold opacity-60">Advance Taken</span>
                     <span className="text-lg font-black text-rose-400">-₹{member.advanceAmount || 0}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center">
                        <p className="text-[9px] font-black text-indigo-300 uppercase mb-1">Present</p>
                        <p className="text-2xl font-black">{member.presentDays || 0}</p>
                     </div>
                     <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center">
                        <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Leaves</p>
                        <p className="text-2xl font-black">{member.leaveDays || 0}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Class Hub */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                     <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                     My Class Hub: {member.assignedClass || 'N/A'}
                  </h4>
                  <TrendingUp size={24} className="text-indigo-600" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SummaryCard label="Enrolled Students" value={students.length.toString()} color="bg-indigo-50 text-indigo-600" />
                  <SummaryCard label="Avg Attendance" value="94%" color="bg-emerald-50 text-emerald-600" />
                  <SummaryCard label="Pending Exams" value="2" color="bg-amber-50 text-amber-600" />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
               <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <MessageSquare size={20} className="text-indigo-600" />
                  Broadcast Class Notice
               </h4>
               <div className="space-y-6">
                  <input 
                    type="text" 
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Notice Heading (e.g. Science Fair Postponed)"
                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                  />
                  <textarea 
                    value={notifMsg}
                    onChange={(e) => setNotifMsg(e.target.value)}
                    rows={5}
                    placeholder="Provide details about the homework or event..."
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[3rem] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none shadow-sm"
                  />
                  <button 
                    onClick={sendNotification}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4"
                  >
                     <Send size={20} /> Broadcast to My Class
                  </button>
               </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[3.5rem] text-amber-900 flex items-center gap-6 border border-amber-100">
               <div className="w-16 h-16 bg-amber-200 rounded-3xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={32} />
               </div>
               <div>
                  <h5 className="font-black text-lg">Payroll Reminder</h5>
                  <p className="text-xs font-medium">Please submit your leave application for the current cycle by Friday 3:00 PM.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const HRDetail = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
   <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
         <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
            {icon}
         </div>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value}</span>
   </div>
);

const SummaryCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
   <div className={`p-8 rounded-[2.5rem] ${color.split(' ')[0]} border border-current/10 shadow-sm`}>
      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
   </div>
);

export default TeacherPortal;
