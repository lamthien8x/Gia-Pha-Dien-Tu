const fs = require('fs');
const data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Find all people with empty parentFamilies that are NOT the root (P001)
const regex = /handle:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'[\s\S]*?generation:\s*(\d+)[\s\S]*?parentFamilies:\s*\[([^\]]*)\]/g;
let m;
console.log('People with empty parentFamilies (potential orphans):');
while ((m = regex.exec(data)) !== null) {
    const handle = m[1];
    const name = m[2];
    const gen = m[3];
    const parents = m[4].trim();
    if (!parents && handle !== 'P001') {
        console.log('  ' + handle + ' ' + name + ' G' + gen);
    }
}

// Find people whose parentFamilies reference a family handle that doesn't exist
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle/g;
const famHandles = new Set();
let fm;
while ((fm = famRegex.exec(data)) !== null) {
    famHandles.add(fm[1]);
}

const pRegex2 = /handle:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'[\s\S]*?parentFamilies:\s*\['([^']+)'\]/g;
console.log('\nPeople whose parentFamilies references missing family:');
while ((m = pRegex2.exec(data)) !== null) {
    if (!famHandles.has(m[3])) {
        console.log('  ' + m[1] + ' ' + m[2] + ' -> missing family ' + m[3]);
    }
}

// Also find people with families that don't exist
const pRegex3 = /handle:\s*'([^']+)'[\s\S]*?displayName:\s*'([^']+)'[\s\S]*?families:\s*\['([^']+)'\]/g;
console.log('\nPeople whose families references missing family:');
while ((m = pRegex3.exec(data)) !== null) {
    if (!famHandles.has(m[3])) {
        console.log('  ' + m[1] + ' ' + m[2] + ' -> missing family ' + m[3]);
    }
}
