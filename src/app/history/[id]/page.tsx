'use client';
export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, Send, Check } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';
import CanvaExportButton from '@/components/CanvaExportButton';
import CaptionBlock from '@/components/ui/CaptionBlock';
import { ContentRecord, ClaudeOutput } from '@/lib/types';
import Select from '@/components/ui/Select';

export default function HistoryDetailPage({ params }: { params: any }) {
  const [paramsId, setParamsId] = useState<string | null>(null);
  
  // Safe param unwrapping for Next.js 14/15 compatibility
  useEffect(() => {
    if (params instanceof Promise) {
      params.then(p => setParamsId(p.id));
    } else {
      setParamsId(params.id);
    }
  }, [params]);

  const id = paramsId;
  const [content, setContent] = useState<ContentRecord | null>(null);
  const [claudeData, setClaudeData] = useState<ClaudeOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      try {
        const res = await fetch(`/api/contents/${id}`);
        if (!res.ok) throw new Error('Failed to fetch detail');
        const data = await res.json();
        setContent(data);

        // Safely parse extra_info if it's a string (legacy support)
        let extra = data.extra_info;
        if (typeof extra === 'string') {
          try { extra = JSON.parse(extra); } catch { extra = {}; }
        }
        extra = extra || {};
        setClaudeData({
          tipe: data.content_type || extra.tipe || 'A',
          product_category: extra.product_category || 'DEFAULT',
          analysis: extra.analysis || { pain_points: '', psychological_motive: '' },
          tiktok_scripts: extra.tiktok_scripts || [],
          carousel_slides: extra.carousel_slides || [],
          caption_v1: data.caption_v1 || extra.caption_v1 || '',
          caption_v2: data.caption_v2 || extra.caption_v2 || '',
          hashtag: data.hashtag || extra.hashtag || '',
          waktu_posting: data.waktu_posting || extra.waktu_posting || '',
          rekomendasi_visual: data.rekomendasi_visual || extra.rekomendasi_visual || '',
          post_format: data.post_format || extra.post_format || 'feed',
          image_prompt: extra.image_prompt || { en: '', style_notes: '', negative_prompt: '' },
          canva_template_type: extra.canva_template_type || 'lifestyle',
          generated_images: extra.generated_images || (data.image_url ? [data.image_url] : []),
          visual_theme: extra.visual_theme
        });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (status: 'draft' | 'approved' | 'posted') => {
    if (!content) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/contents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: content.id, status }),
      });
      if (res.ok) {
        setContent({ ...content, status });
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !id) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[#9B8EA0]">
      <Loader2 className="w-8 h-8 animate-spin text-[#00A896]" />
      <p className="text-[13px] italic">Retrieving historical data...</p>
    </div>
  );

  if (!content || !claudeData) return (
    <div className="text-center py-20 bg-white border border-[#EDEBE5] rounded-xl">
      <p className="text-red-500 font-medium">Archive not found.</p>
      <button onClick={() => router.push('/history')} className="mt-4 text-[#00A896] font-bold">Return to History</button>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Editorial Top Bar (Archive) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E5DF] pb-8">
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/history')} 
            className="group flex items-center gap-2 text-[11px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] hover:text-[#00A896] transition-all mb-4 bg-white border border-[#E8E5DF] px-4 py-1.5 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to History
          </button>
          <h1 className="text-3xl md:text-4xl font-serif text-[#1C1C1E]">
            StoryFlow Archive <span className="text-[#9B8EA0] font-sans text-sm font-medium tracking-widest ml-3">Ref: {content.id.slice(-6).toUpperCase()}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
             <span className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-widest leading-none mb-1">Status</span>
             <span className={`text-[12px] font-bold capitalize ${content.status === 'approved' ? 'text-[#00A896]' : content.status === 'posted' ? 'text-[#00A896]' : 'text-amber-600'}`}>
               {content.status}
             </span>
          </div>
          <div className="w-48">
            <Select 
              options={[
                { value: 'draft', label: 'Mark as Draft' },
                { value: 'approved', label: 'Mark as Approved' },
                { value: 'posted', label: 'Mark as Posted' }
              ]}
              value={content.status}
              onChange={(val) => handleUpdateStatus(val as any)}
              placeholder="Status"
            />
          </div>
          {isSaving && <Loader2 size={14} className="animate-spin text-[#00A896]" />}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
        {/* Main Content Area (2/3) */}
        <div className="xl:col-span-8 space-y-12">
          {/* Analysis */}
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Strategic Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CaptionBlock label="Target Anxiety" content={claudeData.analysis?.pain_points || ''} variant="secondary" isItalic />
              <CaptionBlock label="Psychological Motive" content={claudeData.analysis?.psychological_motive || ''} variant="secondary" />
            </div>
          </section>

          {/* Visual Preview */}
          <section className="space-y-8 pt-4">
             <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Archived Visual Content</h2>
             <ImagePreview image_url={content.image_url || undefined} data={claudeData} />
             
             <div className="space-y-8 mt-10">
               <CaptionBlock 
                 label="Storytelling Caption" 
                 content={claudeData.caption_v1} 
                 variant="editorial"
               />
               <CaptionBlock 
                 label="Direct Caption" 
                 content={claudeData.caption_v2} 
                 variant="secondary"
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <CaptionBlock label="Hashtag List" content={claudeData.hashtag} variant="accent" />
                 <CaptionBlock label="Posting Time" content={claudeData.waktu_posting} variant="amber" />
               </div>
             </div>
          </section>

          {/* TikTok Scripts */}
          {claudeData.tiktok_scripts && claudeData.tiktok_scripts.length > 0 && (
            <section className="space-y-8 pt-4">
              <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Engagement Utility</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {claudeData.tiktok_scripts.map((item, idx) => (
                  <CaptionBlock 
                    key={idx}
                    label={`Video Var ${idx + 1}`}
                    content={`${item.title}\n\n${item.script}`}
                    variant="secondary"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Visual Strategy */}
          <section className="space-y-6 pt-4 border-t border-[#EDEBE5]">
            <CaptionBlock 
              label="Visual Strategy Blueprint" 
              content={claudeData.rekomendasi_visual} 
              variant="purple"
              isItalic
            />
          </section>
        </div>

        {/* Right Panel (1/3) */}
        <div className="xl:col-span-4 space-y-6 md:space-y-8 self-start sticky top-20">
          <section className="space-y-6">
            <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] px-1">Design Distribution</label>
            <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm">
              <CanvaExportButton type={claudeData.canva_template_type} format={claudeData.post_format} caption={claudeData.caption_v1} />
            </div>
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] px-1">Archive Metadata</label>
            <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 md:p-6 shadow-sm divide-y divide-[#EDEBE5]">
              <div className="flex items-center justify-between py-3">
                <span className="text-[11px] font-bold text-[#9B8EA0] uppercase tracking-widest">Source</span>
                <span className="text-[12px] font-bold text-[#00A896]">{content.source}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[11px] font-bold text-[#9B8EA0] uppercase tracking-widest">Creation Date</span>
                <span className="text-[12px] font-bold text-[#1C1C1E]">{new Date(content.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[11px] font-bold text-[#9B8EA0] uppercase tracking-widest">Post Type</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                  Tipe {content.content_type}
                </span>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-[#EDEBE5]">
             <div className="bg-[#F0EEE8] rounded-xl p-6 space-y-4">
               <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em]">Archived Blueprint</label>
               <p className="text-[12px] text-[#3D3D3D] font-mono leading-relaxed opacity-60 italic">
                 {content.raw_text}
               </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
