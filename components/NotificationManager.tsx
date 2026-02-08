
import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Trash2, Bell, ShieldCheck, User, Users, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Notification, UserRole } from '../types';

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = StorageService.getCurrentUser();
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotifications(StorageService.getNotifications());
    const unsubscribe = StorageService.subscribe(() => {
      setNotifications(StorageService.getNotifications());
    });
    return unsubscribe;
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setLoading(true);
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      from: currentUser?.name || 'Admin',
      fromRole: currentUser?.role || 'System',
      to: target,
      title,
      message,
      date: new Date().toLocaleString(),
      priority
    };

    StorageService.saveNotification(newNotif);
    
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      setTitle('');
      setMessage('');
      setTarget('ALL');
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this broadcast?')) {
       const updated = notifications.filter(n => n.id !== id);
       localStorage.setItem('edustream_notifications', JSON.stringify(updated));
       StorageService.notifyUpdate();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Broadcast Center</h2>
          <p className="text-slate-500 font-medium">Manage institutional notices and emergency alerts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:bg-indigo-700 transition-all hover:-translate-y-1"
        >
          <Plus size={18} strokeWidth={3} /> Post New Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {notifications.length > 0 ? notifications.map((notif) => (
            <div key={notif.id} className={`bg-white p-8 rounded-[3rem] border shadow-sm transition-all group hover:shadow-xl ${notif.priority === 'Urgent' ? 'border-rose-100 ring-2 ring-rose-50' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${notif.priority === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'} shadow-xl`}>
                    <Megaphone size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{notif.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">TO: {notif.to}</span>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${notif.priority === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {notif.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(notif.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium mb-8 text-lg">{notif.message}</p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-indigo-400" />
                  POSTED BY: {notif.from} ({notif.fromRole})
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-indigo-400" />
                  {notif.date}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-40 text-center opacity-30 flex flex-col items-center">
              <Bell size={64} className="mb-6 text-slate-300" />
              <p className="text-sm font-black uppercase tracking-widest">No active broadcasts found</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={100} /></div>
              <h4 className="text-xl font-black mb-6 flex items-center gap-3">System Metrics</h4>
              <div className="space-y-6">
                 <MetricMini label="Total Notices" value={notifications.length.toString()} />
                 <MetricMini label="Urgent Alerts" value={notifications.filter(n => n.priority === 'Urgent').length.toString()} />
                 <MetricMini label="Last Broadcast" value={notifications[0]?.date.split(',')[0] || 'N/A'} />
              </div>
           </div>

           <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl">
              <AlertCircle size={32} className="mb-4 text-indigo-200" />
              <h4 className="text-lg font-black mb-2">Usage Policy</h4>
              <p className="text-[10px] font-bold opacity-80 uppercase leading-relaxed tracking-wider">
                All staff members can broadcast to their assigned classes. Urgent notices will bypass student filters and show prominently on their dashboard.
              </p>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 animate-in zoom-in-95 duration-500 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-4 text-slate-300 hover:text-rose-500 transition-colors">
                 <X size={28} />
              </button>
              
              <div className="mb-12">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Draft Notice</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Publish to Student/Staff Ecosystem</p>
              </div>

              <form onSubmit={handleSend} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Notice Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Winter Vacation Announcement"
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                      required
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Audience</label>
                       <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-black outline-none focus:border-indigo-600 transition-all appearance-none">
                          <option value="ALL">Everyone</option>
                          <option value="STUDENTS">Students Only</option>
                          <option value="TEACHERS">Faculty Only</option>
                          {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(c => <option key={c} value={c}>Class {c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Priority</label>
                       <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] font-black outline-none focus:border-indigo-600 transition-all appearance-none">
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent Alert</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Detailed Message</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] font-medium text-lg outline-none focus:bg-white focus:border-indigo-600 transition-all resize-none shadow-sm" 
                      placeholder="Enter the broadcast message here..."
                      required
                    />
                 </div>

                 <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {loading ? <><Clock className="animate-spin" /> Publishing...</> : 'Send Broadcast Now'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricMini = ({ label, value }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-white/10">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-lg font-black">{value}</span>
  </div>
);

export default NotificationManager;
