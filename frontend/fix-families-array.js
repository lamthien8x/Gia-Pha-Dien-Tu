const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// These fathers need their families arrays updated to include the new F_ family handles
const fixes = [
    // { handle, add family }
    { personHandle: 'D129', addFamily: 'F998' },
    { personHandle: 'D130', addFamily: 'F997' },
    { personHandle: 'LI19', addFamily: 'F_LI19' },
    { personHandle: 'U101', addFamily: 'F_U101' },
    { personHandle: 'CN08', addFamily: 'F_CN08' },
    { personHandle: 'C128', addFamily: 'F_C128' },
    { personHandle: 'C112', addFamily: 'F_C112' },
];

fixes.forEach(({ personHandle, addFamily }) => {
    // Find the person's families: [...] and add the new family
    const regex = new RegExp(`handle: '${personHandle}'([\\s\\S]*?)families: \\[([^\\]]*)\\]`);
    const match = data.match(regex);
    if (!match) {
        console.log(`Could not find ${personHandle}`);
        return;
    }
    const existingFamilies = match[2].trim();
    let newFamilies;
    if (existingFamilies) {
        newFamilies = `${existingFamilies}, '${addFamily}'`;
    } else {
        newFamilies = `'${addFamily}'`;
    }
    data = data.replace(regex, `handle: '${personHandle}'$1families: [${newFamilies}]`);
    console.log(`Fixed ${personHandle}: families now includes ${addFamily}`);
});

// Also fix C107 (Hiểu) - should have F113, but currently has F112
// F112 has father C106, F113 has father C107 
const c107match = data.match(/handle: 'C107'([\s\S]*?)families: \[([^\]]*)\]/);
if (c107match && !c107match[2].includes('F113')) {
    data = data.replace(
        /handle: 'C107'([\s\S]*?)families: \[([^\]]*)\]/,
        (match, p1, fams) => {
            if (fams.includes('F112')) {
                // Replace F112 with F113
                return `handle: 'C107'${p1}families: [${fams.replace('F112', 'F113')}]`;
            }
            return `handle: 'C107'${p1}families: [${fams ? fams + ", 'F113'" : "'F113'"}]`;
        }
    );
    console.log('Fixed C107: families F112 -> F113');
}

// Fix C115 (Mạnh) - should have F119, but currently has F118
const c115match = data.match(/handle: 'C115'([\s\S]*?)families: \[([^\]]*)\]/);
if (c115match && !c115match[2].includes('F119')) {
    data = data.replace(
        /handle: 'C115'([\s\S]*?)families: \[([^\]]*)\]/,
        (match, p1, fams) => {
            if (fams.includes('F118')) {
                return `handle: 'C115'${p1}families: [${fams.replace('F118', 'F119')}]`;
            }
            return `handle: 'C115'${p1}families: [${fams ? fams + ", 'F119'" : "'F119'"}]`;
        }
    );
    console.log('Fixed C115: families F118 -> F119');
}

// Fix L120 (Oánh) - should have F105, but currently has F106
const l120match = data.match(/handle: 'L120'([\s\S]*?)families: \[([^\]]*)\]/);
if (l120match && !l120match[2].includes('F105')) {
    data = data.replace(
        /handle: 'L120'([\s\S]*?)families: \[([^\]]*)\]/,
        (match, p1, fams) => {
            if (fams.includes('F106')) {
                return `handle: 'L120'${p1}families: [${fams.replace('F106', 'F105')}]`;
            }
            return `handle: 'L120'${p1}families: [${fams ? fams + ", 'F105'" : "'F105'"}]`;
        }
    );
    console.log('Fixed L120: families F106 -> F105');
}

// Also add D999 person if missing
if (!data.includes("handle: 'D999'")) {
    console.log("Adding missing person D999 (Hiền)...");
    // Insert D999 after D998
    data = data.replace(
        /(handle: 'D998'[^}]*\},)/,
        `$1
    {
        handle: 'D999', gramps_id: 'ID999', gender: 1,
        displayName: 'Lê Huy Hiền', surname: 'Lê', firstName: 'Huy Hiền',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F999'], parentFamilies: ['F069']
    },`
    );
}

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('\nDone fixing families arrays.');
