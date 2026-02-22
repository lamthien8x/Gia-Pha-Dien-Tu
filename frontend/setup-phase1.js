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

async function runSQL(sql, label) {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
    });
    // RPC won't work for DDL, use the SQL editor approach via REST
    console.log(`${label}: attempting...`);
}

async function main() {
    // Step 1: Check current profiles columns
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=1`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const profiles = await resp.json();
    console.log('Current profile columns:', profiles.length > 0 ? Object.keys(profiles[0]).join(', ') : 'table empty or error');
    if (profiles.length > 0) console.log('Sample:', JSON.stringify(profiles[0]));

    // Step 2: Test if invite_links table exists
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/invite_links?select=*&limit=1`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    console.log('\ninvite_links table status:', resp2.status);
    if (resp2.status === 200) {
        console.log('invite_links exists!');
    } else {
        const err = await resp2.text();
        console.log('invite_links error:', err.substring(0, 200));
    }

    // Step 3: Try to add missing columns to profiles
    console.log('\n=== Updating profiles table ===');

    // Try updating the existing profile with new fields
    const profileId = profiles[0]?.id;
    if (profileId) {
        const resp3 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profileId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                display_name: 'LeHuy Admin',
                status: 'active'
            })
        });
        const result = await resp3.json();
        console.log('Profile update result:', JSON.stringify(result));
    }
}

main();
