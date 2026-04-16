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
    draft: 'bg-gray-500/10 text-[var(--bp-text-secondary)] border-[var(--bp-border)]',
    approved: 'bg-[var(--bp-amber-bg)] text-[var(--bp-amber)] border-[var(--bp-amber)]/20',
    posted: 'bg-[var(--bp-green-bg)] text-[var(--bp-green)] border-[var(--bp-green)]/20',
  };

  const typeLabels = {
    A: 'Testimoni',
    B: 'Edukasi',
    C: 'Peluang Bisnis',
    D: 'Promo',
  };

  return (
    <Card 
      onClick={onClick}
      className={`
        group relative cursor-pointer
        hover:border-[var(--bp-accent)]/30 hover:shadow-md 
        transition-all duration-300
      `.trim()}
      padding="p-0 overflow-hidden"
    >
      <div className="flex">
        {/* Media Preview (Left) */}
        <div className="w-24 shrink-0 bg-inner border-r border-thin flex items-center justify-center overflow-hidden">
          {content.image_url ? (
            <img src={content.image_url} alt="Content" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
          ) : (
            <ImageIcon className="w-6 h-6 text-[var(--bp-text-placeholder)]" />
          )}
        </div>

        {/* Content Info (Right) */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[content.status]}`}>
                {content.status}
              </span>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-[var(--bp-radius-xs)] bg-inner text-[var(--bp-text-secondary)] border-thin">
                Tipe {content.content_type}
              </span>
            </div>
          </div>

          <h3 className="text-[13px] font-semibold text-[var(--bp-text-primary)] line-clamp-1 leading-snug">
            {content.caption_final ? content.caption_final.split('\n')[0] : content.raw_text.split('\n')[0]}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-[var(--bp-text-muted)] font-medium">
                <Clock size={12} className="text-[var(--bp-accent)]" />
                {content.waktu_posting || 'N/A'}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[var(--bp-text-muted)] font-medium">
                <Tag size={12} className="text-[var(--bp-accent)]" />
                {content.post_format || 'feed'}
              </div>
            </div>
            
            <div className="text-[var(--bp-accent)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ExternalLink size={14} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentCard;
