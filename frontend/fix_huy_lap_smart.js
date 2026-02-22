const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Build mapping of fatherHandle -> F handle
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
let match;
const fatherToFam = {};
while ((match = famRegex.exec(data)) !== null) {
  fatherToFam[match[2]] = match[1];
}

// Helper to replace children of a specific fatherHandle
function setChildren(fatherHandle, newChildrenList) {
  const fHandle = fatherToFam[fatherHandle];
  if (!fHandle) { console.error("No family found for father:", fatherHandle); return; }

  const childrenStr = newChildrenList.map(c => `'${c}'`).join(', ');

  const re = new RegExp(`handle: '${fHandle}',\\s*fatherHandle: '${fatherHandle}',\\s*children: \\[[^\\]]*\\]`, 'g');
  data = data.replace(re, `handle: '${fHandle}', fatherHandle: '${fatherHandle}',\n        children: [${childrenStr}]`);
  console.log(`Set children for ${fatherHandle} (${fHandle}) -> [${newChildrenList.join(', ')}]`);
}

// Helper to set parentFamilies for a specific person handle
function setParent(personHandle, fatherHandle) {
  const fHandle = fatherHandle ? fatherToFam[fatherHandle] : null;
  const parentFamStr = fHandle ? `['${fHandle}']` : `[]`;

  const re = new RegExp(`handle: '${personHandle}'([\\s\\S]*?)parentFamilies: \\[[^\\]]*\\]`, 'g');
  data = data.replace(re, `handle: '${personHandle}'$1parentFamilies: ${parentFamStr}`);
  console.log(`Set parent for ${personHandle} -> ${fHandle}`);
}

// ============================================
// Apply chart corrections for Gen 10-14 CHI 1 LẠP BRANCH
// ============================================

// 1. Xích branch
// L113 (Thanh) -> Hiếu(L128), Lâm(D992)
setChildren('L113', ['L128', 'D992']);
setParent('L128', 'L113');

// 2. Lạng branch
// L118 (Chiến) -> Dương (L134), Cương (L135), Thái (L136), Lê Huy (L138)
setChildren('L118', ['L134', 'L135', 'L136', 'L138']);
setParent('L134', 'L118');
setParent('L135', 'L118');
setParent('L136', 'L118');
setParent('L138', 'L118');

// 3. Nhinh branch -> Lô
// L109 (Lô) -> Tám (L119), Oánh (L120), Duyệt (L121), Doãn (L144), Đàn (L122)
setChildren('L109', ['L119', 'L120', 'L121', 'L144', 'L122']);
setParent('L119', 'L109');
setParent('L120', 'L109');
setParent('L121', 'L109');
setParent('L144', 'L109');
setParent('L122', 'L109');

// Tám (L119) -> Vịnh (L142)
setChildren('L119', ['L142']);
setParent('L142', 'L119');

// Oánh (L120) -> Tuấn (L141)
setChildren('L120', ['L141']);
setParent('L141', 'L120');

// Duyệt (L121) -> Việt (L140)
setChildren('L121', ['L140']);
setParent('L140', 'L121');

// Đàn (L122) -> empty
setChildren('L122', []);

// 4. Inh branch
// Mợi (L110) -> Hùng (L123), Hạnh (L127)
setChildren('L110', ['L123', 'L127']);
setParent('L123', 'L110');
setParent('L127', 'L110');

// Đạo (L111) -> empty
if (fatherToFam['L111']) setChildren('L111', []);

// Thạo (L112) -> Thành (L125), Tính (L126)
setChildren('L112', ['L125', 'L126']);
setParent('L125', 'L112');
setParent('L126', 'L112');

// Hùng (L123) -> empty
setChildren('L123', []);
setParent('L139', null); // Hướng disconnected

// Hạnh (L127) -> empty
if (fatherToFam['L127']) setChildren('L127', []);

// Thành (L125) -> empty
if (fatherToFam['L125']) setChildren('L125', []);

// Tính (L126) -> Hoàng (L143)
setChildren('L126', ['L143']);
setParent('L143', 'L126');

// Disconnected ones
setParent('L137', null); // Dung disconnected
setParent('L124', null); // Extra Đạo disconnected


// Add new person D992 (Lâm) if not exists
if (!data.includes("'D992'")) {
  const parentFamStr = fatherToFam['L113'] ? `['${fatherToFam['L113']}']` : `[]`;
  const newPeople = `
    {
        handle: 'D992', gramps_id: 'ID992', gender: 1,
        displayName: 'Lê Huy Lâm', surname: 'Lê', firstName: 'Huy Lâm',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ${parentFamStr}
    },`;

  data = data.replace(/handle: 'L144', gramps_id: 'I0180', gender: 1,\n        displayName: 'Lê Huy Doãn', surname: 'Lê', firstName: 'Huy Doãn',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\](.*?)parentFamilies: \[(.*?)\]\n    },/g,
    `handle: 'L144', gramps_id: 'I0180', gender: 1,
        displayName: 'Lê Huy Doãn', surname: 'Lê', firstName: 'Huy Doãn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: []$1parentFamilies: [$2]
    },${newPeople}`);
}

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Script completed.');
