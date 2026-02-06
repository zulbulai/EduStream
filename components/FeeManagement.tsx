
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Filter, Download, Plus, CheckCircle, Clock, X, Search, Loader2, FileText, ShieldAlert, AlertCircle, Calculator } from 'lucide-react';
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

  // Advanced Form State
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeType, setFeeType] = useState<FeeTransaction['feeType']>('Tuition Fee');
  const [baseAmount, setBaseAmount] = useState('');
  const [fineAmount, setFineAmount] = useState('0');
  const [fineReason, setFineReason] = useState('');
  const [month, setMonth] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer'>('Cash');

  useEffect(() => {
    setFees(StorageService.getFees());
    setStudents(StorageService.getStudents());
  }, []);

  const totalCalculated = (parseFloat(baseAmount) || 0) + (parseFloat(fineAmount) || 0);

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) || 
    s.admissionNo.toLowerCase().includes(searchStudent.toLowerCase())
  ).slice(0, 5);

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
      totalAmount: totalCalculated,
      fineReason: fineReason || 'N/A',
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
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSearchStudent('');
    setBaseAmount('');
    setFineAmount('0');
    setFineReason('');
    setMonth('');
    setFeeType('Tuition Fee');
  };

  const handleDownloadInvoice = (txn: FeeTransaction) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const html = `
      <html>
        <head>
          <title>Advanced Receipt - ${txn.id}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
            .invoice-card { background: white; padding: 50px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 800px; margin: auto; border: 1px solid #e2e8f0; position: relative; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0,0,0,0.03); font-weight: 900; pointer-events: none; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #6366f1; padding-bottom: 30px; margin-bottom: 40px; }
            .school-name { font-size: 28px; font-weight: 900; color: #4f46e5; letter-spacing: -1px; }
            .receipt-badge { background: #6366f1; color: white; padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 5px; }
            .value { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
            .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .fee-table th { text-align: left; padding: 15px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-transform: uppercase; }
            .fee-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-weight: 600; font-size: 14px; }
            .total-row { background: #f8fafc; border-radius: 16px; padding: 25px; display: flex; justify-content: space-between; align-items: center; border: 2px solid #e2e8f0; }
            .footer { margin-top: 60px; text-align: center; border-top: 1px dashed #cbd5e1; pt-20; }
            @media print { body { background: white; padding: 0; } .invoice-card { box-shadow: none; border: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="watermark">PAID</div>
            <div class="header">
              <div>
                <div class="school-name">EDUSTREAM PRO ERP</div>
                <div style="font-size: 12px; color: #64748b; font-weight: 600;">System Generated Official Receipt</div>
              </div>
              <div style="text-align: right;">
                <div class="receipt-badge">Payment Voucher</div>
                <div style="font-size: 13px; font-weight: 900; margin-top: 10px;">ID: ${txn.id}</div>
              </div>
            </div>
            
            <div class="details-grid">
              <div>
                <div class="label">Student Identity</div>
                <div class="value">${txn.studentName}</div>
                <div class="label">Academic Class</div>
                <div class="value">${txn.class}</div>
              </div>
              <div style="text-align: right;">
                <div class="label">Settlement Date</div>
                <div class="value">${txn.date}</div>
                <div class="label">Payment Mode</div>
                <div class="value">${txn.mode}</div>
              </div>
            </div>

            <table class="fee-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Service Month</th>
                  <th style="text-align: right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${txn.feeType}</td>
                  <td>${txn.month}</td>
                  <td style="text-align: right;">₹${txn.baseAmount.toLocaleString()}</td>
                </tr>
                ${txn.fineAmount > 0 ? `
                <tr style="color: #e11d48;">
                  <td>Fine: ${txn.fineReason}</td>
                  <td>-</td>
                  <td style="text-align: right;">₹${txn.fineAmount.toLocaleString()}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="total-row">
              <div style="font-weight: 800; color: #64748b; text-transform: uppercase; font-size: 12px;">Grand Total Paid</div>
              <div style="font-size: 32px; font-weight: 900; color: #4f46e5;">₹${txn.totalAmount.toLocaleString()}</div>
            </div>

            <div class="footer">
              <p style="font-size: 12px; color: #64748b; font-weight: 600;">
                Transaction collected by <b>${txn.collectedBy}</b>. This is a computer generated document and does not require a physical signature.
              </p>
              <p style="font-size: 10px; color: #94a3b8; margin-top: 20px;">Support: contact@edustream.pro | Academic Session 2025-26</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  // Fix: use totalAmount instead of fallback to non-existent amount
  const totalCollected = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalFines = fees.reduce((acc, f) => acc + (f.fineAmount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Fee Ledger</h2>
          <p className="text-slate-500 font-medium">Manage tuition, fines, and itemized billing for all students.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Plus size={20} /> Collect Fee & Fine
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-600 px-5 py-3 rounded-2xl border border-amber-100 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert size={16} /> Restricted to Admin/Accountant
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 transform group-hover:scale-125 transition-transform">
             <Calculator size={120} className="text-indigo-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate School Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{(totalCollected/1000).toFixed(1)}k</span>
            <span className="text-emerald-500 text-xs font-bold">+12% Growth</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase">Collection Active</div>
            <div className="bg-amber-50 px-3 py-1.5 rounded-full text-[10px] font-black text-amber-600 uppercase">Audit Ready</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Fines Collected</p>
          <h3 className="text-3xl font-black text-rose-600 tracking-tight">₹{totalFines.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-4 tracking-tight uppercase flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-500" /> From {fees.filter(f => f.fineAmount > 0).length} records
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Active Transactions</p>
          <h3 className="text-4xl font-black tracking-tight">{fees.length}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">Cloud Sync: Online</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-slate-100">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
             Master Fee Ledger
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search entries..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2 text-xs font-bold">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[450px]">
          {fees.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-white">
                  <th className="px-10 py-6">Transaction / Student</th>
                  <th className="px-10 py-6">Fee Category</th>
                  <th className="px-10 py-6">Base Amount</th>
                  <th className="px-10 py-6">Fine & Penalty</th>
                  <th className="px-10 py-6">Total / Mode</th>
                  <th className="px-10 py-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fees.map((txn) => (
                  <tr key={txn.id} className="hover:bg-indigo-50/50 transition-all group">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {txn.studentName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{txn.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">ID: #{txn.id} • {txn.date}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg uppercase tracking-tight">{txn.feeType}</span>
                        <p className="text-[10px] text-slate-400 font-bold italic">{txn.month}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-700">₹{txn.baseAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-6">
                      {txn.fineAmount > 0 ? (
                        <div>
                          <p className="text-sm font-black text-rose-500">₹{txn.fineAmount.toLocaleString()}</p>
                          <p className="text-[9px] text-rose-400 font-bold uppercase truncate max-w-[120px]">{txn.fineReason}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300">NIL</span>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-lg font-black text-slate-900 tracking-tight">₹{txn.totalAmount.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase mt-1">{txn.mode}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => handleDownloadInvoice(txn)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Print Invoice"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-4 border-dashed border-slate-100">
                  <DollarSign size={48} />
               </div>
               <div className="text-center">
                  <p className="font-black text-slate-800 text-xl">Ledger is Empty</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Accept payments to generate financial analytics.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Collect Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 ring-12 ring-white/10">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                   <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Collect Fee & Fine</h3>
                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">Official Payment Portal</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white hover:bg-rose-50 rounded-3xl text-slate-400 hover:text-rose-600 transition-all border border-slate-200 shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Search & Select Student</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Admission ID or Student Name..."
                      value={searchStudent}
                      onChange={(e) => {
                        setSearchStudent(e.target.value);
                        setSelectedStudent(null);
                      }}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 font-bold text-lg transition-all"
                    />
                  </div>
                  
                  {searchStudent && !selectedStudent && (
                    <div className="absolute w-full mt-4 bg-white border border-slate-100 shadow-3xl rounded-3xl z-50 overflow-hidden divide-y divide-slate-50 ring-1 ring-slate-200 animate-in slide-in-from-top-2">
                      {filteredStudents.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => { setSelectedStudent(s); setSearchStudent(`${s.firstName} ${s.lastName} (${s.admissionNo})`); }}
                          className="p-5 hover:bg-indigo-50 cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                              {s.firstName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Class {s.admissionClass} • Enrollment: {s.admissionNo}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <Plus size={16} />
                          </div>
                        </div>
                      ))}
                      {filteredStudents.length === 0 && <div className="p-10 text-center text-xs text-slate-400 font-black uppercase tracking-widest">No Student Records Found</div>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">2. Fee Category</label>
                  <select 
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value as any)}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 font-bold transition-all appearance-none"
                    required
                  >
                    {['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Uniform Fee', 'Other'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">3. Billing Month</label>
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 font-bold transition-all appearance-none"
                    required
                  >
                    <option value="">Choose Month</option>
                    {['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">4. Base Amount (INR)</label>
                  <input 
                    type="number" 
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 font-black text-2xl tracking-tight transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 block">5. Fine / Penalty (INR)</label>
                  <input 
                    type="number" 
                    value={fineAmount}
                    onChange={(e) => setFineAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-6 py-5 bg-rose-50 border-2 border-rose-100 rounded-[2rem] outline-none focus:border-rose-500 font-black text-2xl tracking-tight text-rose-600 transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">6. Fine Reason (Optional)</label>
                  <input 
                    type="text" 
                    value={fineReason}
                    onChange={(e) => setFineReason(e.target.value)}
                    placeholder="e.g. Late submission, Library damage..."
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 font-bold transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">7. Mode of Settlement</label>
                  <div className="flex flex-wrap gap-3">
                    {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map(m => (
                      <button 
                        key={m}
                        type="button"
                        onClick={() => setMode(m as any)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          mode === m 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Grand Total Settlement</p>
                  <h4 className="text-4xl font-black tracking-tighter">₹{totalCalculated.toLocaleString()}</h4>
                </div>
                <button 
                  type="submit"
                  disabled={loading || !selectedStudent}
                  className="relative z-10 px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-30 shadow-xl"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} className="text-indigo-600" /> Confirm & Print</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
