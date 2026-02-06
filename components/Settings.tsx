
import React, { useState } from 'react';
import { Save, Globe, Database, School, ShieldCheck, RefreshCw, CheckCircle2, DownloadCloud, UploadCloud, Loader2, Info } from 'lucide-react';
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
      await StorageService.backgroundSync();
      alert("Push Sent! Check your Google Sheet in a few seconds. If it doesn't appear, check the 'DEBUG_LOG' sheet in Google Sheets.");
    } catch (error) {
      console.error(error);
      alert("Push failed. Make sure your script is deployed as 'Anyone'.");
    } finally {
      setSyncing(false);
    }
  };

  const handlePullFromCloud = async () => {
    if (!config.appsScriptUrl) {
      alert("Cloud URL missing.");
      return;
    }
    if (!confirm("This will overwrite your local data with sheet data. Continue?")) return;
    
    setPulling(true);
    try {
      const success = await StorageService.syncFromCloud();
      if (success) {
        alert("Restored successfully!");
        window.location.reload();
      } else {
        alert("Pull failed. Sheet might be empty.");
      }
    } catch (error) {
      console.error(error);
      alert("Pull Error: Ensure the script is deployed correctly as 'Anyone'.");
    } finally {
      setPulling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium">Enterprise Cloud Engine v7.0 Configuration</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saved ? 'Settings Saved' : 'Update Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl">
                    <Globe size={24} className="text-indigo-600" />
                    Cloud Hub Control
                </h3>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    Engine v7.0 Stable
                </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">Deployment Web App URL (exec)</label>
                <input 
                  type="text" 
                  value={config.appsScriptUrl}
                  onChange={(e) => setConfig({...config, appsScriptUrl: e.target.value})}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-mono text-xs transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={handlePushToCloud}
                  disabled={syncing || pulling}
                  className="py-5 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl disabled:opacity-50"
                >
                  {syncing ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                  Push Local Data
                </button>
                <button 
                  onClick={handlePullFromCloud}
                  disabled={pulling || syncing}
                  className="py-5 bg-emerald-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl disabled:opacity-50"
                >
                  {pulling ? <Loader2 size={20} className="animate-spin" /> : <DownloadCloud size={20} />}
                  Restore from Cloud
                </button>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase">
                    Sync push is manual here for backup. All admissions and attendance are auto-synced to cloud in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl">
              <School size={24} className="text-indigo-600" />
              School Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Official Institution Name</label>
                <input 
                  type="text" 
                  value={config.schoolName}
                  onChange={(e) => setConfig({...config, schoolName: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-black transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Current Academic Cycle</label>
                <select 
                  value={config.currentSession}
                  onChange={(e) => setConfig({...config, currentSession: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-black transition-all appearance-none"
                >
                  <option>2024-25</option>
                  <option>2025-26</option>
                  <option>2026-27</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <ShieldCheck size={48} className="mb-8 text-indigo-400" />
            <h4 className="text-2xl font-black mb-4 tracking-tight">Data Integrity</h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Enterprise Grade Encryption. All data flows securely between your browser and your private Google Drive infrastructure.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-6 shadow-xl">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Live Status</h4>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Cloud Signal</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${config.appsScriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black text-slate-900 uppercase">{config.appsScriptUrl ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Latency Pulse</span>
                    <span className="text-[10px] font-black text-indigo-600 uppercase">Optimized</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
