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
    <>
      {/* Decorative Blob */}
      <div 
        className="absolute -top-3 -right-3 w-12 h-10 rounded-full opacity-20 transition-transform group-hover:scale-125"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div 
          className="w-[26px] h-[26px] rounded-[var(--bp-radius-sm)] flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          {React.cloneElement(icon as React.ReactElement, { size: 14 })}
        </div>
        
        <div>
          <p className="text-[10px] text-[var(--bp-text-muted)] font-medium uppercase tracking-wider mb-0.5">
            {title}
          </p>
          <p className="text-[12px] font-semibold text-[var(--bp-text-primary)]">
            {name}
          </p>
        </div>
      </div>
    </>
  );

  const classes = `
    relative overflow-hidden
    bg-inner border-thin 
    rounded-[var(--bp-radius-md)] 
    p-3 cursor-pointer
    transition-all duration-150
    hover:bg-[var(--bp-bg-hover)] hover:border-[rgba(124,111,247,0.2)]
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
