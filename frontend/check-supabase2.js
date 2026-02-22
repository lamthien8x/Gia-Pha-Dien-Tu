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
    // Find people with empty parent_families in Supabase
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/people?parent_families=eq.{}&select=handle,display_name,generation,families`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const orphans = await resp.json();

    console.log('=== People with empty parent_families in SUPABASE ===');
    orphans.forEach(p => console.log(`  ${p.handle} ${p.display_name} G${p.generation} families=${JSON.stringify(p.families)}`));
    console.log(`Total: ${orphans.length}`);

    // Also check people whose families array references non-existent family handles
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/families?select=handle`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const allFams = await resp2.json();
    const famSet = new Set(allFams.map(f => f.handle));

    const resp3 = await fetch(`${SUPABASE_URL}/rest/v1/people?select=handle,display_name,families`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const allPeople = await resp3.json();

    console.log('\n=== People referencing non-existent families ===');
    allPeople.forEach(p => {
        if (p.families && p.families.length > 0) {
            p.families.forEach(fId => {
                if (!famSet.has(fId)) {
                    console.log(`  ${p.handle} ${p.display_name} -> missing family ${fId}`);
                }
            });
        }
    });

    // Check people whose parent_families reference non-existent handles
    console.log('\n=== People with parent_families referencing missing families ===');
    allPeople.forEach(p => {
        // Need parent_families too
    });

    const resp4 = await fetch(`${SUPABASE_URL}/rest/v1/people?select=handle,display_name,parent_families`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const allPeople2 = await resp4.json();
    allPeople2.forEach(p => {
        if (p.parent_families && p.parent_families.length > 0) {
            p.parent_families.forEach(fId => {
                if (!famSet.has(fId)) {
                    console.log(`  ${p.handle} ${p.display_name} -> missing parent family ${fId}`);
                }
            });
        }
    });
}

main();
