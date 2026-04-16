'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Save, ArrowLeft, Loader2, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ImagePicker from '@/components/ImagePicker';
import ImagePreview from '@/components/ImagePreview';
import CanvaExportButton from '@/components/CanvaExportButton';
import { ClaudeOutput } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Script berhasil disalin! ✅');
  };

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--bp-accent)]" />
      <p className="text-[13px] text-[var(--bp-text-secondary)] italic">Memuat data konten...</p>
    </div>
  );

  // Robust Theme Detection
  const primaryColor = data.visual_theme?.primary?.toLowerCase() || '#000000';
  const isLightMode = primaryColor === '#fff5f7' || data.product_category === 'BELGIE' || primaryColor === '#ffffff';

  return (
    <div className="space-y-6 md:space-y-10 pb-24 md:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Bar */}
      <div className="flex items-center justify-between sticky top-[48px] md:top-0 z-40 bg-[var(--bp-bg-page)]/80 backdrop-blur-md py-3 md:py-4 -mx-4 md:-mx-8 px-4 md:px-8 border-b border-[var(--bp-border)]">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] md:text-[12px] font-medium text-[var(--bp-text-secondary)] hover:text-[var(--bp-text-primary)] transition-colors">
          <ArrowLeft size={14} /> Back to Editor
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="secondary" size="sm" onClick={() => handleSave('draft')} disabled={isSaving} className="text-[10px] md:text-[12px] px-3 md:px-4">
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Draft
          </Button>
          <Button size="sm" onClick={() => handleSave('approved')} disabled={isSaving} className="text-[10px] md:text-[12px] px-3 md:px-4">
            Approve & Publish <Send size={12} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
        <div className="xl:col-span-8 space-y-10 md:space-y-12">
          {/* Analysis */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-7 h-7 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400"><Sparkles size={14} /></div>
              <h2 className="font-bold uppercase tracking-widest text-[var(--bp-text-secondary)] text-[12px]">Psychology Analysis</h2>
            </div>
            <Card className="bg-gradient-to-br from-purple-500/[0.05] to-transparent border-purple-500/10" padding="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Target Anxiety</h4>
                  <p className="text-[14px] text-[var(--bp-text-primary)] leading-relaxed italic">"{data.analysis?.pain_points}"</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Psychological Motive</h4>
                  <p className="text-[13px] text-[var(--bp-text-secondary)]">{data.analysis?.psychological_motive}</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Visual & Preview */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-7 h-7 bg-[var(--bp-accent-light)] rounded-lg flex items-center justify-center text-[var(--bp-accent)]"><Check size={14} /></div>
              <h2 className="font-bold uppercase tracking-widest text-[var(--bp-text-secondary)] text-[12px]">Visual & Caption</h2>
            </div>
            <ImagePreview image_url={selectedImage} data={data} />
          </section>

          {/* TikTok Scripts */}
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-7 h-7 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400"><Send size={14} /></div>
              <h2 className="font-bold uppercase tracking-widest text-[var(--bp-text-secondary)] text-[12px]">TikTok Scripts (30s)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.tiktok_scripts?.map((item, idx) => (
                <Card key={idx} className={`${isLightMode ? 'bg-black/5' : 'bg-white/[0.02]'} border-white/5 flex flex-col group transition-all`} padding="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">30s Script</span>
                    <span className="text-[9px] font-bold text-gray-500 opacity-50">Var {idx + 1}</span>
                  </div>
                  <h4 className={`text-[13px] font-bold ${isLightMode ? 'text-black' : 'text-white'} mb-3 group-hover:text-red-400 transition-colors leading-tight`}>{item.title}</h4>
                  <div className={`flex-1 ${isLightMode ? 'bg-white/60' : 'bg-black/40'} rounded-xl p-4 border border-white/5 overflow-y-auto max-h-[250px] scrollbar-hide`}>
                    <p className={`text-[12px] font-medium leading-relaxed ${isLightMode ? 'text-gray-900' : 'text-gray-200'}`}>{item.script}</p>
                  </div>
                  <button onClick={() => copyToClipboard(item.script)} className="w-full mt-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-[11px] font-black text-red-500 transition-all uppercase tracking-widest border border-red-500/10">
                    COPY THIS SCRIPT
                  </button>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Visual Strategy Notes */}
        <div className="xl:col-span-4 space-y-8 self-start">
          <section className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Visual Strategy Notes</label>
            <div className={`p-6 border rounded-2xl ${isLightMode ? 'bg-amber-100/50 border-amber-200' : 'bg-amber-500/5 border-amber-500/20'}`}>
              <p className={`text-[13px] italic leading-relaxed font-bold ${isLightMode ? 'text-amber-900' : 'text-amber-200'}`}>
                &quot;{data.rekomendasi_visual}&quot;
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-[var(--bp-border)]">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--bp-text-muted)] uppercase tracking-widest pl-1">
              <Sparkles size={12} className="text-[var(--bp-accent)]" /> 1. Visual Studio
            </div>
            <Card padding="p-0">
              <ImagePicker initialPrompt={data.image_prompt?.en || ''} format={data.post_format} onImageSelected={setSelectedImage} />
            </Card>
          </section>

          <section className="space-y-4 pt-4 border-t border-[var(--bp-border)]">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--bp-text-muted)] uppercase tracking-widest pl-1">2. Design Assets</div>
            <CanvaExportButton type={data.canva_template_type} format={data.post_format} caption={data.caption_v1} />
          </section>
        </div>
      </div>
    </div>
  );
}
