'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AIOrb from '@/components/ui/AIOrb';
import InputArea from '@/components/ui/InputArea';
import Card from '@/components/ui/Card';

export default function InputPage() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText }),
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
    <div className="max-w-2xl mx-auto py-6 md:py-12 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-3 md:space-y-4">
        <AIOrb />
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Smart Input Assistant</h1>
          <p className="text-[12px] md:text-[13px] text-[var(--bp-text-secondary)] max-w-sm mx-auto leading-relaxed px-4">
            Tempelkan pesan atau testimoni dari Telegram. AI akan merangkumnya menjadi konten premium siap posting.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InputArea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onSend={handleGenerate}
            disabled={isLoading}
            placeholder="Contoh: Alhamdulillah hari ini ada testimoni dari Bu Siti, rutin minum BP 1 minggu kolesterol turun drastis..."
          />
        </motion.div>

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-2 md:py-4 animate-in fade-in duration-500">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--bp-accent)]" />
            <p className="text-[10px] md:text-[11px] font-medium text-[var(--bp-accent)] uppercase tracking-widest italic">
              AI is analyzing your message...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-[var(--bp-red-bg)] border-[0.5px] border-[var(--bp-red)]/10 rounded-[var(--bp-radius-md)] text-[var(--bp-red)] text-[11px] md:text-[12px]">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>

      {/* Help Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { title: "Testimoni", desc: "Cerita kesembuhan." },
          { title: "Kemitraan", desc: "Peluang bisnis." },
          { title: "Edukasi", desc: "Manfaat produk." },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
            className={idx === 2 ? "col-span-2 md:col-span-1" : ""}
          >
            <Card className="hover:border-[var(--bp-accent)]/20 transition-all cursor-default group h-full" padding="p-3 md:p-4">
              <h3 className="text-[9px] md:text-[11px] font-bold text-[var(--bp-text-primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--bp-accent)]" />
                {item.title}
              </h3>
              <p className="text-[9px] md:text-[11px] text-[var(--bp-text-secondary)] leading-relaxed">{item.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center pb-20 md:pb-0">
        <p className="text-[9px] md:text-[10px] text-[var(--bp-text-muted)] font-medium flex items-center justify-center gap-2">
          <Sparkles size={10} className="text-[var(--bp-accent)]" /> 
          Powered by Gemini 2.0 & Antigravity Intelligence
        </p>
      </div>
    </div>
  );
}
