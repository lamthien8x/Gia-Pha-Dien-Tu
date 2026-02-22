const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)="?([^"]*)"?$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

async function main() {
    // Check what tables exist
    console.log('=== Checking profiles table ===');
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    console.log('Status:', resp.status);
    const text = await resp.text();
    console.log('Response:', text.substring(0, 500));

    // Try to get auth users
    console.log('\n=== Auth users (admin API) ===');
    const resp2 = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    console.log('Status:', resp2.status);
    const text2 = await resp2.text();
    console.log('Response:', text2.substring(0, 500));
}

main();
