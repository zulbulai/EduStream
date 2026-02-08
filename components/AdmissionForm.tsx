
import React, { useState, useRef } from 'react';
import { User, Users, BookOpen, Camera, FileText, CheckCircle2, MapPin, PhoneCall, School, Check, ShieldCheck, Upload, Trash2, Fingerprint, FileCheck, RefreshCw } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, StudentDocument } from '../types';

const SUBJECT_LIST = ["Mathematics", "Science", "English", "Hindi", "Sanskrit", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology", "Accounts", "Economics"];

const AdmissionForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<Student>>({
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    studentDocuments: [],
    subjects: [],
    bloodGroup: 'O+',
    section: 'A',
    aadharNo: '',
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewPhoto(base64);
        setFormData(prev => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: StudentDocument['type']) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newDoc: StudentDocument = {
          type: docType,
          name: file.name,
          data: base64
        };
        setFormData(prev => ({
          ...prev,
          studentDocuments: [...(prev.studentDocuments || []).filter(d => d.type !== docType), newDoc]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDoc = (docType: string) => {
    setFormData(prev => ({
      ...prev,
      studentDocuments: (prev.studentDocuments || []).filter(d => d.type !== docType)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.admissionClass || !formData.fatherMobile || !formData.aadharNo) {
      alert("Mandatory fields: Name, Class, Mobile, and Aadhar Number.");
      return;
    }

    setIsSubmitting(true);
    const newStudent: Student = {
      ...formData as Student,
      id: `STU-${Date.now()}`,
      admissionNo: `ADM-${Math.floor(Math.random() * 9000) + 1000}`,
    };

    StorageService.saveStudent(newStudent);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto animate-bounce shadow-2xl shadow-emerald-100">
          <CheckCircle2 size={64} strokeWidth={3} />
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Enrollment Success</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed px-10">
          Student <span className="text-indigo-600 font-black">{formData.firstName}</span> has been successfully onboarded into the EduStream system.
        </p>
        <button onClick={() => window.location.reload()} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">Enroll Next Student</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Campus Enrollment</h2>
          <p className="text-slate-500 font-medium mt-2">Institutional Biometric & Document Verification Suite.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-[3rem] border border-slate-100 shadow-xl overflow-x-auto">
           {[1,2,3,4,5,6].map(s => (
             <div 
              key={s} 
              className={`w-12 h-12 min-w-[3rem] rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                step === s ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-300 scale-110' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
              }`}
             >
               {step > s ? <Check size={20} strokeWidth={3} /> : s}
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-100">
        <div className="p-16">
          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Fingerprint size={32} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">Biometric Identity</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Official Student Profile</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-64 h-64 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden cursor-pointer hover:border-indigo-400 transition-all" onClick={() => fileInputRef.current?.click()}>
                        {previewPhoto ? <img src={previewPhoto} className="w-full h-full object-cover" /> : <div className="text-center p-6"><Camera size={56} className="text-slate-300 mx-auto mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Click to capture<br/>passport photo</p></div>}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputGroup label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Given Name" />
                  <InputGroup label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Surname" />
                  <InputGroup label="Aadhar ID *" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} placeholder="12-digit UID" />
                  <InputGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white font-bold transition-all">
                      <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <InputGroup label="Mobile No" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="+91" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Users size={32} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">Guardian Profile</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Parental Documentation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup label="Father's Full Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                <InputGroup label="Father's Contact *" name="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} placeholder="+91" />
                <InputGroup label="Mother's Full Name" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                <InputGroup label="Residential City" name="city" value={formData.city} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-inner"><School size={32} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">Academic History</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Previous Education Metrics</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup label="Last Institution" name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} placeholder="Name of School" />
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Admission Grade</label>
                    <select name="admissionClass" value={formData.admissionClass} onChange={handleInputChange} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white font-bold transition-all">
                      {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <InputGroup label="TC Reference ID" name="tcNumber" value={formData.tcNumber} onChange={handleInputChange} />
                <InputGroup label="Aadhar ID" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner"><BookOpen size={32} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">Curriculum Assignment</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select Subjects for Student Profile</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                  {SUBJECT_LIST.map(sub => (
                      <button 
                          key={sub} 
                          type="button" 
                          onClick={() => toggleSubject(sub)}
                          className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center gap-3 ${
                              formData.subjects?.includes(sub) ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                          }`}
                      >
                          {sub} {formData.subjects?.includes(sub) && <Check size={14} strokeWidth={3} />}
                      </button>
                  ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-inner"><FileText size={32} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">Digital Document Hub</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Encrypted Archive of Legal Identity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <DocUploader label="UID/Aadhar Proof" type="Aadhar" icon={<Fingerprint size={24} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Transfer Receipt" type="TC" icon={<Upload size={24} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Last Academic Record" type="Marksheet" icon={<FileCheck size={24} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Official Birth Proof" type="BirthCertificate" icon={<Users size={24} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center">
                <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-300"><ShieldCheck size={48} /></div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Authorize & Finalize</h3>
                <div className="bg-slate-50 p-12 rounded-[4rem] text-left grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto border border-slate-100">
                    <ReviewItem label="Enrolling Student" value={`${formData.firstName} ${formData.lastName}`} />
                    <ReviewItem label="Identification UID" value={formData.aadharNo || '---'} />
                    <ReviewItem label="Institutional Grade" value={`${formData.admissionClass} - ${formData.section}`} />
                    <ReviewItem label="Verified Documents" value={`${formData.studentDocuments?.length} items cloud-synced`} />
                </div>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="px-20 py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50"
                >
                    {isSubmitting ? <><RefreshCw className="animate-spin" /> Authorizing...</> : 'Confirm Official Enrollment'}
                </button>
            </div>
          )}
        </div>

        <div className="px-16 py-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(prev => prev - 1)} 
            disabled={step === 1} 
            className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-slate-900 disabled:opacity-0 transition-all"
          >
            Previous Stage
          </button>
          {step < totalSteps && (
            <button 
              onClick={() => setStep(prev => prev + 1)} 
              className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              Continue to Step {step + 1}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <input 
      name={name} 
      type={type} 
      value={value} 
      onChange={onChange} 
      className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white font-bold transition-all shadow-sm" 
      placeholder={placeholder} 
    />
  </div>
);

const DocUploader = ({ label, type, icon, formData, onUpload, onRemove }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const doc = formData.studentDocuments?.find((d: any) => d.type === type);

  return (
    <div className={`p-8 rounded-[3rem] border-2 transition-all flex items-center justify-between ${doc ? 'bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-500/5' : 'bg-slate-50 border-dashed border-slate-200 hover:border-indigo-400 shadow-sm'}`}>
       <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${doc ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'bg-white text-slate-300 shadow-inner'}`}>
             {doc ? <Check size={28} strokeWidth={4} /> : icon}
          </div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
             <p className="text-sm font-black text-slate-900 truncate max-w-[180px]">{doc ? doc.name : 'Awaiting file...'}</p>
          </div>
       </div>
       <div className="flex gap-3">
          {doc ? (
            <button onClick={() => onRemove(type)} className="p-4 bg-white text-rose-500 rounded-2xl hover:bg-rose-50 shadow-sm transition-all"><Trash2 size={20} /></button>
          ) : (
            <button onClick={() => fileRef.current?.click()} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"><Upload size={20} /></button>
          )}
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => onUpload(e, type)} />
       </div>
    </div>
  );
};

const ReviewItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="font-black text-slate-900 text-2xl tracking-tight">{value}</p>
    </div>
);

export default AdmissionForm;
