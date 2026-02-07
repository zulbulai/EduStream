
import React, { useMemo, useState, useEffect } from 'react';
import { Users, UserCheck, DollarSign, AlertCircle, Clock, CheckCircle2, RefreshCw, Loader2, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storage';

const Dashboard: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      setDataVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  const students = useMemo(() => StorageService.getStudents(), [dataVersion]);
  const fees = useMemo(() => StorageService.getFees(), [dataVersion]);
  const attendance = useMemo(() => StorageService.getAttendance(), [dataVersion]);
  
  const pendingApprovals = useMemo(() => fees.filter(f => f.status === 'Pending'), [fees]);
  const verifiedFees = useMemo(() => fees.filter(f => f.status === 'Verified'), [fees]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'P').length;
    const totalVerifiedRevenue = verifiedFees.reduce((sum, f) => sum + f.totalAmount, 0);

    return [
      { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'bg-indigo-500', trend: 'Active Enrollment' },
      { label: 'Today Presence', value: presentCount.toString(), icon: UserCheck, color: 'bg-emerald-500', trend: `${totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}% Attendance` },
      { label: 'Verified Revenue', value: `₹${(totalVerifiedRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'bg-indigo-600', trend: 'Bank-settled payments' },
      { label: 'Pending Approval', value: pendingApprovals.length.toString(), icon: AlertCircle, color: 'bg-amber-500', trend: 'Requires Review' },
    ];
  }, [students, attendance, verifiedFees, pendingApprovals]);

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
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring school operations & verified finance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleManualSync}
            disabled={syncing}
            className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-200 hover:bg-indigo-50 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            {syncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {syncing ? 'Syncing...' : 'Live Cloud Sync'}
          </button>
          <div className="flex items-center gap-3 bg-indigo-900 text-white px-5 py-3 rounded-2xl shadow-xl">
            <ShieldCheck size={20} className="text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest">Admin Mode</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            <div className="mt-4 text-[10px] font-bold text-slate-500">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 h-fit">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                 <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                 Fee Approval Queue
              </h3>
              <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase">{pendingApprovals.length} Pending</span>
           </div>
           
           <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {pendingApprovals.length > 0 ? pendingApprovals.map((txn) => (
                  <div key={txn.id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-amber-200 transition-all">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-sm font-black text-slate-900">{txn.studentName}</h4>
                           <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{txn.class}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹{txn.totalAmount} • {txn.month} • {txn.mode}</p>
                        <p className="text-[9px] text-indigo-400 font-black uppercase mt-1">Requested By: {txn.requestedBy}</p>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(txn.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                           <CheckCircle2 size={14} /> Approve
                        </button>
                     </div>
                  </div>
              )) : (
                <div className="py-20 text-center opacity-30">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
                  <p className="text-sm font-bold uppercase tracking-widest">Finance queue is clear</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
           <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3"><Clock size={20} className="text-indigo-400" /> Recent Verifications</h3>
           <div className="space-y-4">
              {verifiedFees.slice(0, 8).map(f => (
                <div key={f.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-[10px]">PASS</div>
                   <div>
                     <p className="text-xs font-black">{f.studentName}</p>
                     <p className="text-[8px] text-indigo-300 font-black uppercase tracking-widest">₹{f.totalAmount} Settled</p>
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
