'use client';

import { ContentRecord } from '@/lib/types';
import { Clock, Tag, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

interface ContentCardProps {
  content: ContentRecord;
  onClick?: () => void;
}

const ContentCard = ({ content, onClick }: ContentCardProps) => {
  const statusColors = {
    draft: 'bg-[#F7F6F2] text-[#9B8EA0] border-[#E8E5DF]',
    approved: 'bg-[#E0F5F2] text-[#00A896] border-[#00A896]/20',
    posted: 'bg-[#1C1C1E] text-white border-transparent',
  };

  const typeLabels = {
    A: 'Testimonial',
    B: 'Educational',
    C: 'Opportunity',
    D: 'Promotional',
  };

  return (
    <Card 
      onClick={onClick}
      className={`
        group relative cursor-pointer
        bg-white border border-[#E8E5DF] rounded-2xl
        hover:shadow-xl hover:border-[#00A896]/10
        transition-all duration-300 transform hover:-translate-y-1
      `.trim()}
      padding="p-0 overflow-hidden"
    >
      <div className="flex flex-col">
        {/* Media Preview (Top) */}
        <div className="aspect-[16/9] w-full bg-[#F7F6F2] border-b border-[#E8E5DF] flex items-center justify-center overflow-hidden relative">
          {content.image_url ? (
            <img src={content.image_url} alt="Content" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-20">
              <ImageIcon className="w-8 h-8 text-[#9B8EA0]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8EA0]">No Visual</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full border shadow-sm ${statusColors[content.status as keyof typeof statusColors]}`}>
              {content.status}
            </span>
          </div>
        </div>

        {/* Content Info (Bottom) */}
        <div className="p-4 space-y-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[9px] font-bold text-[#00A896] uppercase tracking-[0.2em]">
              {typeLabels[content.content_type as keyof typeof typeLabels] || content.content_type}
            </div>
            <h3 className="text-[13px] font-serif font-bold text-[#1C1C1E] line-clamp-2 leading-snug">
              {content.caption_final ? content.caption_final.split('\n')[0] : content.raw_text.split('\n')[0]}
            </h3>
          </div>

          <div className="pt-2 border-t border-[#F7F6F2] flex items-center justify-between text-[10px] text-[#9B8EA0] font-sans">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock size={10} className="text-[#00A896]" />
                {content.waktu_posting || 'No Schedule'}
              </div>
              <div className="hidden sm:block text-[9px] opacity-50">
                {new Date(content.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="w-7 h-7 rounded-full border border-[#EDEBE5] flex items-center justify-center text-[#1C1C1E] group-hover:bg-[#00A896] group-hover:text-white group-hover:border-transparent transition-all">
              <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentCard;
