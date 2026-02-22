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
    // Find the user profile
    const email = 'lhda.eth@gmail.com';
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,role`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const profiles = await resp.json();
    console.log('Found profiles:', JSON.stringify(profiles, null, 2));

    if (profiles.length > 0) {
        console.log(`\nCurrent role: "${profiles[0].role}"`);

        // Update role to admin
        const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profiles[0].id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ role: 'admin' })
        });
        const result = await resp2.json();
        console.log('Updated:', JSON.stringify(result, null, 2));
    } else {
        console.log('Profile not found! Listing all profiles...');
        const resp3 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,email,role`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const all = await resp3.json();
        console.log('All profiles:', JSON.stringify(all, null, 2));
    }
}

main();
