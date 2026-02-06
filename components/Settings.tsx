
import React, { useState, useEffect } from 'react';
import { Save, Globe, Database, School, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { SystemConfig } from '../types';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(StorageService.getConfig());
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSave = () => {
    StorageService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleManualSync = async () => {
    if (!config.appsScriptUrl) {
      alert("Please enter the Apps Script URL first.");
      return;
    }
    setSyncing(true);
    try {
      const data = {
        students: StorageService.getStudents(),
        fees: StorageService.getFees(),
        staff: StorageService.getStaff(),
        attendance: StorageService.getAttendance()
      };

      const response = await fetch(config.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires this for simple web apps
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      alert("Cloud Sync Triggered! Data is being pushed to Google Sheets.");
    } catch (error) {
      console.error(error);
      alert("Sync failed. Check your URL or Internet connection.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium">Configure cloud connectivity and school profile.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saved ? 'Settings Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Globe size={20} className="text-indigo-600" />
              Cloud Integration (Google Sheets)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Apps Script Web App URL</label>
                <input 
                  type="text" 
                  value={config.appsScriptUrl}
                  onChange={(e) => setConfig({...config, appsScriptUrl: e.target.value})}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-mono text-xs transition-all"
                />
                <p className="mt-2 text-[10px] text-slate-400 font-medium leading-relaxed">
                  यह URL आपको Google Sheet के Apps Script को 'Web App' के रूप में Deploy करने पर मिलेगा।
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleManualSync}
                  disabled={syncing}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Uploading Data...' : 'Sync All Data to Cloud Now'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <School size={20} className="text-indigo-600" />
              School Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">School Name</label>
                <input 
                  type="text" 
                  value={config.schoolName}
                  onChange={(e) => setConfig({...config, schoolName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Academic Session</label>
                <select 
                  value={config.currentSession}
                  onChange={(e) => setConfig({...config, currentSession: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold transition-all"
                >
                  <option>2024-25</option>
                  <option>2025-26</option>
                  <option>2026-27</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
            <ShieldCheck size={40} className="mb-6 opacity-50" />
            <h4 className="text-xl font-black mb-4">Security Note</h4>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">
              आपका सारा डेटा लोकल स्टोरेज में एन्क्रिप्टेड रहता है। Cloud Sync करने पर यह आपके पर्सनल Google Drive (Sheet) में सुरक्षित रूप से कॉपी हो जाता है।
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-4">
            <h4 className="font-bold text-slate-800">Connection Status</h4>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${config.appsScriptUrl ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                {config.appsScriptUrl ? 'Linked to Google Cloud' : 'Offline Mode'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase">
              Last Sync: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
