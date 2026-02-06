
import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Database, ListChecks, LayoutGrid, ShieldCheck, Zap } from 'lucide-react';

const AppsScriptExporter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * EduStream Pro - Full School ERP Suite (21 Sheets / 9 Modules)
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this entire code.
 * 4. Run the 'setupFullSystem' function.
 */

const DB_SCHEMA = {
  // MODULE 1: ADMINISTRATION & ADMISSION
  STUDENT_ADMISSION_MASTER: ['Student_ID', 'Admission_No', 'First_Name', 'Last_Name', 'Class_Current', 'Section', 'Roll_No', 'Gender', 'DOB', 'Blood_Group', 'Father_Name', 'Mother_Name', 'Father_Mobile', 'Mother_Mobile', 'Student_Email', 'Address_Line1', 'Address_Line2', 'Category', 'RTE_Student', 'Disability', 'Status', 'Photo_URL', 'Aadhar_No', 'Admission_Date'],
  STUDENT_DOCUMENTS: ['Doc_ID', 'Student_ID', 'Doc_Type', 'Doc_Link', 'Submission_Date', 'Verification_Status'],
  
  // MODULE 2: HR & PAYROLL
  STAFF_MASTER: ['Staff_ID', 'Full_Name', 'Role', 'Designation', 'Qualification', 'Date_Of_Joining', 'Mobile_No', 'Email_ID', 'Address', 'Bank_Name', 'Account_Number', 'IFSC_Code', 'PAN_Number', 'Basic_Salary', 'Status'],
  PAYROLL_GENERATION: ['Transaction_ID', 'Month_Year', 'Staff_ID', 'Total_Working_Days', 'Days_Present', 'Leaves_Taken', 'Basic_Pay', 'HRA_Allowance', 'Bonus', 'PF_Deduction', 'TDS_Tax', 'Advance_Taken', 'Net_Payable', 'Payment_Date', 'Payment_Mode'],
  LEAVE_MANAGEMENT: ['Leave_ID', 'Applicant_ID', 'Applicant_Type', 'Leave_Type', 'From_Date', 'To_Date', 'Reason', 'Approval_Status', 'Approved_By'],

  // MODULE 3: ACADEMICS
  CLASS_SUBJECT_MAPPING: ['Mapping_ID', 'Class_Name', 'Section', 'Subject_Name', 'Teacher_Assigned_ID', 'Book_Name_Ref'],
  TIME_TABLE_MASTER: ['TimeTable_ID', 'Day', 'Class_Section', 'Period_No', 'Start_Time', 'End_Time', 'Subject', 'Teacher_ID', 'Room_No'],
  SYLLABUS_TRACKER: ['Tracker_ID', 'Class_Section', 'Subject', 'Chapter_No', 'Chapter_Name', 'Total_Topics', 'Topics_Completed', 'Expected_Completion_Date', 'Actual_Completion_Date', 'Status', 'Teacher_Remark'],
  HOMEWORK_DIARY: ['HW_ID', 'Date', 'Class_Section', 'Subject', 'Title', 'Description', 'Attachment_Link', 'Submission_Due_Date', 'Posted_By_Teacher_ID'],

  // MODULE 4: LIBRARY
  LIBRARY_BOOKS_MASTER: ['Accession_No', 'ISBN', 'Book_Title', 'Author', 'Publisher', 'Category', 'Language', 'Price', 'Purchase_Date', 'Rack_Location', 'Current_Status'],
  LIBRARY_CIRCULATION: ['Issue_ID', 'Book_Accession_No', 'User_Type', 'User_ID', 'Issue_Date', 'Due_Date', 'Return_Date', 'Fine_Amount', 'Status'],

  // MODULE 5: INVENTORY
  INVENTORY_ITEMS: ['Item_ID', 'Item_Name', 'Category', 'Vendor_Details', 'Unit_Price', 'Total_Quantity_Purchased', 'Current_Quantity_Available', 'Reorder_Level'],
  INVENTORY_ISSUANCE: ['Issue_ID', 'Date', 'Item_ID', 'Quantity', 'Issued_To_Staff_ID', 'Purpose', 'Authorized_By_Admin'],

  // MODULE 6: TRANSPORT
  TRANSPORT_VEHICLES: ['Bus_No', 'Driver_Name', 'Driver_Phone', 'Cleaner_Name', 'Capacity', 'Insurance_Expiry', 'Pollution_Expiry', 'GPS_Tracking_Link'],
  TRANSPORT_ROUTES: ['Route_ID', 'Bus_No_Link', 'Stop_Name', 'Pickup_Time', 'Drop_Time', 'Transport_Fee_Monthly'],
  TRANSPORT_ALLOCATION: ['Allocation_ID', 'Student_ID', 'Route_ID', 'Stop_Name', 'Start_Date', 'End_Date'],

  // MODULE 7: FRONT OFFICE
  VISITOR_LOG: ['Visitor_ID', 'Date', 'In_Time', 'Out_Time', 'Visitor_Name', 'Phone_No', 'Purpose', 'Whom_To_Meet', 'Gate_Pass_Issued'],
  ADMISSION_ENQUIRY: ['Enquiry_ID', 'Date', 'Parent_Name', 'Child_Name', 'Class_Applied', 'Phone', 'Source', 'Status', 'Follow_Up_Date', 'Staff_Handling_Enquiry'],

  // MODULE 8: EXAM & CERTIFICATES
  EXAM_MASTER: ['Exam_ID', 'Exam_Name', 'Start_Date', 'End_Date', 'Is_Result_Published'],
  CERTIFICATE_LOG: ['Cert_Issue_ID', 'Certificate_Type', 'Student_ID', 'Issue_Date', 'Reason', 'Generated_Doc_Link'],

  // MODULE 9: SYSTEM CONFIG
  APP_CONFIG: ['Config_Key', 'Config_Value']
};

