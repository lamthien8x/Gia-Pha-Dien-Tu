/**
 * Parse the extracted .doc files and build the normalized family tree.
 * 
 * Strategy:
 * - File 1: Overview tree TH1-10 (flat text, need to reconstruct structure)
 * - Files 2-5: Chi 1 sub-trees (TH10-15)
 * - File 6: Chi 2 (only TH10, no further data)
 * - Files 7-12: Chi 3 sub-trees (TH10-14/15)
 * 
 * For files 2-12: The first name is the TH10 root, and remaining names
 * are organized by generation labels in the document.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function extractText(docPath) {
    return execSync(`textutil -convert txt -stdout "${docPath}" 2>/dev/null`)
        .toString()
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && l !== 'PAGE' && !l.startsWith('PAGE'));
}

function parseSubTree(lines, title) {
    // Find generation labels and their positions
    const genPositions = [];
    const nameLines = [];

    for (let i = 0; i < lines.length; i++) {
        const genMatch = lines[i].match(/^Thế hệ\s+(\d+)$/);
        if (genMatch) {
            genPositions.push({ gen: parseInt(genMatch[1]), lineIdx: i });
        }
    }

    // Extract all names (non-generation-label, non-title lines)
    const allNames = lines.filter(l => {
        if (l.match(/^Thế hệ/)) return false;
        if (l.match(/^SƠ ĐỒ/)) return false;
        if (l.match(/^Chi \d/)) return false;
        if (l.match(/^PAGE/)) return false;
        if (l === '') return false;
        return true;
    });

    return { title, genPositions, allNames };
}

// Parse all files
const dir = path.join(__dirname);
const results = {};

for (let i = 1; i <= 12; i++) {
    const filePath = path.join(dir, `${i}.doc`);
    const lines = extractText(filePath);
    const title = lines[0] || `File ${i}`;
    const parsed = parseSubTree(lines, title);
    results[i] = parsed;
    
    console.log(`\n=== File ${i}: ${title} ===`);
    console.log(`Generations found:`, parsed.genPositions.map(g => `TH${g.gen}`).join(', '));
    console.log(`Names (${parsed.allNames.length}):`, parsed.allNames.join(' | '));
}

// Now build the structured tree data
// File 1 has TH1-TH10 names in order
// Based on document structure analysis:
// TH1: Đức Tính (thủy tổ)
// TH2: Đức Thiệu (single son)
// TH3: Đức Hậu (single son)
// TH4: Đức Trạch (single son)
// TH5: Đức Thận (single son)
// TH6: Đức Thuần (single son line breaks into branches)
// From TH6 onward, multiple branches emerge

// For files 2-12, the FIRST name is always the TH10 root
// and the names are ordered by generation (TH10 first, then TH11, etc.)

console.log('\n\n=== BUILDING STRUCTURED TREE ===');

// Map TH10 roots to their sub-tree files
const subTrees = {
    // Chi 1
    'Huy Bổng': { file: 2, chi: 1 },
    'Huy Toản': { file: 3, chi: 1 },
    'Huy Đản': { file: 4, chi: 1 },
    'Huy Lạp': { file: 5, chi: 1 },
    // Chi 3
    'Huy Cung': { file: 7, chi: 3 },
    'Huy Cớn': { file: 8, chi: 3 },
    'Huy Liêu': { file: 9, chi: 3 },
    'Huy Huân': { file: 10, chi: 3 },   // from file 10 header analysis
    'Huy Thước': { file: 11, chi: 3 },
    'Huy Tuy': { file: 12, chi: 3 },
    'Huy Tước': { file: 12, chi: 3 },   // same file as Huy Tuy
};

// For each sub-tree file, determine which names belong to which generation
function assignGenerations(fileData) {
    const { genPositions, allNames } = fileData;
    if (genPositions.length === 0) return {};
    
    // Sort generations
    const sortedGens = [...genPositions].sort((a, b) => a.gen - b.gen);
    
    // The first name is always the root (lowest gen number)
    const rootGen = sortedGens[0].gen;
    
    console.log(`  Root gen: TH${rootGen}, Total names: ${allNames.length}`);
    console.log(`  Generations: ${sortedGens.map(g => `TH${g.gen}`).join(', ')}`);
    
    return { rootGen, sortedGens, allNames };
}

console.log('\n--- Sub-tree analysis ---');
for (const [root, info] of Object.entries(subTrees)) {
    console.log(`\n${root} (Chi ${info.chi}, File ${info.file}):`);
    const data = results[info.file];
    assignGenerations(data);
}

// Output summary
const totalPeople = Object.values(results).reduce((sum, r) => sum + r.allNames.length, 0);
console.log(`\n\nTotal unique names across all files: ~${totalPeople} (with some overlap at TH10)`);
