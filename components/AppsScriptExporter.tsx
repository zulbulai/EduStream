
import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Zap, ExternalLink, HelpCircle, Terminal, Database } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EDUSTREAM PRO - ADVANCED CLOUD SYNC ENGINE v3.0
 * Supports: Detailed Fee Breakdown, Fines, and Attendance Logs.
 */

const DB_SCHEMA = {
  STUDENT_ADMISSION_MASTER: ['Student_ID', 'Admission_No', 'First_Name', 'Last_Name', 'Class', 'Status', 'Admission_Date', 'Father_Name', 'Father_Mobile'],
  FEE_TRANSACTIONS: ['TXN_ID', 'Date', 'Student_Name', 'Class', 'Month', 'Fee_Type', 'Base_Amount', 'Fine_Amount', 'Total_Amount', 'Fine_Reason', 'Mode', 'Collected_By'],
  STAFF_MASTER: ['Staff_ID', 'Full_Name', 'Role', 'Email', 'Mobile', 'Salary', 'Joining_Date'],
  ATTENDANCE_LOG: ['Date', 'Class', 'Student_ID', 'Status', 'Marked_By']
};

/**
 * SETUP MENU
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏫 EduStream ERP')
    .addItem('🚀 Setup All Sheets (One-Click)', 'setupFullSystem')
    .addSeparator()
    .addItem('ℹ️ Check Connection', 'checkConnection')
    .addToUi();
}

/**
 * RECEIVE DATA FROM APP (POST)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Sync Students
    if (payload.students) syncEntity('STUDENT_ADMISSION_MASTER', payload.students, (s) => [
      s.id, s.admissionNo, s.firstName, s.lastName, s.admissionClass, s.status, s.admissionDate, s.fatherName, s.fatherMobile
    ]);

    // Sync Fees (Advanced breakdown)
    if (payload.fees) syncEntity('FEE_TRANSACTIONS', payload.fees, (f) => [
      f.id, f.date, f.studentName, f.class, f.month, f.feeType, f.baseAmount, f.fineAmount, f.totalAmount, f.fineReason, f.mode, f.collectedBy
    ]);

    // Sync Staff
    if (payload.staff) syncEntity('STAFF_MASTER', payload.staff, (m) => [
      m.id, m.name, m.role, m.email, m.mobile, m.salary, m.joiningDate
    ]);

    // Sync Attendance
    if (payload.attendance) syncEntity('ATTENDANCE_LOG', payload.attendance, (a) => [
      a.date, a.classSection, a.studentId, a.status, a.markedBy
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Advanced Data Synced Successfully'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * VERIFICATION (GET)
 */
function doGet() {
  return ContentService.createTextOutput("EduStream Cloud Sync v3.0 ACTIVE!").setMimeType(ContentService.MimeType.TEXT);
}

function syncEntity(sheetName, dataArray, mapFn) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(DB_SCHEMA[sheetName]);
  }
  
  sheet.clear();
  sheet.appendRow(DB_SCHEMA[sheetName]);
  
  const rows = dataArray.map(mapFn);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, DB_SCHEMA[sheetName].length).setValues(rows);
  }
  
  // Formatting
  sheet.getRange(1, 1, 1, DB_SCHEMA[sheetName].length).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, DB_SCHEMA[sheetName].length);
}

function setupFullSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(DB_SCHEMA).forEach(name => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
    syncEntity(name, [], () => []);
  });
  SpreadsheetApp.getUi().alert('✅ Advanced School Database Initialized!');
}

function checkConnection() {
  SpreadsheetApp.getUi().alert('📡 Server Status: ONLINE\\nVersion: 3.0 (Advanced)');
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
          <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
            <Database size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Cloud Engine</h2>
            <p className="text-slate-500 font-medium">Supporting <span className="text-indigo-600 font-bold">Itemized Fees & Fines</span>.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <a 
            href="https://sheets.new" 
            target="_blank" 
            className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all shadow-sm"
           >
             <ExternalLink size={16} /> Update Sheet
           </a>
           <button 
            onClick={handleCopy}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${
              copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
           >
            {copied ? <CheckCircle size={18} /> : <FileCode size={18} />}
            {copied ? 'Copied!' : 'Copy Advanced Script'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10">
               <HelpCircle size={120} />
             </div>
             <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-indigo-200">
                <Zap size={20} className="text-amber-400" />
                Next Step
             </h3>
             <p className="text-sm font-medium leading-relaxed mb-6 opacity-80">
               चूंकि आपने पहले से ही पुरानी स्क्रिप्ट डाली हुई है, कृपया उसे **हटाकर** इस नई **Advanced Script** को पेस्ट करें और दोबारा **Deploy** करें।
             </p>
             <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-black shrink-0 border border-indigo-400">1</span>
                  <p className="text-sm font-medium leading-relaxed">
                    Apps Script में पुराना कोड मिटाकर यह नया कोड डालें।
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-black shrink-0 border border-indigo-400">2</span>
                  <p className="text-sm font-medium leading-relaxed">
                    <span className="font-black text-white">Deploy &gt; Manage Deployments</span> में जाकर पुराने वाले को **Edit** करके **New Version** चुनें।
                  </p>
                </li>
             </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col ring-8 ring-slate-900/50">
             <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="px-4 py-1 bg-slate-800 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  GoogleSync_v3.gs
                </div>
             </div>
             <div className="p-10 overflow-auto custom-scrollbar font-mono text-[10px] leading-relaxed text-indigo-200/80 bg-slate-950 h-[500px]">
                <pre className="whitespace-pre">
                  {scriptCode}
                </pre>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppsScriptExporter;
