import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Lazy Supabase Initializer
 */
let _supabaseCache: SupabaseClient | null = null;
const getSupabase = () => {
  if (_supabaseCache) return _supabaseCache;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) throw new Error('❌ Supabase Env Missing.');
  _supabaseCache = createClient(url, key);
  return _supabaseCache;
};

const SOCIAL_HANDLE = "@mbaktila";
const PANORAMA_URL = "https://images.unsplash.com/photo-1543429302-3c82d41fa6e9?q=80&w=3500&auto=format&fit=crop";

export interface VisualTheme {
  primary: string;
  accent: string;
  text: string;
  decoration: string;
}

/**
 * 🛠️ UTILITY: Split text into slides (MANDATORY EXPORT)
 */
export const splitTextToSlides = (text: string): { title: string; body: string }[] => {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return [{ title: "Tips Hari Ini", body: text }];

  return sentences.slice(0, 6).map((sentence, idx) => ({
    title: idx === 0 ? "Fakta Menarik" : "Poin Penting",
    body: sentence.trim()
  }));
};

/**
 * 🖼️ FETCH: Stock Images
 */
export const fetchRepresentativeImage = async (query: string): Promise<string | null> => {
  const apiKey = process.env.PEXELS_API_KEY || "";
  let finalQuery = query.toLowerCase();
  const humanKeywords = ['woman', 'person', 'people', 'girl', 'lady', 'man', 'boy', 'model'];
  if (humanKeywords.some(k => finalQuery.includes(k)) && !finalQuery.includes('hijab') && !finalQuery.includes('muslim')) {
    finalQuery += " hijab modest muslim";
  }
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(finalQuery)}&per_page=1`, { headers: { Authorization: apiKey } });
    const data = await response.json();
    if (data.photos && data.photos.length > 0) return data.photos[0].src.large2x;
  } catch (error) { console.error("❌ Pexels Failed", error); }
  return null;
};

/**
 * 🏗️ TEMPLATE: HTML for Carousel
 */
const getHtmlTemplate = (
  title: string,
  body: string,
  index: number,
  totalSlides: number,
  stockImageUrl: string | null,
  theme: VisualTheme
) => {
  const hasImage = !!stockImageUrl;
  const bgOffsetX = - (index * 1080);
  const isLightMode = theme.primary.toLowerCase() === '#fff5f7' || theme.text === '#2d3748';
  const panoramaBrightness = isLightMode ? '1.5' : '0.65';
  const glassBg = isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)';
  const glassBorder = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.12)';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
    body {
      margin: 0; padding: 0;
      width: 1080px; height: 1080px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: hidden;
      background: ${theme.primary};
      display: flex;
      flex-direction: row;
      color: ${theme.text};
    }
    .image-section {
      display: ${hasImage ? 'block' : 'none'};
      width: 540px; height: 100%; position: relative; overflow: hidden; background: #111;
    }
    .image-section img { width: 100%; height: 100%; object-fit: cover; }
    .text-section {
      flex: 1; height: 100%; position: relative; display: flex; flex-direction: column;
      justify-content: center; align-items: center; padding: ${hasImage ? '0 60px' : '0 120px'};
      box-sizing: border-box; z-index: 10; text-align: center;
    }
    .panorama-bg {
      position: absolute; top: 0; left: 0; width: ${totalSlides * 1080}px; height: 1080px;
      background-image: url('${PANORAMA_URL}'); background-size: cover;
      transform: translateX(${bgOffsetX}px); filter: brightness(${panoramaBrightness}) saturate(0.5); z-index: -1;
      opacity: ${isLightMode ? '0.2' : '0.6'};
    }
    .glass-box {
      width: 100%; max-width: ${hasImage ? '480px' : '840px'};
      background: ${glassBg}; backdrop-filter: blur(35px);
      padding: 60px; border-radius: 50px; border: 1px solid ${glassBorder};
      box-shadow: 0 40px 100px rgba(0,0,0,${isLightMode ? '0.05' : '0.4'});
    }
    .index-badge {
      font-size: ${hasImage ? '100px' : '140px'}; font-weight: 800; color: transparent;
      -webkit-text-stroke: 1px ${theme.accent}; margin-bottom: -20px; display: block; line-height: 1;
      opacity: 0.4;
    }
    h1 { font-size: ${hasImage ? '56px' : '72px'}; font-weight: 800; line-height: 1.1; margin: 0 0 24px 0; text-wrap: balance; }
    p { font-size: ${hasImage ? '28px' : '36px'}; line-height: 1.6; font-weight: 500; opacity: 0.85; margin: 0; text-wrap: balance; }
    .footer {
      position: absolute; bottom: 80px; left: 0; width: 100%;
      display: flex; justify-content: center; align-items: center;
      color: ${theme.accent}; font-weight: 800; font-size: 24px; opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="image-section">${stockImageUrl ? `<img src="${stockImageUrl}">` : ''}</div>
  <div class="text-section">
    <div class="panorama-bg"></div>
    <div class="glass-box">
      <span class="index-badge">${index + 1}</span>
      <h1>${title}</h1>
      <p>${body}</p>
    </div>
    <div class="footer"><span>${SOCIAL_HANDLE}</span></div>
  </div>
</body>
</html>
`;
};

/**
 * 🚀 ENGINE: Generate Images
 */
export const generateCarouselImages = async (
  slides: { title: string; body: string; image_search_query?: string }[],
  theme?: VisualTheme
): Promise<string[]> => {
  const supabase = getSupabase();
  const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'bp-images';
  const finalTheme: VisualTheme = theme || { primary: "#0A0F0D", accent: "#F59E0B", text: "#FFFFFF", decoration: "gold-glitter" };

  const sessionId = uuidv4().slice(0, 8);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const folderPath = `production/carousel_${timestamp}_${sessionId}`;
  const publicUrls: string[] = [];

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  let representativeImageUrl = slides[0]?.image_search_query ? await fetchRepresentativeImage(slides[0].image_search_query) : null;
  console.log(`🎨 Branding Applied: ${finalTheme.decoration.toUpperCase()} | Uploading to ${folderPath}...`);

  for (let i = 0; i < slides.length; i++) {
    const imageUrl = (i === 0) ? representativeImageUrl : null;
    const html = getHtmlTemplate(slides[i].title, slides[i].body, i, slides.length, imageUrl, finalTheme);
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');
    const buffer = await page.screenshot({ type: 'png' });
    const fullPath = `${folderPath}/slide_${i + 1}.png`;
    const { error: uploadError } = await supabase.storage.from(supabaseBucket).upload(fullPath, buffer, { contentType: 'image/png', upsert: true });
    if (uploadError) { console.error(`❌ Upload failed:`, uploadError); continue; }
    const { data: { publicUrl } } = supabase.storage.from(supabaseBucket).getPublicUrl(fullPath);
    publicUrls.push(publicUrl);
  }

  await browser.close();
  return publicUrls;
};
