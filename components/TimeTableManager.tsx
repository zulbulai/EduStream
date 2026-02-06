
import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save, Users, BookOpen, AlertCircle, CalendarRange } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Staff, TimeSlot } from '../types';

const CLASSES = ["Nursery", "KG-1", "KG-2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimeTableManager: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('1st');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  // Modal/Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    periodNumber: 1,
    subject: '',
    teacherId: '',
    startTime: '08:00',
    endTime: '08:45'
  });

  useEffect(() => {
    setSchedule(StorageService.getSchedule());
    setStaff(StorageService.getStaff());
  }, []);

  const classDaySlots = schedule.filter(s => s.classId === selectedClass && s.day === selectedDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  const handleAddSlot = () => {
    const slot: TimeSlot = {
      ...newSlot as TimeSlot,
      id: `SLOT-${Date.now()}`,
      classId: selectedClass,
      day: selectedDay,
    };
    const updated = [...schedule, slot];
    setSchedule(updated);
    StorageService.saveSchedule(updated);
    setIsModalOpen(false);
  };

  const removeSlot = (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    setSchedule(updated);
    StorageService.saveSchedule(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Scheduler</h2>
          <p className="text-slate-500 font-medium">Manage periods, subjects, and teacher rotations for each class.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} /> Assign New Period
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
             <Users size={24} />
           </div>
           <div className="flex-1">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Class</p>
             <select 
               value={selectedClass} 
               onChange={(e) => setSelectedClass(e.target.value)}
               className="w-full text-lg font-black text-slate-900 outline-none bg-transparent"
             >
               {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 md:col-span-2">
           <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
             <CalendarRange size={24} />
           </div>
           <div className="flex-1">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Weekday</p>
             <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button 
                    key={day}
                    onClick={() => setSelectedDay(day as any)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-all ${
                      selectedDay === day ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
           <h3 className="font-black text-slate-900 flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              Daily Sequence: {selectedDay}
           </h3>
        </div>

        {classDaySlots.length > 0 ? (
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classDaySlots.map((slot) => {
              const teacher = staff.find(t => t.id === slot.teacherId);
              return (
                <div key={slot.id} className="relative bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 group hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-sm">
                   <button 
                    onClick={() => removeSlot(slot.id)}
                    className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50"
                   >
                     <Trash2 size={14} />
                   </button>
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm">
                        {slot.periodNumber}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Period</p>
                   </div>
                   <h4 className="text-xl font-black mb-1">{slot.subject}</h4>
                   <div className="flex items-center gap-2 text-[10px] font-bold opacity-70 mb-6">
                      <Clock size={12} /> {slot.startTime} - {slot.endTime}
                   </div>
                   <div className="flex items-center gap-3 pt-4 border-t border-slate-200 group-hover:border-indigo-400/50">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-[10px] group-hover:bg-indigo-400 group-hover:text-white">
                        {teacher?.name[0] || '?'}
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-tighter opacity-50">Faculty</p>
                        <p className="text-[11px] font-black">{teacher?.name || 'Not Assigned'}</p>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 space-y-6 text-slate-300">
             <CalendarRange size={80} strokeWidth={1} />
             <div className="text-center">
               <p className="text-lg font-black text-slate-800">No periods scheduled for this day</p>
               <p className="text-sm font-medium mt-1">Assign subject teachers to create the academic calendar.</p>
             </div>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Period Assignment</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500">
                 <Trash2 size={24} />
               </button>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Period Number</label>
                    <input 
                      type="number" 
                      value={newSlot.periodNumber}
                      onChange={(e) => setNewSlot({...newSlot, periodNumber: parseInt(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Subject Name</label>
                    <input 
                      type="text" 
                      value={newSlot.subject}
                      onChange={(e) => setNewSlot({...newSlot, subject: e.target.value})}
                      placeholder="e.g. Mathematics"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Faculty Teacher</label>
                    <select 
                      value={newSlot.teacherId}
                      onChange={(e) => setNewSlot({...newSlot, teacherId: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold"
                    >
                      <option value="">Select Teacher</option>
                      {staff.filter(s => s.role === 'Teacher' || s.role === 'Admin').map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Time Interval</label>
                    <div className="flex items-center gap-2">
                      <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                      <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddSlot}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Confirm Assignment
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableManager;
