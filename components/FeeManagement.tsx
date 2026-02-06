
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Filter, Download, Plus, CheckCircle, Clock, X, Search, Loader2, FileText, ShieldAlert } from 'lucide-react';
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
  const isAdmin = currentUser.role === UserRole.ADMIN;

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
      setSelectedStudent(null);
      setSearchStudent('');
      setAmount('');
      setMonth('');
    }, 1000);
  };

  const handleDownloadInvoice = (txn: FeeTransaction) => {
    // Basic dynamic HTML invoice print logic
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const html = `
      <html>
        <head>
          <title>Fee Receipt - ${txn.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .school-name { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .receipt-title { font-size: 18px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            .content { margin-top: 40px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-size: 12px; color: #999; text-transform: uppercase; font-weight: bold; }
            .value { font-size: 16px; margin-bottom: 20px; font-weight: bold; }
            .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #aaa; }
            .amount-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 40px; border: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="school-name">EDUSTREAM ERP</div>
              <div style="font-size: 12px; color: #666;">Modern School Management Portal</div>
            </div>
            <div class="receipt-title">Payment Receipt</div>
          </div>
          <div class="content">
            <div class="grid">
              <div>
                <div class="label">Receipt Number</div>
                <div class="value">#${txn.id}</div>
                <div class="label">Student Name</div>
                <div class="value">${txn.studentName}</div>
                <div class="label">Class</div>
                <div class="value">${txn.class}</div>
              </div>
              <div style="text-align: right;">
                <div class="label">Payment Date</div>
                <div class="value">${txn.date}</div>
                <div class="label">Fee Month</div>
                <div class="value">${txn.month}</div>
                <div class="label">Payment Mode</div>
                <div class="value">${txn.mode}</div>
              </div>
            </div>
            <div class="amount-box">
              <div class="label">Total Amount Paid</div>
              <div style="font-size: 32px; font-weight: 900;">₹${txn.amount.toLocaleString()}</div>
              <div style="font-size: 12px; margin-top: 10px; color: #059669; font-weight: bold;">Status: ${txn.status}</div>
            </div>
          </div>
          <div class="footer">
            Computer generated receipt. Collected by ${txn.collectedBy}.<br>
            Thank you for choosing EduStream Pro.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  const totalCollected = fees.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Fee Ledger & Invoicing</h2>
          <p className="text-slate-500 font-medium">Monitoring school revenue and individual student payments.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} /> Collect Fee
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert size={14} /> Collection Disabled (Admin Only)
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Revenue</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">₹{totalCollected.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 text-[10px] font-black bg-emerald-50 px-3 py-1.5 rounded-full w-fit uppercase tracking-widest">
            <CheckCircle size={14} /> Live Sync Active
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Receipts</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{fees.length}</h3>
          <p className="text-xs text-slate-400 font-bold mt-6 tracking-tight uppercase flex items-center gap-2">
            <Clock size={14} className="text-indigo-500" />
            Recently updated {fees[0]?.date || 'Never'}
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <DollarSign size={64} />
          </div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Monthly Goal</p>
          <h3 className="text-4xl font-black mb-6 tracking-tight">₹25.0L</h3>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2 shadow-inner">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalCollected/2500000)*100, 100)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Session Performance: {Math.min((totalCollected/2500000)*100, 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-slate-100">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
             Recent Transactions
          </h3>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          {fees.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-5">TXN REFERENCE</th>
                  <th className="px-10 py-5">SENSITIVE DETAILS</th>
                  <th className="px-10 py-5">FEE PERIOD</th>
                  <th className="px-10 py-5">SETTLEMENT</th>
                  <th className="px-10 py-5">DOCUMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fees.map((txn) => (
                  <tr key={txn.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-10 py-5">
                       <p className="text-[10px] font-mono font-black text-slate-400 group-hover:text-indigo-600 transition-colors">#{txn.id}</p>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{txn.date}</p>
                    </td>
                    <td className="px-10 py-5">
                      <div>
                        <p className="text-sm font-black text-slate-900">{txn.studentName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Class {txn.class}</p>
                      </div>
                    </td>
                    <td className="px-10 py-5">
                      <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200">{txn.month}</span>
                    </td>
                    <td className="px-10 py-5">
                      <p className="text-lg font-black text-slate-900 tracking-tight">₹{txn.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{txn.mode} Verified</p>
                    </td>
                    <td className="px-10 py-5">
                      <button 
                        onClick={() => handleDownloadInvoice(txn)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                      >
                        <FileText size={14} /> Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 text-center space-y-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto border-4 border-dashed border-slate-100">
                <DollarSign size={48} />
              </div>
              <div className="max-w-xs mx-auto">
                <p className="font-black text-slate-800 text-lg">Empty Ledger</p>
                <p className="text-sm text-slate-400 font-medium mt-1">Ready to accept payments. Click "Collect Fee" to start your school's revenue tracking.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-8 ring-white/20">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Fee Receipt</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction Portal</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-all shadow-sm border border-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lookup Student</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search Name or Admission ID..."
                      value={searchStudent}
                      onChange={(e) => {
                        setSearchStudent(e.target.value);
                        setSelectedStudent(null);
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 font-bold transition-all"
                    />
                  </div>
                  
                  {searchStudent && !selectedStudent && (
                    <div className="absolute w-full mt-3 bg-white border border-slate-200 shadow-2xl rounded-2xl z-20 overflow-hidden divide-y divide-slate-100 animate-in slide-in-from-top-2">
                      {filteredStudents.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => { setSelectedStudent(s); setSearchStudent(`${s.firstName} ${s.lastName}`); }}
                          className="p-4 hover:bg-indigo-50 cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {s.firstName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Class {s.admissionClass} • {s.admissionNo}</p>
                            </div>
                          </div>
                          <Plus size={16} className="text-indigo-600" />
                        </div>
                      ))}
                      {filteredStudents.length === 0 && <div className="p-6 text-center text-xs text-slate-400 font-bold">No student match found</div>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount Payable (INR)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="5000"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-black text-xl tracking-tight transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Billing Month</label>
                    <select 
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                      required
                    >
                      <option value="">Select Month</option>
                      {['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Transaction Mode</label>
                  <div className="flex flex-wrap gap-3">
                    {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map(m => (
                      <button 
                        key={m}
                        type="button"
                        onClick={() => setMode(m as any)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          mode === m ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
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
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Generate & Finalize Receipt</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
