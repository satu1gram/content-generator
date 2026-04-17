'use client';

import { useState } from 'react';
import { ClaudeOutput } from '@/lib/types';
import { 
  Instagram, MoreHorizontal, MessageCircle, Send, 
  Bookmark, Heart, ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadSlidesAsZip } from '@/lib/download-utils';

interface ImagePreviewProps {
  image_url?: string;
  data: ClaudeOutput;
}

const ImagePreview = ({ image_url, data }: ImagePreviewProps) => {
  const images = data.generated_images || (image_url ? [image_url] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const downloadAll = async () => {
    if (images.length === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      const projectName = (data.visual_theme?.primary || 'content').replace('#', '') + '_slides';
      await downloadSlidesAsZip(images, projectName);
    } catch (error) {
      console.error('Download as ZIP failed:', error);
      alert('Gagal mendownload ZIP. Pastikan koneksi internet stabil.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-[#EDEBE5] rounded-xl p-6 md:p-8 shadow-sm">
      <div className="max-w-[360px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <label className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] block flex items-center gap-2">
            <Instagram size={12} className="text-[#00A896]" /> Instagram Mockup
          </label>
          
          {images.length > 0 && (
            <button 
              onClick={downloadAll}
              disabled={isDownloading}
              className={`group flex items-center gap-2 text-[10px] font-bold transition-all ${
                isDownloading ? 'text-[#9B8EA0] cursor-not-allowed' : 'text-[#00A896] hover:text-[#008A7B]'
              }`}
            >
              <Download size={11} className={isDownloading ? 'animate-bounce' : ''} /> 
              {isDownloading ? 'Bundling ZIP...' : 'Download Slides'}
            </button>
          )}
        </div>

        <div className="bg-[#0D0D12] border border-[#2D2D2D] rounded-[3.2rem] p-3 shadow-2xl relative group">
          {images.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00A896]">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00A896]">
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <div className="bg-black rounded-[2.6rem] overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between bg-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-[1px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=BP&background=00A896&color=fff`} alt="Avatar" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white">britishpropolis_hq</span>
                  <span className="text-[9px] text-gray-500">Jakarta, Indonesia</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white" />
            </div>

            <div className="relative bg-[#1A1A1A] aspect-square overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {images.length > 0 ? (
                  <motion.img 
                    key={currentIndex}
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex + 1}`} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/10 italic">
                    <Instagram size={32} />
                    <span className="text-[10px]">No image yet</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 space-y-3 bg-black text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart size={20} />
                  <MessageCircle size={20} />
                  <Send size={20} />
                </div>
                <Bookmark size={20} />
              </div>
              <div className="text-[11px]">
                <span className="font-bold mr-2">britishpropolis_hq</span>
                <span className="text-gray-200 line-clamp-2 leading-relaxed">{data.caption_v1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
