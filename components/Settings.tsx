
import React, { useState } from 'react';
import { Save, Globe, Database, School, ShieldCheck, RefreshCw, CheckCircle2, DownloadCloud, UploadCloud, Loader2, Info, Server, HelpCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { SystemConfig } from '../types';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(StorageService.getConfig());
  const [saved, setSaved] = useState(false);
  const [pulling, setPulling] = useState(false);

  const handleSave = () => {
    StorageService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePullFromCloud = async () => {
    if (!config.appsScriptUrl) {
      alert("Please enter the Apps Script URL first.");
      return;
    }
    setPulling(true);
    const success = await StorageService.syncFromCloud();
    setPulling(false);
    if (success) {
      alert("✅ Data successfully pulled from Google Sheets!");
      window.location.reload();
    } else {
      alert("❌ Pull failed. Check your URL and ensure script is deployed as 'Anyone'.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Backend Infrastructure</h2>
          <p className="text-slate-500 font-medium">Configure your cloud database and institution profile.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saved ? 'Config Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Cloud Database Section */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl">
                    <Server size={24} className="text-indigo-600" />
                    Cloud Connector (Google Sheets)
                </h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">Apps Script Web App URL</label>
                <input 
                  type="text" 
                  value={config.appsScriptUrl}
                  onChange={(e) => setConfig({...config, appsScriptUrl: e.target.value})}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-mono text-xs transition-all shadow-sm"
                />
              </div>

              <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 space-y-4">
                 <div className="flex items-center gap-2 text-indigo-700">
                    <HelpCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">How to fix sync issues?</span>
                 </div>
                 <ol className="text-[10px] font-bold text-indigo-600/80 uppercase space-y-2 list-decimal ml-4">
                    <li>Copy code from 'Cloud Tool' tab.</li>
                    <li>Paste in Google Apps Script and Deploy as 'Web App'.</li>
                    <li>Set 'Who has access' to 'Anyone'.</li>
                    <li>Paste the URL above and click 'Pull Cloud Data'.</li>
                 </ol>
                 <button 
                    onClick={handlePullFromCloud}
                    disabled={pulling}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl disabled:opacity-50"
                  >
                    {pulling ? <Loader2 size={20} className="animate-spin" /> : <DownloadCloud size={20} />}
                    Pull Cloud Data (Fetch All)
                  </button>
              </div>
            </div>
          </div>

          {/* School Profile Section */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl">
              <School size={24} className="text-indigo-600" />
              Institution Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">School Name</label>
                <input 
                  type="text" 
                  value={config.schoolName}
                  onChange={(e) => setConfig({...config, schoolName: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-black"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Current Session</label>
                <select 
                  value={config.currentSession}
                  onChange={(e) => setConfig({...config, currentSession: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-black appearance-none"
                >
                  <option>2025-26</option>
                  <option>2026-27</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Globe size={100} /></div>
            <h4 className="text-xl font-black mb-4">Why is my data not showing?</h4>
            <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
              Google Sheets is free but sometimes has 'CORS' delays. 
              Always use the 'Pull Cloud Data' button if you've updated the spreadsheet manually.
            </p>
          </div>

          <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={32} />
                <h4 className="text-lg font-black uppercase tracking-tighter leading-none">Enterprise Upgrade</h4>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6">Want a faster backend?</p>
             <p className="text-sm font-medium leading-relaxed mb-8">
                Upgrade to a Supabase or Firebase backend for instant 0.1s sync speed. Contact support for migration.
             </p>
             <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <p className="text-[9px] font-black uppercase">Status: Using Sheet Engine</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
