
import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, Trash2, ShieldAlert, Edit3, X, Mail, MessageCircle, Printer, Download, UserCircle, MapPin, Calendar, Heart, AlertCircle, PhoneCall, School } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, UserRole, FeeTransaction, AttendanceRecord } from '../types';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [fees, setFees] = useState<FeeTransaction[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const currentUser = StorageService.getCurrentUser();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    setStudents(StorageService.getStudents());
    setFees(StorageService.getFees());
    setAttendance(StorageService.getAttendance());
  }, []);

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (confirm('Permanently delete this student record?')) {
      StorageService.deleteStudent(id);
      setStudents(StorageService.getStudents());
    }
  };

  const handlePrintProfile = (student: Student) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <html>
        <head><title>Profile - ${student.firstName}</title><style>
          body { font-family: sans-serif; padding: 40px; }
          .profile-box { border: 2px solid #333; padding: 20px; border-radius: 20px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; pb-20; }
          .photo { width: 120px; height: 120px; border: 1px solid #ccc; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; mt-20; }
          .label { font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold; }
          .value { font-size: 14px; font-weight: bold; }
        </style></head>
        <body>
          <div class="profile-box">
            <div class="header">
              <div><h1>EDUSTREAM PRO - STUDENT PROFILE</h1><p>ID: ${student.admissionNo}</p></div>
              <img src="${student.photo || ''}" class="photo" />
            </div>
            <div class="grid">
              <div><p class="label">Full Name</p><p class="value">${student.firstName} ${student.lastName}</p></div>
              <div><p class="label">Admission Class</p><p class="value">${student.admissionClass} - ${student.section}</p></div>
              <div><p class="label">Father's Name</p><p class="value">${student.fatherName}</p></div>
              <div><p class="label">Father's Mobile</p><p class="value">${student.fatherMobile}</p></div>
              <div><p class="label">Address</p><p class="value">${student.address}, ${student.city}</p></div>
              <div><p class="label">Subjects</p><p class="value">${student.subjects.join(', ')}</p></div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  const openWhatsApp = (mobile: string, name: string) => {
    const clean = mobile.replace(/\D/g, '');
    const msg = encodeURIComponent(`नमस्ते, एडुस्ट्रीम स्कूल की तरफ से संदेश: प्रिय अभिभावक, छात्र ${name} का शैक्षणिक रिकॉर्ड अपडेट कर दिया गया है।`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  const studentAttendance = attendance.filter(a => a.studentId === selectedStudent?.id);
  const presentCount = studentAttendance.filter(a => a.status === 'P').length;
  const attPerc = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 100;

  const studentFees = fees.filter(f => f.studentId === selectedStudent?.id);
  const totalPaid = studentFees.reduce((acc, f) => acc + f.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 font-medium">Viewing {students.length} global enrollments.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Name, Admission ID, or Class..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold outline-none"
            />
          </div>
          <button className="px-8 py-4 bg-white border border-slate-200 rounded-3xl text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
            <Filter size={18} /> Filter List
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {filteredStudents.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white">
                  <th className="px-10 py-6">Student Information</th>
                  <th className="px-10 py-6">Enrollment</th>
                  <th className="px-10 py-6">Parental Info</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)} className="hover:bg-indigo-50/50 transition-all cursor-pointer group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 overflow-hidden flex items-center justify-center font-black text-indigo-600">
                          {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : student.firstName[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Class {student.admissionClass} - {student.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-black text-indigo-600 uppercase">#{student.admissionNo}</td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-700">{student.fatherName}</p>
                      <p className="text-[10px] text-slate-400 font-black">{student.fatherMobile}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleDelete(student.id, e)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-50"><UserCircle size={48}/><p className="mt-4 font-black">No Students Found</p></div>
          )}
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
            <div className="w-full md:w-80 bg-slate-50 p-10 flex flex-col items-center text-center overflow-y-auto">
                <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-4 text-slate-400"><X size={24} /></button>
                <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl mb-6">
                    <img src={selectedStudent.photo || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[2.5rem]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedStudent.firstName}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Roll ID: {selectedStudent.admissionNo}</p>
                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Attendance</p>
                        <p className="text-xl font-black text-emerald-600">{attPerc}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Paid Fee</p>
                        <p className="text-xl font-black text-indigo-600">₹{(totalPaid/1000).toFixed(1)}k</p>
                    </div>
                </div>
                <div className="space-y-3 w-full">
                    <button onClick={() => openWhatsApp(selectedStudent.fatherMobile, selectedStudent.firstName)} className="w-full py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"><MessageCircle size={18} /> WhatsApp Parent</button>
                    <a href={`mailto:${selectedStudent.email || ''}`} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"><Mail size={18} /> Email Record</a>
                    <button onClick={() => handlePrintProfile(selectedStudent)} className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"><Printer size={18} /> Print Full Profile</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-12">
                <div className="flex items-center justify-between">
                    <div><h4 className="text-2xl font-black text-slate-900">Academic Portfolio</h4><p className="text-slate-500 font-medium">Detailed student overview</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bio Information</h5>
                        <div className="grid grid-cols-2 gap-6">
                            <ProfileItem label="Full Name" value={`${selectedStudent.firstName} ${selectedStudent.lastName}`} />
                            <ProfileItem label="Gender" value={selectedStudent.gender} />
                            <ProfileItem label="DOB" value={selectedStudent.dob} icon={<Calendar size={12}/>} />
                            <ProfileItem label="Blood Group" value={selectedStudent.bloodGroup} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Academic Info</h5>
                        <div className="grid grid-cols-2 gap-6">
                            <ProfileItem label="Class" value={selectedStudent.admissionClass} />
                            <ProfileItem label="Section" value={selectedStudent.section} />
                            <div className="col-span-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Subjects Enrolled</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStudent.subjects.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">{s}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Family & Contact</h5>
                        <div className="grid grid-cols-2 gap-6">
                            <ProfileItem label="Father" value={selectedStudent.fatherName} />
                            <ProfileItem label="Mobile" value={selectedStudent.fatherMobile} />
                            <ProfileItem label="Occupation" value={selectedStudent.fatherOccupation} />
                            <ProfileItem label="Mother" value={selectedStudent.motherName} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Safety & Address</h5>
                        <div className="grid grid-cols-2 gap-6">
                            <ProfileItem label="Emergency" value={selectedStudent.emergencyContactMobile} icon={<PhoneCall size={12}/>} />
                            <ProfileItem label="City" value={selectedStudent.city} icon={<MapPin size={12}/>} />
                            <div className="col-span-2"><ProfileItem label="Residential Address" value={selectedStudent.address} /></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ label, value, icon }: { label: string, value?: string, icon?: any }) => (
    <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">{icon} {label}</p>
        <p className="text-sm font-black text-slate-800">{value || 'N/A'}</p>
    </div>
);

export default StudentList;
