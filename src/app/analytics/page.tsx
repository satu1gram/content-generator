import { BarChart3, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="w-20 h-20 bg-[#F0EEE8] rounded-3xl flex items-center justify-center text-[#00A896] shadow-inner mb-4">
        <BarChart3 size={40} />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-serif text-[#1C1C1E]">
          Advanced <span className="text-[#00A896] italic">Insights</span>
        </h1>
        <p className="text-[14px] text-[#9B8EA0] leading-relaxed">
          We're fine-tuning the metrics engine to provide you with the most sophisticated engagement analysis for British Propolis.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <div className="flex items-center gap-2 px-6 py-2 bg-[#E0F5F2] text-[#00A896] rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
          <Sparkles size={12} fill="currentColor" /> Coming Soon
        </div>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[12px] font-bold text-[#1C1C1E] hover:text-[#00A896] transition-colors border-b border-[#1C1C1E]/10 pb-1"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
