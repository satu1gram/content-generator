export const runtime = 'edge';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Zap, 
  Target, 
  MessageCircle, 
  Calendar,
  PlusCircle, 
  BarChart3 
} from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import { supabase } from '@/lib/supabase';
import { ContentRecord } from '@/lib/types';
import QuickActionCard from '@/components/ui/QuickActionCard';

export const revalidate = 0; // Disable caching for dashboard

async function getRecentContents() {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('captions')
    .select(`
      *,
      contents (
        raw_text,
        content_type,
        source
      )
    `)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Fetch error:', error);
    return [];
  }

  return data.map((item: any) => ({
    ...item,
    raw_text: item.contents?.raw_text,
    content_type: item.contents?.content_type,
    source: item.contents?.source
  })) as ContentRecord[];
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
    { name: 'Total Production', value: totalCount.toString(), icon: Zap, color: '#00A896' },
    { name: 'Engagement Rate', value: '0%', icon: TrendingUp, color: '#3B82F6' },
    { name: 'Conversion Rate', value: '0.0%', icon: Target, color: '#F59E0B' },
    { name: 'Avg. Frequency', value: '0/day', icon: MessageCircle, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Editorial Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E8E5DF] pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00A896] uppercase tracking-[0.2em]">
             Dashboard <span className="text-[#EDEBE5]">/</span> Overview
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1C1C1E] leading-tight max-w-2xl">
            Good Afternoon, <span className="text-[#00A896] italic">Creator</span>.
          </h1>
          <p className="text-[14px] text-[#9B8EA0] font-sans max-w-md">
            Your British Propolis content performance is steady. Ready to produce some new insights today?
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-full border border-[#EDEBE5] bg-white text-[12px] font-bold text-[#1C1C1E] hover:bg-[#F7F6F2] transition-all shadow-sm">
            Download Report
          </button>
          <button className="px-6 py-2.5 rounded-full bg-[#00A896] text-white text-[12px] font-bold hover:bg-[#008A7B] shadow-md hover:shadow-lg transition-all">
            Kirim ke Telegram
          </button>
        </div>
      </header>

      {/* Stats Grid - Editorial Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.1em]">{stat.name}</span>
            </div>
            <div className="text-2xl font-serif text-[#1C1C1E]">{stat.value}</div>
            <div className="mt-2 text-[11px] text-[#00A896] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              +0% from last week
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Content (Main Area) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[#EDEBE5] pb-4">
            <h2 className="text-xl font-serif text-[#1C1C1E] flex items-center gap-3">
              <Clock size={18} className="text-[#00A896]" /> Recent Publications
            </h2>
            <Link href="/history" className="text-[11px] font-bold text-[#00A896] hover:text-[#008A7B] flex items-center gap-2 uppercase tracking-widest">
              View History <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentContents.length > 0 ? (
              recentContents.map((content) => (
                <Link key={content.id} href={`/history/${content.id}`} className="group">
                  <div className="bg-white border border-[#E8E5DF] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-[#00A896]/20 transition-all">
                    <ContentCard content={content} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-[#F7F6F2] border border-dashed border-[#EDEBE5] rounded-xl space-y-4">
                <Sparkles size={32} className="text-[#9B8EA0]/30 mx-auto" />
                <p className="text-[14px] text-[#9B8EA0] italic font-serif">Awaiting your first editorial piece...</p>
                <Link href="/input" className="inline-block px-8 py-3 bg-[#00A896] text-white rounded-full text-[12px] font-bold shadow-md hover:bg-[#008A7B]">
                  Start Generating
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-6">
            <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] px-1">Studio Access</label>
            <div className="space-y-4">
              <QuickActionCard 
                icon={<PlusCircle className="w-5 h-5" />} 
                title="Create" 
                name="Generate New Story" 
                accentColor="#00A896"
                href="/input"
              />
              <QuickActionCard 
                icon={<Calendar className="w-5 h-5" />} 
                title="Planning" 
                name="Editorial Calendar" 
                accentColor="#3B82F6"
                href="/calendar"
              />
              <div className="opacity-60 cursor-not-allowed">
                <QuickActionCard 
                  icon={<BarChart3 className="w-5 h-5" />} 
                  title="Analytics" 
                  name="Performance Insights" 
                  accentColor="#9B8EA0"
                  href="#"
                />
              </div>
            </div>
          </section>

          {/* Editorial Inset (Power Tip) */}
          <div className="bg-[#1C1C1E] text-white rounded-xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A896]/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#00A896] uppercase tracking-[0.2em]">
                <Sparkles size={12} fill="currentColor" /> Editorial Strategy
              </div>
              <h3 className="text-xl font-serif">The Power of Soft Storytelling</h3>
              <p className="text-[13px] leading-relaxed text-[#9B8EA0]">
                "Content Tipe B" often converts better when framed as an educational Q&A. Try answering actual customer anxieties in your next post.
              </p>
              <button className="text-[11px] font-bold text-[#00A896] hover:underline decoration-white/30 underline-offset-4">
                Read Best Practices &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

