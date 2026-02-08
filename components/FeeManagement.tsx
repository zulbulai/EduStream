
import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Plus, CheckCircle2, AlertCircle, FileText, CheckCircle, ShieldAlert, X, Filter, Smartphone, CreditCard, RefreshCw } from 'lucide-react';
import { StorageService } from '../services/storage';
import { FeeTransaction, Student, User, UserRole } from '../types';

interface FeeManagementProps {
  currentUser: User;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ currentUser }) => {
  const [fees, setFees] = useState<FeeTransaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.ACCOUNTANT;

  // Form State
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeType, setFeeType] = useState('Tuition Fee');
  const [baseAmount, setBaseAmount] = useState('2500');
  const [month, setMonth] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer'>('Cash');

  useEffect(() => {
    setFees(StorageService.getFees());
    setStudents(StorageService.getStudents());
    
    const unsubscribe = StorageService.subscribe(() => {
      setFees(StorageService.getFees());
    });
    return unsubscribe;
  }, []);

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !baseAmount || !month) return;

    setLoading(true);
    const newTxn: FeeTransaction = {
      id: `TXN-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      class: selectedStudent.admissionClass,
      date: new Date().toISOString().split('T')[0],
      feeType,
      baseAmount: parseFloat(baseAmount),
      fineAmount: 0,
      totalAmount: parseFloat(baseAmount),
      fineReason: 'N/A',
      month,
      mode,
      status: isAdmin ? 'Verified' : 'Pending',
      collectedBy: isAdmin ? currentUser.name : 'System Queue',
      requestedBy: currentUser.name
    };

    StorageService.saveFee(newTxn);
    
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      resetForm();
    }, 1000);
  };

  const handleVerify = (id: string) => {
    const txn = fees.find(f => f.id === id);
    if (txn) {
      txn.status = 'Verified';
      txn.collectedBy = currentUser.name;
      StorageService.saveFee(txn);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSearchStudent('');
    setBaseAmount('2500');
    setMonth('');
  };

  const filteredFees = fees.filter(f => 
    f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVerified = fees.filter(f => f.status === 'Verified').reduce((acc, f) => acc + f.totalAmount, 0);

  return (
    <div className="space-y-10 pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Financial Ledger</h2>
          <p className="text-slate-500 font-medium mt-1">Authorized transaction tracking & bank settlements.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:bg-indigo-700 transition-all hover:-translate-y-1"
        >
          <Plus size={18} strokeWidth={3} /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Metric label="Bank-Verified Assets" value={`₹${totalVerified.toLocaleString()}`} color="text-emerald-600" trend="Gross Received" />
         <Metric label="Awaiting Approval" value={fees.filter(f => f.status === 'Pending').length.toString()} color="text-amber-500" trend="Pending Verification" />
         <Metric label="System Throughput" value="100%" color="text-indigo-600" trend="Cloud Status: Active" />
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden ring-1 ring-slate-100">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-6">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search by Student Name or TXN ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm"
              />
           </div>
           <button className="px-10 py-5 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 hover:text-slate-900 transition-colors">
              <Filter size={18} /> Filter Records
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white border-b border-slate-50">
                   <th className="px-10 py-8">Account Owner</th>
                   <th className="px-10 py-8">Ledger Entry</th>
                   <th className="px-10 py-8">Authorization Status</th>
                   <th className="px-10 py-8 text-right">Verification</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {filteredFees.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-all group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100">
                              {f.studentName[0]}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-none">{f.studentName}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2">{f.class} • {f.id}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <p className="text-lg font-black text-slate-900 leading-none">₹{f.totalAmount}</p>
                        <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-2">{f.month} • {f.mode}</p>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             f.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                           }`}>
                              {f.status}
                           </span>
                           <p className="text-[8px] text-slate-400 font-black uppercase">BY: {f.requestedBy}</p>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-right">
                        {f.status === 'Pending' && isAdmin ? (
                          <button onClick={() => handleVerify(f.id)} className="px-6 py-3 bg-indigo-600 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Approve Entry</button>
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-emerald-500">
                             <CheckCircle2 size={24} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                        )}
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filteredFees.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center opacity-30">
               <DollarSign size={64} className="mb-6" />
               <p className="text-sm font-black uppercase tracking-widest">No matching transactions found</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 animate-in zoom-in-95 duration-500 relative ring-8 ring-white/10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-4 text-slate-300 hover:text-rose-500 transition-colors">
                 <X size={28} />
              </button>
              
              <div className="mb-12">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Record Receipt</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Institutional Accounting Gateway</p>
              </div>

              <form onSubmit={handleCollectFee} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Authorized Student Search</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Enter Admission No or Name..." 
                         value={searchStudent} 
                         onChange={(e) => {
                            setSearchStudent(e.target.value);
                            const s = students.find(s => s.admissionNo === e.target.value || s.firstName.toLowerCase().includes(e.target.value.toLowerCase()));
                            if(s) setSelectedStudent(s);
                            else setSelectedStudent(null);
                         }}
                         className="w-full pl-8 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                       />
                       {selectedStudent && (
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-white px-4 py-1.5 rounded-full border border-emerald-100">
                             <CheckCircle size={14} /> Identified
                          </div>
                       )}
                    </div>
                    {selectedStudent && (
                       <p className="text-xs font-black text-indigo-600 px-6 animate-in slide-in-from-top-2">
                          Mapped: {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.admissionClass})
                       </p>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Payment Month</label>
                       <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-black outline-none focus:border-indigo-600 transition-all appearance-none" required>
                          <option value="">Select Month</option>
                          {['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025'].map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Settlement Mode</label>
                       <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-black outline-none focus:border-indigo-600 transition-all appearance-none">
                          <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Amount to Transact (INR)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input type="number" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} className="w-full pl-14 pr-8 py-6 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] font-black text-3xl text-indigo-600 outline-none focus:bg-white focus:border-indigo-600 transition-all" required />
                    </div>
                 </div>

                 <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center gap-5">
                    <ShieldAlert size={32} className="text-amber-600 shrink-0" />
                    <p className="text-[10px] font-black text-amber-700 uppercase leading-relaxed tracking-wider">
                       Strict Policy: This transaction will be logged as {isAdmin ? 'VERIFIED' : 'PENDING'}. 
                       Cloud audit trails will record {currentUser.name} as the authorized requestor.
                    </p>
                 </div>

                 <button 
                  type="submit" 
                  disabled={loading || !selectedStudent}
                  className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-30 disabled:translate-y-0"
                 >
                    {loading ? <><RefreshCw className="animate-spin" /> Authorizing...</> : 'Confirm & Log Transaction'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value, color, trend }: any) => (
  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{label}</p>
     <p className={`text-5xl font-black ${color} tracking-tighter mb-4`}>{value}</p>
     <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
        <RefreshCw size={10} /> {trend}
     </div>
  </div>
);

export default FeeManagement;
