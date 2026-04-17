import { NextResponse } from 'next/server';
import genAI, { GEMINI_MODEL } from '@/lib/gemini';

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

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: OPTIMIZE_PROMPT,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const optimizedText = response.text().trim();

    return NextResponse.json({ optimized: optimizedText });
  } catch (error: any) {
    console.error('Optimize Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
