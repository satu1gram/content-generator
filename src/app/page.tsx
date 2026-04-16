import { Sparkles, TrendingUp, Users, Clock, ArrowRight, Zap, Target, MessageCircle, Calendar } from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import { supabase } from '@/lib/supabase';
import { ContentRecord } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import QuickActionCard from '@/components/ui/QuickActionCard';

export const revalidate = 0; // Disable caching for dashboard

async function getRecentContents() {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('content_dashboard')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Fetch error:', error);
    return [];
  }
  return data as ContentRecord[];
}

async function getTotalCount() {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from('contents')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Count error:', error);
    return 0;
  }
  return count || 0;
}

export default async function Dashboard() {
  const [recentContents, totalCount] = await Promise.all([
    getRecentContents(),
    getTotalCount()
  ]);

  const stats = [
    { name: 'Total Konten', value: totalCount.toString(), icon: Zap, color: 'var(--bp-accent)' },
    { name: 'Engagement', value: '0%', icon: TrendingUp, color: 'var(--bp-green)' },
    { name: 'New Leads', value: '0', icon: Target, color: 'var(--bp-blue)' },
    { name: 'Avg. frequency', value: '0/day', icon: MessageCircle, color: 'var(--bp-amber)' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-[12px] md:text-[13px] text-[var(--bp-text-secondary)]">
            Halo! Ini adalah performa konten British Propolis Anda hari ini.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!supabase && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[var(--bp-amber-bg)] border-[0.5px] border-[var(--bp-amber)]/20 rounded-[var(--bp-radius-sm)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--bp-amber)] animate-pulse" />
              <span className="text-[10px] font-semibold text-[var(--bp-amber)] uppercase tracking-wider">Setup Required</span>
            </div>
          )}
          <Button variant="secondary" size="sm" className="flex-1 md:flex-none">Download Report</Button>
          <Button size="sm" className="flex-1 md:flex-none">Kirim ke Telegram</Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="group hover:border-[var(--bp-accent)]/20 transition-all duration-300" padding="p-3 md:p-5">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <div 
                className="w-6 h-6 md:w-7 md:h-7 rounded-[var(--bp-radius-sm)] flex items-center justify-center opacity-80"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={14} className="md:w-4 md:h-4" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-[var(--bp-text-muted)] uppercase tracking-widest truncate">{stat.name}</span>
            </div>
            <div className="text-lg md:text-xl font-semibold tabular-nums tracking-tight">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Recent Generations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[13px] md:text-[14px] font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--bp-accent)]" /> Last Generations
            </h2>
            <button className="text-[10px] md:text-[11px] font-medium text-[var(--bp-accent)] hover:underline flex items-center gap-1">
              View history <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentContents.length > 0 ? (
              recentContents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))
            ) : (
              <div className="col-span-full py-12 md:py-16 text-center border-thin border-dashed rounded-[var(--bp-radius-lg)] bg-inner">
                <Sparkles size={24} className="text-[var(--bp-text-placeholder)] mx-auto mb-3" />
                <p className="text-[12px] md:text-[13px] text-[var(--bp-text-muted)] italic px-4">Belum ada konten yang dihasilkan.</p>
                <div className="mt-6">
                  <Button size="sm" href="/input">Generate New Post</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[12px] md:text-[13px] font-semibold px-1">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <QuickActionCard 
                icon={<MessageCircle />} 
                title="Automation" 
                name="Generate from Telegram" 
                accentColor="var(--bp-accent)"
                href="/input"
              />
              <QuickActionCard 
                icon={<Calendar />} 
                title="Scheduling" 
                name="Open Content Calendar" 
                accentColor="var(--bp-blue)"
                href="/calendar"
              />
              <QuickActionCard 
                icon={<Users />} 
                title="Management" 
                name="Agent Performance" 
                accentColor="var(--bp-teal)"
                href="/analytics"
              />
            </div>
          </section>

          {/* AI Tips Card */}
          <Card className="bg-[var(--bp-accent)] text-white border-none overflow-hidden relative" padding="p-5 md:p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-[12px] md:text-[13px] font-bold flex items-center gap-2">
                <Sparkles size={14} /> Power Tip
              </h3>
              <p className="text-[11px] md:text-[12px] leading-relaxed text-white/80">
                Gunakan format "Tanya Jawab" untuk konten Tipe B agar engagement rate naik hingga 25% lebih tinggi.
              </p>
              <button className="text-[10px] md:text-[11px] font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white/100 transition-all">
                Learn how it works
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
