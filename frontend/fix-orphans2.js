const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Remove orphaned people from mock data
// These are people who were disconnected during chart fixes and don't appear on any chart
const orphansToRemove = ['T119', 'L124', 'L137', 'L139', 'LI30'];

orphansToRemove.forEach(handle => {
    // Remove the person block  
    const regex = new RegExp(`\\n?\\s*\\{\\s*handle: '${handle}'[^}]*\\},`, 'g');
    const before = data.length;
    data = data.replace(regex, '');
    if (data.length < before) {
        console.log(`Removed person ${handle}`);
    } else {
        console.log(`Could not find person ${handle}`);
    }
});

// Now check for any other people with issues  
// Find all people whose generation != their actual tree depth
// and find people with parentFamilies referencing nonexistent families  
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle/g;
const famHandles = new Set();
let m;
while ((m = famRegex.exec(data)) !== null) {
    famHandles.add(m[1]);
}

// Check C107 (Hiểu, was under Hớn but chart says should be under Hớn)
// Check if C107 has proper parentFamilies
const c107match = data.match(/handle: 'C107'[\s\S]*?parentFamilies: \[([^\]]*)\]/);
if (c107match) {
    console.log(`C107 parentFamilies: [${c107match[1]}]`);
}

// Also let's check all the "Hiểu" and "Thành" nodes to make sure they're properly linked
const hieuNodes = data.match(/handle: 'C107'[\s\S]*?generation: (\d+)/);
if (hieuNodes) console.log(`C107 generation: ${hieuNodes[1]}`);

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('\nDone. Re-running orphan check...');

// Re-run check
const data2 = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');
const regex2 = /handle:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'[\s\S]*?generation:\s*(\d+)[\s\S]*?parentFamilies:\s*\[([^\]]*)\]/g;
let m2;
console.log('\nPeople with empty parentFamilies:');
while ((m2 = regex2.exec(data2)) !== null) {
    if (!m2[4].trim() && m2[1] !== 'P001') {
        console.log(`  ${m2[1]} ${m2[2]} G${m2[3]}`);
    }
}
