// ⚠️ Supabase diimport secara DINAMIS di dalam fungsi agar tidak crash di Cloudflare edge runtime

/**
 * Lazy Supabase Initializer — dynamic import, edge-safe
 */
let _supabaseCache: any | null = null;
const getSupabase = async () => {
  if (_supabaseCache) return _supabaseCache;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    throw new Error('Supabase configuration missing');
  }

  const { createClient } = await import('@supabase/supabase-js');
  _supabaseCache = createClient(url, key);
  return _supabaseCache;
};

const PANORAMA_URL = "https://images.unsplash.com/photo-1543429302-3c82d41fa6e9?q=80&w=3500&auto=format&fit=crop";

export type HandlePosition =
  | 'top-left' | 'top-right'
  | 'bottom-left' | 'bottom-right'
  | 'none';

export type CounterFormat =
  | 'numeric'    // 01 / 06
  | 'written'    // 1 of 6
  | 'dots'       // ● ● ○ ○ ○ ○
  | 'none';

export type CounterPosition =
  | 'top-left' | 'top-right'
  | 'bottom-left' | 'bottom-right';

export interface CarouselBrandingSettings {
  handle: string;
  handlePosition: HandlePosition;
  counterFormat: CounterFormat;
  counterPosition: CounterPosition;
}

export const DEFAULT_BRANDING: CarouselBrandingSettings = {
  handle: '@username',
  handlePosition: 'top-right',
  counterFormat: 'numeric',
  counterPosition: 'bottom-right',
};

function positionStyle(pos: HandlePosition | CounterPosition): string {
  const map: Record<string, string> = {
    'top-left':     'top: 60px; left: 80px;',
    'top-right':    'top: 60px; right: 80px;',
    'bottom-left':  'bottom: 60px; left: 80px;',
    'bottom-right': 'bottom: 60px; right: 80px;',
  };
  return map[pos] || map['top-right'];
}

function renderHandleHtml(settings: CarouselBrandingSettings, textColor: string): string {
  if (settings.handlePosition === 'none' || !settings.handle) return '';
  return `<div style="position:absolute;${positionStyle(settings.handlePosition)}font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;opacity:0.5;color:${textColor};z-index:20;">${settings.handle}</div>`;
}

function renderCounterHtml(
  index: number,
  total: number,
  settings: CarouselBrandingSettings,
  textColor: string,
  accentColor: string
): string {
  if (settings.counterFormat === 'none') return '';

  let inner = '';
  if (settings.counterFormat === 'numeric') {
    inner = `<span style="font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:0.25em;color:${textColor};opacity:0.4;">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>`;
  } else if (settings.counterFormat === 'written') {
    inner = `<span style="font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:0.15em;color:${textColor};opacity:0.4;">${index + 1} of ${total}</span>`;
  } else if (settings.counterFormat === 'dots') {
    const items = Array.from({ length: total }).map((_, i) => {
      const isActive = i === index;
      return isActive
        ? `<span style="display:inline-block;width:18px;height:2px;background:${accentColor};border-radius:2px;vertical-align:middle;margin:0 2px;opacity:0.9;"></span>`
        : `<span style="display:inline-block;width:5px;height:5px;background:${textColor};border-radius:50%;vertical-align:middle;margin:0 2px;opacity:0.2;"></span>`;
    });
    inner = items.join('');
  }

  return `<div style="position:absolute;${positionStyle(settings.counterPosition)}z-index:20;display:flex;align-items:center;">${inner}</div>`;
}

export interface VisualTheme {
  primary: string;
  accent: string;
  text: string;
  decoration: string;
}

export type LayoutType =
  | 'HERO_TYPOGRAPHIC'
  | 'SPLIT_IMAGE_TEXT'
  | 'FULL_BLEED_IMAGE'
  | 'MINIMAL_QUOTE'
  | 'MAGAZINE_EDITORIAL'
  | 'STAT_HIGHLIGHT';

