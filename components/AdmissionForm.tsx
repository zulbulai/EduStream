
import React, { useState, useRef } from 'react';
import { User, Users, BookOpen, Camera, FileText, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Student } from '../types';

const AdmissionForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    documents: [],
    transportRequired: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
            documents: [...(prev.documents || []), { type, url: base64 }]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API delay
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
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Admission Successful!</h2>
        <p className="text-slate-500">Student record has been saved to the database and is ready for syncing.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Add Another Student
        </button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Personal', icon: User },
    { id: 2, name: 'Guardians', icon: Users },
    { id: 3, name: 'Academic', icon: BookOpen },
    { id: 4, name: 'Docs', icon: FileText },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">New Admission Entry</h2>
        <div className="flex gap-2">
           {steps.map(s => (
             <div key={s.id} className={`w-3 h-3 rounded-full ${step >= s.id ? 'bg-indigo-600' : 'bg-slate-200'}`} />
           ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="md:col-span-3 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800">Basic Information</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">FIRST NAME *</label>
                <input name="firstName" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">LAST NAME *</label>
                <input name="lastName" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">GENDER</label>
                <select name="gender" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DATE OF BIRTH</label>
                <input name="dob" type="date" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">AADHAR NUMBER</label>
                <input name="aadharNo" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="12 Digit" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="md:col-span-2 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800">Parental Details</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">FATHER'S NAME</label>
                <input name="fatherName" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PRIMARY MOBILE</label>
                <input name="fatherMobile" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="+91" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">MOTHER'S NAME</label>
                <input name="motherName" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL ID</label>
                <input name="email" type="email" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="example@mail.com" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="md:col-span-2 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800">Class & Transport</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ADMISSION CLASS</label>
                <select name="admissionClass" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  {["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TRANSPORT REQUIRED</label>
                <select name="transportRequired" onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col items-center justify-center p-10 border-4 border-dashed border-slate-100 rounded-[2rem] bg-slate-50 text-center relative overflow-hidden group">
                 {previewPhoto ? (
                   <img src={previewPhoto} className="w-32 h-32 object-cover rounded-2xl shadow-xl" alt="Preview" />
                 ) : (
                   <Camera size={48} className="text-slate-300 mb-4" />
                 )}
                 <p className="font-bold text-slate-700 mt-2">Student Passport Photo</p>
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-all"
                 >
                   {previewPhoto ? 'Change Photo' : 'Upload Image'}
                 </button>
                 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'PHOTO')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {['AADHAR_CARD', 'BIRTH_CERTIFICATE', 'PREVIOUS_MARKSHEET'].map(doc => {
                   const isUploaded = formData.documents?.some(d => d.type === doc);
                   return (
                     <div key={doc} className={`p-4 rounded-2xl border ${isUploaded ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                           <FileText size={20} className={isUploaded ? 'text-emerald-500' : 'text-slate-400'} />
                           <span className="text-xs font-bold text-slate-700">{doc.replace('_', ' ')}</span>
                        </div>
                        <label className="cursor-pointer">
                           <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc)} />
                           {isUploaded ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Upload size={18} className="text-indigo-600" />}
                        </label>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(prev => prev - 1)} 
            disabled={step === 1}
            className="text-slate-500 font-bold hover:text-slate-800 disabled:opacity-30"
          >
            Back
          </button>
          {step === totalSteps ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              {isSubmitting ? 'Saving to Database...' : 'Final Submission'}
            </button>
          ) : (
            <button 
              onClick={() => setStep(prev => prev + 1)} 
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
