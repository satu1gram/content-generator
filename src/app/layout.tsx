import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair' 
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans'
});

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  weight: ['400', '500'],
  variable: '--font-dm-mono'
});

export const metadata: Metadata = {
  title: "BP Content Tools | Editorial Dashboard",
  description: "AI-Powered Content Generation for British Propolis and Quantum Millionaire community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable} font-sans min-h-screen selection:bg-[var(--bp-accent)]/20`}>
        <Sidebar />
        
        <div className="md:pl-[56px] pl-0 min-h-screen flex flex-col pt-[48px]">
          <header className="fixed top-0 md:left-[56px] left-0 right-0 h-[48px] bg-white/80 backdrop-blur-md border-b border-[#E8E5DF] z-40 flex items-center px-4 md:px-6 justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-6 h-6 bg-[#1C1C1E] rounded-md flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                 <Sparkles size={12} className="text-[#00A896]" fill="currentColor" />
              </div>
              <div className="text-[11px] md:text-[12px] font-bold text-[#1C1C1E] uppercase tracking-widest truncate pr-4 group-hover:text-[#00A896] transition-colors">
                British Propolis Dashboard
              </div>
            </Link>
            <div className="flex items-center gap-4 text-[10px] md:text-[11px] text-[#9B8EA0] font-medium shrink-0">
               <span className="hidden xs:inline uppercase tracking-widest font-bold text-[#00A896]/60">Studio Active</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#00A896] shadow-[0_0_8px_rgba(0,168,150,0.4)]" />
            </div>
          </header>

          <main className="flex-1 bg-[#F7F6F2] min-h-screen pb-[80px] md:pb-0">
            <div className="p-4 md:p-10 max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
