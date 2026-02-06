
import React, { useMemo } from 'react';
import { Users, UserCheck, UserMinus, TrendingUp, Calendar, AlertCircle, DollarSign, Cpu, ArrowUpRight, Clock, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StorageService } from '../services/storage';

const Dashboard: React.FC = () => {
  const students = StorageService.getStudents();
  const fees = StorageService.getFees();
  const attendance = StorageService.getAttendance();
  const staff = StorageService.getStaff();
  const schedule = StorageService.getSchedule();

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as any;
  const todaySchedule = schedule.filter(s => s.day === currentDay).sort((a,b) => a.periodNumber - b.periodNumber);
  const classTeachers = staff.filter(s => s.assignedClass);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'P').length;
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

  const feeChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => {
      const amount = fees.filter(f => f.month.includes(m)).reduce((s, f) => s + f.totalAmount, 0);
      return { month: m, amount: amount / 1000 };
    });
  }, [fees]);

  const attendanceChartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Academic Schedule */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                 <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                 Schedule: {currentDay}
              </h3>
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">Live periods</span>
           </div>
           
           <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {todaySchedule.length > 0 ? todaySchedule.map((slot) => {
                const teacher = staff.find(t => t.id === slot.teacherId);
                return (
                  <div key={slot.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition-colors">
                     <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200">
                        <span className="text-[9px] font-black text-slate-400 uppercase">P-{slot.periodNumber}</span>
                        <Clock size={14} className="text-indigo-600" />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900">{slot.subject}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{slot.classId} • {slot.startTime} - {slot.endTime}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{teacher?.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold">Assigned Faculty</p>
                     </div>
                  </div>
                )
              }) : (
                <div className="py-20 text-center opacity-30">
                  <Calendar size={48} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No classes scheduled today</p>
                </div>
              )}
           </div>
        </div>

        {/* Class Teachers Sidebar */}
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 transform group-hover:scale-125 transition-transform duration-700">
              <GraduationCap size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-black mb-6 tracking-tight">Active Class Teachers</h3>
              <div className="space-y-4">
                 {classTeachers.map(ct => (
                   <div key={ct.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black">
                        {ct.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black">{ct.name}</p>
                        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Class {ct.assignedClass}</p>
                      </div>
                   </div>
                 ))}
                 {classTeachers.length === 0 && (
                   <p className="text-xs font-bold text-indigo-300 italic">No class teachers assigned yet.</p>
                 )}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                 Manage Faculty Assignments
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Attendance Trends</h3>
              <p className="text-xs text-slate-400 font-medium">Daily participation rate</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
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
              <p className="text-xs text-slate-400 font-medium">Collection in ₹ Thousands</p>
            </div>
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
    </div>
  );
};

export default Dashboard;
