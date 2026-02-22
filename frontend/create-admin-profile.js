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
    const userId = '7e5f5518-bb09-4b5b-ad2d-52454e620d2c';
    const email = 'lhda.eth@gmail.com';

    // Insert profile with admin role
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            id: userId,
            email: email,
            role: 'admin'
        })
    });

    console.log('Insert status:', resp.status);
    const result = await resp.text();
    console.log('Result:', result);

    // Verify
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const profiles = await resp2.json();
    console.log('\nAll profiles now:', JSON.stringify(profiles, null, 2));
}

main();
