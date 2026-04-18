export const runtime = 'edge';
import { NextResponse } from 'next/server';
import genAI, { SYSTEM_PROMPT, MODELS, generateWithFallback } from '@/lib/gemini';
import { generateCarouselImages, splitTextToSlides } from '@/lib/carousel-engine';

export async function POST(req: Request) {
  try {
    // 1. API Key Validation
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is missing in environmental variables. Please check .env.local' },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Resilient Gemini API Call
    const result = await generateWithFallback(prompt);

    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('Gemini API returned an empty response.');
    }
    
    // 3. Robust Response Handling
    try {
      const parsedData = JSON.parse(content);
      
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
          image_search_query: s.image_search_query || 'nature minimalist'
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
        const result = await generateCarouselImages(
          normalizedData.carousel_slides, 
          normalizedData.visual_theme
        );
        if (Array.isArray(result)) {
          imageUrls = result;
        }
      } catch (carouselError) {
        console.error('Failed to generate carousel images:', carouselError);
      }

      return NextResponse.json({
        ...normalizedData,
        generated_images: imageUrls
      });
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response as JSON:', content);
      return NextResponse.json(
        { error: 'Generated content is not valid JSON', raw: content },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error Stage:', error.stack || error.message);
    return NextResponse.json(
      { 
        error: error.message, 
        stage: 'overall_process', 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }, 
      { status: 500 }
    );
  }
}
