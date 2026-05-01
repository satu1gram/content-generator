export const runtime = 'edge';
import { NextResponse } from 'next/server';

/**
 * 🔍 DIAGNOSTIC: Test the entire carousel image pipeline end-to-end.
 * Hit this endpoint in a browser to see exactly which step fails.
 */
export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      SCREENSHOT_SERVICE_URL: process.env.SCREENSHOT_SERVICE_URL ? '✅ set' : '❌ missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ set' : '❌ missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ set' : '❌ missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ set' : '❌ missing',
      NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || '(default: bp-images)',
      PEXELS_API_KEY: process.env.PEXELS_API_KEY ? '✅ set' : '❌ missing',
    },
  };

  // ── 1. Test screenshot service health ────────────────────────
  const serviceUrl = process.env.SCREENSHOT_SERVICE_URL;
  if (!serviceUrl) {
    checks.screenshot_service = { status: '❌ skipped', reason: 'SCREENSHOT_SERVICE_URL missing' };
  } else {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      checks.screenshot_service = { url: cleanUrl };

      // Health check
      const healthRes = await fetch(`${cleanUrl}/health`);
      checks.screenshot_service.health_status = healthRes.status;
      checks.screenshot_service.health_body = await healthRes.text();

      // Real screenshot test
      const testHtml = `<html><body style="margin:0;background:#0A0F0D;color:#fff;display:flex;align-items:center;justify-content:center;width:1080px;height:1080px;font-size:80px;font-family:sans-serif;">DEBUG TEST</body></html>`;
      const startTime = Date.now();
      const shotRes = await fetch(`${cleanUrl}/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: testHtml,
          options: { type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1080 } },
          viewport: { width: 1080, height: 1080 },
        }),
      });
      checks.screenshot_service.screenshot_status = shotRes.status;
      checks.screenshot_service.screenshot_duration_ms = Date.now() - startTime;
      if (!shotRes.ok) {
        checks.screenshot_service.screenshot_error = await shotRes.text();
      } else {
        const buf = await shotRes.arrayBuffer();
        checks.screenshot_service.screenshot_bytes = buf.byteLength;
      }
    } catch (err: any) {
      checks.screenshot_service.error = err.message;
    }
  }

  // ── 2. Test Supabase connectivity ────────────────────────────
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'bp-images';

  if (!supaUrl || !supaKey) {
    checks.supabase = { status: '❌ skipped', reason: 'Supabase URL or key missing' };
  } else {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supaUrl, supaKey);

      const testBuffer = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
      const testPath = `debug/${Date.now()}-test.png`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(testPath, testBuffer, { contentType: 'image/png', upsert: true });

      if (uploadError) {
        checks.supabase = { bucket, status: '❌ upload failed', error: uploadError.message };
      } else {
        const { data } = supabase.storage.from(bucket).getPublicUrl(testPath);
        checks.supabase = {
          bucket,
          status: '✅ upload ok',
          public_url: data?.publicUrl,
        };
        await supabase.storage.from(bucket).remove([testPath]);
      }
    } catch (err: any) {
      checks.supabase = { error: err.message };
    }
  }

  return NextResponse.json(checks, { status: 200 });
}
