import React, { useState } from 'react';
// Added Check to the lucide-react imports to resolve "Cannot find name 'Check'" errors.
import { Copy, FileCode, CheckCircle, Database, ExternalLink, Zap, Check } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EDUSTREAM PRO - ENTERPRISE CLOUD SYNC ENGINE v4.0
 * FULL AUTOMATION FOR: STUDENTS, FEES, ATTENDANCE, STAFF
 */

const DB_CONFIG = {
  STUDENT_MASTER: {
    sheetName: 'STUDENT_MASTER',
    headers: ['ID', 'Admission_No', 'First_Name', 'Last_Name', 'Gender', 'DOB', 'Class', 'Section', 'Father_Name', 'Father_Mobile', 'Address', 'Subjects', 'Admission_Date', 'Status']
  },
  FEE_LEDGER: {
    sheetName: 'FEE_LEDGER',
    headers: ['TXN_ID', 'Date', 'Student_Name', 'Class', 'Month', 'Fee_Type', 'Base_Amount', 'Fine_Amount', 'Total_Amount', 'Mode', 'Collected_By']
  },
  ATTENDANCE_LOGS: {
    sheetName: 'ATTENDANCE_LOGS',
    headers: ['Date', 'Class', 'Student_ID', 'Status', 'Marked_By']
  },
  STAFF_DIRECTORY: {
    sheetName: 'STAFF_DIRECTORY',
    headers: ['ID', 'Name', 'Role', 'Email', 'Mobile', 'Salary', 'Assigned_Class', 'Joining_Date']
  }
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏫 EduStream ERP')
    .addItem('🚀 Final System Setup', 'initializeEnterpriseSheets')
    .addToUi();
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Process Students
    if (payload.students) syncData('STUDENT_MASTER', payload.students, (s) => [
      s.id, s.admissionNo, s.firstName, s.lastName, s.gender, s.dob, s.admissionClass, s.section, s.fatherName, s.fatherMobile, s.address, (s.subjects || []).join(','), s.admissionDate, s.status
    ]);

    // Process Fees
    if (payload.fees) syncData('FEE_LEDGER', payload.fees, (f) => [
      f.id, f.date, f.studentName, f.class, f.month, f.feeType, f.baseAmount, f.fineAmount, f.totalAmount, f.mode, f.collectedBy
    ]);

    // Process Staff
    if (payload.staff) syncData('STAFF_DIRECTORY', payload.staff, (m) => [
      m.id, m.name, m.role, m.email, m.mobile, m.salary, m.assignedClass, m.joiningDate
    ]);

    // Process Attendance
    if (payload.attendance) syncData('ATTENDANCE_LOGS', payload.attendance, (a) => [
      a.date, a.classSection, a.studentId, a.status, a.markedBy
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Enterprise Cloud Sync Completed'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncData(key, data, mapFn) {
  const config = DB_CONFIG[key];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.sheetName) || ss.insertSheet(config.sheetName);
  
  sheet.clear();
  sheet.appendRow(config.headers);
  const rows = data.map(mapFn);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, config.headers.length).setValues(rows);
  }
  
  // High-End Formatting
  const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
  headerRange.setBackground('#312e81').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, config.headers.length);
}

function initializeEnterpriseSheets() {
  Object.keys(DB_CONFIG).forEach(key => syncData(key, [], () => []));
  SpreadsheetApp.getUi().alert('✅ Enterprise School System v4.0 Ready!');
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100"><Database size={32} /></div>
          <div><h2 className="text-3xl font-black text-slate-900">Ultimate Cloud Sync</h2><p className="text-slate-500 font-medium tracking-tight">Enterprise Edition v4.0 (Final)</p></div>
        </div>
        <button onClick={handleCopy} className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {copied ? <CheckCircle size={18} /> : <FileCode size={18} />}{copied ? 'Copied!' : 'Copy Comprehensive Code'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-fit">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Zap size={100} /></div>
             <h3 className="text-xl font-black mb-6 text-indigo-300">Final Deployment Instructions</h3>
             <p className="text-sm opacity-80 leading-relaxed mb-6">यह कोड आपकी स्कूल मैनेजमेंट सिस्टम के लिए 'आखिरी अपडेट' है। इसे कॉपी करें और Apps Script में डालें।</p>
             <ul className="space-y-4 text-xs font-bold text-slate-300">
                <li className="flex gap-3"><Check size={14} className="text-emerald-500" /> पुराना सारा कोड मिटा दें।</li>
                <li className="flex gap-3"><Check size={14} className="text-emerald-500" /> यह नया कोड पेस्ट करें।</li>
                <li className="flex gap-3"><Check size={14} className="text-emerald-500" /> 'Deploy' &gt; 'New Deployment' चुनें।</li>
                <li className="flex gap-3"><Check size={14} className="text-emerald-500" /> 'Anyone' को एक्सेस दें।</li>
             </ul>
        </div>
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col h-[500px]">
             <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><div className="w-3 h-3 rounded-full bg-amber-500"></div><div className="w-3 h-3 rounded-full bg-emerald-500"></div></div></div>
             <div className="p-10 overflow-auto font-mono text-[10px] text-indigo-200/80 bg-slate-950"><pre>{scriptCode}</pre></div>
        </div>
      </div>
    </div>
  );
};

export default AppsScriptExporter;