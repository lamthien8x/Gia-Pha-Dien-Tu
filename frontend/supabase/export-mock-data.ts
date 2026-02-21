/**
 * Step 1: Export mock data to JSON
 * Run: npx tsx supabase/export-mock-data.ts
 */
import { MOCK_PEOPLE, MOCK_FAMILIES } from '../src/lib/mock-genealogy';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const people = MOCK_PEOPLE.map(p => ({
    handle: p.handle,
    gramps_id: p.gramps_id || null,
    gender: p.gender || 1,
    display_name: p.displayName,
    surname: p.surname || null,
    first_name: p.firstName || null,
    generation: p.generation || 1,
    chi: p.chi || null,
    birth_year: p.birthYear || null,
    birth_date: p.birthDate || null,
    birth_place: p.birthPlace || null,
    death_year: p.deathYear || null,
    death_date: p.deathDate || null,
    death_place: p.deathPlace || null,
    is_living: p.isLiving ?? true,
    is_privacy_filtered: p.isPrivacyFiltered ?? false,
    is_patrilineal: p.isPatrilineal ?? true,
    families: p.families || [],
    parent_families: p.parentFamilies || [],
    phone: p.phone || null,
    email: p.email || null,
    zalo: p.zalo || null,
    facebook: p.facebook || null,
    current_address: p.currentAddress || null,
    hometown: p.hometown || null,
    occupation: p.occupation || null,
    company: p.company || null,
    education: p.education || null,
    nick_name: p.nickName || null,
    notes: p.notes || null,
}));

const families = MOCK_FAMILIES.map(f => ({
    handle: f.handle,
    father_handle: f.fatherHandle || null,
    mother_handle: f.motherHandle || null,
    children: f.children || [],
}));

const outPath = resolve(__dirname, 'mock-data-export.json');
writeFileSync(outPath, JSON.stringify({ people, families }, null, 2));
console.log(`✅ Exported ${people.length} people, ${families.length} families → ${outPath}`);
