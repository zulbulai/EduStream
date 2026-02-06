
import React, { useMemo, useState } from 'react';
import { UserCircle, Award, DollarSign, UserCheck, AlertCircle, CheckCircle2, CreditCard, Send } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, FeeTransaction, AttendanceRecord, ExamMark, Notification } from '../types';

interface StudentPortalProps {
  studentId: string;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ studentId }) => {
  const students = StorageService.getStudents();
  const student = students.find(s => s.id === studentId);
  const [payModal, setPayModal] = useState(false);
  const [month, setMonth] = useState('');
  
  const allFees = StorageService.getFees().filter(f => f.studentId === studentId);
  const allAttendance = StorageService.getAttendance().filter(a => a.studentId === studentId);
  const allMarks = StorageService.getMarks().filter(m => m.studentId === studentId);
  const allNotifs = StorageService.getNotifications().filter(n => 
    n.to === 'ALL' || n.to === 'STUDENTS' || n.to === student?.admissionClass
  );

  const handlePayRequest = () => {
    if(!month) return;
    const txn: FeeTransaction = {
      id: `PAY-${Date.now()}`,
      studentId: studentId,
      studentName: student?.firstName || 'Student',
      class: student?.admissionClass || 'N/A',
      date: new Date().toISOString().split('T')[0],
      feeType: 'Tuition Fee',
      baseAmount: 2500, // Predefined or dynamic
      fineAmount: 0,
      totalAmount: 2500,
      fineReason: 'N/A',
      month,
      mode: 'UPI (Self)',
      status: 'Pending',
      collectedBy: 'System Pending',
      requestedBy: student?.firstName || 'Student'
    };
    StorageService.saveFee(txn);
    alert("Payment request sent to Admin for approval.");
    setPayModal(false);
  };

  const stats = useMemo(() => {
    const present = allAttendance.filter(a => a.status === 'P').length;
    const perc = allAttendance.length > 0 ? Math.round((present / allAttendance.length) * 100) : 100;
    const totalVerified = allFees.filter(f => f.status === 'Verified').reduce((acc, f) => acc + f.totalAmount, 0);
    return { attendance: perc, fees: totalVerified, exams: allMarks.length };
  }, [allFees, allAttendance, allMarks]);

  if (!student) return <div className="p-20 text-center font-black">Student Profile Not Found</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ID Card Column - Read Only */}
        <div className="w-full lg:w-96 shrink-0 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-10">
                   <div className="bg-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">Digital ID (Read Only)</div>
                </div>
                
                <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl mb-8">
                   <img src={student.photo || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[2.5rem]" />
                </div>
                
                <h3 className="text-2xl font-black mb-1 tracking-tight">{student.firstName} {student.lastName}</h3>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-10">{student.admissionClass}</p>
                
                <div className="w-full space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                   <DetailItem label="Official ID" value={student.admissionNo} />
                   <DetailItem label="Contact" value={student.mobile} />
                   <DetailItem label="Guardian" value={student.fatherName} />
                </div>
             </div>
          </div>
          
          <button 
            onClick={() => setPayModal(true)}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
          >
             <CreditCard size={20} /> Pay Online Fee
          </button>
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-8">
           <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                 <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                 Quick Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard icon={<UserCheck size={20}/>} label="Attendance" value={`${stats.attendance}%`} color="text-emerald-600" />
                 <StatCard icon={<DollarSign size={20}/>} label="Fees Paid" value={`₹${stats.fees}`} color="text-indigo-600" />
                 <StatCard icon={<Award size={20}/>} label="Exams" value={stats.exams.toString()} color="text-amber-600" />
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
              <h4 className="text-xl font-black mb-8 flex items-center gap-3"><AlertCircle className="text-amber-500" /> Active Notices</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                 {allNotifs.map(n => (
                    <div key={n.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                       <h5 className="font-black text-indigo-300">{n.title}</h5>
                       <p className="text-sm opacity-60 mt-1">{n.message}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {payModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[3rem] p-10 animate-in zoom-in-95">
              <h3 className="text-2xl font-black mb-4">Pay Tuition Fee</h3>
              <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">Amount: ₹2,500.00</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Select Month</label>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black">
                       <option value="">Choose Month</option>
                       {['April 2025', 'May 2025', 'June 2025'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                 </div>
                 
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <p className="text-[10px] font-black text-indigo-700 uppercase leading-relaxed">Admin will verify this request manually before it shows in your paid records.</p>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => setPayModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest">Cancel</button>
                    <button onClick={handlePayRequest} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                       <Send size={16} /> Submit
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
   <div className="flex justify-between items-center py-2 border-b border-white/10">
      <span className="text-[8px] font-black text-indigo-300 uppercase">{label}</span>
      <span className="text-xs font-black">{value}</span>
   </div>
);

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
      <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 ${color} shadow-sm`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
   </div>
);

export default StudentPortal;
