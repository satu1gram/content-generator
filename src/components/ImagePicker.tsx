'use client';

import { useState } from 'react';
import { Sparkles, Upload, Loader2, CheckCircle2, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePickerProps {
  initialPrompt?: string;
  format?: string;
  onImageSelected: (url: string) => void;
}

const ImagePicker = ({ initialPrompt = '', format = 'feed', onImageSelected }: ImagePickerProps) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'upload'>('ai');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format }),
      });
      const data = await res.json();
      if (data.image_url) {
        setGeneratedUrl(data.image_url);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.public_url) {
        onImageSelected(data.public_url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="w-full bg-[var(--bp-bg-surface)] border border-[var(--bp-border)] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex border-b border-[var(--bp-border)]">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'ai' ? 'bg-[var(--bp-accent)]/5 text-[var(--bp-accent)] shadow-[inset_0_-2px_0_var(--bp-accent)]' : 'text-[var(--bp-text-muted)] hover:text-[var(--bp-text-primary)] hover:bg-[var(--bp-bg-hover)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Studio
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'upload' ? 'bg-[var(--bp-accent)]/5 text-[var(--bp-accent)] shadow-[inset_0_-2px_0_var(--bp-accent)]' : 'text-[var(--bp-text-muted)] hover:text-[var(--bp-text-primary)] hover:bg-[var(--bp-bg-hover)]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'ai' ? (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-[var(--bp-text-muted)] uppercase tracking-widest">Image Generation Prompt</label>
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-[9px] font-bold transition-all px-2 py-0.5 rounded-lg border ${
                      copied 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : 'bg-[var(--bp-bg-inner)] text-[var(--bp-text-muted)] border-[var(--bp-border)] hover:text-[var(--bp-text-primary)]'
                    }`}
                  >
                    {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-28 p-4 bg-[var(--bp-bg-inner)] border border-[var(--bp-border)] rounded-xl text-[13px] text-[var(--bp-text-primary)] font-medium focus:ring-1 focus:ring-[var(--bp-accent)] outline-none transition-all resize-none leading-relaxed"
                  placeholder="Describe your image in English..."
                />
              </div>

              {generatedUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--bp-border)] ring-4 ring-[var(--bp-accent)]/5 shadow-md">
                    <img src={generatedUrl} alt="Generated" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-[var(--bp-bg-inner)] hover:bg-[var(--bp-bg-hover)] text-[var(--bp-text-primary)] border border-[var(--bp-border)] rounded-xl text-[12px] font-bold transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> Regenerate
                    </button>
                    <button
                      onClick={() => onImageSelected(generatedUrl)}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-[var(--bp-accent)] hover:bg-[var(--bp-accent-hover)] text-white rounded-xl text-[12px] font-black transition-all shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Use This Image
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full py-4 bg-[var(--bp-accent)] hover:bg-[var(--bp-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.1em] text-[12px] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2.5"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generating... (~20s)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Create AI Visual
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="border-2 border-dashed border-[var(--bp-border)] rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-[var(--bp-bg-inner)] hover:bg-[var(--bp-bg-hover)] transition-all cursor-pointer group relative">
                <div className="p-4 bg-[var(--bp-bg-surface)] rounded-full group-hover:scale-110 transition-transform shadow-sm border border-[var(--bp-border)]">
                  <Upload className="w-7 h-7 text-[var(--bp-accent)]" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] text-[var(--bp-text-primary)] font-bold">Klik atau seret foto ke sini</p>
                  <p className="text-[11px] text-[var(--bp-text-muted)] mt-1">PNG, JPG, WEBP (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
              {uploadLoading && (
                <div className="flex items-center justify-center gap-2 text-[var(--bp-accent)] text-[12px] italic font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sedang mengunggah...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImagePicker;
