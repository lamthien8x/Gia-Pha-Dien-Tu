const fs = require('fs');
const data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Extract all handles and group by prefix
const handleRegex = /handle:\s*'([^']+)'/g;
let m;
const prefixes = {};
while ((m = handleRegex.exec(data)) !== null) {
    const h = m[1];
    // Extract prefix: letters at the start, possibly with underscore
    const prefix = h.replace(/[0-9]+[a-z]?$/, '');
    if (!prefixes[prefix]) prefixes[prefix] = [];
    if (!prefixes[prefix].includes(h)) prefixes[prefix].push(h);
}

console.log('=== Handle prefixes and counts ===');
const sorted = Object.keys(prefixes).sort();
sorted.forEach(p => {
    console.log(`  ${p}: ${prefixes[p].length} handles (${prefixes[p].slice(0, 5).join(', ')}${prefixes[p].length > 5 ? '...' : ''})`);
});
