const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Build mapping
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
let match;
const fatherToFam = {};
while ((match = famRegex.exec(data)) !== null) {
    fatherToFam[match[2]] = match[1];
}

// 1. Fix C103 (Hớn) - it references F999 which doesn't exist
// F999 should be a family for D999 (Hiền) who is a child of Đợi (D104)
// Let's check if F999 exists in families - it should have been created in fix_huy_dan.js
// But it seems it wasn't added to the families section. Let's add it.
const f999Exists = data.includes("handle: 'F999',");
if (!f999Exists) {
    console.log("Adding missing family F999 for D999...");
    // Insert F999 after F069 (Đợi's family)
    data = data.replace(
        /(handle: 'F069', fatherHandle: 'D104',\s*children: \[[^\]]*\]\s*\},)/,
        `$1
    {
        handle: 'F999', fatherHandle: 'D999',
        children: ['D121', 'D998']
    },`
    );
}

// 2. Fix F998 and F997 if missing
const f998Exists = data.includes("handle: 'F998',");
if (!f998Exists) {
    console.log("Adding missing families F998, F997...");
    data = data.replace(
        /(handle: 'F999', fatherHandle: 'D999',\s*children: \[[^\]]*\]\s*\},)/,
        `$1
    {
        handle: 'F998', fatherHandle: 'D129',
        children: ['D994']
    },
    {
        handle: 'F997', fatherHandle: 'D130',
        children: ['D993']
    },`
    );
}

// 3. Fix D999 - it needs families: ['F999']
data = data.replace(
    /handle: 'D999'([\s\S]*?)families: \[\]/,
    "handle: 'D999'$1families: ['F999']"
);

// 4. Fix C103 (Hớn) - Change families from F999 to F109
// Hớn (C103) should have families: ['F109'] if it exists
// Actually, C103 is Huy Hớn, generation 11 in Chi 3 (Cung).
// In the families table, F109 has fatherHandle C103. So C103 should reference F109.
data = data.replace(
    /handle: 'C103'([\s\S]*?)families: \['F999'\]/,
    "handle: 'C103'$1families: ['F109']"
);

// 5. Fix D121 parentFamilies - should be F999 (child of D999/Hiền)
data = data.replace(
    /handle: 'D121'([\s\S]*?)parentFamilies: \['F999'\]/,
    "handle: 'D121'$1parentFamilies: ['F999']"  // Already correct!
);

// 6. Fix Đợi's children to include D999
const f069match = data.match(/handle: 'F069'[\s\S]*?children: \[([^\]]*)\]/);
if (f069match && !f069match[1].includes('D999')) {
    console.log("Adding D999 to Đợi's children...");
    data = data.replace(
        /handle: 'F069', fatherHandle: 'D104',\s*children: \[([^\]]*)\]/,
        (match, children) => `handle: 'F069', fatherHandle: 'D104',\n        children: ['D999', ${children}]`
    );
}

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Fixed orphaned nodes and broken references.');
