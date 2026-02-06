
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, UserCircle, Phone, MapPin, Trash2, ShieldAlert } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student } from '../types';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setStudents(StorageService.getStudents());
  }, []);

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      const updated = students.filter(s => s.id !== id);
      localStorage.setItem('edustream_students', JSON.stringify(updated));
      setStudents(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500 text-sm">Real-time database of all enrolled students.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
            {students.length} Total Records
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, Admission ID, or mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {filteredStudents.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Admission Details</th>
                  <th className="px-6 py-4">Parent</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 overflow-hidden border border-indigo-100 flex items-center justify-center">
                          {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-indigo-600">{student.firstName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{student.admissionClass} - {student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono font-bold text-indigo-600">{student.admissionNo}</p>
                      <p className="text-[10px] text-slate-400">{student.admissionDate}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{student.fatherName}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{student.fatherMobile}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
              <ShieldAlert size={64} strokeWidth={1} className="text-slate-300" />
              <div className="text-center">
                <p className="font-bold text-slate-800">No Student Data Found</p>
                <p className="text-xs text-slate-400 mt-1">Add students via the Admission form to see them here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
