
import React, { useState, useRef } from 'react';
import { User, Users, BookOpen, Camera, FileText, CheckCircle2, Upload, MapPin, PhoneCall, History, School, Check } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student } from '../types';

const SUBJECT_LIST = ["Mathematics", "Science", "English", "Hindi", "Sanskrit", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology", "Accounts", "Economics"];

const AdmissionForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    documents: [],
    transportRequired: false,
    subjects: [],
    category: 'General',
    religion: 'Hinduism'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const toggleSubject = (subject: string) => {
    const current = formData.subjects || [];
    if (current.includes(subject)) {
      setFormData({ ...formData, subjects: current.filter(s => s !== subject) });
    } else {
      setFormData({ ...formData, subjects: [...current, subject] });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'PHOTO') {
          setPreviewPhoto(base64);
          setFormData(prev => ({ ...prev, photo: base64 }));
        } else {
          setFormData(prev => ({
            ...prev,
            documents: [...(prev.documents || []), { type, url: base64, name: file.name }]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.admissionClass) {
      alert("Please fill mandatory fields (Name, Class)");
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const newStudent: Student = {
      ...formData as Student,
      id: `STU-${Date.now()}`,
      admissionNo: `ADM-${Math.floor(Math.random() * 9000) + 1000}`,
      age: formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 0,
    };

    StorageService.saveStudent(newStudent);
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-xl shadow-emerald-100">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admission Successful!</h2>
        <p className="text-slate-500 font-medium">Student <span className="text-indigo-600 font-bold">{formData.firstName}</span> has been officially enrolled.</p>
        <div className="flex justify-center gap-4 pt-6">
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">Add New Admission</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Student Enrollment</h2>
          <p className="text-slate-500 font-medium mt-1">Academic Session 2025-26 • Professional Admission Portal</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
           {[1,2,3,4,5].map(s => (
             <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
              }`}
             >
               {step > s ? <Check size={16} strokeWidth={3} /> : s}
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
        <div className="p-12">
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Personal Identity</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-44 h-44 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {previewPhoto ? <img src={previewPhoto} className="w-full h-full object-cover" /> : <Camera size={40} className="text-slate-300" />}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">Update Photo</div>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'PHOTO')} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passport Image (Mandatory)</p>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name *</label>
                    <input name="firstName" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all" placeholder="Legal first name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name *</label>
                    <input name="lastName" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all" placeholder="Legal surname" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select name="gender" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all">
                      <option>Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <input name="dob" type="date" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                    <select name="bloodGroup" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all">
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select name="category" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all">
                      <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Guardian & Family</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Father's Name</label>
                    <input name="fatherName" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Father's Occupation</label>
                    <input name="fatherOccupation" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mother's Name</label>
                    <input name="motherName" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Mobile (WhatsApp)</label>
                    <input name="fatherMobile" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" placeholder="+91" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Academic & Subjects</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admission Class</label>
                    <select name="admissionClass" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold">
                      {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Section</label>
                    <select name="section" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold">
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Select Learning Subjects</label>
                    <div className="flex flex-wrap gap-3">
                        {SUBJECT_LIST.map(sub => (
                            <button 
                                key={sub} 
                                type="button" 
                                onClick={() => toggleSubject(sub)}
                                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tight transition-all border-2 ${
                                    formData.subjects?.includes(sub) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Previous School (If any)</label>
                    <input name="previousSchool" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Grade Attained</label>
                    <input name="previousGrade" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Address & Emergency</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permanent Residential Address</label>
                    <textarea name="address" onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold resize-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input name="city" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                    <input name="pinCode" onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Emergency Contact Name</label>
                    <input name="emergencyContactName" onChange={handleInputChange} className="w-full px-6 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl outline-none focus:border-rose-500 font-bold text-rose-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Emergency Contact Mobile</label>
                    <input name="emergencyContactMobile" onChange={handleInputChange} className="w-full px-6 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl outline-none focus:border-rose-500 font-bold text-rose-700" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 text-center">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Review & Finalize</h3>
                <p className="text-slate-500 max-w-md mx-auto">Please ensure all details provided are accurate according to legal documents. This action will create a permanent student ID.</p>
                
                <div className="bg-slate-50 p-8 rounded-[3rem] text-left grid grid-cols-2 gap-6 max-w-2xl mx-auto border border-slate-100">
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Student</p><p className="font-black">{formData.firstName} {formData.lastName}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Admission Class</p><p className="font-black">{formData.admissionClass}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Guardian</p><p className="font-black">{formData.fatherName}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Subjects</p><p className="font-bold text-xs truncate">{(formData.subjects || []).join(', ')}</p></div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-6">
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="px-16 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4"
                    >
                        {isSubmitting ? 'Processing Enrollment...' : <><ShieldCheck size={20} className="text-indigo-400" /> Confirm Admission</>}
                    </button>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital signature will be generated automatically</p>
                </div>
            </div>
          )}
        </div>

        <div className="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <button onClick={() => setStep(prev => prev - 1)} disabled={step === 1} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all">Back to previous</button>
          {step < totalSteps && (
            <button onClick={() => setStep(prev => prev + 1)} className="px-12 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Continue</button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default AdmissionForm;
