export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getSupabaseAny } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = getSupabaseAny();
    if (!client) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { data: caption, error: captionError } = await client
      .from('captions')
      .select(`
        *,
        contents (*)
      `)
      .eq('id', id)
      .single();

    if (captionError) throw captionError;

    // Flatten to match ContentRecord interface + extra_info
    const flattenedData = {
      ...caption,
      raw_text: caption.contents?.raw_text,
      content_type: caption.contents?.content_type,
      source: caption.contents?.source,
      extra_info: caption.contents?.extra_info
    };

    return NextResponse.json(flattenedData);
  } catch (error: any) {
    console.error('Fetch detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
