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
  const humanKeywords = ['woman', 'person', 'people', 'girl', 'lady', 'man', 'boy', 'model', 'human', 'patient'];
  if (humanKeywords.some(k => finalQuery.includes(k))) {
    if (!finalQuery.includes('hijab') && !finalQuery.includes('muslim') && !finalQuery.includes('man') && !finalQuery.includes('boy')) {
      finalQuery += " hijab muslim modest";
    }
  } else {
    // Jika query tidak spesifik tapi berpotensi memunculkan orang (misal: 'sick', 'tired')
    const vibeKeywords = ['sick', 'tired', 'happy', 'sad', 'healthy', 'business', 'success'];
    if (vibeKeywords.some(k => finalQuery.includes(k)) && !finalQuery.includes('hijab') && !finalQuery.includes('muslim')) {
      finalQuery += " hijab muslim";
    }
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
  const isAlt = index % 2 === 1; // Alternating layout
  const bgOffsetX = - (index * 1080);
  const isLightMode = theme.primary.toLowerCase() === '#fff5f7' || theme.primary.toLowerCase() === '#ffffff' || theme.text === '#2d3748';
  
  const accentColor = '#00A896'; // Dashboard Teal
  const labelColor = isLightMode ? '#1C1C1E' : '#FFFFFF';
  const bgColor = isLightMode ? '#FAF9F6' : theme.primary; // Soft off-white for light mode
  
  const vignette = isLightMode 
    ? `linear-gradient(to right, ${bgColor} 0%, ${bgColor}f2 30%, ${bgColor}00 100%)`
    : `linear-gradient(to right, rgba(28,28,30,0.95) 0%, rgba(28,28,30,0.85) 50%, rgba(28,28,30,0) 100%)`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
    
    body {
      margin: 0; padding: 0;
      width: 1080px; height: 1080px;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
      background: ${bgColor};
      color: ${theme.text};
      display: flex;
    }

    .paper-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');
      opacity: ${isLightMode ? '0.2' : '0.05'};
      pointer-events: none; z-index: 50;
    }

    .slide-container {
      position: relative;
      width: 1080px; height: 1080px;
      display: flex;
      flex-direction: ${isAlt ? 'row-reverse' : 'row'};
    }

    .image-section {
      display: ${hasImage ? 'block' : 'none'};
      width: 540px; height: 100%; position: relative; overflow: hidden;
    }
    .image-section img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); }
    
    .content-section {
      flex: 1; height: 100%; position: relative;
      display: flex; flex-direction: column; justify-content: center;
      padding: 80px; box-sizing: border-box; z-index: 10;
      text-align: ${isAlt ? 'right' : 'left'};
    }

    .vignette-overlay {
      position: absolute; top: 0; ${isAlt ? 'right' : 'left'}: 0;
      width: 100%; height: 100%;
      background: ${vignette};
      transform: ${isAlt ? 'scaleX(-1)' : 'none'};
      z-index: -1;
    }

    .panoramic-texture {
      position: absolute; top: 0; left: 0; width: ${totalSlides * 1080}px; height: 1080px;
      background-image: url('${PANORAMA_URL}'); background-size: cover;
      transform: translateX(${bgOffsetX}px);
      filter: grayscale(1) opacity(0.15); z-index: -2;
    }

    .index-badge {
      position: absolute; bottom: 80px; right: 80px;
      font-size: 14px; font-weight: 700; text-transform: uppercase; tracking: 0.3em;
      color: ${labelColor}; display: flex; align-items: center; gap: 12px;
      opacity: 0.4;
    }
    .index-badge::before {
      content: ""; width: 25px; height: 1px; background: ${accentColor}; opacity: ${isLightMode ? '0.2' : '0.4'};
      order: 1;
    }

    .footer {
      position: absolute; top: 80px; right: 80px;
      display: flex; align-items: center; gap: 8px;
      color: ${labelColor}; font-weight: 700; font-size: 14px; 
      text-transform: uppercase; tracking: 0.3em; opacity: 0.6;
    }

    h1 { 
      font-family: 'Playfair Display', serif;
      font-size: 84px; font-weight: 700; line-height: 1.0; margin: 0 0 28px 0; 
      color: ${theme.text}; text-wrap: balance;
      letter-spacing: -0.02em;
    }
    h1 span { color: ${accentColor}; font-style: italic; font-weight: 500; }

    p { 
      font-size: 34px; line-height: 1.55; font-weight: 400; 
      color: ${theme.text}; opacity: 0.8; margin: 0; text-wrap: balance; 
      max-width: 620px;
      ${isAlt ? 'margin-left: auto;' : ''}
      letter-spacing: -0.01em;
    }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="paper-overlay"></div>
    <div class="image-section">${stockImageUrl ? `<img src="${stockImageUrl}">` : ''}</div>
    <div class="content-section">
      <div class="vignette-overlay"></div>
      <div class="panoramic-texture"></div>
      
      <div class="index-badge">
        ${(index + 1).toString().padStart(2, '0')} 
        <span style="opacity: 0.4; margin: 0 4px;">/</span> 
        ${totalSlides.toString().padStart(2, '0')}
      </div>
      
      <h1>${title.replace(/(.*)/, '$1')}</h1>
      <p>${body}</p>
      
      <div class="footer">${SOCIAL_HANDLE}</div>
    </div>
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

  let browser;

  // 🛡️ ISOMORPHIC BROWSER BRIDGE
  try {
    const puppeteer = await import('puppeteer').then(m => m.default || m);
    
    // 🌐 Option A: Remote Browser (Cloudflare compatible)
    if (process.env.BROWSERLESS_TOKEN) {
      console.log('🌐 Connecting to Remote Browser (Browserless)...');
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      });
    } 
    // 💻 Option B: Local Browser (Local Dev or Docker)
    else {
      console.log('💻 Launching Puppeteer...');
      const launchOptions: any = { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      };
      
      // Jika di Docker (Koyeb), gunakan path executable yang sudah disiapkan
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        console.log(`🐳 Using Docker Chrome path: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }

      browser = await puppeteer.launch(launchOptions);
    } 
  } catch (error) {
    console.warn('❌ Failed to initialize browser:', error);
    return []; // Return early without crashing
  }
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
