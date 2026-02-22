const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

const peopleRegex = /handle:\s*'([^']+)',.*?displayName:\s*'([^']+)',.*?generation:\s*(\d+)/gs;
const people = {};
let match;
while ((match = peopleRegex.exec(data)) !== null) {
    people[match[1]] = { name: match[2], gen: parseInt(match[3]) };
}

const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
const families = {};
while ((match = famRegex.exec(data)) !== null) {
    const childrenStr = match[3];
    const children = [];
    const childRegex = /'([^']+)'/g;
    let childMatch;
    while ((childMatch = childRegex.exec(childrenStr)) !== null) {
        children.push(childMatch[1]);
    }
    families[match[1]] = { father: match[2], children };
}

function printTree(personId, indent) {
    const p = people[personId];
    if (!p) return;
    console.log('  '.repeat(indent) + p.name + ' (' + personId + ', G' + p.gen + ')');
    if (p.gen >= 15) return;

    for (const fId in families) {
        if (families[fId].father === personId) {
            for (const childId of families[fId].children) {
                printTree(childId, indent + 1);
            }
        }
    }
}

console.log(`=== THẾ HỆ 10-14 CHI 3: HUY LIÊU (P050) ===`);
printTree('P050', 0);
