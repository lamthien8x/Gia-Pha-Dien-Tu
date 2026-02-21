/**
 * Generate all 3 mock data files from normalized_data.json
 */
const fs = require('fs');
const path = require('path');
const data = require('./normalized_data.json');
const persons = data.persons;

// Build lookup maps
const personMap = {};
persons.forEach(p => { personMap[p.id] = p; });

// Build families: group children by fatherId
const childrenByFather = {};
persons.forEach(p => {
    if (p.fatherId) {
        if (!childrenByFather[p.fatherId]) childrenByFather[p.fatherId] = [];
        childrenByFather[p.fatherId].push(p.id);
    }
});

// Create family entries for fathers who have children
const families = [];
let famIdx = 1;
Object.entries(childrenByFather).forEach(([fatherId, childIds]) => {
    const fam = {
        handle: 'F' + String(famIdx).padStart(3, '0'),
        fatherId: fatherId,
        children: childIds,
    };
    families.push(fam);
    famIdx++;
});

// Build person -> family mappings
const personFamilies = {};     // families where person is a parent
const personParentFamilies = {}; // families where person is a child
families.forEach(f => {
    if (!personFamilies[f.fatherId]) personFamilies[f.fatherId] = [];
    personFamilies[f.fatherId].push(f.handle);
    f.children.forEach(cid => {
        if (!personParentFamilies[cid]) personParentFamilies[cid] = [];
        personParentFamilies[cid].push(f.handle);
    });
});

console.log('Persons:', persons.length);
console.log('Families:', families.length);

// ─── Generate frontend/src/lib/mock-genealogy.ts ──────────────────────
function genFrontend() {
    let out = `/**
 * Mock genealogy — Dòng họ Lê Huy Tộc
 * ${persons.length} thành viên, ${families.length} gia đình, thế hệ 1-15
 * Dữ liệu chuẩn hóa từ gia phả gốc (12 file .doc)
 * Chỉ có dữ liệu nam giới (cha-con). Vợ và con gái để bổ sung sau.
 */

export interface TreeNode {
    handle: string;
    displayName: string;
    gender: number; // 1=male, 2=female
    birthYear?: number;
    deathYear?: number;
    generation: number;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    isPatrilineal: boolean;
    families: string[];
    parentFamilies: string[];
}

export interface TreeFamily {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}

export interface PersonDetail {
    handle: string;
    gramps_id: string;
    gender: number;
    displayName: string;
    surname: string;
    firstName: string;
    generation: number;
    chi?: number;
    birthYear?: number;
    birthDate?: string;
    birthPlace?: string;
    deathYear?: number;
    deathDate?: string;
    deathPlace?: string;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    isPatrilineal: boolean;
    families?: string[];
    parentFamilies?: string[];
    mediaCount?: number;
    phone?: string;
    email?: string;
    zalo?: string;
    facebook?: string;
    currentAddress?: string;
    hometown?: string;
    occupation?: string;
    company?: string;
    education?: string;
    nickName?: string;
    notes?: string;
    biography?: string;
    tags?: string[];
    _privacyNote?: string;
}

// ═══ Zodiac Year Helper ═══
const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI_ZD = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

export function zodiacYear(year?: number): string | undefined {
    if (!year) return undefined;
    return \`\${CAN[year % 10]} \${CHI_ZD[year % 12]}\`;
}

// ════════════════════════════════════════════════════════════════════════
// PEOPLE — ${persons.length} người, thế hệ 1-15
// ════════════════════════════════════════════════════════════════════════
export const MOCK_PEOPLE: PersonDetail[] = [
`;

    persons.forEach((p, i) => {
        const displayName = 'Lê ' + p.name;
        const fams = personFamilies[p.id] || [];
        const pfams = personParentFamilies[p.id] || [];
        out += `    {
        handle: '${p.id}', gramps_id: 'I${String(i + 1).padStart(4, '0')}', gender: 1,
        displayName: '${displayName}', surname: 'Lê', firstName: '${p.name}',
        generation: ${p.gen},${p.chi ? ` chi: ${p.chi},` : ''}
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: [${fams.map(f => `'${f}'`).join(', ')}], parentFamilies: [${pfams.map(f => `'${f}'`).join(', ')}]
    },\n`;
    });

    out += `];

// ════════════════════════════════════════════════════════════════════════
// FAMILIES — ${families.length} gia đình
// ════════════════════════════════════════════════════════════════════════
export const MOCK_FAMILIES: TreeFamily[] = [
`;

    families.forEach(f => {
        out += `    {
        handle: '${f.handle}', fatherHandle: '${f.fatherId}',
        children: [${f.children.map(c => `'${c}'`).join(', ')}]
    },\n`;
    });

    out += `];

// ════════════════════════════════════════════════════════════════════════
// TREE NODES (for tree view)
// ════════════════════════════════════════════════════════════════════════
export const MOCK_TREE_NODES: TreeNode[] = MOCK_PEOPLE.map(p => ({
    handle: p.handle,
    displayName: p.displayName,
    gender: p.gender,
    birthYear: p.birthYear,
    deathYear: p.deathYear,
    generation: p.generation,
    isLiving: p.isLiving,
    isPrivacyFiltered: p.isPrivacyFiltered,
    isPatrilineal: p.isPatrilineal,
    families: p.families || [],
    parentFamilies: p.parentFamilies || [],
}));
`;
    return out;
}