export type MoodType = 'PREMIUM_DARK' | 'LIGHT_AIRY' | 'ACCENT_DOMINANT';

export interface SlideDesign {
  layout: LayoutType;
  mood: MoodType;
  emphasis_word?: string;
  decoration?: string;
  stat_value?: string | null;
}

const VALID_LAYOUTS: LayoutType[] = [
  'HERO_TYPOGRAPHIC', 'SPLIT_IMAGE_TEXT', 'FULL_BLEED_IMAGE',
  'MINIMAL_QUOTE', 'MAGAZINE_EDITORIAL', 'STAT_HIGHLIGHT',
];
const VALID_MOODS: MoodType[] = ['PREMIUM_DARK', 'LIGHT_AIRY', 'ACCENT_DOMINANT'];

const normalizeDesign = (design: any): SlideDesign => ({
  layout: VALID_LAYOUTS.includes(design?.layout) ? design.layout : 'SPLIT_IMAGE_TEXT',
  mood: VALID_MOODS.includes(design?.mood) ? design.mood : 'PREMIUM_DARK',
  emphasis_word: design?.emphasis_word || '',
  decoration: design?.decoration || '',
  stat_value: design?.stat_value || null,
});

function resolveThemeByMood(baseTheme: VisualTheme, mood: MoodType): VisualTheme {
  switch (mood) {
    case 'LIGHT_AIRY':
      return { primary: '#FAF9F6', accent: baseTheme.accent, text: '#1C1C1E', decoration: 'soft-glow' };
    case 'ACCENT_DOMINANT':
      return { primary: baseTheme.accent, accent: '#FFFFFF', text: '#FFFFFF', decoration: baseTheme.decoration };
    case 'PREMIUM_DARK':
    default:
      return baseTheme;
  }
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
    if (data.photos && data.photos.length > 0) {
      const url = data.photos[0].src.large2x;
      console.log(`✅ Pexels Found for "${finalQuery}": ${url}`);
      return url;
    }
    console.warn(`⚠️ Pexels: No photos found for "${finalQuery}"`);
  } catch (error) { console.error("❌ Pexels Failed", error); }
  return null;
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,700;1,700&display=swap');`;

const baseStyles = (theme: VisualTheme) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; width: 1080px; height: 1080px; font-family: 'DM Sans', sans-serif; overflow: hidden; background: ${theme.primary}; color: ${theme.text}; }
`;

function highlightTitle(title: string, emphasisWord: string, accentColor: string): string {
  if (!emphasisWord || !title.includes(emphasisWord)) return title;
  return title.replace(emphasisWord, `<span style="color:${accentColor};font-style:italic">${emphasisWord}</span>`);
}

function renderHeroTypographic(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  _imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const titled = highlightTitle(slide.title, design.emphasis_word || '', theme.accent);
  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
    .decoration { font-size: 12px; letter-spacing: 0.35em; opacity: 0.45; margin-bottom: 40px; text-transform: uppercase; color: ${theme.accent}; }
    .hero-title { font-family: 'Playfair Display', serif; font-size: 128px; line-height: 0.95; font-weight: 700; letter-spacing: -0.03em; max-width: 900px; }
    .body-text { font-size: 28px; margin-top: 40px; opacity: 0.7; max-width: 680px; line-height: 1.5; }
    .accent-line { width: 60px; height: 3px; background: ${theme.accent}; margin-bottom: 48px; }
  </style></head><body>
    <div class="slide">
      <div class="accent-line"></div>
      ${design.decoration ? `<div class="decoration">${design.decoration}</div>` : ''}
      <div class="hero-title">${titled}</div>
      <div class="body-text">${slide.body}</div>
      ${renderHandleHtml(branding, theme.text)}
      ${renderCounterHtml(index, total, branding, theme.text, theme.accent)}
    </div>
  </body></html>`;
}

