
import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Database, Zap, Check, AlertTriangle } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EDUSTREAM PRO - ENTERPRISE CLOUD SYNC ENGINE v7.0 (ULTIMATE)
 * Optimized for High-Speed Reliable Data Transfer
 */

const DB_CONFIG = {
  STUDENT_MASTER: {
    sheetName: 'STUDENT_MASTER',
    headers: ['ID', 'Admission_No', 'Roll_No', 'First_Name', 'Last_Name', 'Gender', 'DOB', 'Email', 'Class', 'Section', 'Father_Name', 'Father_Mobile', 'Mother_Name', 'Emergency_Name', 'Emergency_Mobile', 'Address', 'City', 'Pin_Code', 'Blood_Group', 'Category', 'Religion', 'Subjects', 'Prev_School', 'Prev_Grade', 'Status', 'Admission_Date']
  },
  FEE_LEDGER: {
    sheetName: 'FEE_LEDGER',
    headers: ['TXN_ID', 'Date', 'Student_Name', 'Class', 'Month', 'Fee_Type', 'Base_Amount', 'Fine_Amount', 'Total_Amount', 'Fine_Reason', 'Mode', 'Status', 'Collected_By']
  },
  ATTENDANCE_LOGS: {
    sheetName: 'ATTENDANCE_LOGS',
    headers: ['Date', 'Class', 'Student_ID', 'Status', 'Marked_By']
  },
  STAFF_DIRECTORY: {
    sheetName: 'STAFF_DIRECTORY',
    headers: ['ID', 'Name', 'Role', 'Email', 'Mobile', 'Salary', 'Assigned_Class', 'Joining_Date', 'Qualification']
  }
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏫 EduStream ERP')
    .addItem('🚀 Setup All Sheets', 'initializeEnterpriseSheets')
    .addItem('🧹 Wipe All Data', 'cleanDatabase')
    .addToUi();
}

/**
 * PULL DATA (GET)
 */
function doGet() {
  try {
    const data = {};
    Object.keys(DB_CONFIG).forEach(key => {
      data[key.toLowerCase().replace('_', '')] = getSheetData(DB_CONFIG[key].sheetName);
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * PUSH DATA (POST)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    logToSheet('Incoming Sync Request');

    if (payload.students) syncData('STUDENT_MASTER', payload.students, s => [
      s.id, s.admissionNo, s.rollNo || '', s.firstName, s.lastName, s.gender, s.dob, s.email || '', 
      s.admissionClass, s.section || '', s.fatherName, s.fatherMobile, s.motherName || '', 
      s.emergencyContactName || '', s.emergencyContactMobile || '', s.address || '', 
      s.city || '', s.pinCode || '', s.bloodGroup || '', s.category || '', 
      s.religion || '', (s.subjects || []).join(', '), s.previousSchool || '', 
      s.previousGrade || '', s.status, s.admissionDate
    ]);

    if (payload.fees) syncData('FEE_LEDGER', payload.fees, f => [
      f.id, f.date, f.studentName, f.class, f.month, f.feeType, f.baseAmount, 
      f.fineAmount, f.totalAmount, f.fineReason || 'N/A', f.mode, f.status, f.collectedBy
    ]);

    if (payload.staff) syncData('STAFF_DIRECTORY', payload.staff, m => [
      m.id, m.name, m.role, m.email, m.mobile, m.salary, m.assignedClass || 'None', 
      m.joiningDate, m.qualification || 'N/A'
    ]);

    if (payload.attendance) syncData('ATTENDANCE_LOGS', payload.attendance, a => [
      a.date, a.classSection, a.studentId, a.status, a.markedBy
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    logToSheet('ERROR: ' + err.toString());
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
    headers.forEach((h, i) => {
      let key = h.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase());
      obj[key] = (h === 'Subjects' && row[i]) ? row[i].toString().split(', ') : row[i];
    });
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
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, config.headers.length).setValues(rows);
  }
  sheet.getRange(1, 1, 1, config.headers.length).setBackground('#312e81').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, config.headers.length);
}

function logToSheet(msg) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('DEBUG_LOG') || ss.insertSheet('DEBUG_LOG');
  sheet.appendRow([new Date(), msg]);
}

function initializeEnterpriseSheets() {
  Object.keys(DB_CONFIG).forEach(key => syncData(key, [], () => []));
  SpreadsheetApp.getUi().alert('✅ EduStream Database Ready!');
}

function cleanDatabase() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.alert('Danger', 'Delete everything?', ui.ButtonSet.YES_NO);
  if (res == ui.Button.YES) initializeEnterpriseSheets();
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
          <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Cloud Engine</h2><p className="text-indigo-600 font-bold tracking-tight text-sm uppercase">Version 7.0 Ultimate Fix</p></div>
        </div>
        <button onClick={handleCopy} className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-2xl active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
          {copied ? <CheckCircle size={20} /> : <FileCode size={20} />}{copied ? 'Code Copied!' : 'Copy v7.0 Source Code'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden h-fit shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Zap size={150} /></div>
             <h3 className="text-2xl font-black mb-8 text-indigo-200">Final Setup Steps</h3>
             <div className="space-y-6">
                <StepItem num="1" text="पुराना Apps Script कोड पूरी तरह डिलीट करें।" />
                <StepItem num="2" text="नया v7.0 कोड यहाँ से कॉपी करके पेस्ट करें।" />
                <StepItem num="3" text="Deploy > New Deployment > Web App चुनें।" />
                <StepItem num="4" text="'Who has access' को 'Anyone' पर रखें।" />
                <StepItem num="5" text="Authorize होने के बाद प्राप्त URL को Settings में डालें।" />
             </div>
             <div className="mt-10 p-6 bg-white/10 rounded-3xl border border-white/20">
                <div className="flex items-center gap-3 text-amber-300 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-black text-[10px] uppercase">Pro Tip</span>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80">अगर डेटा नहीं आ रहा, तो शीट में 'DEBUG_LOG' नाम की शीट देखें, वहां आपको गलती का पता चल जाएगा।</p>
             </div>
        </div>
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col h-[600px] border border-slate-800 shadow-2xl">
             <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><div className="w-3 h-3 rounded-full bg-amber-500"></div><div className="w-3 h-3 rounded-full bg-emerald-500"></div></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ultimate_sync_v7.gs</span>
             </div>
             <div className="p-10 overflow-auto font-mono text-[11px] text-indigo-100/80 bg-slate-950 leading-relaxed custom-scrollbar">
                <pre>{scriptCode}</pre>
             </div>
        </div>
      </div>
    </div>
  );
};

const StepItem = ({ num, text }: { num: string, text: string }) => (
    <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center text-xs font-black shrink-0 border border-white/20">{num}</div>
        <p className="text-sm font-bold text-indigo-50 leading-tight pt-1">{text}</p>
    </div>
);

export default AppsScriptExporter;
