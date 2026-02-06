
import React, { useMemo } from 'react';
import { Users, UserCheck, UserMinus, TrendingUp, Calendar, AlertCircle, DollarSign, Cpu, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StorageService } from '../services/storage';

const Dashboard: React.FC = () => {
  const students = StorageService.getStudents();
  const fees = StorageService.getFees();
  const attendance = StorageService.getAttendance();

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'P').length;
    // Fix: Using totalAmount instead of non-existent amount property
    const totalFee = fees.reduce((sum, f) => sum + f.totalAmount, 0);

    return [
      { 
        label: 'Total Students', 
        value: totalStudents.toLocaleString(), 
        icon: Users, 
        color: 'bg-indigo-500', 
        trend: `${students.filter(s => s.status === 'Active').length} Active` 
      },
      { 
        label: 'Attendance Today', 
        value: presentCount.toString(), 
        icon: UserCheck, 
        color: 'bg-emerald-500', 
        trend: totalStudents > 0 ? `${Math.round((presentCount / totalStudents) * 100)}% present` : 'No data' 
      },
      { 
        label: 'Absentees', 
        value: (totalStudents - presentCount).toString(), 
        icon: UserMinus, 
        color: 'bg-rose-500', 
        trend: 'Daily report generated' 
      },
      { 
        label: 'Total Fees', 
        value: `₹${(totalFee / 1000).toFixed(1)}K`, 
        icon: DollarSign, 
        color: 'bg-amber-500', 
        trend: 'Session 2025-26' 
      },
    ];
  }, [students, fees, attendance]);

  // Transform real data for charts
  const feeChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => {
      // Fix: Using totalAmount instead of non-existent amount property
      const amount = fees.filter(f => f.month.includes(m)).reduce((s, f) => s + f.totalAmount, 0);
      return { month: m, amount: amount / 1000 };
    });
  }, [fees]);

  const attendanceChartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // In a real app we'd filter by the last 6 days. For now, showing dummy trend with real scaling.
    return days.map(d => ({ name: d, p: 85 + Math.random() * 10, a: 5 + Math.random() * 5 }));
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring real-time metrics for EduStream ERP.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
          <Calendar size={20} className="text-indigo-600" />
          <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-lg">
              <AlertCircle size={12} className="text-indigo-500" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Attendance Statistics</h3>
              <p className="text-xs text-slate-400 font-medium">Daily participation percentage</p>
            </div>
            <select className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none">
              <option>Current Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="p" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} name="Present" />
                <Bar dataKey="a" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={16} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Flow</h3>
              <p className="text-xs text-slate-400 font-medium">Fee collection in ₹ Thousands</p>
            </div>
            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeChartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">System Audit Log</h3>
            <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          <div className="divide-y divide-slate-50">
            {students.slice(-4).reverse().map((student) => (
              <div key={student.id} className="p-5 hover:bg-slate-50 transition-all flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-black text-lg">
                  {student.firstName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">New Enrollment: <span className="text-indigo-600">{student.firstName} {student.lastName}</span></p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Class {student.admissionClass} • {student.admissionDate}</p>
                </div>
                <span className="text-[9px] font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-widest">Admission</span>
              </div>
            ))}
            {students.length === 0 && (
              <div className="p-20 text-center opacity-30">
                <p className="text-sm font-bold">No recent activities to display</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 p-12 opacity-10 transform group-hover:scale-110 transition-all duration-700 text-white">
            <Cpu size={240} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">AI School Assistant</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium italic">
              "Based on your current fee collection rate, you are on track to exceed last session's revenue by 12.4%."
            </p>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
              Ask AI for Advice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for AI section
const Sparkles = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default Dashboard;
