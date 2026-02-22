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
  if (p.gen >= 10) return; // Stop at G10

  for (const fId in families) {
    if (families[fId].father === personId) {
      for (const childId of families[fId].children) {
        printTree(childId, indent + 1);
      }
    }
  }
}

console.log("=== BRANCH 1: ĐỨC THẬN ===");
printTree('P004', 0);
console.log("\n=== BRANCH 2: ĐỨC TRẠCH ===");
printTree('P005', 0);
console.log("\n=== BRANCH 3: ĐỨC THUẦN ===");
printTree('P006', 0);
