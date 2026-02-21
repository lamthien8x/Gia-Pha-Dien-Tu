/**
 * Step 2: Import exported JSON data into Supabase
 * 
 * Prerequisites:
 *   1. Run supabase/schema.sql in Supabase Dashboard → SQL Editor
 *   2. Run: npx tsx supabase/export-mock-data.ts  (already done if mock-data-export.json exists)
 *   3. Then run: node supabase/migrate-data.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ttbveiegtjwkjmkckbpx.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YnZlaWVndGp3a2pta2NrYnB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5MzY5MiwiZXhwIjoyMDg3MjY5NjkyfQ.f8C_-Os8CuHkYxvvZm_zFx6CsafduzcT_slB0pTulzg';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function migrate() {
    // Load exported JSON
    const dataPath = resolve(__dirname, 'mock-data-export.json');
    const { people, families } = JSON.parse(readFileSync(dataPath, 'utf-8'));
    console.log(`📊 Loaded ${people.length} people, ${families.length} families from export`);

    // ── Insert people (batches of 100) ──
    console.log('\n👥 Inserting people...');
    for (let i = 0; i < people.length; i += 100) {
        const batch = people.slice(i, i + 100);
        const { error } = await supabase.from('people').upsert(batch);
        if (error) {
            console.error(`❌ Error at batch ${i}:`, error.message);
            console.error('   Details:', error.details);
            return;
        }
        console.log(`  ✅ People ${i + 1}–${Math.min(i + 100, people.length)}`);
    }

    // ── Insert families (batches of 100) ──
    console.log('\n👨‍👩‍👧‍👦 Inserting families...');
    for (let i = 0; i < families.length; i += 100) {
        const batch = families.slice(i, i + 100);
        const { error } = await supabase.from('families').upsert(batch);
        if (error) {
            console.error(`❌ Error at batch ${i}:`, error.message);
            console.error('   Details:', error.details);
            return;
        }
        console.log(`  ✅ Families ${i + 1}–${Math.min(i + 100, families.length)}`);
    }

    // ── Verify ──
    const { count: pCount } = await supabase.from('people').select('*', { count: 'exact', head: true });
    const { count: fCount } = await supabase.from('families').select('*', { count: 'exact', head: true });
    console.log(`\n🎉 Migration complete! ${pCount} people, ${fCount} families in Supabase`);
}

migrate().catch(console.error);
