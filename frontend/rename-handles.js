const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// ═══════════════════════════════════════════════════
// Step 1: Build old → new handle mapping
// ═══════════════════════════════════════════════════

// Prefix mapping (old → new)
// IMPORTANT: Order matters - longer prefixes must be processed first
const prefixMap = {
    'CH': 'I',   // Chi 3 - Chước
    'CN': 'J',   // Chi 3 - Cớn  
    'LI': 'L',   // Chi 3 - Liệu
    'TH': 'F',   // Chi 2
    'TU': 'G',   // Chi 2
    'TC': 'H',   // Chi 2
    'B': 'A',   // Chi 1 - Bường
    'D': 'B',   // Chi 1 - Đản
    'C': 'K',   // Chi 3 - Cung (must be after CH, CN)
    'L': 'C',   // Chi 1 - Lạp (must be after LI)
    'T': 'D',   // Chi 1 - Toản (must be after TH, TU, TC)
    'U': 'M',   // Chi 3 - Uẩn
    'V': 'E',   // Chi 1 - Vụ
    // P stays as P
};

// Extract all person handles
const personHandleRegex = /handle:\s*'([^']+)',\s*gramps_id/g;
let m;
const personHandles = new Set();
while ((m = personHandleRegex.exec(data)) !== null) {
    personHandles.add(m[1]);
}

// Extract all family handles  
const familyHandleRegex = /handle:\s*'([^']+)',\s*fatherHandle/g;
const familyHandles = new Set();
while ((m = familyHandleRegex.exec(data)) !== null) {
    familyHandles.add(m[1]);
}

console.log(`Found ${personHandles.size} person handles, ${familyHandles.size} family handles`);

// Build the complete handle mapping
const handleMap = {};

// Group person handles by old prefix, sorted by generation then number
const handlesByPrefix = {};
for (const h of personHandles) {
    if (h.startsWith('P')) continue; // P stays the same

    // Find which prefix this handle belongs to (longest match first)
    let matchedPrefix = null;
    for (const oldPrefix of Object.keys(prefixMap)) {
        if (h.startsWith(oldPrefix)) {
            if (!matchedPrefix || oldPrefix.length > matchedPrefix.length) {
                matchedPrefix = oldPrefix;
            }
        }
    }
    if (matchedPrefix) {
        if (!handlesByPrefix[matchedPrefix]) handlesByPrefix[matchedPrefix] = [];
        handlesByPrefix[matchedPrefix].push(h);
    }
}

// For each prefix group, sort handles and assign new sequential numbers
for (const [oldPrefix, handles] of Object.entries(handlesByPrefix)) {
    const newPrefix = prefixMap[oldPrefix];

    // Sort handles by their numeric part
    handles.sort((a, b) => {
        const numA = parseInt(a.substring(oldPrefix.length).replace(/[a-z]$/, ''));
        const numB = parseInt(b.substring(oldPrefix.length).replace(/[a-z]$/, ''));
        return numA - numB;
    });

    // Assign new numbers (keep the original ordering)
    let counter = 1;
    for (const oldHandle of handles) {
        const suffix = oldHandle.substring(oldPrefix.length);
        // Keep alphabetic suffix if present (e.g., 056a → suffix = "056a")
        const hasLetterSuffix = /[a-z]$/.test(suffix);

        if (hasLetterSuffix) {
            // Extract the letter
            const letter = suffix.slice(-1);
            const num = parseInt(suffix.slice(0, -1));
            // Find the base handle's new number
            const baseOldHandle = oldPrefix + suffix.slice(0, -1);
            // Use the base number + letter
            const baseNewNum = handleMap[baseOldHandle] ?
                handleMap[baseOldHandle].substring(newPrefix.length) :
                String(counter).padStart(3, '0');
            handleMap[oldHandle] = newPrefix + baseNewNum + letter;
        } else {
            handleMap[oldHandle] = newPrefix + String(counter).padStart(3, '0');
            counter++;
        }
    }
}

// Also map F_ family handles
for (const fh of familyHandles) {
    if (fh.startsWith('F_')) {
        const personPart = fh.substring(2); // e.g., "C128" from "F_C128"
        if (handleMap[personPart]) {
            handleMap[fh] = 'F_' + handleMap[personPart];
        }
    }
}

// Print the mapping
console.log('\n=== Handle Mapping ===');
let count = 0;
for (const [old, nw] of Object.entries(handleMap)) {
    if (count < 20 || old.startsWith('F_')) {
        console.log(`  ${old} → ${nw}`);
    }
    count++;
}
console.log(`  ... (${count} total mappings)`);

// ═══════════════════════════════════════════════════
// Step 2: Replace all handles in the file
// ═══════════════════════════════════════════════════

// Sort replacements by length descending to avoid partial matches
const sortedOldHandles = Object.keys(handleMap).sort((a, b) => b.length - a.length);

// Use a two-pass approach: first replace with unique placeholders, then with final values
const placeholders = {};
for (const oldHandle of sortedOldHandles) {
    const placeholder = `__PLACEHOLDER_${oldHandle}__`;
    placeholders[placeholder] = handleMap[oldHandle];

    // Replace all occurrences of the old handle (inside quotes)
    const regex = new RegExp(`'${oldHandle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    data = data.replace(regex, `'${placeholder}'`);
}

// Now replace placeholders with final values
for (const [placeholder, newHandle] of Object.entries(placeholders)) {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    data = data.replace(regex, newHandle);
}

// ═══════════════════════════════════════════════════
// Step 3: Write result
// ═══════════════════════════════════════════════════
fs.writeFileSync('src/lib/mock-genealogy.ts', data);

// Save the mapping for reference
fs.writeFileSync('handle-mapping.json', JSON.stringify(handleMap, null, 2));

console.log('\n✅ Done! Renamed ' + Object.keys(handleMap).length + ' handles.');
console.log('Mapping saved to handle-mapping.json');
