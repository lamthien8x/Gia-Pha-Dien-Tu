const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
let match;
const fatherToFam = {};
while ((match = famRegex.exec(data)) !== null) {
    fatherToFam[match[2]] = match[1];
}

function setChildren(fatherHandle, newChildrenList) {
    let fHandle = fatherToFam[fatherHandle];
    if (!fHandle) {
        fHandle = 'F_' + fatherHandle;
        fatherToFam[fatherHandle] = fHandle;
        const newFam = `
    {
        handle: '${fHandle}', fatherHandle: '${fatherHandle}',
        children: []
    },`;
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
// Apply chart corrections for Liệu and Uẩn
// ============================================

// 1. Renames
data = data.replace(/displayName: 'Lê Huy Liêu', surname: 'Lê', firstName: 'Huy Liêu'/g, "displayName: 'Lê Huy Liệu', surname: 'Lê', firstName: 'Huy Liệu'");
data = data.replace(/displayName: 'Lê Huy Miêu', surname: 'Lê', firstName: 'Huy Miêu'/g, "displayName: 'Lê Huy Miều', surname: 'Lê', firstName: 'Huy Miều'");
data = data.replace(/displayName: 'Lê Huy Quang', surname: 'Lê', firstName: 'Huy Quang'/g, "displayName: 'Lê Huy Quan', surname: 'Lê', firstName: 'Huy Quan'");
data = data.replace(/displayName: 'Lê Huy Thủy', surname: 'Lê', firstName: 'Huy Thủy'/g, "displayName: 'Lê Huy Thúy', surname: 'Lê', firstName: 'Huy Thúy'");
data = data.replace(/displayName: 'Lê Huy Lăng', surname: 'Lê', firstName: 'Huy Lăng'/g, "displayName: 'Lê Huy Lãng', surname: 'Lê', firstName: 'Huy Lãng'");
data = data.replace(/handle: 'LI13'([\s\S]*?)displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng'/g, "handle: 'LI13'$1displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng'");
data = data.replace(/handle: 'LI28'([\s\S]*?)displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh'/g, "handle: 'LI28'$1displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng'");

// 2. Fix Uẩn branch - Move Giáp(LI19), Dũng(LI20), Dương(LI21) from Lãng(LI08) to Bồn(U101)
// Fix generations of Giáp, Dũng, Dương to 12
data = data.replace(/handle: 'LI19'([\s\S]*?generation: )13/g, `handle: 'LI19'$112`);
data = data.replace(/handle: 'LI20'([\s\S]*?generation: )13/g, `handle: 'LI20'$112`);
data = data.replace(/handle: 'LI21'([\s\S]*?generation: )13/g, `handle: 'LI21'$112`);

setChildren('LI08', []); // Lãng has no children
setChildren('U101', ['LI19', 'LI20', 'LI21']); // Bồn has Giáp, Dũng, Dương
setParent('LI19', 'U101');
setParent('LI20', 'U101');
setParent('LI21', 'U101');

// 3. Move Quý(LI22) from Dũng(LI20) to Giáp(LI19)
setChildren('LI20', []); // Dũng has no children
setChildren('LI19', ['LI22']); // Giáp has Quý
setParent('LI22', 'LI19');

// 4. Mơng(LI07) -> Hưng(D990), Bá(LI16), Long(LI17), Linh(LI18)
// Add missing Hưng node (D990)
if (!data.includes("'D990'")) {
    const newPeople = `
    {
        handle: 'D990', gramps_id: 'ID990', gender: 1,
        displayName: 'Lê Huy Hưng', surname: 'Lê', firstName: 'Huy Hưng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['${fatherToFam['LI07']}']
    },`;
    data = data.replace(/(handle: 'LI18'[\s\S]*?\},)/, `$1${newPeople}`);
}
setChildren('LI07', ['D990', 'LI16', 'LI17', 'LI18']);

// 5. Cleanup Long(LI17) - no children
setChildren('LI17', []); // Remove LI30 from Long
setParent('LI30', null); // Disconnect LI30 for now

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Script completed.');
