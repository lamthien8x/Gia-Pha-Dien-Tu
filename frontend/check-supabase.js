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
    // Find people with empty parent_families 
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/people?parent_families=eq.{}&select=handle,display_name,generation`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const orphans = await resp.json();

    console.log('=== People with empty parent_families ===');
    orphans.forEach(p => console.log(`  ${p.handle} ${p.display_name} G${p.generation}`));

    // Check families with F_ prefix
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/families?handle=like.F_*&select=handle,father_handle,children`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const fams = await resp2.json();
    console.log('\n=== Families with F_ prefix ===');
    if (Array.isArray(fams)) {
        fams.forEach(f => console.log(`  ${f.handle} father=${f.father_handle} children=${JSON.stringify(f.children)}`));
    } else {
        console.log(JSON.stringify(fams));
    }

    // Check total counts
    const resp3 = await fetch(`${SUPABASE_URL}/rest/v1/people?select=handle`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'count=exact' }
    });
    const resp4 = await fetch(`${SUPABASE_URL}/rest/v1/families?select=handle`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'count=exact' }
    });

    console.log(`\nTotal people: ${resp3.headers.get('content-range')}`);
    console.log(`Total families: ${resp4.headers.get('content-range')}`);
}

main();
