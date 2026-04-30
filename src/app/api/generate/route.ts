export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, generateWithFallback } from '@/lib/gemini';
// ⚠️ carousel-engine TIDAK diimport di module level — diimport dinamis di dalam handler
// agar @supabase/supabase-js tidak crash Cloudflare Workers saat inisialisasi

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function POST(req: Request) {
  try {
    // ── 1. Validasi Environment ────────────────────────────────
    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (!hasGemini) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY tidak terpasang.' },
        { status: 500 }
      );
    }

    // ── 2. Parse Request ───────────────────────────────────────
    let body: any;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { prompt, brandingSettings } = body;
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    console.log('🏁 Generate:', prompt.slice(0, 60));

    // ── 3. AI Generation ───────────────────────────────────────
    let parsedData: any;
    try {
      const result = await generateWithFallback(prompt);
      parsedData = JSON.parse(result.response.text());
      console.log('✅ AI generation success');
    } catch (err: unknown) {
      const msg = errMsg(err);
      console.error('❌ Gemini failed:', msg);
      return NextResponse.json(
        { error: 'Gemini gagal generate konten.', providerErrors: [msg] },
        { status: 500 }
      );
    }

    if (!parsedData || typeof parsedData !== 'object') {
      return NextResponse.json({ error: 'AI mengembalikan data tidak valid.' }, { status: 500 });
    }

    // ── 4. Normalisasi Data ────────────────────────────────────
    const normalizedData = {
      tipe: parsedData.tipe || 'A',
      product_category: parsedData.product_category || 'DEFAULT',
      analysis: {
        pain_points: parsedData.analysis?.pain_points || '',
        psychological_motive: parsedData.analysis?.psychological_motive || '',
      },
      tiktok_scripts: (parsedData.tiktok_scripts || []).map((s: any) => ({
        title: s.title || 'Draft Script',
        script: s.script || '',
      })),
      carousel_slides: (parsedData.carousel_slides || []).map((s: any, idx: number) => ({
        title: s.title || `Slide ${idx + 1}`,
        body: s.body || '',
        image_search_query: s.image_search_query || 'nature minimalist',
        ...(s.design ? { design: s.design } : {}),
      })),
      caption_v1: parsedData.caption_v1 || '',
      caption_v2: parsedData.caption_v2 || '',
      hashtag: parsedData.hashtag || '',
      waktu_posting: parsedData.waktu_posting || '',
      rekomendasi_visual: parsedData.rekomendasi_visual || '',
      post_format: parsedData.post_format || 'feed',
      canva_template_type: parsedData.canva_template_type || 'lifestyle',
      visual_theme: parsedData.visual_theme || null,
    };

    // Fallback slides jika AI tidak menghasilkan array carousel
    if (normalizedData.carousel_slides.length === 0) {
      const sentences = (normalizedData.caption_v1 || '')
        .split(/[.!?]/)
        .filter((s: string) => s.trim().length > 10)
        .slice(0, 7);
      normalizedData.carousel_slides = sentences.map((s: string, i: number) => ({
        title: i === 0 ? 'Fakta Menarik' : 'Poin Penting',
        body: s.trim(),
        image_search_query: 'nature minimalist',
      }));
    }

    // ── 5. Generate Carousel Images (dinamis, tidak crash jika gagal) ──
    let imageUrls: string[] = [];
    let imageGenerationError: string | null = null;
    const imageDiagnostics = {
      hasScreenshotService: !!process.env.SCREENSHOT_SERVICE_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasPexels: !!process.env.PEXELS_API_KEY,
    };

    try {
      console.log('🎨 Starting carousel image generation...');
      const { generateCarouselImages } = await import('@/lib/carousel-engine');
      const result = await generateCarouselImages(
        normalizedData.carousel_slides,
        normalizedData.visual_theme,
        brandingSettings
      );
      if (Array.isArray(result)) {
        imageUrls = result;
        console.log(`✅ ${imageUrls.length} carousel images generated`);
      }
      if (imageUrls.length === 0) {
        const missing: string[] = [];
        if (!imageDiagnostics.hasScreenshotService) missing.push('SCREENSHOT_SERVICE_URL');
        if (!imageDiagnostics.hasSupabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!imageDiagnostics.hasSupabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY (atau ANON_KEY)');
        imageGenerationError = missing.length
          ? `Env vars hilang: ${missing.join(', ')}`
          : 'Carousel engine returned empty array — cek log Cloudflare untuk detail upload/render.';
      }
    } catch (imgErr) {
      const msg = errMsg(imgErr);
      console.error('⚠️ Carousel image generation failed (non-fatal):', msg);
      imageGenerationError = msg;
    }

    return NextResponse.json({
      ...normalizedData,
      generated_images: imageUrls,
      image_generation_error: imageGenerationError,
      image_diagnostics: imageDiagnostics,
    });

  } catch (error: unknown) {
    const msg = errMsg(error);
    console.error('❌ Route error:', msg);
    return NextResponse.json(
      {
        error: msg,
        diagnostics: {
          hasGemini: !!process.env.GEMINI_API_KEY,
          hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
      },
      { status: 500 }
    );
  }
}
