
import React, { useState } from 'react';
import { UserCheck, Clock, DollarSign, Award, Send, MessageSquare, ShieldCheck, GraduationCap, Users, Calendar, AlertTriangle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Staff, UserRole, Notification } from '../types';

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
    alert("Notification sent to class " + member?.assignedClass);
    setNotifTitle('');
    setNotifMsg('');
  };

  if (!member) return <div className="p-20 text-center font-black">Teacher Profile Not Found</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Profile Card */}
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex flex-col items-center text-center">
               <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl mb-6 shadow-2xl shadow-indigo-100">
                  {member.name[0]}
               </div>
               <h3 className="text-2xl font-black text-slate-900">{member.name}</h3>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Faculty Identity</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
               <ProfileStat label="Qualification" value={member.qualification} icon={<GraduationCap size={14}/>} />
               <ProfileStat label="Class Teacher" value={member.assignedClass || 'None'} icon={<Users size={14}/>} />
               <ProfileStat label="Mobile" value={member.mobile} icon={<Calendar size={14}/>} />
            </div>

            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Pay & Attendance</p>
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold opacity-60">Monthly Salary</span>
                  <span className="text-lg font-black text-emerald-400">₹{member.salary}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold opacity-60">Advance Taken</span>
                  <span className="text-sm font-black text-rose-400">-₹{member.advanceAmount || 0}</span>
               </div>
               <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-white/10">
                  <div className="text-center">
                     <p className="text-[9px] font-black text-emerald-500 uppercase">Present</p>
                     <p className="text-xl font-black">{member.presentDays || 0}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[9px] font-black text-rose-500 uppercase">Leaves</p>
                     <p className="text-xl font-black">{member.leaveDays || 0}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Class Management & Notification */}
         <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <h4 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                  My Class: {member.assignedClass || 'N/A'}
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SummaryCard label="Total Students" value={students.length.toString()} color="bg-indigo-50 text-indigo-600" />
                  <SummaryCard label="Attendance Today" value="92%" color="bg-emerald-50 text-emerald-600" />
                  <SummaryCard label="Average Marks" value="78/100" color="bg-amber-50 text-amber-600" />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
               <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <MessageSquare size={20} className="text-indigo-600" />
                  Send Class Notification
               </h4>
               <div className="space-y-4">
                  <input 
                    type="text" 
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Notice Heading (e.g. Homework Update)"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-600 transition-all"
                  />
                  <textarea 
                    value={notifMsg}
                    onChange={(e) => setNotifMsg(e.target.value)}
                    rows={4}
                    placeholder="Describe the update here..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold outline-none focus:border-indigo-600 transition-all resize-none"
                  />
                  <button 
                    onClick={sendNotification}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                  >
                     <Send size={18} /> Broadcast to Class
                  </button>
               </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-start gap-4">
               <AlertTriangle size={24} className="text-amber-600 mt-1" />
               <div>
                  <h5 className="font-black text-amber-800 text-lg">System Reminder</h5>
                  <p className="text-sm text-amber-700 leading-relaxed font-medium">Please ensure all student marks for Unit Test 1 are uploaded by the 25th of this month. Direct sync with cloud will be initiated.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ProfileStat = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
   <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">{icon}</div>
         <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-800">{value}</span>
   </div>
);

const SummaryCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
   <div className={`p-6 rounded-3xl ${color.split(' ')[0]} border border-current/10`}>
      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
   </div>
);

export default TeacherPortal;
