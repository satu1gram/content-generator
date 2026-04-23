export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, generateWithFallback } from '@/lib/gemini';
import { generateWithGroq } from '@/lib/groq';
import { generateWithDeepSeek } from '@/lib/deepseek';
import { generateCarouselImages, splitTextToSlides, CarouselBrandingSettings } from '@/lib/carousel-engine';

export async function POST(req: Request) {
  try {
    // 1. Environmental Validation
    const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const hasGemini   = !!process.env.GEMINI_API_KEY;
    const hasGroq     = !!process.env.GROQ_API_KEY;
    const isEdge      = process.env.NEXT_RUNTIME === 'edge';

    if (!hasDeepSeek && !hasGemini && !hasGroq) {
      console.error('❌ Missing API Credentials. Runtime:', isEdge ? 'Edge' : 'Node');
      return NextResponse.json(
        {
          error: 'AI_CONFIGURATION_MISSING',
          message: 'Peringatan: Tidak ada API Key AI yang terpasang (DeepSeek / Gemini / Groq).',
          required_vars: ['DEEPSEEK_API_KEY', 'GEMINI_API_KEY', 'GROQ_API_KEY'],
          runtime: isEdge ? 'edge' : 'node'
        },
        { status: 500 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      console.error('❌ Request Body Parse Failed');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { prompt, brandingSettings } = body;
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('🏁 Starting Generation for prompt:', prompt.slice(0, 50) + '...');

    // 2. Resilient Generation Chain: DeepSeek → Gemini → Groq
    let parsedData: any = null;

    const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

    // ── Primary: DeepSeek ──────────────────────────────────────
    if (!parsedData && hasDeepSeek) {
      try {
        console.log('🤖 Attempting DeepSeek Generation...');
        parsedData = await generateWithDeepSeek(prompt, SYSTEM_PROMPT);
        console.log('✅ DeepSeek: Success');
      } catch (err) {
        console.warn('⚠️ DeepSeek Failed:', errMsg(err));
      }
    }

    // ── Secondary: Gemini ──────────────────────────────────────
    if (!parsedData && hasGemini) {
      try {
        console.log('💎 Attempting Gemini Generation...');
        const result = await generateWithFallback(prompt);
        const content = result.response.text();
        if (content) parsedData = JSON.parse(content);
        console.log('✅ Gemini: Success');
      } catch (err) {
        console.warn('⚠️ Gemini Failed:', errMsg(err));
      }
    }

    // ── Tertiary: Groq ─────────────────────────────────────────
    if (!parsedData && hasGroq) {
      try {
        console.log('⚡ Attempting Groq Generation (Llama 3)...');
        parsedData = await generateWithGroq(prompt, SYSTEM_PROMPT);
        console.log('✅ Groq: Success');
      } catch (err) {
        console.error('❌ Groq Failed:', errMsg(err));
      }
    }

    if (!parsedData) {
      console.error('❌ Stage AI: No data returned from any provider');
      throw new Error('Semua provider AI gagal menghasilkan konten. Cek API keys dan quota.');
    }
    
    console.log('✅ Stage AI: Content Generated Successfully');
    
    // 4. Robust Data Normalization
    try {
      
      // Normalize data to ensure it matches the expected interface
      const normalizedData = {
        tipe: parsedData.tipe || 'A',
        product_category: parsedData.product_category || 'DEFAULT',
        analysis: {
          pain_points: parsedData.analysis?.pain_points || '',
          psychological_motive: parsedData.analysis?.psychological_motive || ''
        },
        tiktok_scripts: (parsedData.tiktok_scripts || []).map((s: any) => ({
          title: s.title || 'Draft Script',
          script: s.script || ''
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
        image_prompt: {
          en: parsedData.image_prompt?.en || parsedData.image_prompt || '',
          style_notes: parsedData.image_prompt?.style_notes || '',
          negative_prompt: parsedData.image_prompt?.negative_prompt || 'text, watermark, logo, blurry'
        },
        canva_template_type: parsedData.canva_template_type || 'lifestyle',
        visual_theme: parsedData.visual_theme
      };

      // Fallback slides if Gemini failed to provide array
      if (normalizedData.carousel_slides.length === 0) {
        normalizedData.carousel_slides = splitTextToSlides(normalizedData.caption_v1).map((s, i) => ({
          ...s,
          image_search_query: 'nature minimalist'
        }));
      }

      // 4. Generate Carousel Images & Upload
      let imageUrls: string[] = [];
      try {
        console.log('🎨 Stage Images: Starting Visual Generation...');
        const result = await generateCarouselImages(
          normalizedData.carousel_slides,
          normalizedData.visual_theme,
          brandingSettings as CarouselBrandingSettings | undefined
        );
        if (Array.isArray(result)) {
          imageUrls = result;
          console.log(`✅ Stage Images: Generated ${imageUrls.length} assets`);
        }
      } catch (carouselError) {
        console.error('❌ Stage Images Failed:', carouselError);
      }

      return NextResponse.json({
        ...normalizedData,
        generated_images: imageUrls
      });
    } catch (parseError: any) {
      console.error('Failed to normalize AI response:', parseError.message);
      return NextResponse.json(
        { error: 'Failed to normalize AI response', details: parseError instanceof Error ? parseError.message : String(parseError) },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const isEdge = process.env.NEXT_RUNTIME === 'edge';
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error('API Error Stage:', errMsg);
    return NextResponse.json(
      {
        error: errMsg,
        stage: 'overall_process',
        runtime: isEdge ? 'edge' : 'node',
        env: process.env.NODE_ENV,
        diagnostics: {
          hasDeepSeek: !!process.env.DEEPSEEK_API_KEY,
          hasGemini: !!process.env.GEMINI_API_KEY,
          hasGroq: !!process.env.GROQ_API_KEY,
          hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
        stack: process.env.NODE_ENV === 'development' ? errStack : undefined
      },
      { status: 500 }
    );
  }
}
