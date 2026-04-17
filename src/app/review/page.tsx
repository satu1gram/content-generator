'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, Send, Save, Check } from 'lucide-react';
import ImagePicker from '@/components/ImagePicker';
import ImagePreview from '@/components/ImagePreview';
import CanvaExportButton from '@/components/CanvaExportButton';
import CaptionBlock from '@/components/ui/CaptionBlock';
import { ClaudeOutput } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getThemeConfig } from '@/lib/theme';

export default function ReviewPage() {
  const [data, setData] = useState<ClaudeOutput | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pending = sessionStorage.getItem('pending_content');
    if (!pending) {
      router.push('/input');
      return;
    }
    const { original_text, generated } = JSON.parse(pending);
    setData(generated);
    setOriginalText(original_text);

    if (generated.generated_images && generated.generated_images.length > 0) {
      setSelectedImage(generated.generated_images[0]);
    }
  }, [router]);

  const handleSave = async (status: 'draft' | 'approved' = 'draft') => {
    if (!data) return;
    setIsSaving(true);
    try {
      const payload = { ...data, original_text: originalText, source: 'telegram', image_url: selectedImage, status: status, created_at: new Date().toISOString() };
      const res = await fetch('/api/contents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { sessionStorage.removeItem('pending_content'); router.push('/'); }
    } catch (error) { console.error('Save failed:', error); } finally { setIsSaving(false); }
  };

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-[#00A896]" />
      <p className="text-[13px] text-[#9B8EA0] italic">Curating your content...</p>
    </div>
  );

  return (
    <div 
      className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000"
    >
      {/* Editorial Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E8E5DF] pb-8">
        <div className="space-y-2">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-[11px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] hover:text-[#00A896] transition-all mb-4 bg-white border border-[#E8E5DF] px-4 py-1.5 rounded-full shadow-sm hover:shadow-md w-fit"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Editor
          </button>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1C1C1E] leading-tight">
            Content Review <span className="text-[#00A896] italic">&</span> Quality Check
          </h1>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => handleSave('draft')} 
            className="px-6 py-2.5 rounded-full border border-[#00A896] text-[#00A896] text-[12px] font-bold hover:bg-[#E0F5F2] transition-all flex items-center gap-2 shadow-sm"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('approved')} 
            className="px-8 py-3 rounded-full bg-[#00A896] text-white text-[13px] font-black uppercase tracking-widest hover:bg-[#008A7B] shadow-md hover:shadow-lg transition-all flex items-center gap-3"
          >
            Approve <Send size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Main Content Area (2/3) */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* 1. Psychological Analysis */}
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Psychological Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CaptionBlock 
                label="Target Anxiety" 
                content={data.analysis?.pain_points || ''} 
                variant="secondary"
                isItalic
              />
              <CaptionBlock 
                label="Psychological Motive" 
                content={data.analysis?.psychological_motive || ''} 
                variant="secondary"
              />
            </div>
          </section>

          {/* 2. Visual & Content Preview */}
          <section className="space-y-8 pt-4">
            <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Visual & Copy Presentation</h2>
            
            <ImagePreview image_url={selectedImage} data={data} />

            <div className="space-y-8 mt-10">
              <CaptionBlock 
                label="Recommended Caption (Storytelling)" 
                content={data.caption_v1} 
                variant="editorial"
              />
              <CaptionBlock 
                label="Alternative Caption (Direct)" 
                content={data.caption_v2} 
                variant="secondary"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CaptionBlock label="Hashtags" content={data.hashtag} variant="accent" />
                <CaptionBlock label="Posting Schedule" content={data.waktu_posting} variant="amber" />
              </div>
            </div>
          </section>

          {/* 3. TikTok Scripts */}
          <section className="space-y-8 pt-4">
            <h2 className="text-xl font-serif text-[#1C1C1E] border-l-4 border-[#00A896] pl-4">Engagement Utility (Short-Form)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.tiktok_scripts?.map((item, idx) => (
                <CaptionBlock 
                  key={idx}
                  label={`Video Var ${idx + 1}`}
                  content={`${item.title}\n\n${item.script}`}
                  variant="secondary"
                />
              ))}
            </div>
          </section>

          {/* 4. Visual Strategy Notes */}
          <section className="space-y-6 pt-4 border-t border-[#EDEBE5]">
            <CaptionBlock 
              label="Visual Strategy Design MD" 
              content={data.rekomendasi_visual} 
              variant="purple"
              isItalic
            />
          </section>
        </div>

        {/* Right Panel (1/3) */}
        <div className="xl:col-span-4 space-y-10 self-start sticky top-20">
          <section className="space-y-4">
            <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] px-1">Studio Assets</label>
            <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm">
              <ImagePicker initialPrompt={data.image_prompt?.en || ''} format={data.post_format} onImageSelected={setSelectedImage} />
            </div>
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] px-1">Design Distribution</label>
            <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm">
              <CanvaExportButton type={data.canva_template_type} format={data.post_format} caption={data.caption_v1} />
            </div>
          </section>

          <section className="pt-6 border-t border-[#EDEBE5]">
             <div className="bg-[#F0EEE8] rounded-xl p-6 space-y-4">
               <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em]">Original Blueprint</label>
               <p className="text-[12px] text-[#3D3D3D] font-mono leading-relaxed line-clamp-6 opacity-80 italic">
                 {originalText}
               </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
