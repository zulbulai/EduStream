
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MoreVertical, Plus, Trash2, Edit3, X, GraduationCap, Loader2 } from 'lucide-react';
import { UserRole, Staff } from '../types';
import { StorageService } from '../services/storage';

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Staff>>({
    role: UserRole.TEACHER,
    status: 'Active'
  } as any);

  useEffect(() => {
    setStaff(StorageService.getStaff());
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const member: Staff = {
      ...formData as Staff,
      id: editingId || `EMP-${Date.now()}`,
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0]
    };

    StorageService.saveStaff(member);
    setStaff(StorageService.getStaff());
    
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ role: UserRole.TEACHER } as any);
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this staff record?')) {
      StorageService.deleteStaff(id);
      setStaff(StorageService.getStaff());
    }
  };

  const handleEdit = (member: Staff) => {
    setFormData(member);
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Staff Master</h2>
          <p className="text-slate-500">Real-time teacher and support staff directory.</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingId(null); setFormData({ role: UserRole.TEACHER } as any); }}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} /> Add Staff Member
        </button>
      </div>

      {staff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {member.name[0]}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 bg-rose-50 text-rose-300 hover:text-rose-600 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.name}</h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 inline-block mt-2">
                {member.role}
              </span>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Mail size={16} />
                  <span className="text-xs font-bold truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone size={16} />
                  <span className="text-xs font-bold tracking-tight">{member.mobile}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</p>
                  <p className="text-sm font-bold text-slate-900">{member.assignedClass || 'Unassigned'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary</p>
                  <p className="text-sm font-black text-emerald-600">₹{member.salary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center opacity-30">
          <GraduationCap size={64} className="mx-auto mb-4" />
          <p className="font-bold">Staff database is empty</p>
          <p className="text-sm">Add your school employees to manage them here.</p>
        </div>
      )}

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Update Staff Member' : 'New Staff Registration'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Staff Role</label>
                  <select 
                    value={formData.role || UserRole.TEACHER}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                  >
                    {Object.values(UserRole).filter(r => r !== UserRole.STUDENT && r !== UserRole.PARENT).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email ID</label>
                  <input 
                    type="email" 
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Mobile Number</label>
                  <input 
                    type="text" 
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Monthly Salary (INR)</label>
                  <input 
                    type="number" 
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-black text-emerald-600"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Class Assigned</label>
                  <select 
                    value={formData.assignedClass || ''}
                    onChange={(e) => setFormData({...formData, assignedClass: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                  >
                    <option value="">None</option>
                    {['Nursery', 'KG-1', 'KG-2', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : (editingId ? 'Update Employee Record' : 'Save New Staff Member')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
