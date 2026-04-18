export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function GET() {
  const varsToCheck = [
    'GEMINI_API_KEY',
    'GROQ_API_KEY',
    'PEXELS_API_KEY',
    'BROWSERLESS_TOKEN',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET'
  ];

  const results: Record<string, any> = {
    runtime: process.env.NEXT_RUNTIME || 'unknown',
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  varsToCheck.forEach(varName => {
    const val = process.env[varName];
    if (val) {
      results[varName] = {
        status: '✅ FOUND',
        length: val.length,
        prefix: val.slice(0, 3) + '...',
        suffix: '...' + val.slice(-3)
      };
    } else {
      results[varName] = {
        status: '❌ MISSING',
      };
    }
  });

  return NextResponse.json(results);
}
