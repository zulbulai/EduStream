
import React from 'react';
/* Added Cpu to imports from lucide-react */
import { Users, UserCheck, UserMinus, TrendingUp, Calendar, AlertCircle, DollarSign, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '1,248', icon: Users, color: 'bg-indigo-500', trend: '+12% from last month' },
    { label: 'Present Today', value: '1,120', icon: UserCheck, color: 'bg-emerald-500', trend: '90% attendance rate' },
    { label: 'Absentees', value: '128', icon: UserMinus, color: 'bg-rose-500', trend: 'SMS alerts sent' },
    { label: 'Fee Collection', value: '₹4.2L', icon: DollarSign, color: 'bg-amber-500', trend: '85% targets reached' },
  ];

  const attendanceData = [
    { name: 'Mon', p: 95, a: 5 },
    { name: 'Tue', p: 92, a: 8 },
    { name: 'Wed', p: 88, a: 12 },
    { name: 'Thu', p: 94, a: 6 },
    { name: 'Fri', p: 91, a: 9 },
    { name: 'Sat', p: 85, a: 15 },
  ];

  const feeData = [
    { month: 'Jan', amount: 3.2 },
    { month: 'Feb', amount: 4.8 },
    { month: 'Mar', amount: 4.2 },
    { month: 'Apr', amount: 5.5 },
    { month: 'May', amount: 2.1 },
    { month: 'Jun', amount: 1.8 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Principal</h1>
          <p className="text-slate-500">Here's what's happening in your school today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <Calendar size={18} className="text-indigo-600" />
          <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-slate-300" />
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} className="text-indigo-400" />
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Weekly Attendance Trend</h3>
            <select className="text-sm bg-slate-50 border-none rounded-lg px-2 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="p" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Present" />
                <Bar dataKey="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Monthly Revenue (Fee Collection)</h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">₹ Lakhs</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Recent Activities</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">New admission processed for <span className="text-indigo-600">Aryan Singh</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">Today at 10:45 AM • By Admin</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-600">Admission</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
            <Cpu size={120} />
          </div>
          <h3 className="text-xl font-bold mb-2">Smart AI Insights</h3>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Gemini AI has detected a 15% drop in math performance in Grade 10-A. Would you like to schedule a review meeting?</p>
          <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-50 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
