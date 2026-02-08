
import React, { useMemo, useState, useEffect } from 'react';
import { Users, UserCheck, DollarSign, AlertCircle, Clock, CheckCircle2, RefreshCw, Loader2, ShieldCheck, GraduationCap, TrendingUp, UserPlus, Camera } from 'lucide-react';
import { StorageService } from '../services/storage';

const Dashboard: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => setDataVersion(v => v + 1));
    return unsubscribe;
  }, []);

  const students = useMemo(() => StorageService.getStudents(), [dataVersion]);
  const fees = useMemo(() => StorageService.getFees(), [dataVersion]);
  const attendance = useMemo(() => StorageService.getAttendance(), [dataVersion]);
  const staff = useMemo(() => StorageService.getStaff(), [dataVersion]);
  
  const pendingApprovals = useMemo(() => fees.filter(f => f.status === 'Pending'), [fees]);
  const verifiedFees = useMemo(() => fees.filter(f => f.status === 'Verified'), [fees]);
  const recentStudents = useMemo(() => students.slice(0, 4), [students]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'P').length;
    const totalVerifiedRevenue = verifiedFees.reduce((sum, f) => sum + f.totalAmount, 0);

    return [
      { label: 'Total Enrollment', value: totalStudents.toLocaleString(), icon: Users, color: 'bg-indigo-600', trend: 'Global Database' },
      { label: 'Faculty Count', value: staff.length.toString(), icon: GraduationCap, color: 'bg-slate-900', trend: 'Active Educators' },
      { label: 'Verified Ledger', value: `₹${(totalVerifiedRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'bg-emerald-600', trend: 'Synced Revenue' },
      { label: 'Fee Queue', value: pendingApprovals.length.toString(), icon: AlertCircle, color: 'bg-amber-500', trend: 'Action Required' },
    ];
  }, [students, attendance, verifiedFees, pendingApprovals, staff]);

  const handleApprove = async (id: string) => {
    const txn = fees.find(f => f.id === id);
    if (txn) {
      txn.status = 'Verified';
      StorageService.saveFee(txn);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await StorageService.syncFromCloud();
    setSyncing(false);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Management Cockpit</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time educational intelligence and financial oversight.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleManualSync}
            disabled={syncing}
            className="px-6 py-4 bg-white text-indigo-600 rounded-[1.5rem] shadow-sm border border-slate-100 hover:bg-indigo-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
          >
            {syncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {syncing ? 'Fetching...' : 'Cloud Refresh'}
          </button>
          <div className="hidden lg:flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl">
            <ShieldCheck size={20} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Authorized Session</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group transition-all hover:shadow-xl hover:border-indigo-100 ring-1 ring-slate-50">
            <div className="flex items-center justify-between mb-8">
              <div className={`${stat.color} p-5 rounded-[1.5rem] text-white shadow-2xl`}>
                <stat.icon size={28} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                 <TrendingUp size={16} />
              </div>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{stat.value}</p>
            <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Recent Students with Photos */}
           <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 ring-1 ring-slate-50">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                    New Enrollments
                 </h3>
                 <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full uppercase tracking-widest">Active Intake</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {recentStudents.length > 0 ? recentStudents.map(student => (
                   <div key={student.id} className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm shrink-0">
                         {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" alt={student.firstName} />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100"><Camera size={20} /></div>
                         )}
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-black text-slate-900">{student.firstName} {student.lastName}</h4>
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Class {student.admissionClass} • #{student.admissionNo}</p>
                         <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full"></div>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="col-span-2 py-10 text-center opacity-30 flex flex-col items-center">
                     <UserPlus size={48} className="mb-4" />
                     <p className="text-sm font-black uppercase tracking-widest">Awaiting First Enrollment</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Payment Queue */}
           <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 ring-1 ring-slate-50">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                    <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                    Fee Approval Queue
                 </h3>
                 <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-4 py-2 rounded-full uppercase tracking-widest border border-amber-100">{pendingApprovals.length} Pending</span>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {pendingApprovals.length > 0 ? pendingApprovals.map((txn) => (
                     <div key={txn.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-amber-200 transition-all group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100">
                           {txn.studentName[0]}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-black text-slate-900">{txn.studentName}</h4>
                              <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full">{txn.class}</span>
                           </div>
                           <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em]">₹{txn.totalAmount} • {txn.month} • {txn.mode}</p>
                        </div>
                        <button 
                           onClick={() => handleApprove(txn.id)}
                           className="px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
                        >
                           <CheckCircle2 size={16} /> Verify Entry
                        </button>
                     </div>
                 )) : (
                   <div className="py-20 text-center opacity-30 flex flex-col items-center">
                     <CheckCircle2 size={64} className="mb-6 text-emerald-500" />
                     <p className="text-sm font-black uppercase tracking-widest">Financial ledger is balanced</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl text-white">
           <h3 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-4"><Clock size={24} className="text-indigo-400" /> Recent Receipts</h3>
           <div className="space-y-4">
              {verifiedFees.slice(0, 10).map(f => (
                <div key={f.id} className="flex items-center gap-5 bg-white/5 p-6 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all">
                   <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-[10px] border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all uppercase tracking-tighter">Verified</div>
                   <div>
                     <p className="text-sm font-black leading-none">{f.studentName}</p>
                     <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mt-2">₹{f.totalAmount} • {f.date}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
