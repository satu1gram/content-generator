'use client';

import React from 'react';

interface StoryFlowLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const StoryFlowLogo = ({ className = '', size = 32, showText = false }: StoryFlowLogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/brand-logo.png" 
        alt="StoryFlow" 
        style={{ width: size, height: size }}
        className="object-contain"
      />
      
      {showText && (
        <span className="font-serif text-xl font-bold text-[#1C1C1E] tracking-tight">
          Story<span className="text-[#00A896]">Flow</span>
        </span>
      )}
    </div>
  );
};

export default StoryFlowLogo;
