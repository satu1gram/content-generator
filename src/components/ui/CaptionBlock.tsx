'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CaptionBlockProps {
  label: string;
  content: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'amber' | 'purple' | 'red' | 'editorial' | 'draft';
  className?: string;
  isItalic?: boolean;
}

const CaptionBlock = ({ label, content, variant = 'primary', className = '', isItalic = false }: CaptionBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variantStyles = {
    primary: 'bg-surface border-[#EDEBE5] text-[#1C1C1E] shadow-sm',
    secondary: 'bg-[#F7F6F2] border-[#EDEBE5] text-[#3D3D3D]',
    accent: 'bg-[#E0F5F2] border-transparent text-[#007A6E]',
    amber: 'bg-[#FFF8E7] border-l-4 border-amber-400 text-[#5C5C5C]',
    purple: 'bg-[#F0EEE8] border-l-4 border-[#00A896] text-[#2D2D2D]',
    red: 'bg-[#FEF2F2] border-rose-100 text-[#2D2D2D]',
    editorial: 'bg-surface border-[#E8E5DF] text-[#2D2D2D] shadow-md',
    draft: 'bg-[#F4F1EB] border-[#EDEBE5] text-[#1C1C1E] font-mono',
  };

  const labelColor = '#9B8EA0';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9B8EA0]">
          {label}
        </label>
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 text-[10px] font-bold transition-all px-4 py-1.5 rounded-full border ${
            copied 
              ? 'bg-[#00A896] text-white border-[#00A896]' 
              : 'bg-white text-[#00A896] border-[#00A896] hover:bg-[#00A896] hover:text-white'
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Berhasil' : 'Salin'}
        </button>
      </div>
      <div className={`rounded-lg border p-6 md:p-7 transition-all ${variantStyles[variant]}`}>
        <p className={`text-[16px] leading-[1.7] whitespace-pre-wrap ${isItalic ? 'italic' : ''} ${variant === 'draft' ? 'font-mono' : 'font-sans'}`}>
          {content || 'Memuat konten editorial...'}
        </p>
      </div>
    </div>
  );
};

export default CaptionBlock;
