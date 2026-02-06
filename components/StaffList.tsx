
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MoreVertical, Plus, Trash2, Edit3, X, GraduationCap, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole, Staff } from '../types';
import { StorageService } from '../services/storage';

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentUser = StorageService.getCurrentUser();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Form State
  const [formData, setFormData] = useState<Partial<Staff>>({
    role: UserRole.TEACHER,
  } as any);

  useEffect(() => {
    setStaff(StorageService.getStaff());
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
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
    if (!isAdmin) return;
    if (confirm('Delete this staff record? This will remove their system access.')) {
      StorageService.deleteStaff(id);
      setStaff(StorageService.getStaff());
    }
  };

  const handleEdit = (member: Staff) => {
    if (!isAdmin) return;
    setFormData(member);
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Master</h2>
          <p className="text-slate-500 font-medium">Monitoring {staff.length} professional educators and administrators.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setIsModalOpen(true); setEditingId(null); setFormData({ role: UserRole.TEACHER } as any); }}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> Add Staff Member
          </button>
        )}
      </div>

      {staff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-white shadow-xl text-indigo-600 rounded-3xl flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-4 ring-slate-50">
                    {member.name[0]}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(member)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(member.id)} className="p-3 bg-rose-50 text-rose-300 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-rose-50"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {member.role}
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    <UserCheck size={12} /> Active
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <Mail size={16} className="text-indigo-300" />
                    <span className="text-xs font-bold truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Phone size={16} className="text-indigo-300" />
                    <span className="text-xs font-bold tracking-tight">{member.mobile}</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Rep</p>
                    <p className="text-sm font-black text-slate-800">{member.assignedClass || 'None'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pay Grade</p>
                    <p className="text-sm font-black text-emerald-600">₹{member.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto border-4 border-dashed border-slate-100">
            <GraduationCap size={48} />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="font-black text-slate-800 text-lg">Staff Database Empty</p>
            <p className="text-sm text-slate-400 font-medium mt-1">Start by adding your first employee record. Only administrators can add staff.</p>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ring-8 ring-white/20">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingId ? 'Modify Staff Record' : 'Register Professional'}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">HR Management System</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-all border border-slate-100 shadow-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 font-bold transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">System Designation</label>
                  <select 
                    value={formData.role || UserRole.TEACHER}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                  >
                    {Object.values(UserRole).filter(r => r !== UserRole.STUDENT && r !== UserRole.PARENT).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Work Email</label>
                  <input 
                    type="email" 
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                    placeholder="name@school.com"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Personal Contact</label>
                  <input 
                    type="text" 
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Monthly Package (INR)</label>
                  <input 
                    type="number" 
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-black text-emerald-600 text-xl transition-all"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Class Assignment</label>
                  <select 
                    value={formData.assignedClass || ''}
                    onChange={(e) => setFormData({...formData, assignedClass: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                  >
                    <option value="">No Class Assigned</option>
                    {['Nursery', 'KG-1', 'KG-2', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> {editingId ? 'Confirm Updates' : 'Authorize & Create Record'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
