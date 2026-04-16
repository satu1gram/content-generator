export type ContentType = 'A' | 'B' | 'C' | 'D';

export type PostFormat = 'feed' | 'carousel' | 'story' | 'reels';

export type CanvaTemplateType = 'lifestyle' | 'infographic' | 'aspirational' | 'product';

export interface ClaudeOutput {
  tipe: ContentType;
  analysis: {
    pain_points: string;
    psychological_motive: string;
  };
  tiktok_scripts: {
    title: string;
    script: string;
  }[];
  carousel_slides: {
    title: string;
    body: string;
    image_search_query?: string;
  }[];
  caption_v1: string;
  caption_v2: string;
  hashtag: string;
  waktu_posting: string;
  rekomendasi_visual: string;
  post_format: PostFormat;
  image_prompt: {
    en: string;
    style_notes: string;
    negative_prompt: string;
  };
  canva_template_type: CanvaTemplateType;
  generated_images?: string[];
  visual_theme?: {
    primary: string;
    accent: string;
    text: string;
    decoration: string;
  };
}

// Table: contents
export interface RawContent {
  id?: string;
  raw_text: string;
  source: string;
  content_type: ContentType;
  extra_info?: any;
  created_at?: string;
}

// Table: captions
export interface CaptionDetails {
  id?: string;
  content_id: string;
  caption_v1: string;
  caption_v2: string;
  caption_final: string;
  hashtag: string;
  waktu_posting: string;
  rekomendasi_visual: string;
  status: 'draft' | 'approved' | 'posted';
  scheduled_date?: string;
  posted_at?: string;
  image_prompt?: string;
  image_url?: string;
  image_uploaded?: string;
  image_source: 'ai_generated' | 'uploaded' | 'none';
  canva_template?: string;
  post_format: PostFormat;
  created_at?: string;
  updated_at?: string;
}

// View: content_dashboard (The joined view)
export interface ContentRecord {
  id: string;
  status: 'draft' | 'approved' | 'posted';
  scheduled_date: string | null;
  caption_final: string | null;
  hashtag: string | null;
  created_at: string;
  updated_at: string;
  content_type: ContentType;
  raw_text: string;
  source: string;
  // Fields needed for UI rendering from ClaudeOutput if needed
  caption_v1: string;
  caption_v2: string;
  waktu_posting: string;
  rekomendasi_visual: string;
  post_format: PostFormat;
  image_url?: string;
}
