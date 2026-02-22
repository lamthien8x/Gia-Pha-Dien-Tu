const fs = require('fs');

const data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

const peopleRegex = /handle:\s*'([^']+)',.*?displayName:\s*'([^']+)',/gs;
const genRegex = /handle:\s*'([^']+)',.*?generation:\s*(\d+)/gs;
const people = {};

let match;
while ((match = peopleRegex.exec(data)) !== null) {
  if (!people[match[1]]) people[match[1]] = {};
  people[match[1]].name = match[2];
}

while ((match = genRegex.exec(data)) !== null) {
  if (!people[match[1]]) people[match[1]] = {};
  people[match[1]].gen = parseInt(match[2]);
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
  console.log('  '.repeat(indent) + p.name + ' (G' + p.gen + ')');
  if (p.gen >= 15) return;

  for (const fId in families) {
    if (families[fId].father === personId) {
      for (const childId of families[fId].children) {
        printTree(childId, indent + 1);
      }
    }
  }
}

// Find handles for Huy Cung and Huy Cớn
let cungHandle = '';
let conHandle = '';
for (const [handle, p] of Object.entries(people)) {
  if (p.name === 'Lê Huy Cung' && p.gen === 10) cungHandle = handle;
  if (p.name === 'Lê Huy Cớn' && p.gen === 10) conHandle = handle;
}

console.log(`=== THẾ HỆ 10-14 CHI 3: HUY CUNG (${cungHandle}) ===`);
if (cungHandle) printTree(cungHandle, 0);

console.log(`\n=== THẾ HỆ 10-14 CHI 3: HUY CỚN (${conHandle}) ===`);
if (conHandle) printTree(conHandle, 0);
