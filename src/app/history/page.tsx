'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ContentRecord, ContentType } from '@/lib/types';
import ContentCard from '@/components/ContentCard';
import { Sparkles, ArrowLeft, Search, Filter, ChevronDown, Loader2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Select from '@/components/ui/Select';

export default function HistoryPage() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch('/api/contents');
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setContents(data as ContentRecord[]);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const filteredContents = contents.filter(item => {
    const matchesType = filterType === 'ALL' || item.content_type === filterType;
    const rawText = item.raw_text || '';
    const captionFinal = item.caption_final || '';
    const matchesSearch = rawText.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         captionFinal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeLabels: Record<ContentType | 'ALL', string> = {
    ALL: 'All Editions',
    A: 'Tipe A: Testimonial',
    B: 'Tipe B: Educational',
    C: 'Tipe C: Opportunity',
    D: 'Tipe D: Promotional',
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E8E5DF] pb-10">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] hover:text-[#00A896] transition-colors mb-3">
            <ArrowLeft size={12} /> Back to Create
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1C1C1E] leading-tight max-w-2xl">
            Historical <span className="text-[#00A896] italic">Archives</span>.
          </h1>
          <p className="text-[14px] text-[#9B8EA0] max-w-md">
            A complete record of all editorial pieces generated for British Propolis.
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-[#F7F6F2] border border-[#E8E5DF] rounded-full">
           <div className="px-4 py-1.5 bg-white shadow-sm rounded-full text-[11px] font-bold text-[#00A896]">
             {contents.length} Total Records
           </div>
        </div>
      </header>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9B8EA0] group-focus-within:text-[#00A896] transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by keywords or captions..." 
            className="w-full h-14 pl-14 pr-6 bg-white border border-[#E8E5DF] rounded-xl text-[14px] font-sans text-[#1C1C1E] focus:outline-none focus:border-[#00A896] focus:ring-4 focus:ring-[#007A6E]/5 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full lg:w-80">
          <Select 
            options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))}
            value={filterType}
            onChange={(val) => setFilterType(val as any)}
            icon={<Filter size={16} />}
            placeholder="All Editions"
          />
        </div>
      </div>

      {/* Editorial Records Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
          <Loader2 className="w-10 h-10 animate-spin text-[#00A896]" />
          <p className="text-[14px] text-[#9B8EA0] italic font-serif">Curating archive records...</p>
        </div>
      ) : filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div 
                key={content.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="group cursor-pointer"
                onClick={() => router.push(`/history/${content.id}`)}
              >
                <div className="bg-white border border-[#E8E5DF] rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:border-[#00A896]/30 transition-all transform group-hover:-translate-y-1 duration-300 relative">
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      content.status === 'approved' ? 'bg-[#E0F5F2] text-[#00A896]' : 'bg-[#FFF8E7] text-amber-700'
                    }`}>
                      {content.status}
                    </div>
                  </div>
                  <ContentCard content={content} />
                  <div className="px-5 pb-5 pt-0">
                    <div className="flex items-center gap-2 text-[10px] text-[#9B8EA0] font-mono">
                      <Clock size={10} /> {new Date(content.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center bg-[#F7F6F2] border border-dashed border-[#EDEBE5] rounded-2xl space-y-6">
          <Sparkles size={40} className="text-[#9B8EA0]/20 mx-auto" />
          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-[#1C1C1E]">The archive is quiet.</h3>
            <p className="text-[14px] text-[#9B8EA0] italic px-12">
              {searchTerm || filterType !== 'ALL' 
                ? "No editions matched your current filters." 
                : "Your creative history is waiting for its first entry."}
            </p>
          </div>
          <Link href="/input" className="inline-block px-8 py-3 bg-[#00A896] text-white rounded-full text-[12px] font-bold shadow-md hover:bg-[#008A7B]">
            Create First Edition
          </Link>
        </div>
      )}
    </div>
  );
}