function renderSplitImageText(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const isAlt = index % 2 === 1;
  const titled = highlightTitle(slide.title, design.emphasis_word || '', theme.accent);
  const isLight = theme.text === '#1C1C1E';
  const vignette = isLight
    ? `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary}f0 35%, ${theme.primary}00 100%)`
    : `linear-gradient(to right, rgba(10,15,13,0.95) 0%, rgba(10,15,13,0.8) 45%, rgba(10,15,13,0) 100%)`;

  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; display: flex; flex-direction: ${isAlt ? 'row-reverse' : 'row'}; }
    .img-section { width: 540px; height: 100%; overflow: hidden; flex-shrink: 0; }
    .img-section img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.88); }
    .content { flex: 1; height: 100%; position: relative; display: flex; flex-direction: column; justify-content: center; padding: 80px; z-index: 10; text-align: ${isAlt ? 'right' : 'left'}; }
    .vignette { position: absolute; inset: 0; background: ${vignette}; transform: ${isAlt ? 'scaleX(-1)' : 'none'}; z-index: -1; }
    h1 { font-family: 'Playfair Display', serif; font-size: 80px; font-weight: 700; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 28px; }
    p { font-size: 32px; line-height: 1.55; opacity: 0.8; max-width: 580px; ${isAlt ? 'margin-left: auto;' : ''} }
    .decoration { font-size: 11px; letter-spacing: 0.35em; opacity: 0.45; margin-bottom: 20px; text-transform: uppercase; color: ${theme.accent}; }
  </style></head><body>
    <div class="slide">
      ${imageUrl ? `<div class="img-section"><img src="${imageUrl}"></div>` : ''}
      <div class="content">
        <div class="vignette"></div>
        ${design.decoration ? `<div class="decoration">${design.decoration}</div>` : ''}
        <h1>${titled}</h1>
        <p>${slide.body}</p>
      </div>
      ${renderHandleHtml(branding, theme.text)}
      ${renderCounterHtml(index, total, branding, theme.text, theme.accent)}
    </div>
  </body></html>`;
}

function renderFullBleedImage(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const titled = highlightTitle(slide.title, design.emphasis_word || '', theme.accent);
  const bg = imageUrl ? `url('${imageUrl}') center/cover no-repeat` : theme.primary;
  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; background: ${bg}; }
    .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%); }
    .content { position: absolute; bottom: 80px; left: 80px; right: 80px; z-index: 10; color: #fff; }
    .decoration { font-size: 11px; letter-spacing: 0.4em; opacity: 0.55; margin-bottom: 24px; text-transform: uppercase; color: ${theme.accent}; }
    h1 { font-family: 'Playfair Display', serif; font-size: 88px; line-height: 1.0; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 24px; }
    p { font-size: 28px; opacity: 0.85; line-height: 1.5; max-width: 800px; }
  </style></head><body>
    <div class="slide">
      <div class="overlay"></div>
      ${renderHandleHtml(branding, '#FFFFFF')}
      ${renderCounterHtml(index, total, branding, '#FFFFFF', theme.accent)}
      <div class="content">
        ${design.decoration ? `<div class="decoration">${design.decoration}</div>` : ''}
        <h1>${titled}</h1>
        <p>${slide.body}</p>
      </div>
    </div>
  </body></html>`;
}

