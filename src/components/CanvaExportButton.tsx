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
    <div className="w-full space-y-4">
      <button
        onClick={handleOpenCanva}
        className="w-full py-4 bg-[#00C4CC] hover:bg-[#00B4BB] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group"
      >
        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
          <span className="text-[#00C4CC] font-black text-xs">C</span>
        </div>
        Buka di Canva Template
        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </button>

      <div className="relative group/copy">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Caption for Paste</label>
        <div className="relative">
          <textarea
            readOnly
            value={caption}
            className="w-full h-24 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-gray-400 focus:outline-none resize-none pr-10"
          />
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
              copied ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
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