// ─── Generate backend/src/modules/genealogy/mock-data.ts ──────────────
function genBackendGenealogy() {
    let out = `/**
 * Mock genealogy data — Dòng họ Lê Huy Tộc (${persons.length} người, TH1-15)
 * Used when Gramps Web is unavailable for UI development/testing.
 * Dữ liệu chuẩn hóa từ gia phả gốc.
 */

import type { GrampsPerson, GrampsFamily } from './types';

`;

    persons.forEach((p, i) => {
        const varName = `person_${p.id}`;
        const fams = personFamilies[p.id] || [];
        const pfams = personParentFamilies[p.id] || [];
        out += `const ${varName}: GrampsPerson = {
    handle: '${p.id}',
    gramps_id: 'I${String(i + 1).padStart(4, '0')}',
    gender: 1,
    primary_name: { first_name: '${p.name}', surname_list: [{ surname: 'Lê' }] },
    family_list: [${fams.map(f => `'${f}'`).join(', ')}],
    parent_family_list: [${pfams.map(f => `'${f}'`).join(', ')}],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};\n\n`;
    });

    families.forEach(f => {
        const varName = `family_${f.handle}`;
        out += `const ${varName}: GrampsFamily = {
    handle: '${f.handle}',
    gramps_id: '${f.handle}',
    father_handle: '${f.fatherId}',
    child_ref_list: [${f.children.map(c => `{ ref: '${c}' }`).join(', ')}],
    type: 'Married',
};\n\n`;
    });

    out += `// === Export ===
export const MOCK_PEOPLE: GrampsPerson[] = [
    ${persons.map(p => `person_${p.id}`).join(',\n    ')},
];

export const MOCK_FAMILIES: GrampsFamily[] = [
    ${families.map(f => `family_${f.handle}`).join(',\n    ')},
];
`;
    return out;
}

// ─── Generate backend/src/modules/members/mock-data.ts ────────────────
function genBackendMembers() {
    let out = `/**
 * Minimal person/family data for editable scope computation.
 * Dòng họ Lê Huy Tộc — ${persons.length} người, TH1-15.
 */

export interface MockPerson {
    handle: string;
    displayName: string;
    families?: string[];
    parentFamilies?: string[];
}

export interface MockFamily {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}

export const MOCK_PEOPLE: MockPerson[] = [
`;

    persons.forEach(p => {
        const fams = personFamilies[p.id] || [];
        const pfams = personParentFamilies[p.id] || [];
        const famsStr = fams.length ? `, families: [${fams.map(f => `'${f}'`).join(', ')}]` : '';
        const pfamsStr = pfams.length ? `, parentFamilies: [${pfams.map(f => `'${f}'`).join(', ')}]` : '';
        out += `    { handle: '${p.id}', displayName: 'Lê ${p.name}'${famsStr}${pfamsStr} },\n`;
    });

    out += `];

export const MOCK_FAMILIES: MockFamily[] = [
`;

    families.forEach(f => {
        out += `    { handle: '${f.handle}', fatherHandle: '${f.fatherId}', children: [${f.children.map(c => `'${c}'`).join(', ')}] },\n`;
    });

    out += `];
`;
    return out;
}

// Write files
const root = path.join(__dirname, '..');

fs.writeFileSync(path.join(root, 'frontend/src/lib/mock-genealogy.ts'), genFrontend());
console.log('✅ Written: frontend/src/lib/mock-genealogy.ts');

fs.writeFileSync(path.join(root, 'backend/src/modules/genealogy/mock-data.ts'), genBackendGenealogy());
console.log('✅ Written: backend/src/modules/genealogy/mock-data.ts');

fs.writeFileSync(path.join(root, 'backend/src/modules/members/mock-data.ts'), genBackendMembers());
console.log('✅ Written: backend/src/modules/members/mock-data.ts');

console.log(`\nDone! ${persons.length} persons, ${families.length} families generated.`);
