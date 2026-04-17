import React from 'react';
import Link from 'next/link';

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  name: string;
  accentColor: string;
  href?: string;
  onClick?: () => void;
}

const QuickActionCard = ({ icon, title, name, accentColor, href, onClick }: QuickActionCardProps) => {
  const content = (
    <div className="relative z-10 flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
        style={{ backgroundColor: accentColor }}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      
      <div>
        <p className="text-[10px] text-[#9B8EA0] font-bold uppercase tracking-[0.2em] mb-1">
          {title}
        </p>
        <p className="text-[14px] font-serif font-bold text-[#1C1C1E]">
          {name}
        </p>
      </div>
    </div>
  );

  const classes = `
    group relative overflow-hidden
    bg-white border border-[#E8E5DF] 
    rounded-2xl 
    p-5 cursor-pointer
    transition-all duration-300
    hover:shadow-lg hover:border-[#007A6E]/10
    active:scale-[0.98]
    block
  `.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={classes}>
      {content}
    </div>
  );
};

export default QuickActionCard;
