import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import StoryFlowLogo from "@/components/ui/StoryFlowLogo";

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
  title: "StoryFlow | AI Digital Contents Studio",
  description: "Advanced AI-powered content generation studio for social media, carousel, and storytelling. Powered by StoryFlow Engine.",
  icons: {
    icon: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
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
              <StoryFlowLogo size={24} />
              <div className="text-[11px] md:text-[12px] font-bold text-[#1C1C1E] uppercase tracking-widest truncate pr-4 group-hover:text-[#00A896] transition-colors">
                StoryFlow
              </div>
            </Link>
            <div className="flex items-center gap-4 text-[10px] md:text-[11px] text-[#9B8EA0] font-medium shrink-0">
              <span className="hidden xs:inline uppercase tracking-widest font-bold text-[#00A896]/60">Studio Active</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00A896] shadow-[0_0_8px_rgba(0,168,150,0.4)]" />
            </div>
          </header>

          <main className="flex-1 bg-[#F7F6F2] min-h-screen pb-[80px] md:pb-0">
            <div className="p-3 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
