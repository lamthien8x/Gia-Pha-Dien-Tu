const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Build mapping of fatherHandle -> F handle
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
let match;
const fatherToFam = {};
while ((match = famRegex.exec(data)) !== null) {
    fatherToFam[match[2]] = match[1];
}

function setChildren(fatherHandle, newChildrenList) {
    let fHandle = fatherToFam[fatherHandle];
    if (!fHandle) {
        // Need to create a new family if it doesn't exist?
        // For this script, all our target fathers actually have families already except maybe Tưởng or Lê Huy
        fHandle = 'F_' + fatherHandle;
        fatherToFam[fatherHandle] = fHandle;
        // We will inject the new family
        const newFam = `
    {
        handle: '${fHandle}', fatherHandle: '${fatherHandle}',
        children: []
    },`;
        // Insert after F148
        data = data.replace(/(handle: 'F148'[\s\S]*?\},)/, `$1${newFam}`);
    }

    const childrenStr = newChildrenList.map(c => `'${c}'`).join(', ');
    const re = new RegExp(`handle: '${fHandle}',\\s*fatherHandle: '${fatherHandle}',\\s*children: \\[[^\\]]*\\]`, 'g');
    data = data.replace(re, `handle: '${fHandle}', fatherHandle: '${fatherHandle}',\n        children: [${childrenStr}]`);
    console.log(`Set children for ${fatherHandle} (${fHandle}) -> [${newChildrenList.join(', ')}]`);
}

function setParent(personHandle, fatherHandle) {
    const fHandle = fatherHandle ? fatherToFam[fatherHandle] : null;
    const parentFamStr = fHandle ? `['${fHandle}']` : `[]`;
    const re = new RegExp(`handle: '${personHandle}'([\\s\\S]*?)parentFamilies: \\[[^\\]]*\\]`, 'g');
    data = data.replace(re, `handle: '${personHandle}'$1parentFamilies: ${parentFamStr}`);
    console.log(`Set parent for ${personHandle} -> ${fHandle}`);
}

// ============================================
// Apply chart corrections for Gen 10-14 CHI 3
// ============================================

// Rename C105 (Huy Dương) to Huy Dung
data = data.replace(/displayName: 'Lê Huy Dương', surname: 'Lê', firstName: 'Huy Dương',(\s*generation: 12,\s*chi: 3,)/g,
    "displayName: 'Lê Huy Dung', surname: 'Lê', firstName: 'Huy Dung',$1");

// Cung Branch
// C112 (Hân) -> C124 (Hiếu), C125 (Cường)
setChildren('C112', ['C124', 'C125']);
setParent('C124', 'C112');
setParent('C125', 'C112');

// C113 (Hạnh) -> empty
setChildren('C113', []);

// C106 (Mùi) -> C115 (Mạnh), C116 (Tảo), C128 (Tưởng), C117 (Nguyễn)
setChildren('C106', ['C115', 'C116', 'C128', 'C117']);
setParent('C116', 'C106');
setParent('C128', 'C106');
setParent('C117', 'C106');

// C117 (Nguyễn) -> empty
setChildren('C117', []);

// C128 (Tưởng) -> generation 13, child D991
// Update generation
data = data.replace(/handle: 'C128'([\s\S]*?generation: )14/g, `handle: 'C128'$113`);
setChildren('C128', ['D991']);

// C107 (Hiểu) -> C118 (Thành), C119 (Sơn)
setChildren('C107', ['C118', 'C119']);
setParent('C118', 'C107');
setParent('C119', 'C107');

// C108 (Hùng) -> C120 (Dương)
setChildren('C108', ['C120']);
setParent('C120', 'C108');

// C109 (Khuôn) -> C121 (Hữu Khanh)
setChildren('C109', ['C121']);
setParent('C121', 'C109');

// C110 (Điển) -> empty
setChildren('C110', []);

// Cớn Branch
// CN07 (Hanh) -> CN15 (Việt Anh)
setChildren('CN07', ['CN15']);
setParent('CN15', 'CN07');

// CN08 (Lê Huy) -> CN16 (Phi Hùng)
setChildren('CN08', ['CN16']);
setParent('CN16', 'CN08');

// Add new person D991 (Đương)
const parentFamStrC128 = `['${fatherToFam['C128']}']`;
const newPeople = `
    {
        handle: 'D991', gramps_id: 'ID991', gender: 1,
        displayName: 'Lê Huy Đương', surname: 'Lê', firstName: 'Huy Đương',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ${parentFamStrC128}
    },`;

data = data.replace(/handle: 'C132', gramps_id: 'I0144', gender: 1,\n        displayName: 'Lê Gia Bảo', surname: 'Lê', firstName: 'Gia Bảo',\n        generation: 14, chi: 3,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F146'\]\n    },/g,
    `handle: 'C132', gramps_id: 'I0144', gender: 1,
        displayName: 'Lê Gia Bảo', surname: 'Lê', firstName: 'Gia Bảo',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F146']
    },${newPeople}`);

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Script completed.');
