
import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Database, Zap, Check } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EDUSTREAM PRO - ENTERPRISE CLOUD SYNC ENGINE v6.0
 * FEATURES: 2-WAY SYNC (GET/POST), AUTO-HEADERS, FORMATTING
 */

const DB_CONFIG = {
  STUDENT_MASTER: {
    sheetName: 'STUDENT_MASTER',
    headers: [
      'ID', 'Admission_No', 'Roll_No', 'First_Name', 'Last_Name', 'Gender', 'DOB', 'Email', 
      'Class', 'Section', 'Father_Name', 'Father_Mobile', 'Mother_Name', 'Emergency_Name', 
      'Emergency_Mobile', 'Address', 'City', 'Pin_Code', 'Blood_Group', 'Category', 
      'Religion', 'Subjects', 'Prev_School', 'Prev_Grade', 'Status', 'Admission_Date'
    ]
  },
  FEE_LEDGER: {
    sheetName: 'FEE_LEDGER',
    headers: [
      'TXN_ID', 'Date', 'Student_Name', 'Class', 'Month', 'Fee_Type', 'Base_Amount', 
      'Fine_Amount', 'Total_Amount', 'Fine_Reason', 'Mode', 'Status', 'Collected_By'
    ]
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
    .addItem('🚀 Final System Setup', 'initializeEnterpriseSheets')
    .addToUi();
}

/**
 * Handle GET requests (Pulling data to Web App)
 */
function doGet() {
  const output = {
    status: 'success',
    data: {
      students: getSheetData('STUDENT_MASTER'),
      fees: getSheetData('FEE_LEDGER'),
      attendance: getSheetData('ATTENDANCE_LOGS'),
      staff: getSheetData('STAFF_DIRECTORY')
    }
  };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let key = h.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      // Special mapping for subjects array
      if (h === 'Subjects' && row[i]) {
        obj[key] = row[i].toString().split(', ');
      } else {
        obj[key] = row[i];
      }
    });
    return obj;
  });
}

/**
 * Handle POST requests (Pushing data to Sheet)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.students) syncData('STUDENT_MASTER', payload.students, (s) => [
      s.id, s.admissionNo, s.rollNo || '', s.firstName, s.lastName, s.gender, s.dob, s.email || '', 
      s.admissionClass, s.section || '', s.fatherName, s.fatherMobile, s.motherName || '', 
      s.emergencyContactName || '', s.emergencyContactMobile || '', s.address || '', 
      s.city || '', s.pinCode || '', s.bloodGroup || '', s.category || '', 
      s.religion || '', (s.subjects || []).join(', '), s.previousSchool || '', 
      s.previousGrade || '', s.status, s.admissionDate
    ]);

    if (payload.fees) syncData('FEE_LEDGER', payload.fees, (f) => [
      f.id, f.date, f.studentName, f.class, f.month, f.feeType, f.baseAmount, 
      f.fineAmount, f.totalAmount, f.fineReason || 'N/A', f.mode, f.status, f.collectedBy
    ]);

    if (payload.staff) syncData('STAFF_DIRECTORY', payload.staff, (m) => [
      m.id, m.name, m.role, m.email, m.mobile, m.salary, m.assignedClass || 'None', 
      m.joiningDate, m.qualification || 'N/A'
    ]);

    if (payload.attendance) syncData('ATTENDANCE_LOGS', payload.attendance, (a) => [
      a.date, a.classSection, a.studentId, a.status, a.markedBy
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
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
  
  const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
  headerRange.setBackground('#312e81').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, config.headers.length);
}

function initializeEnterpriseSheets() {
  Object.keys(DB_CONFIG).forEach(key => syncData(key, [], () => []));
  SpreadsheetApp.getUi().alert('✅ Enterprise School System Ready!');
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
          <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Cloud Sync</h2><p className="text-slate-500 font-medium tracking-tight">System Version 6.0 (Global 2-Way Sync)</p></div>
        </div>
        <button onClick={handleCopy} className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {copied ? <CheckCircle size={18} /> : <FileCode size={18} />}{copied ? 'Code Copied' : 'Copy v6.0 Source Code'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-fit shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Zap size={100} /></div>
             <h3 className="text-xl font-black mb-6 text-indigo-300">Deployment Logic v6.0</h3>
             <p className="text-sm opacity-80 leading-relaxed mb-6">यह नया कोड (GET/POST) दोनों को सपोर्ट करता है, जिससे शीट का पुराना डाटा ऐप में वापिस भी आ सकेगा।</p>
             <div className="space-y-4">
                <StepItem num="1" text="पुराना सारा कोड हटाकर यह नया v6.0 पेस्ट करें।" />
                <StepItem num="2" text="Save बटन दबाएं।" />
                <StepItem num="3" text="Deploy > New Deployment > Web App चुनें।" />
                <StepItem num="4" text="Access को 'Anyone' पर सेट करें (अनिवार्य)।" />
             </div>
        </div>
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col h-[500px] border border-slate-800 shadow-2xl">
             <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">enterprise_sync_v6.gs</span>
             </div>
             <div className="p-10 overflow-auto font-mono text-[11px] text-indigo-200/90 bg-slate-950 custom-scrollbar leading-relaxed">
                <pre>{scriptCode}</pre>
             </div>
        </div>
      </div>
    </div>
  );
};

const StepItem = ({ num, text }: { num: string, text: string }) => (
    <div className="flex gap-4 items-start">
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">{num}</div>
        <p className="text-xs font-bold text-slate-300">{text}</p>
    </div>
);

export default AppsScriptExporter;
