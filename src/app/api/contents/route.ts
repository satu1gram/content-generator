import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const client = supabaseAdmin || supabase;
    if (!client) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    
    // Fetch from the joined view for the dashboard
    const { data, error } = await client
      .from('content_dashboard')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = supabaseAdmin || supabase;
    if (!client) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const body = await req.json();
    
    // 1. Insert into raw contents table
    const { data: contentData, error: contentError } = await client
      .from('contents')
      .insert([{
        raw_text: body.original_text,
        source: body.source || 'telegram',
        content_type: body.tipe,
        extra_info: {
          waktu_posting: body.waktu_posting,
          canva_template_type: body.canva_template_type,
          generated_images: body.generated_images
        }
      }])
      .select()
      .single();

    if (contentError) throw contentError;

    // 2. Insert into captions table using the content_id
    const { data: captionData, error: captionError } = await client
      .from('captions')
      .insert([{
        content_id: contentData.id,
        caption_v1: body.caption_v1,
        caption_v2: body.caption_v2,
        caption_final: body.caption_final || body.caption_v1,
        hashtag: body.hashtag,
        waktu_posting: body.waktu_posting,
        rekomendasi_visual: body.rekomendasi_visual,
        status: body.status || 'draft',
        image_prompt: body.image_prompt?.en || body.image_prompt,
        image_url: body.image_url,
        image_source: body.image_source || (body.image_url ? 'ai_generated' : 'none'),
        post_format: body.post_format || 'feed'
      }])
      .select()
      .single();

    if (captionError) throw captionError;

    return NextResponse.json({ ...contentData, ...captionData });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const client = supabaseAdmin || supabase;
    if (!client) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const body = await req.json();
    const { id, ...updates } = body;
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    // Target the captions table for updates
    const { data, error } = await client
      .from('captions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
