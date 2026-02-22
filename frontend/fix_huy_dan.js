const fs = require('fs');

let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Helper to replace precisely in text
function replace(desc, regex, replacement) {
  if (!data.match(regex)) { console.error("FAILED to find:", desc); return; }
  data = data.replace(regex, replacement);
  console.log("Applied:", desc);
}

// ============================================
// 1. Huy Thảng branch (D106 to D109)
// Move children of Hiểu (D106) to Cầu (D107), Quán (D108), Cống (D109)
// DB currently has F105 (Hiểu) -> D117, D118, D119, D120 and F106(Cầu), F107(Quán), F108(Cống) -> empty.
// ============================================
replace('F105 (Hiểu)',
/handle: 'F105', fatherHandle: 'D106',\n        children: \['D117', 'D118', 'D119', 'D120'\]/g,
`handle: 'F105', fatherHandle: 'D106',
        children: []`);

replace('F106 (Cầu)',
/handle: 'F106', fatherHandle: 'D107',\n        children: \[\]/g,
`handle: 'F106', fatherHandle: 'D107',
        children: ['D117', 'D118']`);

replace('F107 (Quán)',
/handle: 'F107', fatherHandle: 'D108',\n        children: \[\]/g,
`handle: 'F107', fatherHandle: 'D108',
        children: ['D119']`);

replace('F108 (Cống)',
/handle: 'F108', fatherHandle: 'D109',\n        children: \[\]/g,
`handle: 'F108', fatherHandle: 'D109',
        children: ['D120']`);

// Update parentFamilies for D117, D118, D119, D120
replace('D117 parent', /handle: 'D117'[\s\S]*?parentFamilies: \['F105'\]/g, match => match.replace("'F105'", "'F106'"));
replace('D118 parent', /handle: 'D118'[\s\S]*?parentFamilies: \['F105'\]/g, match => match.replace("'F105'", "'F106'"));
replace('D119 parent', /handle: 'D119'[\s\S]*?parentFamilies: \['F105'\]/g, match => match.replace("'F105'", "'F107'"));
replace('D120 parent', /handle: 'D120'[\s\S]*?parentFamilies: \['F105'\]/g, match => match.replace("'F105'", "'F108'"));


// ============================================
// 2. Huy Đợi branch
// Create D999 (Hiền), D998 (Gian), D997 (Hòa), D996 (Trưởng), D995 (Hiệp)
// Move Hậu (D121) from Lành to Hiền.
// Move Tuấn (D132) from Tú (D124) to Tuấn (D123)
// Move Hóa (D128) from Sơn to Năm
// ============================================

replace('F109 (Lành)',
/handle: 'F109', fatherHandle: 'D110',\n        children: \['D121', 'D122', 'D123', 'D124'\]/g,
`handle: 'F109', fatherHandle: 'D110',
        children: ['D122', 'D123', 'D124']`);

replace('F112 (Năm)',
/handle: 'F112', fatherHandle: 'D113',\n        children: \[\]/g,
`handle: 'F112', fatherHandle: 'D113',
        children: ['D997', 'D128']`);

replace('F113 (Sơn)',
/handle: 'F113', fatherHandle: 'D114',\n        children: \['D128'\]/g,
`handle: 'F113', fatherHandle: 'D114',
        children: ['D996']`);

replace('F114 (Thủy)',
/handle: 'F114', fatherHandle: 'D115',\n        children: \[\]/g,
`handle: 'F114', fatherHandle: 'D115',
        children: ['D995']`);

replace('F118 (Tuấn)',
/handle: 'F118', fatherHandle: 'D123',\n        children: \[\]/g,
`handle: 'F118', fatherHandle: 'D123',
        children: ['D132']`);

replace('F119 (Tú)',
/handle: 'F119', fatherHandle: 'D124',\n        children: \['D132', 'D133'\]/g,
`handle: 'F119', fatherHandle: 'D124',
        children: ['D133']`);

// Update parents
replace('D121 parent', /handle: 'D121'[\s\S]*?parentFamilies: \['F109'\]/g, match => match.replace("'F109'", "'F999'"));
replace('D128 parent', /handle: 'D128'[\s\S]*?parentFamilies: \['F113'\]/g, match => match.replace("'F113'", "'F112'"));
replace('D132 parent', /handle: 'D132'[\s\S]*?parentFamilies: \['F119'\]/g, match => match.replace("'F119'", "'F118'"));

// Add D999 to F103 (Đợi)
replace('F103 (Đợi)',
/handle: 'F103', fatherHandle: 'D104',\n        children: \['D110', 'D111', 'D112', 'D113', 'D114', 'D115'\]/g,
`handle: 'F103', fatherHandle: 'D104',
        children: ['D999', 'D110', 'D111', 'D112', 'D113', 'D114', 'D115']`);

// Add new families and people
const newFams = `
    {
        handle: 'F999', fatherHandle: 'D999',
        children: ['D121', 'D998']
    },
    {
        handle: 'F998', fatherHandle: 'D129',
        children: ['D994']
    },
    {
        handle: 'F997', fatherHandle: 'D130',
        children: ['D993']
    },`;

data = data.replace(/handle: 'F114', fatherHandle: 'D115',\n        children: \['D995'\]\n    },/g, `handle: 'F114', fatherHandle: 'D115',\n        children: ['D995']\n    },${newFams}`);

const newPeople = `
    {
        handle: 'D999', gramps_id: 'ID999', gender: 1,
        displayName: 'Lê Huy Hiền', surname: 'Lê', firstName: 'Huy Hiền',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F999'], parentFamilies: ['F103']
    },
    {
        handle: 'D998', gramps_id: 'ID998', gender: 1,
        displayName: 'Lê Huy Gian', surname: 'Lê', firstName: 'Huy Gian',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F999']
    },
    {
        handle: 'D997', gramps_id: 'ID997', gender: 1,
        displayName: 'Lê Huy Hòa', surname: 'Lê', firstName: 'Huy Hòa',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F112']
    },
    {
        handle: 'D996', gramps_id: 'ID996', gender: 1,
        displayName: 'Lê Huy Trưởng', surname: 'Lê', firstName: 'Huy Trưởng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F113']
    },
    {
        handle: 'D995', gramps_id: 'ID995', gender: 1,
        displayName: 'Lê Huy Hiệp', surname: 'Lê', firstName: 'Huy Hiệp',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F114']
    },
    {
        handle: 'D994', gramps_id: 'ID994', gender: 1,
        displayName: 'Lê Huy Hoàn', surname: 'Lê', firstName: 'Huy Hoàn',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F998']
    },
    {
        handle: 'D993', gramps_id: 'ID993', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F997']
    },`;

data = data.replace(/handle: 'D135', gramps_id: 'I0149', gender: 1,\n        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',\n        generation: 15, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F120'\]\n    },/g, 
`handle: 'D135', gramps_id: 'I0149', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F120']
    },${newPeople}`);

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Done.');

