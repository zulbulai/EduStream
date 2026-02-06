
import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Plus, CheckCircle, X, ShieldAlert, AlertCircle, Calculator, FileText, CheckCircle2 } from 'lucide-react';
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
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.ACCOUNTANT;

  // Form State
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeType, setFeeType] = useState('Tuition Fee');
  const [baseAmount, setBaseAmount] = useState('');
  const [fineAmount, setFineAmount] = useState('0');
  const [fineReason, setFineReason] = useState('');
  const [month, setMonth] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer'>('Cash');

  useEffect(() => {
    setFees(StorageService.getFees());
    setStudents(StorageService.getStudents());
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
      fineAmount: parseFloat(fineAmount) || 0,
      totalAmount: (parseFloat(baseAmount) || 0) + (parseFloat(fineAmount) || 0),
      fineReason: fineReason || 'N/A',
      month,
      mode,
      status: isAdmin ? 'Verified' : 'Pending', // Only Admin can record Verified fees
      collectedBy: isAdmin ? currentUser.name : 'System Queue',
      requestedBy: currentUser.name
    };

    StorageService.saveFee(newTxn);
    setFees(StorageService.getFees());
    
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      alert(isAdmin ? "Fee Record Verified." : "Fee submitted for Admin Approval.");
      resetForm();
    }, 1000);
  };

  const handleVerify = (id: string) => {
    const txn = fees.find(f => f.id === id);
    if (txn) {
      txn.status = 'Verified';
      txn.collectedBy = currentUser.name;
      StorageService.saveFee(txn);
      setFees(StorageService.getFees());
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSearchStudent('');
    setBaseAmount('');
    setFineAmount('0');
    setFeeType('Tuition Fee');
  };

  const totalVerified = fees.filter(f => f.status === 'Verified').reduce((acc, f) => acc + f.totalAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Finance Control Master</h2>
          <p className="text-slate-500 font-medium">Verify revenue flows and authorized transactions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-2xl flex items-center gap-3 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> New Record Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <SummaryBox label="Verified Net Cash" value={`₹${totalVerified.toLocaleString()}`} color="text-emerald-600" />
         <SummaryBox label="Pending Approvals" value={fees.filter(f => f.status === 'Pending').length.toString()} color="text-amber-500" />
         <SummaryBox label="Verification Rate" value="98.2%" color="text-indigo-600" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <th className="px-10 py-6">Transaction Detail</th>
                 <th className="px-10 py-6">Status</th>
                 <th className="px-10 py-6">Origin</th>
                 <th className="px-10 py-6 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {fees.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-all">
                   <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-900">{f.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">₹{f.totalAmount} • {f.month}</p>
                   </td>
                   <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        f.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600 animate-pulse'
                      }`}>
                         {f.status}
                      </span>
                   </td>
                   <td className="px-10 py-6 text-[10px] font-black text-slate-400">
                      BY: {f.requestedBy}
                   </td>
                   <td className="px-10 py-6 text-right">
                      {f.status === 'Pending' && isAdmin ? (
                        <button onClick={() => handleVerify(f.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Verify Now</button>
                      ) : (
                        <CheckCircle2 size={20} className="ml-auto text-emerald-500" />
                      )}
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10">
              <h3 className="text-2xl font-black mb-8">Initiate Payment Record</h3>
              <form onSubmit={handleCollectFee} className="space-y-6">
                 {/* Selection logic (simplified search) */}
                 <input 
                   type="text" 
                   placeholder="Student Search..." 
                   value={searchStudent} 
                   onChange={(e) => {
                      setSearchStudent(e.target.value);
                      const s = students.find(s => s.admissionNo === e.target.value || s.firstName.includes(e.target.value));
                      if(s) setSelectedStudent(s);
                   }}
                   className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                 />
                 {selectedStudent && <p className="text-xs font-black text-emerald-600 px-4">Selected: {selectedStudent.firstName} (Class {selectedStudent.admissionClass})</p>}
                 
                 <div className="grid grid-cols-2 gap-4">
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" required>
                       <option value="">Month</option>
                       {['April 2025', 'May 2025', 'June 2025'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="number" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} placeholder="Amount" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" required />
                 </div>

                 <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-600" />
                    <p className="text-[10px] font-black text-amber-700 uppercase leading-relaxed">Important: This payment will be sent for Admin verification. It won't be credited to the total until approved.</p>
                 </div>

                 <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-600 transition-all">Submit for Review</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const SummaryBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
     <p className={`text-4xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

export default FeeManagement;
