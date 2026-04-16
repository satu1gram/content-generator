import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ContentRecord } from '@/lib/types';

export const revalidate = 0;

async function getScheduledContents() {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('content_dashboard')
    .select('*')
    .not('scheduled_date', 'is', null);

  if (error) {
    console.error('Fetch error:', error);
    return [];
  }
  return data as ContentRecord[];
}

export default async function CalendarPage() {
  const scheduledContents = await getScheduledContents();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 3); // Simple mock dates for April 2026

  // Helper to get events for a specific day
  const getEventsForDay = (day: number) => {
    return scheduledContents.filter(content => {
      if (!content.scheduled_date) return false;
      const date = new Date(content.scheduled_date);
      // For now, only match the day number if it's April 2026
      return date.getDate() === day && date.getMonth() === 3 && date.getFullYear() === 2026;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-black">Content Calendar</h1>
        <p className="text-gray-400 text-sm font-medium">Jadwalkan dan pantau distribusi konten Anda secara visual.</p>
      </header>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">April 2026</h2>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              <button className="px-4 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors">Month</button>
              <button className="px-4 py-1.5 text-[11px] font-bold bg-amber-500 text-black rounded-lg shadow-lg shadow-amber-500/20">Week</button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
              <Clock className="w-5 h-5" />
            </button>
            <button className="px-5 py-2.5 bg-amber-500/10 text-amber-500 rounded-xl text-[12px] font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all">
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 relative z-10">
          {days.map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pb-6">
              {day}
            </div>
          ))}
          {dates.map((date, i) => {
            const dayEvents = date > 0 && date <= 30 ? getEventsForDay(date) : [];
            const isToday = date === 16; // Simulating today for visual focus

            return (
              <div 
                key={i} 
                className={`min-h-[130px] p-3.5 rounded-3xl border transition-all duration-300 group ${
                  date > 0 && date <= 30 
                    ? 'bg-white/[0.02] border-white/5 hover:border-amber-500/30' 
                    : 'bg-transparent border-transparent opacity-20'
                } ${isToday ? 'ring-2 ring-amber-500/50 bg-amber-500/[0.03] border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[13px] font-bold transition-colors ${
                    isToday ? 'text-amber-500' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    {date > 0 && date <= 30 ? date : ''}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {dayEvents.map((content) => (
                    <div 
                      key={content.id}
                      className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl group/event cursor-pointer hover:bg-amber-500/20 transition-all"
                    >
                      <p className="text-[10px] font-bold text-amber-500 leading-tight">
                        {content.caption_final?.substring(0, 20)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/[0.08] to-transparent border border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold tracking-tight">Sinkronisasi Google Calendar?</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Hubungkan jadwal konten Anda ke kalender pribadi agar lebih terorganisir.</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest">
          Connect Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
