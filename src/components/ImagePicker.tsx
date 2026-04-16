'use client';

import { useState } from 'react';
import { Sparkles, Upload, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
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
    <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            activeTab === 'ai' ? 'bg-amber-500/10 text-amber-500' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI Generate
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            activeTab === 'upload' ? 'bg-amber-500/10 text-amber-500' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Foto
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
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Image Prompt (English)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 p-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white/80 focus:ring-2 focus:ring-amber-500/40 outline-none transition-all resize-none"
                  placeholder="Describe your image..."
                />
              </div>

              {generatedUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/20 ring-4 ring-amber-500/10">
                    <img src={generatedUrl} alt="Generated" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> Coba Lagi
                    </button>
                    <button
                      onClick={() => onImageSelected(generatedUrl)}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-bold transition-all shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Pakai Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sedang membuat... (~20s)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Generate Gambar
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
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80 font-medium">Klik untuk upload atau drag & drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
              {uploadLoading && (
                <div className="flex items-center justify-center gap-2 text-amber-500 text-sm italic">
                  <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah ke Supabase...
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
