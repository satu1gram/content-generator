'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { CanvaTemplateType } from '@/lib/types';

interface CanvaExportButtonProps {
  type: CanvaTemplateType;
  format: string;
  caption: string;
}

const CANVA_TEMPLATES = {
  lifestyle: "https://www.canva.com/design/[template-lifestyle]/view",
  infographic: "https://www.canva.com/design/[template-infographic]/view",
  aspirational: "https://www.canva.com/design/[template-aspirational]/view",
  product: "https://www.canva.com/design/[template-product]/view",
  story_lifestyle: "https://www.canva.com/design/[template-story]/view",
};

const CanvaExportButton = ({ type, format, caption }: CanvaExportButtonProps) => {
  const [copied, setCopied] = useState(false);

  const templateKey = format === 'story' && type === 'lifestyle' ? 'story_lifestyle' : type;
  const templateUrl = CANVA_TEMPLATES[templateKey as keyof typeof CANVA_TEMPLATES] || CANVA_TEMPLATES.lifestyle;

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCanva = () => {
    window.open(templateUrl, '_blank');
  };

  return (
    <div className="w-full space-y-6">
      <button
        onClick={handleOpenCanva}
        className="w-full py-4 bg-[#00A896] hover:bg-[#008A7B] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-3 group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-3">
          Buka di Canva Template
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </span>
      </button>

      <div className="relative pt-6 border-t border-[#E8E5DF]">
        <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] mb-3 block px-1">Caption For Paste</label>
        <div className="relative overflow-hidden group">
          <textarea
            readOnly
            value={caption}
            className="w-full h-40 p-5 bg-[#F7F6F2] border border-[#EDEBE5] rounded-xl text-[13px] font-sans text-[#2D2D2D] focus:outline-none resize-none leading-relaxed shadow-inner"
          />
          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
              copied 
                ? 'bg-[#00A896] text-white' 
                : 'bg-white text-[#9B8EA0] hover:text-[#00A896] border border-[#EDEBE5] shadow-sm'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvaExportButton;
