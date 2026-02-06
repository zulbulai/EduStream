
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, UserCircle, Phone, MapPin, Trash2, ShieldAlert, Edit3 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, UserRole } from '../types';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = StorageService.getCurrentUser();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    setStudents(StorageService.getStudents());
  }, []);

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to remove this student? This cannot be undone.')) {
      StorageService.deleteStudent(id);
      setStudents(StorageService.getStudents());
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 text-sm font-medium">Managing {students.length} real student records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <ShieldAlert size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">
              {isAdmin ? 'Full Management Access' : 'View Only Access'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, Admission ID, or mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {filteredStudents.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white">
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-8 py-5">Enrollment</th>
                  <th className="px-8 py-5">Guardian</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                          {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-black text-indigo-600 text-lg">{student.firstName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{student.admissionClass} • {student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">{student.admissionNo}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Joined {student.admissionDate}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-700">{student.fatherName}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-bold">
                        <Phone size={10} /> {student.fatherMobile}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        student.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <button className="p-2.5 bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(student.id)}
                              className="p-2.5 bg-rose-50 text-rose-300 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <ShieldAlert size={48} strokeWidth={1} />
              </div>
              <div className="text-center">
                <p className="font-black text-slate-800 text-lg">No Results Found</p>
                <p className="text-sm text-slate-400 mt-1 font-medium">Try adjusting your search filters or add a new student.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
