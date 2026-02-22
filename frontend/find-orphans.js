const fs = require('fs');
const data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Parse people
const peopleRegex = /handle:\s*'([^']+)',.*?displayName:\s*'([^']+)',.*?generation:\s*(\d+)/gs;
const people = {};
let m;
while ((m = peopleRegex.exec(data)) !== null) {
    people[m[1]] = { name: m[2], gen: parseInt(m[3]) };
}

// Parse families
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
const families = {};
while ((m = famRegex.exec(data)) !== null) {
    const children = [];
    const childRegex = /'([^']+)'/g;
    let cm;
    while ((cm = childRegex.exec(m[3])) !== null) children.push(cm[1]);
    families[m[1]] = { father: m[2], children };
}

// BFS from P001 to find all reachable nodes
const reachable = new Set();
const queue = ['P001'];
reachable.add('P001');

while (queue.length > 0) {
    const current = queue.shift();
    // Find all families where current is the father
    for (const [fHandle, fam] of Object.entries(families)) {
        if (fam.father === current) {
            for (const child of fam.children) {
                if (!reachable.has(child)) {
                    reachable.add(child);
                    queue.push(child);
                }
            }
        }
    }
}

console.log(`Total people: ${Object.keys(people).length}`);
console.log(`Reachable from P001: ${reachable.size}`);
console.log(`\nUnreachable nodes (${Object.keys(people).length - reachable.size}):`);

const unreachable = [];
for (const [handle, p] of Object.entries(people)) {
    if (!reachable.has(handle)) {
        unreachable.push({ handle, ...p });
    }
}

// Sort by generation
unreachable.sort((a, b) => a.gen - b.gen);
unreachable.forEach(p => {
    // Find parent family
    const pfMatch = data.match(new RegExp(`handle: '${p.handle}'[\\s\\S]*?parentFamilies: \\[([^\\]]*)\\]`));
    const pf = pfMatch ? pfMatch[1].trim() : 'N/A';
    console.log(`  ${p.handle} ${p.name} G${p.gen} parentFamilies=[${pf}]`);
});

// Also find families that reference unreachable fathers
console.log('\nFamilies with unreachable fathers:');
for (const [fHandle, fam] of Object.entries(families)) {
    if (!reachable.has(fam.father) && people[fam.father]) {
        console.log(`  ${fHandle} father=${fam.father} (${people[fam.father].name}) children=[${fam.children.join(', ')}]`);
    }
}
