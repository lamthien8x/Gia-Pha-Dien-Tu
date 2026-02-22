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
    // Get all families
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/families?select=handle,father_handle`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const families = await resp.json();

    // Get all people with their families array
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/people?select=handle,display_name,families`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const people = await resp2.json();

    const peopleMap = new Map(people.map(p => [p.handle, p]));

    // For each family, check if the father's families array includes this family handle
    console.log('=== Families where father is missing this family in their families array ===');
    let issues = 0;
    for (const fam of families) {
        if (!fam.father_handle) continue;
        const father = peopleMap.get(fam.father_handle);
        if (!father) {
            console.log(`  Family ${fam.handle}: father ${fam.father_handle} NOT FOUND in people table`);
            issues++;
            continue;
        }
        if (!father.families || !father.families.includes(fam.handle)) {
            console.log(`  Family ${fam.handle}: father ${fam.father_handle} (${father.display_name}) does NOT have ${fam.handle} in families=[${(father.families || []).join(',')}]`);
            issues++;
        }
    }
    console.log(`\nTotal issues: ${issues}`);
}

main();