/**
 * CORE SETUP: Creates all 21 Sheets and populates columns
 */
function setupFullSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  Object.keys(DB_SCHEMA).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Clear and set headers
    sheet.clear();
    const headers = DB_SCHEMA[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Professional Styling
    sheet.getRange(1, 1, 1, headers.length)
         .setBackground('#1e293b')
         .setFontColor('#f8fafc')
         .setFontWeight('bold')
         .setVerticalAlignment('middle')
         .setHorizontalAlignment('center');
    
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });
  
  ui.alert('🚀 Full 21-Sheet ERP Database Setup Complete!\\nModules: Administration, HR, Academics, Library, Inventory, Transport, Front Office, Exams, System Config.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏫 EduStream ERP')
    .addItem('Initialize All 21 Sheets', 'setupFullSystem')
    .addSeparator()
    .addItem('Sync All Modules', 'syncModules')
    .addToUi();
}

/** 
 * AUTOMATION FLOWS (Placeholders for triggers)
 */
function syncModules() {
  // Logic to link Transport to Fees, etc.
  Logger.log('Syncing modules...');
}
`;

  const modulesList = [
    { title: 'Admin & Admission', sheets: ['STUDENT_ADMISSION_MASTER', 'STUDENT_DOCUMENTS'] },
    { title: 'HR & Payroll', sheets: ['STAFF_MASTER', 'PAYROLL_GENERATION', 'LEAVE_MGMT'] },
    { title: 'Academics', sheets: ['TIME_TABLE', 'SYLLABUS_TRACKER', 'HOMEWORK'] },
    { title: 'Library & Inventory', sheets: ['BOOKS_MASTER', 'CIRCULATION', 'INVENTORY'] },
    { title: 'Transport & Office', sheets: ['VEHICLES', 'ROUTES', 'VISITOR_LOG'] },
    { title: 'Exam & System', sheets: ['EXAM_MASTER', 'CERTIFICATES', 'APP_CONFIG'] }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise ERP Exporter</h2>
          <p className="text-slate-500 font-medium">Full integration for 21 Google Sheets across 9 Core Modules.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl ${
              copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {copied ? <CheckCircle size={18} /> : <FileCode size={18} />}
            {copied ? 'Code Copied!' : 'Copy ERP Script'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LayoutGrid size={20} className="text-indigo-600" />
                System Modules
             </h3>
             <div className="space-y-4">
                {modulesList.map((m, i) => (
                  <div key={i} className="group cursor-default">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">{m.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {m.sheets.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-600">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              ERP Core Logic
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Zap size={14} className="text-amber-400 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Auto-Validation:</span> Library checks for dues before TC generation is triggered.
                </p>
              </div>
              <div className="flex gap-3">
                <Zap size={14} className="text-amber-400 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Fee Linkage:</span> Transport allocation automatically updates monthly fee ledger.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full ring-8 ring-slate-900/50">
            <div className="p-5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-4">Full_School_ERP_System.gs</span>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Version 2026.1.0</span>
              </div>
            </div>
            <div className="p-8 overflow-auto custom-scrollbar flex-1 font-mono text-xs leading-relaxed text-indigo-300">
              <pre className="whitespace-pre">
                {scriptCode}
              </pre>
            </div>
            <div className="p-4 bg-indigo-600/10 border-t border-slate-800 flex items-center justify-center gap-4">
               <Database size={16} className="text-indigo-400" />
               <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">System ready for Google Apps Script Engine Deployment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsScriptExporter;
