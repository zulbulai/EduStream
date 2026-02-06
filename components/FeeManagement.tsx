
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Filter, Download, Plus, CheckCircle, Clock, X, Search, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { FeeTransaction, Student, User } from '../types';

interface FeeManagementProps {
  currentUser: User;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ currentUser }) => {
  const [fees, setFees] = useState<FeeTransaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer'>('Cash');

  useEffect(() => {
    setFees(StorageService.getFees());
    setStudents(StorageService.getStudents());
  }, []);

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) || 
    s.admissionNo.toLowerCase().includes(searchStudent.toLowerCase())
  ).slice(0, 5);

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount || !month) return;

    setLoading(true);
    const newTxn: FeeTransaction = {
      id: `TXN-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      class: selectedStudent.admissionClass,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      month,
      mode,
      status: 'Verified',
      collectedBy: currentUser.name
    };

    StorageService.saveFee(newTxn);
    setFees([newTxn, ...fees]);
    
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      // Reset form
      setSelectedStudent(null);
      setAmount('');
      setMonth('');
    }, 1000);
  };

  const totalCollected = fees.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Accounting & Fees</h2>
          <p className="text-slate-500">Real-time revenue tracking and transaction ledger.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Collect New Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Collections</p>
          <h3 className="text-3xl font-black text-slate-900">₹{totalCollected.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded w-fit">
            <TrendingUp size={14} /> Live Sync
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Transactions</p>
          <h3 className="text-3xl font-black text-slate-900">{fees.length}</h3>
          <p className="text-xs text-slate-400 font-bold mt-4 tracking-tight uppercase">Successfully processed</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Session Target</p>
          <h3 className="text-3xl font-black mb-4">₹50.0L</h3>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((totalCollected/5000000)*100, 100)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-widest">Revenue Forecast Active</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Transaction Ledger</h3>
          <button className="p-2 text-slate-400 hover:text-indigo-600"><Filter size={18} /></button>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {fees.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-4">TXN ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Fee Month</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fees.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{txn.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{txn.studentName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Class {txn.class}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{txn.month}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">{txn.mode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <CheckCircle size={12} /> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center opacity-30">
              <DollarSign size={64} className="mx-auto mb-4" />
              <p className="font-bold">No transactions found</p>
              <p className="text-sm">Start by collecting fees for your students.</p>
            </div>
          )}
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Collect Student Fee</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Search Student</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Enter Name or ID..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                    />
                  </div>
                  
                  {searchStudent && !selectedStudent && (
                    <div className="absolute w-full mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl z-20 overflow-hidden divide-y divide-slate-50">
                      {filteredStudents.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => { setSelectedStudent(s); setSearchStudent(`${s.firstName} ${s.lastName}`); }}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Class {s.admissionClass} • {s.admissionNo}</p>
                          </div>
                          <Plus size={14} className="text-indigo-600" />
                        </div>
                      ))}
                      {filteredStudents.length === 0 && <div className="p-4 text-center text-xs text-slate-400 font-bold">No student found</div>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Amount (INR)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Fee Month</label>
                    <select 
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                      required
                    >
                      <option value="">Select</option>
                      {['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Payment Mode</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map(m => (
                      <button 
                        key={m}
                        type="button"
                        onClick={() => setMode(m as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                          mode === m ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || !selectedStudent}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Payment Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