function renderMinimalQuote(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  _imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const titled = highlightTitle(slide.title, design.emphasis_word || '', theme.accent);
  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px; text-align: center; }
    .decoration { font-size: 11px; letter-spacing: 0.4em; opacity: 0.4; margin-bottom: 60px; text-transform: uppercase; color: ${theme.accent}; }
    h1 { font-family: 'Playfair Display', serif; font-size: 72px; font-weight: 500; line-height: 1.15; max-width: 780px; letter-spacing: -0.02em; }
    .divider { width: 40px; height: 2px; background: ${theme.accent}; margin: 40px auto; }
    p { font-size: 26px; opacity: 0.7; max-width: 620px; line-height: 1.55; }
  </style></head><body>
    <div class="slide">
      ${design.decoration ? `<div class="decoration">${design.decoration}</div>` : ''}
      <h1>${titled}</h1>
      <div class="divider"></div>
      <p>${slide.body}</p>
      ${renderHandleHtml(branding, theme.text)}
      ${renderCounterHtml(index, total, branding, theme.text, theme.accent)}
    </div>
  </body></html>`;
}

function renderMagazineEditorial(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const titled = highlightTitle(slide.title, design.emphasis_word || '', theme.accent);
  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; padding: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .left { padding-top: 40px; }
    .subhead { font-size: 13px; letter-spacing: 0.3em; margin-bottom: 24px; color: ${theme.accent}; text-transform: uppercase; }
    .pull-quote { font-family: 'Playfair Display', serif; font-size: 62px; font-style: italic; line-height: 1.1; border-left: 4px solid ${theme.accent}; padding-left: 28px; }
    .right { font-size: 26px; line-height: 1.7; opacity: 0.85; }
    .img-block { width: 100%; height: 260px; object-fit: cover; border-radius: 4px; margin-bottom: 28px; filter: brightness(0.88); }
  </style></head><body>
    <div class="slide">
      <div class="left">
        ${design.decoration ? `<div class="subhead">${design.decoration}</div>` : ''}
        <div class="pull-quote">${titled}</div>
      </div>
      <div class="right">
        ${imageUrl ? `<img class="img-block" src="${imageUrl}">` : ''}
        ${slide.body}
      </div>
      ${renderHandleHtml(branding, theme.text)}
      ${renderCounterHtml(index, total, branding, theme.text, theme.accent)}
    </div>
  </body></html>`;
}

function renderStatHighlight(
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  _imageUrl: string | null,
  branding: CarouselBrandingSettings
): string {
  const statVal = design.stat_value || '';
  const statFontSize = statVal.length <= 3 ? '320px' : statVal.length <= 5 ? '240px' : '180px';
  return `<!DOCTYPE html><html><head><style>${FONT_IMPORT}${baseStyles(theme)}
    .slide { width: 1080px; height: 1080px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px; text-align: center; }
    .decoration { font-size: 12px; letter-spacing: 0.4em; margin-bottom: 32px; opacity: 0.55; text-transform: uppercase; color: ${theme.accent}; }
    .stat-value { font-family: 'Playfair Display', serif; font-size: ${statFontSize}; line-height: 0.85; font-weight: 700; color: ${theme.accent}; letter-spacing: -0.04em; }
    .stat-label { font-size: 34px; margin-top: 40px; font-weight: 700; letter-spacing: -0.01em; }
    .body { font-size: 22px; opacity: 0.7; margin-top: 20px; max-width: 680px; line-height: 1.55; }
  </style></head><body>
    <div class="slide">
      ${design.decoration ? `<div class="decoration">${design.decoration}</div>` : ''}
      ${statVal ? `<div class="stat-value">${statVal}</div>` : ''}
      <div class="stat-label">${slide.title}</div>
      <div class="body">${slide.body}</div>
      ${renderHandleHtml(branding, theme.text)}
      ${renderCounterHtml(index, total, branding, theme.text, theme.accent)}
    </div>
  </body></html>`;
}

type LayoutRenderer = (
  slide: { title: string; body: string },
  theme: VisualTheme,
  design: SlideDesign,
  index: number,
  total: number,
  imageUrl: string | null,
  branding: CarouselBrandingSettings
) => string;

const layoutRenderers: Record<LayoutType, LayoutRenderer> = {
  HERO_TYPOGRAPHIC: renderHeroTypographic,
  SPLIT_IMAGE_TEXT: renderSplitImageText,
  FULL_BLEED_IMAGE: renderFullBleedImage,
  MINIMAL_QUOTE: renderMinimalQuote,
  MAGAZINE_EDITORIAL: renderMagazineEditorial,
  STAT_HIGHLIGHT: renderStatHighlight,
};

