export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { GEMINI_MODEL } from '@/lib/gemini';

const OPTIMIZE_PROMPT = `
Kamu adalah Prompt Engineer ahli khusus untuk konten British Propolis (BP).
Tugas kamu adalah memperbaiki dan memperluas input mentah dari user agar menjadi prompt yang sangat detail dan profesional guna menghasilkan konten social media yang premium.

PANDUAN OPTIMASI:
1. Storytelling: Jika input tentang testimoni, tambahkan elemen emosional dan alur cerita yang menyentuh.
2. Spesifik: Tambahkan detail tentang brand BP (Propolis Premium dari Inggris, Flavonoid tinggi, Sertifikasi HALAL, dll).
3. Struktur: Format ulang agar memiliki konteks yang jelas (Siapa audiensnya, apa masalahnya, apa solusinya).
4. Tone: Gunakan tone 'KITA' (inklusi) dan sangat persuasif namun tetap tulus.

CONTOH:
Input: "testimoni bp sembuh asam lambung"
Hasil: "Berikan draf konten testimoni yang menyentuh tentang perjuangan seorang ibu melawan asam lambung kronis. Ceritakan bagaimana ikhtiar rutin dengan British Propolis selama 2 minggu membawa perubahan nyata hingga beliau bisa makan dengan tenang lagi tanpa rasa cemas. Tekankan sisi syukur dan kemudahan dari Allah melalui wasilah BP."

Wajib balas HANYA dengan teks hasil optimasi, tanpa penjelasan tambahan.
`;

async function optimizeWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: OPTIMIZE_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty content');
  return text.trim();
}

async function optimizeWithDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: OPTIMIZE_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`DeepSeek ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('DeepSeek returned empty content');
  return text.trim();
}

export async function POST(req: Request) {
  try {
    const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const hasGemini   = !!process.env.GEMINI_API_KEY;

    if (!hasDeepSeek && !hasGemini) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });

    let optimizedText: string | null = null;

    // Primary: DeepSeek
    if (!optimizedText && hasDeepSeek) {
      try {
        optimizedText = await optimizeWithDeepSeek(prompt);
      } catch (err: any) {
        console.warn('⚠️ Optimize DeepSeek failed:', err.message);
      }
    }

    // Fallback: Gemini
    if (!optimizedText && hasGemini) {
      try {
        optimizedText = await optimizeWithGemini(prompt);
      } catch (err: any) {
        console.warn('⚠️ Optimize Gemini failed:', err.message);
        throw err;
      }
    }

    if (!optimizedText) {
      return NextResponse.json({ error: 'Semua provider gagal mengoptimasi prompt.' }, { status: 500 });
    }

    return NextResponse.json({ optimized: optimizedText });
  } catch (error: any) {
    console.error('Optimize Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
