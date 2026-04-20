'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }

    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Dismissed previously in this session
    if (sessionStorage.getItem('pwa_banner_dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', '1');
    setShowBanner(false);
  };

  if (!showBanner || installed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-sm">
      <div className="bg-[#1C1C1E] text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#00A896]/20 flex items-center justify-center shrink-0">
          <Smartphone size={18} className="text-[#00A896]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black uppercase tracking-widest text-[#00A896]">Install App</p>
          <p className="text-[11px] text-white/60 mt-0.5 leading-tight">Tambah StoryFlow ke Home Screen</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 bg-[#00A896] text-white text-[11px] font-black uppercase tracking-wider px-3 py-2 rounded-xl shrink-0 hover:bg-[#008A7B] transition-colors"
        >
          <Download size={12} />
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-white/30 hover:text-white/60 transition-colors shrink-0 -ml-1"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
