'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Calendar, CheckSquare, BarChart3, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Input', href: '/input', icon: PlusCircle },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Review', href: '/review', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[56px] bg-surface border-r border-[var(--bp-border)] hidden md:flex flex-col items-center py-4 z-50">
        {/* App Logo */}
        <div className="w-8 h-8 bg-[var(--bp-text-primary)] rounded-[10px] flex items-center justify-center mb-8 shrink-0 shadow-sm">
          <Sparkles size={18} className="text-white" fill="currentColor" />
        </div>

        {/* Nav Icons */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-[var(--bp-radius-sm)]
                  transition-all duration-150
                  ${isActive 
                    ? 'bg-[var(--bp-bg-hover)] text-[var(--bp-accent)] shadow-[0_2px_8px_rgba(124,111,247,0.15)]' 
                    : 'text-[var(--bp-text-primary)] opacity-40 hover:opacity-100 hover:bg-[var(--bp-bg-inner)]'
                  }
                `.trim()}
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-[var(--bp-accent-light)] border border-[var(--bp-border-strong)] flex items-center justify-center text-[10px] font-bold text-[var(--bp-accent)] shrink-0">
          BP
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-surface/80 backdrop-blur-xl border-t border-[var(--bp-border)] flex md:hidden items-center justify-around px-4 z-50 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all
                ${isActive 
                  ? 'text-[var(--bp-accent)]' 
                  : 'text-[var(--bp-text-muted)]'
                }
              `.trim()}
            >
              <div className={`
                p-1 rounded-lg transition-all
                ${isActive ? 'bg-[var(--bp-accent)]/10 scale-110' : ''}
              `}>
                <Icon size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
