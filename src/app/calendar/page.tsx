import { Calendar as CalendarIcon, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const getEventsForDay = (day: number) => {
    return scheduledContents.filter(content => {
      if (!content.scheduled_date) return false;
      const date = new Date(content.scheduled_date);
      return date.getDate() === day && date.getMonth() === 3 && date.getFullYear() === 2026;
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E5DF] pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00A896] uppercase tracking-[0.2em]">
             Dashboard <span className="text-[#EDEBE5]">/</span> Planning
          </div>
          <h1 className="text-4xl font-serif text-[#1C1C1E]">
            Editorial <span className="text-[#00A896] italic">Calendar</span>
          </h1>
          <p className="text-[14px] text-[#9B8EA0]">
            Strategize and visualize your British Propolis content distribution.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-[#F7F6F2] border border-[#E8E5DF] rounded-full p-1 shadow-sm">
             <button className="px-5 py-1.5 text-[11px] font-bold text-[#1C1C1E] bg-white rounded-full shadow-sm">Month</button>
             <button className="px-5 py-1.5 text-[11px] font-bold text-[#9B8EA0] hover:text-[#1C1C1E] transition-colors">Week</button>
           </div>
           <button className="px-6 py-2.5 rounded-full bg-[#00A896] text-white text-[12px] font-bold hover:bg-[#008A7B] transition-all flex items-center gap-2">
             New Schedule <Clock size={14} />
           </button>
        </div>
      </header>

      {/* Main Calendar Body */}
      <div className="bg-white border border-[#E8E5DF] rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif text-[#1C1C1E]">April 2026</h2>
            <div className="flex items-center gap-1 ml-4 border border-[#EDEBE5] rounded-lg p-1">
              <button className="p-1 hover:bg-[#F7F6F2] rounded text-[#9B8EA0]"><ChevronLeft size={16} /></button>
              <button className="p-1 hover:bg-[#F7F6F2] rounded text-[#9B8EA0]"><ChevronRight size={16} /></button>
            </div>
          </div>
          <button className="text-[11px] font-bold text-[#00A896] uppercase tracking-[0.2em] border-b border-[#00A896]/20">Go to Today</button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[#E8E5DF] border border-[#E8E5DF] rounded-xl overflow-hidden shadow-inner">
          {days.map(day => (
            <div key={day} className="bg-[#F7F6F2] py-4 text-center text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
          {dates.map((date, i) => {
            const dayEvents = date > 0 && date <= 30 ? getEventsForDay(date) : [];
            const isToday = date === 16;

            return (
              <div 
                key={i} 
                className={`min-h-[140px] p-4 bg-white transition-all duration-300 group relative ${
                  date > 0 && date <= 30 ? '' : 'bg-[#FDFDFC] opacity-30 select-none'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[14px] font-sans font-bold ${
                    isToday ? 'text-[#00A896]' : 'text-[#3D3D3D]'
                  }`}>
                    {date > 0 && date <= 30 ? date : ''}
                  </span>
                  {isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#00A896] shadow-[0_0_8px_rgba(0,168,150,0.5)]" />}
                </div>
                
                <div className="space-y-2">
                  {dayEvents.map((content) => (
                    <div 
                      key={content.id}
                      className="p-3 bg-[#F7F6F2] border-l-2 border-[#00A896] rounded-md group/event cursor-pointer hover:bg-[#E0F5F2] transition-all"
                    >
                      <p className="text-[10px] font-bold text-[#1C1C1E] leading-tight line-clamp-2">
                        {content.caption_v1?.substring(0, 40)}...
                      </p>
                    </div>
                  ))}
                  {date > 0 && date <= 30 && (
                    <button className="absolute bottom-3 right-3 text-[18px] text-[#EDEBE5] hover:text-[#00A896] transition-colors opacity-0 group-hover:opacity-100 font-light">+</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Magazine-style CTA */}
      <div className="p-10 rounded-2xl bg-[#F0EEE8] border border-[#E8E5DF] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/40 rounded-full translate-y-24 translate-x-24" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-16 h-16 bg-white border border-[#E8E5DF] rounded-2xl flex items-center justify-center text-[#00A896] shadow-sm">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif text-[#1C1C1E]">Master Your Editorial Flow</h3>
            <p className="text-[13px] text-[#9B8EA0] max-w-sm">Synchronize your content calendar with Google Calendar for seamless management.</p>
          </div>
        </div>
        <button className="relative z-10 flex items-center gap-3 px-8 py-3.5 bg-[#00A896] text-white rounded-full text-[12px] font-bold hover:bg-[#008A7B] transition-all shadow-md group">
          Sync Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
