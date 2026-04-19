'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, CheckSquare, Sparkles } from 'lucide-react';
import StoryFlowLogo from './ui/StoryFlowLogo';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Create', href: '/', icon: PlusCircle },
    { name: 'History', href: '/history', icon: CheckSquare },
  ];

  return (
    <>
      {/* Editorial Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[56px] bg-white border-r border-[#E8E5DF] hidden md:flex flex-col items-center py-6 z-50">
        <Link href="/" className="mb-10 shrink-0 hover:scale-110 transition-transform">
          <StoryFlowLogo size={32} />
        </Link>

        <nav className="flex flex-col gap-4 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[#F7F6F2] text-[#00A896] shadow-sm' 
                    : 'text-[#9B8EA0] hover:text-[#1C1C1E] hover:bg-[#F7F6F2]'
                  }
                `.trim()}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="w-8 h-8 rounded-full bg-[#E0F5F2] border border-[#EDEBE5] flex items-center justify-center text-[10px] font-black text-[#00A896] shrink-0">
          SF
        </div>
      </aside>

      {/* Editorial Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-white/95 backdrop-blur-xl border-t border-[#E8E5DF] flex md:hidden items-center justify-around px-4 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 transition-all
                ${isActive 
                  ? 'text-[#00A896]' 
                  : 'text-[#9B8EA0]'
                }
              `.trim()}
            >
              <div className={`
                p-1.5 rounded-lg transition-all
                ${isActive ? 'bg-[#E0F5F2] scale-110' : ''}
              `}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
