import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service key for full access
  
  if (!url || !key) {
    console.error('Missing Supabase env vars');
    return;
  }

  const supabase = createClient(url, key);

  console.log('--- Checking content_dashboard view ---');
  const { data: dashboardData, error: dashboardError } = await supabase
    .from('content_dashboard')
    .select('*')
    .limit(5);

  if (dashboardError) {
    console.error('Dashboard Error:', dashboardError);
  } else {
    console.log(`Found ${dashboardData.length} records in dashboard view.`);
    dashboardData.forEach(d => {
      console.log(`ID: ${d.id}, Image URL: ${d.image_url || 'NULL'}`);
    });
  }

  console.log('\n--- Checking captions table directly ---');
  const { data: captionData, error: captionError } = await supabase
    .from('captions')
    .select('id, image_url')
    .limit(5);

  if (captionError) {
    console.error('Caption Error:', captionError);
  } else {
    captionData.forEach(c => {
      console.log(`ID: ${c.id}, Image URL: ${c.image_url || 'NULL'}`);
    });
  }
}

checkData();
