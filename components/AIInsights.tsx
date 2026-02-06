
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Brain, Sparkles, Send, Loader2, BarChart2, MessageSquare, Download } from 'lucide-react';

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const generateInsight = async (type: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = type === 'custom' ? query : `Provide a high-level ${type} analysis for a typical school environment. Use student data archetypes. Focus on ${type}. Format in clean markdown.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "You are a senior education consultant. Analyze school data (attendance, fees, grades) and provide actionable leadership insights. Be professional, concise, and strategic."
        }
      });
      
      setInsight(response.text || 'No response generated.');
    } catch (error) {
      console.error(error);
      setInsight("Error generating AI insights. Please check API configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Brain size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 rounded-full border border-indigo-400/50 mb-6">
            <Sparkles size={14} className="text-indigo-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Powered by Gemini 3</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Educational Intelligence Hub</h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Leverage advanced AI to identify patterns in student performance, optimize fee collection, and predict attendance drops before they happen.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => generateInsight('attendance trends')}
              className="px-6 py-3 bg-white text-indigo-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg"
            >
              <BarChart2 size={18} /> Analyze Attendance
            </button>
            <button 
              onClick={() => generateInsight('fee collection strategy')}
              className="px-6 py-3 bg-indigo-600 border border-indigo-400 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all"
            >
              <MessageSquare size={18} /> Optimization Strategy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-600" />
                Generated Analysis
              </h3>
              {insight && (
                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <Download size={20} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Loader2 size={48} className="animate-spin text-indigo-600" />
                <p className="font-medium animate-pulse text-indigo-600/60">Gemini is processing school data metrics...</p>
              </div>
            ) : insight ? (
              <div className="prose prose-indigo max-w-none text-slate-600 whitespace-pre-wrap">
                {insight}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50">
                <Brain size={64} strokeWidth={1} />
                <p className="font-medium">Select an analysis module to begin</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Ask Custom Analytics</h4>
            <div className="relative">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Why is Grade 8 attendance lower on Fridays?"
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
              />
              <button 
                onClick={() => generateInsight('custom')}
                disabled={!query || loading}
                className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg">
            <h4 className="font-bold mb-2">Automation Status</h4>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs font-bold py-2 border-b border-emerald-500/50">
                <span>Fee Reminders</span>
                <span className="bg-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold py-2 border-b border-emerald-500/50">
                <span>Attendance Alerts</span>
                <span className="bg-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold py-2">
                <span>Birthday Wisher</span>
                <span className="bg-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