/**
 * 🌐 REST: Cloud Run Screenshot Service (Edge Compatible)
 * Replaces Browserless — same request format, self-hosted on GCP.
 */
const generateViaBrowserlessRest = async (
  html: string
): Promise<Uint8Array> => {
  const serviceUrl = process.env.SCREENSHOT_SERVICE_URL;
  if (!serviceUrl) throw new Error('SCREENSHOT_SERVICE_URL not configured');

  const response = await fetch(`${serviceUrl}/screenshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      html,
      options: {
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 1080, height: 1080 }
      },
      viewport: { width: 1080, height: 1080 }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Screenshot service failed: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

/**
 * 🚀 ENGINE: Generate Images
 */
export const generateCarouselImages = async (
  slides: { title: string; body: string; image_search_query?: string; design?: any }[],
  theme?: VisualTheme,
  branding?: CarouselBrandingSettings
): Promise<string[]> => {
  const supabase = await getSupabase();
  const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'bp-images';
  const finalTheme: VisualTheme = theme || { primary: "#0A0F0D", accent: "#F59E0B", text: "#FFFFFF", decoration: "gold-glitter" };
  const finalBranding: CarouselBrandingSettings = branding || DEFAULT_BRANDING;

  const sessionId = crypto.randomUUID().slice(0, 8);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const folderPath = `production/carousel_${timestamp}_${sessionId}`;
  const publicUrls: string[] = [];

  console.log(`🎨 Branding Applied: ${finalTheme.decoration.toUpperCase()} | Handle: ${finalBranding.handle} | Uploading to ${folderPath}...`);

  if (!process.env.SCREENSHOT_SERVICE_URL) {
    throw new Error('SCREENSHOT_SERVICE_URL not configured');
  }

  const slideErrors: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    try {
      const slide = slides[i];
      const design = normalizeDesign(slide.design);
      const resolvedTheme = resolveThemeByMood(finalTheme, design.mood);

      const needsImage = ['SPLIT_IMAGE_TEXT', 'FULL_BLEED_IMAGE', 'MAGAZINE_EDITORIAL'].includes(design.layout);
      let imageUrl: string | null = null;
      if (needsImage && slide.image_search_query) {
        imageUrl = await fetchRepresentativeImage(slide.image_search_query);
      }

      const renderer = layoutRenderers[design.layout] || layoutRenderers['SPLIT_IMAGE_TEXT'];
      const html = renderer(slide, resolvedTheme, design, i, slides.length, imageUrl, finalBranding);

      console.log(`🌐 Rendering Slide ${i+1}/${slides.length} [${design.layout}/${design.mood}]...`);
      const buffer = await generateViaBrowserlessRest(html);

      const fullPath = `${folderPath}/slide_${i + 1}.png`;
      console.log(`📤 Uploading Slide ${i+1} to Supabase: ${fullPath}...`);

      const { error: uploadError } = await supabase.storage.from(supabaseBucket).upload(fullPath, buffer, { contentType: 'image/png', upsert: true });

      if (uploadError) {
        const msg = `Slide ${i+1} upload failed: ${uploadError.message}`;
        console.error(`❌ ${msg}`);
        slideErrors.push(msg);
        continue;
      }

      const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(fullPath);
      if (data?.publicUrl) {
        publicUrls.push(data.publicUrl);
        console.log(`✅ Slide ${i+1} Ready: ${data.publicUrl}`);
      }
    } catch (err: any) {
      const msg = `Slide ${i+1} failed: ${err?.message || String(err)}`;
      console.error(`❌ ${msg}`);
      slideErrors.push(msg);
    }
  }

  // If every slide failed, throw the collected errors so the caller surfaces them.
  if (publicUrls.length === 0 && slideErrors.length > 0) {
    throw new Error(slideErrors.join(' | '));
  }
  return publicUrls;
};
