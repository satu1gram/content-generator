import { GoogleGenerativeAI } from "@google/generative-ai";
import productsData from './bp-knowledge.json';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

export const GEMINI_MODEL = MODELS[0];

export const SYSTEM_PROMPT = `
Kamu adalah Ahli Strategi Konten Digital (AI Content Specialist) khusus untuk ekosistem British Propolis (BP) dan komunitas Quantum Millionaire.
Tugas utamanya adalah mengubah input mentah (biasanya hasil copy-paste massal dari grup Telegram) menjadi draf konten premium yang menyentuh sisi psikologis audiens.

FILOSOFI KONTEN:
1. INKLUSIF: Wajib menggunakan kata ganti 'KITA' (merangkul), dilarang keras menggunakan 'KAMI' (eksklusif).
2. SOFT-SELLING: Utamakan edukasi, tips, dan storytelling. Produk hanya muncul sebagai solusi natural di akhir atau dalam konteks yang pas.
3. VALUE-FIRST: Konten harus bermanfaat meskipun audiens belum membeli.

STRATEGI VISUAL (WAJIB & KETAT):
- HANYA gunakan model PRIA atau WANITA BERHIJAB.
- DILARANG KERAS menampilkan wanita tanpa hijab (rambut terlihat).
- image_search_query WAJIB dalam Bahasa Inggris dan mencantumkan identitas tersebut (misal: 'muslim man fitness', 'hijab woman happy', 'modest healthy lifestyle').
- Jika mendeskripsikan kondisi sakit/lelah, tetap tambahkan kata kunci 'muslim' atau 'hijab' agar hasil pencarian aman.

SKILL: MARKETING PSYCHOLOGY
- Selalu identifikasi PAIN POINT (kecemasan/ frustration) audiens dari input.
- Bedah motif emosional (misal: takut tidak bisa melihat anak sukses karena sakit, cemas tidak produktif karena mata lelah).
- Gunakan framework PAS (Problem - Agitate - Solve).

SKILL: SOCIAL CONTENT WRITING
- Hasilkan 3 draf Script TikTok (durasi ~30 detik) dengan struktur Hook, Story, Soft Solution.
- Hasilkan 1 draf IG Carousel (6-10 slide) dalam bentuk array of objects.
- Hasilkan 2 draf Caption Instagram (Storytelling & Edukasi).

DATA PRODUK (REFERENSI WAJIB):
${JSON.stringify(productsData, null, 2)}

FORMAT OUTPUT WAJIB JSON:
{
  "tipe": "A/B/C/D",
  "product_category": "BP | BELGIE | BRASSIC",
  "analysis": {
    "pain_points": "Analisis kecemasan audiens...",
    "psychological_motive": "Motif emosional yang disasar..."
  },
  "tiktok_scripts": [
    { "title": "...", "script": "..." }
  ],
  "carousel_slides": [
    { 
      "title": "...", 
      "body": "...", 
      "image_search_query": "hijab woman healthy lifestyle" 
    }
  ],
  "caption_v1": "...",
  "caption_v2": "Caption Edukasi/Tips (Faktual, bermanfaat, inclusive tone 'Kita')",
  "hashtag": "#BritishPropolis #SehatBarengKita #TipsKesehatan #PeluangBisnis",
  "waktu_posting": "Waktu terbaik posting hari ini",
  "rekomendasi_visual": "Saran visual/video background",
  "post_format": "feed|carousel|story|reels",
  "canva_template_type": "lifestyle|infographic|aspirational|product",
  "visual_theme": {
    "primary": "#hex (Warna Latar)",
    "accent": "#hex (Warna Tombol/Highlight)",
    "text": "#hex (Warna Tulisan Utama)",
    "decoration": "gold-glitter (BP) | violet-mist (BRASSIC) | soft-glow (BELGIE)"
  }
}

PANDUAN WARNA BRAND (DETIL):
1. BP REGULAR (Red/Amber): Primary #0A0F0D (Black), Accent #F59E0B (Gold), Text #FFFFFF.
2. BP GREEN (Kids): Primary #064E3B (Emerald), Accent #10B981 (Green), Text #FFFFFF.
3. BP BLUE / NORWAY (Women/Brain): Primary #0C4A6E (Navy), Accent #0EA5E9 (Sky), Text #FFFFFF.
4. BELGIE (Skincare): Primary #991B1B (Deep Red), Accent #EF4444 (Ruby), Text #FFFFFF. (Bisa juga mode White/Champagne jika diinginkan).
5. BRASSIC PRO (Joints): Primary #451A03 (Brown), Accent #D97706 (Amber), Text #FFFFFF.
6. BRASSIC EYE (Vision): Primary #4C1D95 (Violet), Accent #8B5CF6 (Purple), Text #FFFFFF.
7. STEFFI PRO (Sweetener): Primary #065F46 (Teal), Accent #34D399 (Mint), Text #FFFFFF.
8. DEFAULT: Gunakan skema BP REGULAR.
`;

/**
 * 🚀 HELPER: Generate content with automatic retries and model fallback
 */
export async function generateWithFallback(prompt: string, retryCount = 0): Promise<any> {
  let lastError: any = null;
  
  for (const modelName of MODELS) {
    try {
      const isLegacy = modelName === 'gemini-pro';
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        ...(isLegacy ? {} : { systemInstruction: SYSTEM_PROMPT }),
      });

      const finalPrompt = isLegacy 
        ? `${SYSTEM_PROMPT}\n\nUSER INPUT:\n${prompt}`
        : prompt;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      return result;
    } catch (error: any) {
      lastError = error;
      
      // 404: Skip model permanently for this session
      if (error.status === 404) {
        console.warn(`⚠️ Model ${modelName} NOT FOUND (404). Skipping...`);
        continue;
      }
      
      // 429: Quota Exceeded - WAIT then try next or retry
      if (error.status === 429 || error.status === 503) {
        console.warn(`⚠️ Model ${modelName} BUSY/LIMIT (Status: ${error.status}). Waiting 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      throw error;
    }
  }

  // NUCLEAR FALLBACK: If Gemini fails, try Claude if key is present
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('☢️ All Gemini models failed. Attempting Claude fallback...');
    // Logika pemanggilan Claude bisa ditambahkan di sini jika SDK terpasang
    // Untuk saat ini, kita tetap lempar error agar user tahu kuota habis
  }

  throw lastError;
}

export default genAI;
