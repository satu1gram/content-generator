import path from 'path';
import fs from 'fs';
import { generateCarouselImages } from '../src/lib/carousel-engine.js';

// --- Loader .env.local ---
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const bpSlides = [
  {
    title: "Badan Kurang Fit?",
    body: "Jangan biarkan aktivitas kita terganggu hanya karena daya tahan tubuh menurun.",
    image_search_query: "muslim man healthy"
  }
];

const belgieSlides = [
  {
    title: "Wajah Glowing Alami",
    body: "Rahasia kita untuk tampil segar dan bercahaya setiap pagi tanpa ribet.",
    image_search_query: "hijab woman skincare"
  }
];

async function main() {
  console.log("🚀 Memulai Pengujian Dynamic Branding...");
  
  // 1. Test BP (Dark Mode)
  console.log("\n--- Testing BP (Dark & Gold) ---");
  const bpUrls = await generateCarouselImages(bpSlides, {
    primary: "#0A0F0D", accent: "#F59E0B", text: "#FFFFFF", decoration: "gold-glitter"
  });
  console.log(`✅ BP URL: ${bpUrls[0]}`);

  // 2. Test Belgie (Light Mode)
  console.log("\n--- Testing BELGIE (Light & Pink) ---");
  const belgieUrls = await generateCarouselImages(belgieSlides, {
    primary: "#FFF5F7", accent: "#F43F5E", text: "#2D3748", decoration: "soft-glow"
  });
  console.log(`✅ BELGIE URL: ${belgieUrls[0]}`);
  
  console.log("\n✨ SILAKAN CEK KEDUA URL DI ATAS DI BROWSER ANDA!");
}

main();
