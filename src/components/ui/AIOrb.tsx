import React from 'react';

const AIOrb = () => {
  return (
    <div className="relative mx-auto mb-4 w-[52px] h-[52px]">
      <div className={`
        w-full h-full rounded-full 
        bg-gradient-to-br from-[#a78bfa] via-[#818cf8] to-[#60a5fa]
        ai-orb-anim shadow-[0_0_20px_rgba(129,140,248,0.3)]
      `.trim()} />
      <div className="absolute inset-0 bg-white/10 rounded-full blur-sm" />
    </div>
  );
};

export default AIOrb;
