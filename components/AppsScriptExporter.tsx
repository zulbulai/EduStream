
import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Database, Zap, Check } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EDUSTREAM PRO - CLOUD ENGINE v9.5 (MULTI-PORTAL UPDATE)
 */

const DB_CONFIG = {
  STUDENT_MASTER: {
    sheetName: 'STUDENT_MASTER',
    headers: ['ID', 'Admission_No', 'Roll_No', 'First_Name', 'Last_Name', 'Gender', 'DOB', 'Email', 'Class', 'Section', 'Father_Name', 'Father_Mobile', 'Address', 'City', 'Status', 'Admission_Date']
  },
  FEE_LEDGER: {
    sheetName: 'FEE_LEDGER',
    headers: ['TXN_ID', 'Date', 'Student_Name', 'Class', 'Month', 'Fee_Type', 'Base_Amount', 'Fine_Amount', 'Fine_Reason', 'Total_Amount', 'Mode', 'Status', 'Collected_By']
  },
  ATTENDANCE_LOGS: {
    sheetName: 'ATTENDANCE_LOGS',
    headers: ['Date', 'Class', 'Student_ID', 'Status', 'Marked_By']
  },
  STAFF_DIRECTORY: {
    sheetName: 'STAFF_DIRECTORY',
    headers: ['ID', 'Name', 'Role', 'Email', 'Mobile', 'Salary', 'Advance_Amount', 'Assigned_Class', 'Joining_Date', 'Qualification', 'Present_Days', 'Leave_Days']
  },
  EXAM_MARKS: {
    sheetName: 'EXAM_MARKS',
    headers: ['ID', 'Student_ID', 'Exam_Name', 'Subject', 'Marks_Obtained', 'Max_Marks', 'Date']
  },
  NOTIFICATIONS: {
    sheetName: 'NOTIFICATIONS',
    headers: ['ID', 'From', 'To', 'Title', 'Message', 'Date', 'Priority']
  }
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🏫 EduStream ERP v9.5').addItem('🚀 Initial Database Setup', 'initializeEnterpriseSheets').addToUi();
}

function doGet() {
  const data = {};
  Object.keys(DB_CONFIG).forEach(key => { data[key.toLowerCase().replace('_', '')] = getSheetData(DB_CONFIG[key].sheetName); });
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.students) syncData('STUDENT_MASTER', payload.students, s => [s.id, s.admissionNo, s.rollNo || '', s.firstName, s.lastName, s.gender, s.dob, s.email || '', s.admissionClass, s.section || '', s.fatherName, s.fatherMobile, s.address || '', s.city || '', s.status, s.admissionDate]);
    if (payload.fees) syncData('FEE_LEDGER', payload.fees, f => [f.id, f.date, f.studentName, f.class, f.month, f.feeType, f.baseAmount, f.fineAmount, f.fineReason, f.totalAmount, f.mode, f.status, f.collectedBy]);
    if (payload.staff) syncData('STAFF_DIRECTORY', payload.staff, m => [m.id, m.name, m.role, m.email, m.mobile, m.salary, m.advanceAmount || 0, m.assignedClass || 'None', m.joiningDate, m.qualification, m.presentDays || 0, m.leaveDays || 0]);
    if (payload.marks) syncData('EXAM_MARKS', payload.marks, m => [m.id, m.studentId, m.examName, m.subject, m.marksObtained, m.maxMarks, m.date]);
    if (payload.notifications) syncData('NOTIFICATIONS', payload.notifications, n => [n.id, n.from, n.to, n.title, n.message, n.date, n.priority]);
    if (payload.attendance) syncData('ATTENDANCE_LOGS', payload.attendance, a => [a.date, a.classSection, a.studentId, a.status, a.markedBy]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => { let key = h.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase()); obj[key] = row[i]; });
    return obj;
  });
}

function syncData(key, data, mapFn) {
  const config = DB_CONFIG[key];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.sheetName) || ss.insertSheet(config.sheetName);
  sheet.clear();
  sheet.appendRow(config.headers);
  const rows = data.map(mapFn);
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, config.headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, config.headers.length).setBackground('#312e81').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, config.headers.length);
}

function initializeEnterpriseSheets() {
  Object.keys(DB_CONFIG).forEach(key => syncData(key, [], () => []));
  SpreadsheetApp.getUi().alert('✅ EduStream v9.5 Enterprise DB Ready!');
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ring-1 ring-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200"><Database size={40} /></div>
          <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Portal Sync Engine</h2><p className="text-indigo-600 font-bold tracking-tight text-sm uppercase">Version 9.5 Enterprise Build</p></div>
        </div>
        <button onClick={handleCopy} className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-2xl active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
          {copied ? <CheckCircle size={20} /> : <FileCode size={20} />}{copied ? 'Code Copied!' : 'Copy v9.5 Source Code'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden h-fit shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Zap size={150} /></div>
             <h3 className="text-2xl font-black mb-8 text-indigo-200">Deployment Steps</h3>
             <div className="space-y-6">
                <p className="text-sm font-bold">1. Replace existing script in Google Sheets.</p>
                <p className="text-sm font-bold">2. Deploy as Web App (Access: Anyone).</p>
                <p className="text-sm font-bold">3. Update URL in Settings.</p>
                <p className="text-sm font-bold">4. Use 'Push Local Data' to create new tables.</p>
             </div>
        </div>
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col h-[600px] border border-slate-800 shadow-2xl">
             <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><div className="w-3 h-3 rounded-full bg-amber-500"></div><div className="w-3 h-3 rounded-full bg-emerald-500"></div></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">engine_v9_5.gs</span>
             </div>
             <div className="p-10 overflow-auto font-mono text-[11px] text-indigo-100/80 bg-slate-950 leading-relaxed custom-scrollbar">
                <pre>{scriptCode}</pre>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AppsScriptExporter;
