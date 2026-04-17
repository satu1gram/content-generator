'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AIOrb from '@/components/ui/AIOrb';
import InputArea from '@/components/ui/InputArea';
import Card from '@/components/ui/Card';

export default function InputPage() {
  const [inputText, setInputText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');
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
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: inputText,
          contentType: selectedType 
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
    <div className="max-w-3xl mx-auto py-8 md:py-16 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Editorial Header Section */}
      <div className="text-center space-y-6">
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
            Paste your Telegram testimonials or raw data below. Our AI editorial team will refine it into high-impact social media content.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-6 animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "A", title: "Testimonial", desc: "Patient healing stories and recovery reports.", icon: <Sparkles size={14} /> },
          { id: "C", title: "Opportunity", desc: "Business partnership and income results.", icon: <MessageCircle size={14} /> },
          { id: "B", title: "Education", desc: "Product benefits and healthy lifestyle guides.", icon: <Sparkles size={14} /> },
        ].map((item, idx) => {
          const isSelected = selectedType === item.id;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              onClick={() => setSelectedType(item.id)}
              className="cursor-pointer"
            >
              <div className={`
                h-full bg-white border rounded-2xl p-6 shadow-sm transition-all duration-300
                ${isSelected 
                  ? 'border-[#00A896] ring-4 ring-[#007A6E]/5 bg-[#E0F5F2]/10 scale-[1.02]' 
                  : 'border-[#E8E5DF] hover:border-[#00A896]/30 hover:shadow-md'
                }
                group relative
              `.trim()}>
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all mb-4
                  ${isSelected ? 'bg-[#00A896] text-white shadow-md' : 'bg-[#F7F6F2] text-[#9B8EA0] group-hover:bg-[#E0F5F2] group-hover:text-[#00A896]'}
                `.trim()}>
                  {item.icon}
                </div>
                <h3 className={`text-[12px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors ${isSelected ? 'text-[#00A896]' : 'text-[#1C1C1E]'}`}>
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#9B8EA0] leading-relaxed">{item.desc}</p>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#00A896]">
                     <Sparkles size={12} fill="currentColor" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-8 border-t border-[#F7F6F2]">
        <p className="text-[10px] text-[#CED4DA] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
          <span className="w-4 h-px bg-[#CED4DA]/30" />
          Editorial Powered by Gemini 2.0
          <span className="w-4 h-px bg-[#CED4DA]/30" />
        </p>
      </div>
    </div>
  );
}
