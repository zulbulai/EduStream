
import React, { useState, useEffect } from 'react';
/* Added missing PhoneCall and School icons to the imports from lucide-react */
import { Search, Filter, Phone, Trash2, ShieldAlert, Edit3, X, Mail, MessageCircle, Printer, Download, UserCircle, MapPin, Calendar, Book, Heart, AlertCircle, FileText, PhoneCall, School } from 'lucide-react';
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
    if (confirm('Permanently delete this student from the cloud?')) {
      StorageService.deleteStudent(id);
      setStudents(StorageService.getStudents());
    }
  };

  const handlePrintIdCard = (student: Student) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <html>
        <head>
          <title>ID CARD - ${student.admissionNo}</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f1f5f9; }
            .card { width: 350px; height: 500px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; border: 1px solid #e2e8f0; }
            .header { height: 120px; background: #4f46e5; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; }
            .school { font-weight: 900; font-size: 18px; text-transform: uppercase; }
            .photo-box { width: 140px; height: 140px; background: #f8fafc; border-radius: 50%; border: 6px solid white; position: absolute; top: 50px; left: 50%; transform: translateX(-50%); overflow: hidden; }
            .details { margin-top: 80px; text-align: center; padding: 20px; }
            .name { font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 0 20px; text-align: left; }
            .label { font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
            .val { font-size: 13px; font-weight: 700; color: #1e293b; }
            .footer { background: #1e293b; color: white; padding: 10px; text-align: center; font-size: 10px; font-weight: 800; position: absolute; bottom: 0; width: 100%; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header"><div class="school">EduStream Pro ERP</div></div>
            <div class="photo-box">
                <img src="${student.photo || 'https://via.placeholder.com/150'}" style="width:100%; height:100%; object-cover;" />
            </div>
            <div class="details">
                <div class="name">${student.firstName} ${student.lastName}</div>
                <div style="font-size: 12px; font-weight: 800; color: #6366f1; margin-bottom: 30px;">ID: ${student.admissionNo}</div>
                <div class="info-row">
                    <div><div class="label">Class</div><div class="val">${student.admissionClass}</div></div>
                    <div><div class="label">Roll No</div><div class="val">${student.rollNo || 'N/A'}</div></div>
                </div>
                <div class="info-row">
                    <div><div class="label">Blood Group</div><div class="val">${student.bloodGroup}</div></div>
                    <div><div class="label">Mobile</div><div class="val">${student.fatherMobile}</div></div>
                </div>
            </div>
            <div class="footer">SESSION 2025-26 • SECURITY ENCRYPTED</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  const openWhatsApp = (mobile: string) => {
    const clean = mobile.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}?text=Hello, this is a message from EduStream School.`, '_blank');
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
          <p className="text-slate-500 font-medium">Global search through {students.length} active enrollments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <ShieldAlert size={16} className="text-indigo-600" />
             {isAdmin ? 'Management Enabled' : 'View Restricted'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Name, Admission ID, or Class..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <button className="px-8 py-4 bg-white border border-slate-200 rounded-3xl text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
            <Filter size={18} /> Apply Filters
          </button>
        </div>

        <div className="overflow-x-auto min-h-[500px]">
          {filteredStudents.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white">
                  <th className="px-10 py-6">Academic Identity</th>
                  <th className="px-10 py-6">Enrollment</th>
                  <th className="px-10 py-6">Primary Guardian</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-indigo-50/50 transition-all group cursor-pointer"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 overflow-hidden border-2 border-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-black text-indigo-600 text-xl">{student.firstName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Class {student.admissionClass} • {student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">#{student.admissionNo}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Enrolled {student.admissionDate}</p>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-700">{student.fatherName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-black uppercase tracking-tight">
                        <Phone size={12} className="text-emerald-500" /> {student.fatherMobile}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                        student.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openWhatsApp(student.fatherMobile)} className="p-3 bg-white border border-slate-200 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><MessageCircle size={18}/></button>
                        {isAdmin && <button onClick={(e) => handleDelete(student.id, e)} className="p-3 bg-white border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 space-y-8">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border-4 border-dashed border-slate-100">
                  <UserCircle size={48} />
               </div>
               <div className="text-center">
                  <p className="font-black text-slate-800 text-xl tracking-tight">No Students Found</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Refine your search parameters or check the session year.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Student Profile Dashboard Overlay */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] animate-in zoom-in-95 duration-500 ring-1 ring-white/20">
            {/* Sidebar info */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
                <button 
                    onClick={() => setSelectedStudent(null)} 
                    className="md:hidden absolute top-6 right-6 p-4 bg-white rounded-full shadow-lg text-slate-400"
                >
                    <X size={20} />
                </button>
                
                <div className="w-44 h-44 rounded-[3rem] bg-white p-2 shadow-2xl mb-8 group relative">
                    <img src={selectedStudent.photo || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-[2.5rem]" />
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                        <Check size={20} strokeWidth={4} />
                    </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedStudent.firstName}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Class {selectedStudent.admissionClass} • Roll {selectedStudent.rollNo || '00'}</p>
                
                <div className="grid grid-cols-2 gap-3 w-full mb-10">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                        <p className="text-xl font-black text-emerald-600">{attPerc}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid Fee</p>
                        <p className="text-xl font-black text-indigo-600">₹{(totalPaid/1000).toFixed(1)}k</p>
                    </div>
                </div>

                <div className="space-y-3 w-full">
                    <button onClick={() => openWhatsApp(selectedStudent.fatherMobile)} className="w-full py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 hover:-translate-y-1 transition-all"><MessageCircle size={18} /> WhatsApp Parent</button>
                    <a href={`mailto:${selectedStudent.email}`} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"><Mail size={18} /> Email Record</a>
                    <button onClick={() => handlePrintIdCard(selectedStudent)} className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all"><Printer size={18} /> Print ID Card</button>
                </div>

                <button onClick={() => setSelectedStudent(null)} className="hidden md:block mt-auto text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Close Profile View</button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Holistic Academic Dashboard</h4>
                        <p className="text-slate-500 font-medium">360-degree comprehensive student data overview.</p>
                    </div>
                    <button className="md:flex hidden items-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                        <Download size={16} /> Export Profile JSON
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Bio Data Section */}
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-indigo-600"></div> Bio-Metric Information
                        </h5>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <InfoItem label="First Name" value={selectedStudent.firstName} />
                            <InfoItem label="Last Name" value={selectedStudent.lastName} />
                            <InfoItem label="Gender Identity" value={selectedStudent.gender} />
                            <InfoItem label="Date of Birth" value={selectedStudent.dob} icon={<Calendar size={12}/>} />
                            <InfoItem label="Blood Group" value={selectedStudent.bloodGroup} icon={<Heart size={12}/>} />
                            <InfoItem label="Religion / Cat" value={`${selectedStudent.religion} (${selectedStudent.category})`} />
                            <InfoItem label="Mother Tongue" value={selectedStudent.motherTongue || 'N/A'} />
                            <InfoItem label="Enrollment ID" value={selectedStudent.admissionNo} highlight />
                        </div>
                    </div>

                    {/* Academic Section */}
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-emerald-600"></div> Academic Portfolio
                        </h5>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <InfoItem label="Current Grade" value={selectedStudent.admissionClass} />
                            <InfoItem label="Assigned Section" value={selectedStudent.section || 'A'} />
                            <InfoItem label="Bus Route" value={selectedStudent.busRoute || 'Self-Transport'} />
                            <InfoItem label="Session" value="2025-26" />
                            <div className="col-span-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Enrolled Subjects</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedStudent.subjects || []).map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{s}</span>)}
                                    {(!selectedStudent.subjects || selectedStudent.subjects.length === 0) && <span className="text-xs text-slate-300 font-medium">No subjects assigned.</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Family & Contact Section */}
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-amber-600"></div> Guardian & Contact
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <InfoItem label="Father's Name" value={selectedStudent.fatherName} />
                            <InfoItem label="Primary Mobile" value={selectedStudent.fatherMobile} icon={<Phone size={12}/>} />
                            <InfoItem label="Mother's Name" value={selectedStudent.motherName || 'N/A'} />
                            <InfoItem label="Guardian Occupation" value={selectedStudent.fatherOccupation || 'N/A'} />
                            <div className="col-span-2">
                                <InfoItem label="Residential Address" value={`${selectedStudent.address || ''}, ${selectedStudent.city || ''}, ${selectedStudent.state || ''} - ${selectedStudent.pinCode || ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Emergency & Previous School */}
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-rose-500"></div> Emergency Protocols
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 col-span-2 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-rose-400 uppercase mb-1">Emergency SOS Contact</p>
                                    <p className="text-xl font-black text-rose-700">{selectedStudent.emergencyContactName || 'No Data'}</p>
                                    <p className="text-sm font-bold text-rose-600 mt-1">{selectedStudent.emergencyContactMobile || 'None'}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl text-rose-600">
                                    <PhoneCall size={24} />
                                </div>
                            </div>
                            <InfoItem label="Previous Institute" value={selectedStudent.previousSchool || 'First Enrollment'} icon={<School size={12}/>} />
                            <InfoItem label="Last Attained Grade" value={selectedStudent.previousGrade || 'Entry Level'} />
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <AlertCircle size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[200px]">Data updated on {selectedStudent.admissionDate} • ID Enforced System</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 hover:bg-slate-50 flex items-center gap-2">
                            <Edit3 size={16} /> Modify Profile
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon, highlight }: { label: string, value?: string, icon?: React.ReactNode, highlight?: boolean }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">{icon} {label}</p>
        <p className={`text-sm font-black ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>{value || '---'}</p>
    </div>
);

const Check = ({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6L9 17l-5-5"/></svg>
);

export default StudentList;
