import * as fal from "@fal-ai/serverless-client";
import { NextResponse } from 'next/server';

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, format } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const aspectRatio = format === 'story' ? '9:16'
      : format === 'portrait' ? '4:5' : '1:1';

    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
        image_size: aspectRatio === '1:1'
          ? { width: 1024, height: 1024 }
          : aspectRatio === '4:5'
          ? { width: 1024, height: 1280 }
          : { width: 768, height: 1360 },
        num_inference_steps: 4,
        num_images: 1,
      }
    });

    return NextResponse.json({ image_url: result.images[0].url });
  } catch (error: any) {
    console.error('Fal.ai API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
