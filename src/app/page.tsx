'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Sparkles, MessageCircle, ChevronDown, Settings2, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIOrb from '@/components/ui/AIOrb';
import InputArea from '@/components/ui/InputArea';
import type { CarouselBrandingSettings, HandlePosition, CounterFormat, CounterPosition } from '@/lib/carousel-engine';

const STORAGE_KEY = 'carousel_branding_settings';

const DEFAULT_BRANDING: CarouselBrandingSettings = {
  handle: '@username',
  handlePosition: 'top-right',
  counterFormat: 'numeric',
  counterPosition: 'bottom-right',
};

export default function RootCreatePage() {
  const [inputText, setInputText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [branding, setBranding] = useState<CarouselBrandingSettings>(DEFAULT_BRANDING);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBranding(JSON.parse(stored));
    } catch {}
  }, []);

  const updateBranding = (patch: Partial<CarouselBrandingSettings>) => {
    setBranding(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const router = useRouter();

  const handleOptimize = async () => {
    if (!inputText.trim() || isOptimizing) return;
    setIsOptimizing(true);
    setError('');
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText }),
      });
      if (!res.ok) throw new Error('Failed to optimize prompt');
      const data = await res.json();
      setInputText(data.optimized);
    } catch (err: any) {
      setError('Gagal optimasi prompt. Silakan coba lagi.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setInputText(template);
  };

  const handleGenerate = async () => {
    if (!inputText.trim() || isLoading || !selectedType) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputText,
          contentType: selectedType,
          brandingSettings: branding,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate content');
      const data = await res.json();
      sessionStorage.setItem('pending_content', JSON.stringify({
        original_text: inputText,
        generated: data
      }));
      router.push('/review');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-8 space-y-6 md:space-y-8 animate-in fade-in duration-1000">
      {/* Editorial Header Section */}
      <div className="text-center space-y-3 md:space-y-4 mb-2 md:mb-6">
        <div className="flex justify-center">
           <AIOrb />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#00A896] uppercase tracking-[0.2em]">
            <Sparkles size={12} fill="currentColor" /> Creative Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1C1C1E] leading-tight">
            Bring your stories <span className="text-[#00A896] italic">to life</span>.
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#9B8EA0] max-w-lg mx-auto leading-relaxed px-4">
            Curate high-impact social media content by following our two-step editorial process.
          </p>
        </div>
      </div>

      {/* STEP 1: CONTENT STRATEGY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
           <div className="w-8 h-8 rounded-full bg-[#00A896] text-white flex items-center justify-center text-[12px] font-black shadow-md">1</div>
           <div>
              <h2 className="text-[14px] font-black text-[#1C1C1E] uppercase tracking-widest">Choose Your Strategy</h2>
              <p className="text-[12px] text-[#9B8EA0]">What kind of story are we telling today?</p>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { id: "A", title: "Testimonial", desc: "Patient healing stories and recovery reports.", icon: <Sparkles size={14} /> },
            { id: "C", title: "Opportunity", desc: "Business partnership and income results.", icon: <MessageCircle size={14} /> },
            { id: "B", title: "Education", desc: "Product benefits and healthy lifestyle guides.", icon: <Sparkles size={14} /> },
          ].map((item, idx) => {
            const isSelected = selectedType === item.id;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(item.id)}
                className="cursor-pointer"
              >
                <div className={`
                h-full bg-white border rounded-2xl p-3 md:p-5 shadow-sm transition-all duration-300
                  ${isSelected 
                    ? 'border-[#00A896] ring-4 ring-[#007A6E]/5 bg-[#E0F5F2]/10' 
                    : 'border-[#E8E5DF] hover:border-[#00A896]/30 hover:shadow-md'
                  }
                  group relative flex flex-col items-center md:items-start text-center md:text-left
                `.trim()}>
                  <div className={`
                    w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all mb-2 md:mb-4
                    ${isSelected ? 'bg-[#00A896] text-white shadow-md' : 'bg-[#F7F6F2] text-[#9B8EA0] group-hover:bg-[#E0F5F2] group-hover:text-[#00A896]'}
                  `.trim()}>
                    {item.icon}
                  </div>
                  <h3 className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2 transition-colors ${isSelected ? 'text-[#00A896]' : 'text-[#1C1C1E]'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#9B8EA0] leading-relaxed hidden md:block">{item.desc}</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 text-[#00A896]">
                       <Sparkles size={10} fill="currentColor" className="md:w-3 md:h-3" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CONTENT INPUT */}
      <AnimatePresence>
        {selectedType && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6 pt-4"
          >
            <div className="flex items-center gap-4 px-2">
               <div className="w-8 h-8 rounded-full bg-[#00A896] text-white flex items-center justify-center text-[12px] font-black shadow-md">2</div>
               <div>
                  <h2 className="text-[14px] font-black text-[#1C1C1E] uppercase tracking-widest">Provide Source Data</h2>
                  <p className="text-[12px] text-[#9B8EA0]">Paste your raw testimonials or context here.</p>
               </div>
            </div>

            <div className="space-y-8">
              <InputArea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onSend={handleGenerate}
                onOptimize={handleOptimize}
                onTemplateSelect={handleTemplateSelect}
                isOptimizing={isOptimizing}
                disabled={isLoading}
                isTypeSelected={!!selectedType}
                placeholder="Paste your source text here (e.g. Testimonials, Daily Reports...)"
              />

              {isLoading && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00A896]" />
                  <p className="text-[12px] font-bold text-[#00A896] uppercase tracking-[0.2em] italic">
                    AI Editorial Assistant is Curating...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-5 bg-[#FEF2F2] border border-rose-100 rounded-2xl text-rose-600 text-[13px] font-medium shadow-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedType && (
         <div className="text-center py-10 opacity-30">
            <ChevronDown className="w-6 h-6 mx-auto animate-bounce text-[#9B8EA0]" />
            <p className="text-[11px] font-bold uppercase tracking-widest mt-2">Select a strategy to unlock Step 2</p>
         </div>
      )}

      {/* Slide Branding Settings */}
      <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setBrandingOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F7F6F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings2 size={15} className="text-[#9B8EA0]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#1C1C1E]">Slide Branding</span>
            <span className="text-[11px] text-[#9B8EA0] font-medium">— username &amp; nomor slide</span>
          </div>
          {brandingOpen ? <ChevronUp size={15} className="text-[#9B8EA0]" /> : <ChevronDown size={15} className="text-[#9B8EA0]" />}
        </button>

        <AnimatePresence>
          {brandingOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 space-y-6 border-t border-[#F0EEE8]">

                {/* Handle */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em]">Username / Handle</label>
                  <div className="flex gap-3 flex-wrap">
                    <input
                      type="text"
                      value={branding.handle}
                      onChange={e => updateBranding({ handle: e.target.value })}
                      placeholder="@username"
                      className="flex-1 min-w-[160px] px-4 py-2.5 text-[13px] border border-[#E8E5DF] rounded-xl focus:outline-none focus:border-[#00A896] transition-colors"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'none'] as HandlePosition[]).map(pos => (
                        <button
                          key={pos}
                          onClick={() => updateBranding({ handlePosition: pos })}
                          className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            branding.handlePosition === pos
                              ? 'bg-[#00A896] text-white border-[#00A896]'
                              : 'border-[#E8E5DF] text-[#9B8EA0] hover:border-[#00A896]/40'
                          }`}
                        >
                          {pos === 'none' ? 'Sembunyikan' : pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em]">Nomor Slide</label>
                  <div className="flex gap-2 flex-wrap">
                    {([
                      { val: 'numeric', label: '01 / 06' },
                      { val: 'written', label: '1 of 6' },
                      { val: 'dots',    label: '● ● ○ ○' },
                      { val: 'none',    label: 'Sembunyikan' },
                    ] as { val: CounterFormat; label: string }[]).map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => updateBranding({ counterFormat: val })}
                        className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                          branding.counterFormat === val
                            ? 'bg-[#00A896] text-white border-[#00A896]'
                            : 'border-[#E8E5DF] text-[#9B8EA0] hover:border-[#00A896]/40'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {branding.counterFormat !== 'none' && (
                    <div className="flex gap-2 flex-wrap">
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as CounterPosition[]).map(pos => (
                        <button
                          key={pos}
                          onClick={() => updateBranding({ counterPosition: pos })}
                          className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            branding.counterPosition === pos
                              ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                              : 'border-[#E8E5DF] text-[#9B8EA0] hover:border-[#1C1C1E]/30'
                          }`}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Preview */}
                <div className="bg-[#0A0F0D] rounded-xl p-5 relative" style={{ height: 120 }}>
                  <span className="text-[10px] text-[#9B8EA0] uppercase tracking-widest absolute top-4 left-5">Preview</span>
                  {/* Handle preview */}
                  {branding.handlePosition !== 'none' && branding.handle && (
                    <span className={`absolute text-[10px] font-bold text-white/50 uppercase tracking-wider ${
                      branding.handlePosition === 'top-left' ? 'top-4 left-16' :
                      branding.handlePosition === 'top-right' ? 'top-4 right-5' :
                      branding.handlePosition === 'bottom-left' ? 'bottom-4 left-5' :
                      'bottom-4 right-5'
                    }`}>{branding.handle}</span>
                  )}
                  {/* Counter preview */}
                  {branding.counterFormat !== 'none' && (
                    <span className={`absolute text-[10px] text-white/35 tracking-widest ${
                      branding.counterPosition === 'top-left' ? 'top-4 left-5' :
                      branding.counterPosition === 'top-right' ? 'top-4 right-5' :
                      branding.counterPosition === 'bottom-left' ? 'bottom-4 left-5' :
                      'bottom-4 right-5'
                    }`}>
                      {branding.counterFormat === 'numeric' ? '01 / 06' :
                       branding.counterFormat === 'written' ? '1 of 6' : '● ● ○ ○ ○ ○'}
                    </span>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-8 border-t border-[#F7F6F2]">
        <p className="text-[10px] text-[#CED4DA] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
          <span className="w-4 h-px bg-[#CED4DA]/30" />
          StoryFlow | Powered by Gemini 2.0
          <span className="w-4 h-px bg-[#CED4DA]/30" />
        </p>
      </div>
    </div>
  );
}
