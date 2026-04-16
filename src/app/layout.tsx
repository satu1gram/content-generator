import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BP Content Tools | Airy Dashboard",
  description: "AI-Powered Content Generation for British Propolis and Quantum Millionaire community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen selection:bg-[var(--bp-accent)]/20`}>
        <Sidebar />
        
        <div className="md:pl-[56px] pl-0 min-h-screen flex flex-col pt-[48px] md:pt-0">
          {/* Topbar - Hide on mobile if preferred, or adjust */}
          <header className="fixed top-0 md:left-[56px] left-0 right-0 h-[48px] bg-surface/80 backdrop-blur-md border-b border-[var(--bp-border)] z-40 flex items-center px-4 md:px-6 justify-between">
            <div className="text-[11px] md:text-[12px] font-medium text-[var(--bp-text-secondary)] truncate pr-4">
              British Propolis / Dashboard
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-[11px] text-[var(--bp-text-muted)] font-medium shrink-0">
              <span className="hidden xs:inline">Status: Online</span>
              <div className="w-2 h-2 rounded-full bg-[var(--bp-green)] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            </div>
          </header>

          {/* Main Area */}
          <main className="flex-1 bg-[var(--bp-bg-page)] min-h-screen">
            <div className="p-4 md:p-8 max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
