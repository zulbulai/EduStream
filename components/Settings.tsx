
import React, { useState } from 'react';
import { Save, Globe, Database, School, ShieldCheck, RefreshCw, CheckCircle2, DownloadCloud, UploadCloud, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { SystemConfig } from '../types';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(StorageService.getConfig());
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);

  const handleSave = () => {
    StorageService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePushToCloud = async () => {
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

      await fetch(config.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(data)
      });
      
      alert("Sync Push Successful! Data sent to Google Sheets.");
    } catch (error) {
      console.error(error);
      alert("Push failed. Check URL or internet.");
    } finally {
      setSyncing(false);
    }
  };

  const handlePullFromCloud = async () => {
    if (!config.appsScriptUrl) {
      alert("Cloud URL missing.");
      return;
    }
    if (!confirm("This will overwrite your local data with the data from Google Sheets. Continue?")) return;
    
    setPulling(true);
    try {
      const success = await StorageService.syncFromCloud();
      if (success) {
        alert("Success! All data restored from Google Sheets.");
        window.location.reload(); // Reload to reflect changes
      } else {
        alert("Failed to pull data. Sheet might be empty or URL is wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Pull Error: Make sure your script has the 'doGet' function and is deployed as 'Anyone'.");
    } finally {
      setPulling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium">Cloud sync engine and enterprise configuration.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saved ? 'Saved' : 'Save Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Globe size={20} className="text-indigo-600" />
              Enterprise Cloud Hub (v6.0)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Google Web App URL (exec)</label>
                <input 
                  type="text" 
                  value={config.appsScriptUrl}
                  onChange={(e) => setConfig({...config, appsScriptUrl: e.target.value})}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-mono text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={handlePushToCloud}
                  disabled={syncing || pulling}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {syncing ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={20} />}
                  Push to Cloud
                </button>
                <button 
                  onClick={handlePullFromCloud}
                  disabled={pulling || syncing}
                  className="py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {pulling ? <Loader2 size={18} className="animate-spin" /> : <DownloadCloud size={20} />}
                  Pull from Cloud
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight text-center">
                Use 'Pull' to restore data after clearing browser history or changing devices.
              </p>
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
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl">
            <ShieldCheck size={40} className="mb-6 opacity-50" />
            <h4 className="text-xl font-black mb-4 tracking-tight">Enterprise Security</h4>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">
              Data is synced over HTTPS. Only authorized Google accounts with your URL can access the sheet database.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-4">
            <h4 className="font-bold text-slate-800">Connection Engine</h4>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${config.appsScriptUrl ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                {config.appsScriptUrl ? 'Cloud Active' : 'Local Only'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase">
              Last Pulse: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
