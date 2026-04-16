'use client';

import { useState } from 'react';
import { ClaudeOutput } from '@/lib/types';
import { 
  Instagram, MapPin, MoreHorizontal, MessageCircle, Send, 
  Bookmark, Heart, ChevronLeft, ChevronRight, Download, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePreviewProps {
  image_url?: string;
  data: ClaudeOutput;
}

const ImagePreview = ({ image_url, data }: ImagePreviewProps) => {
  const images = data.generated_images || (image_url ? [image_url] : []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const downloadAll = async () => {
    if (images.length === 0) return;
    
    // Download each image
    images.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `slide_${index + 1}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Phone Mockup Preview */}
      <div className="w-full max-w-[400px] mx-auto lg:mx-0">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block flex items-center gap-1.5">
            <Instagram size={12} /> Instagram Preview 
            {images.length > 1 && <span className="text-[var(--bp-accent)]">({currentIndex + 1}/{images.length})</span>}
          </label>
          
          {images.length > 0 && (
            <button 
              onClick={downloadAll}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--bp-accent)] hover:text-white transition-all bg-[var(--bp-accent)]/10 px-3 py-1 rounded-full border border-[var(--bp-accent)]/20"
            >
              <Download size={10} /> Download All Slides
            </button>
          )}
        </div>

        <div className="bg-black border border-white/10 rounded-[3rem] p-3 shadow-2xl ring-4 ring-white/5 relative group">
          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--bp-accent)]"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--bp-accent)]"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <div className="bg-black rounded-[2.5rem] overflow-hidden border border-white/10">
            {/* Instagram Header */}
            <div className="px-4 py-3 flex items-center justify-between bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-black border border-black flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=BP&background=F59E0B&color=000`} alt="Avatar" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">britishpropolis_hq</span>
                  <span className="text-[10px] text-gray-400">Jakarta, Indonesia</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white" />
            </div>

            {/* Post Image Carousel */}
            <div className={`relative bg-white/5 overflow-hidden flex items-center justify-center ${
              (data.post_format === 'story' || data.post_format === 'reels') ? 'aspect-[9/16]' : 'aspect-square'
            }`}>
              <AnimatePresence mode="wait">
                {images.length > 0 ? (
                  <motion.img 
                    key={currentIndex}
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex + 1}`} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/20 italic">
                    <Instagram className="w-12 h-12" />
                    <span className="text-sm">Silakan pilih/buat gambar</span>
                  </div>
                )}
              </AnimatePresence>

              {/* Slide Indicators (Dots) */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-20">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-4 bg-[var(--bp-accent)]' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3 bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 text-white hover:text-red-500 transition-colors" />
                  <MessageCircle className="w-6 h-6 text-white" />
                  <Send className="w-6 h-6 text-white" />
                </div>
                {images.length > 1 && (
                  <div className="flex-1 flex justify-center">
                    <div className="flex gap-1">
                      {images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-blue-400' : 'bg-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                )}
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-white">
                <span className="font-bold mr-2">britishpropolis_hq</span>
                <span className="text-gray-200 line-clamp-3 leading-relaxed">{data.caption_v1}</span>
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">JUST NOW • AUTOMATED BY AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption Data Review */}
      <div className="flex-1 space-y-8 w-full">
        <div className="flex items-center gap-3 p-4 bg-[var(--bp-accent)]/5 border border-[var(--bp-accent)]/10 rounded-2xl">
          <Sparkles className="text-[var(--bp-accent)]" size={20} />
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">AI Content Ready</h4>
            <p className="text-[10px] text-[var(--bp-text-secondary)]">Semua slide sudah di-render secara otomatis dengan standar brand.</p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3 pl-1">Recommended Caption (Storytelling)</label>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-gray-300 text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap font-medium">
            {data.caption_v1}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3 pl-1">Alternative Caption (Direct)</label>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-gray-400 text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap">
            {data.caption_v2}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <label className="text-[10px] font-black text-amber-500 uppercase block mb-2 tracking-widest">Hashtags</label>
            <p className="text-[12px] text-gray-400 font-medium leading-relaxed">{data.hashtag}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <label className="text-[10px] font-black text-amber-500 uppercase block mb-2 tracking-widest">Posting Schedule</label>
            <p className="text-[12px] text-gray-400 font-medium">{data.waktu_posting}</p>
          </div>
        </div>

        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <label className="text-[10px] font-black text-amber-500 uppercase block mb-2 tracking-widest">Visual Strategy Notes</label>
          <p className="text-[12px] text-amber-200/70 italic leading-relaxed font-medium">&quot;{data.rekomendasi_visual}&quot;</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
