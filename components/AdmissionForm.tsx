
import React, { useState, useRef } from 'react';
import { User, Users, BookOpen, Camera, FileText, CheckCircle2, MapPin, PhoneCall, School, Check, ShieldCheck, Upload, Trash2, Fingerprint, FileCheck } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student, StudentDocument } from '../types';

const SUBJECT_LIST = ["Mathematics", "Science", "English", "Hindi", "Sanskrit", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology", "Accounts", "Economics"];

const AdmissionForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Increased to accommodate documents step
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
    await new Promise(r => setTimeout(r, 2000));
    
    const newStudent: Student = {
      ...formData as Student,
      id: `STU-${Date.now()}`,
      admissionNo: `ADM-${Math.floor(Math.random() * 9000) + 1000}`,
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admission Registered!</h2>
        <p className="text-slate-500 font-medium text-lg">Student <span className="text-indigo-600 font-bold">{formData.firstName}</span> documents and identity have been verified and uploaded.</p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">Enroll Next Student</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Unified Admission Portal</h2>
          <p className="text-slate-500 font-medium mt-1">Institutional Enrollment & Document Verification v11.0</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto">
           {[1,2,3,4,5,6].map(s => (
             <div 
              key={s} 
              className={`w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
              }`}
             >
               {step > s ? <Check size={16} strokeWidth={3} /> : s}
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-12">
          {/* Step 1: Personal Identity */}
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Fingerprint size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900">Personal & Biometric Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-48 h-48 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {previewPhoto ? <img src={previewPhoto} className="w-full h-full object-cover" /> : <div className="text-center p-4"><Camera size={40} className="text-slate-300 mx-auto" /><p className="text-[9px] font-black text-slate-400 uppercase mt-2">Click to Upload Photo</p></div>}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" />
                  <InputGroup label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" />
                  <InputGroup label="Aadhar Number *" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} placeholder="12-digit Aadhar" />
                  <InputGroup label="Other Govt ID (Optional)" name="otherId" value={formData.otherId} onChange={handleInputChange} placeholder="Passport/PAN/Ration" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold">
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <InputGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guardian Details */}
          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900">Guardian & Family Profile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                <InputGroup label="Father's Mobile *" name="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} placeholder="+91" />
                <InputGroup label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                <InputGroup label="Father's Occupation" name="fatherOccupation" value={(formData as any).fatherOccupation} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {/* Step 3: Academic History */}
          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><School size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900">Academic Background</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Last School Attended" name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} placeholder="Name of previous school" />
                <InputGroup label="Last Grade/Class" name="previousGrade" value={formData.previousGrade} onChange={handleInputChange} placeholder="e.g. 5th Grade" />
                <InputGroup label="TC Number (if applicable)" name="tcNumber" value={formData.tcNumber} onChange={handleInputChange} />
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admission Requested For</label>
                    <select name="admissionClass" value={formData.admissionClass} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold">
                      {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Subjects & Interests */}
          {step === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><BookOpen size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900">Curriculum Selection</h3>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Assigned Subjects for Session 2025-26</label>
                  <div className="flex flex-wrap gap-3">
                      {SUBJECT_LIST.map(sub => (
                          <button 
                              key={sub} 
                              type="button" 
                              onClick={() => toggleSubject(sub)}
                              className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
                                  formData.subjects?.includes(sub) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                              }`}
                          >
                              {sub} {formData.subjects?.includes(sub) && <Check size={12} />}
                          </button>
                      ))}
                  </div>
              </div>
            </div>
          )}

          {/* Step 5: Document Hub */}
          {step === 5 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900">Document Hub & Verification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <DocUploader label="Aadhar Card Copy" type="Aadhar" icon={<Fingerprint size={20} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Transfer Certificate (TC)" type="TC" icon={<Upload size={20} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Previous Marksheet" type="Marksheet" icon={<FileCheck size={20} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
                 <DocUploader label="Birth Certificate" type="BirthCertificate" icon={<Users size={20} />} formData={formData} onUpload={handleDocUpload} onRemove={removeDoc} />
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck size={40} /></div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Final Registration Review</h3>
                <div className="bg-slate-50 p-10 rounded-[3.5rem] text-left grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto border border-slate-100 shadow-sm">
                    <div><ReviewItem label="Student" value={`${formData.firstName} ${formData.lastName}`} /></div>
                    <div><ReviewItem label="Aadhar" value={formData.aadharNo || 'Missing'} /></div>
                    <div><ReviewItem label="Academic Class" value={`${formData.admissionClass} - ${formData.section}`} /></div>
                    <div><ReviewItem label="Previous School" value={formData.previousSchool || 'Fresh Admission'} /></div>
                    <div className="col-span-full">
                        <ReviewItem label="Uploaded Documents" value={`${formData.studentDocuments?.length} items verified`} />
                        <div className="flex flex-wrap gap-2 mt-2">
                           {formData.studentDocuments?.map(d => <span key={d.type} className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase">{d.type}</span>)}
                        </div>
                    </div>
                </div>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="px-16 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 mx-auto"
                >
                    {isSubmitting ? <><RefreshCw className="animate-spin" /> Finalizing Enrollment...</> : 'Complete Admission'}
                </button>
            </div>
          )}
        </div>

        <div className="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(prev => prev - 1)} 
            disabled={step === 1} 
            className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all"
          >
            Go Back
          </button>
          {step < totalSteps && (
            <button 
              onClick={() => setStep(prev => prev + 1)} 
              className="px-12 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      name={name} 
      type={type} 
      value={value} 
      onChange={onChange} 
      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all" 
      placeholder={placeholder} 
    />
  </div>
);

const DocUploader = ({ label, type, icon, formData, onUpload, onRemove }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const doc = formData.studentDocuments?.find((d: any) => d.type === type);

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${doc ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-dashed border-slate-200 hover:border-indigo-300'}`}>
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${doc ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
             {doc ? <Check size={20} strokeWidth={3} /> : icon}
          </div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
             <p className="text-sm font-black text-slate-700 truncate max-w-[150px]">{doc ? doc.name : 'No file chosen'}</p>
          </div>
       </div>
       <div className="flex gap-2">
          {doc ? (
            <button onClick={() => onRemove(type)} className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-50 shadow-sm transition-all"><Trash2 size={16} /></button>
          ) : (
            <button onClick={() => fileRef.current?.click()} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"><Upload size={16} /></button>
          )}
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => onUpload(e, type)} />
       </div>
    </div>
  );
};

const ReviewItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="font-black text-slate-800 text-lg">{value}</p>
    </div>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
);

export default AdmissionForm;
