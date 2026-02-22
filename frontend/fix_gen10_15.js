const fs = require('fs');

let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

// Helper to replace precisely in text
function replace(desc, regex, replacement) {
  if (!data.match(regex)) { console.error("FAILED to find:", desc); return; }
  data = data.replace(regex, replacement);
  console.log("Applied:", desc);
}

// 1. T117 rename to Viên, change parent
replace('T117', 
/handle: 'T117', gramps_id: 'I0109', gender: 1,\n        displayName: 'Lê Huy Thế', surname: 'Lê', firstName: 'Huy Thế',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F058'\]/g,
`handle: 'T117', gramps_id: 'I0109', gender: 1,
        displayName: 'Lê Huy Viên', surname: 'Lê', firstName: 'Huy Viên',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F058a']`);

// 3. V108 (Huy Văn) parentFams F058
replace('V108',
/handle: 'V108', gramps_id: 'I0122', gender: 1,\n        displayName: 'Lê Huy Văn', surname: 'Lê', firstName: 'Huy Văn',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F064'\]/g,
`handle: 'V108', gramps_id: 'I0122', gender: 1,
        displayName: 'Lê Huy Văn', surname: 'Lê', firstName: 'Huy Văn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F058']`);

// 5. T119 (Huy Nam) disconnect
replace('T119',
/handle: 'T119', gramps_id: 'I0111', gender: 1,\n        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F058'\]/g,
`handle: 'T119', gramps_id: 'I0111', gender: 1,
        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: []`);

// 6 & 12. T116 (Viện) parentFams F055, add F058a
replace('T116',
/handle: 'T116', gramps_id: 'I0108', gender: 1,\n        displayName: 'Lê Huy Viện', surname: 'Lê', firstName: 'Huy Viện',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F058'\]/g,
`handle: 'T116', gramps_id: 'I0108', gender: 1,
        displayName: 'Lê Huy Viện', surname: 'Lê', firstName: 'Huy Viện',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F058a'], parentFamilies: ['F055']`);

// 10. V107 (Tùng) parentFam F064a
replace('V107',
/handle: 'V107', gramps_id: 'I0121', gender: 1,\n        displayName: 'Lê Huy Tùng', surname: 'Lê', firstName: 'Huy Tùng',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F064'\]/g,
`handle: 'V107', gramps_id: 'I0121', gender: 1,
        displayName: 'Lê Huy Tùng', surname: 'Lê', firstName: 'Huy Tùng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F064a']`);

// 11. V106 (Thế) add F064a
replace('V106',
/handle: 'V106', gramps_id: 'I0120', gender: 1,\n        displayName: 'Lê Huy Thế', surname: 'Lê', firstName: 'Huy Thế',\n        generation: 13, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F063'\]/g,
`handle: 'V106', gramps_id: 'I0120', gender: 1,
        displayName: 'Lê Huy Thế', surname: 'Lê', firstName: 'Huy Thế',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F064a'], parentFamilies: ['F063']`);

// 16. T113 (Bảng) parentFam F056a
replace('T113',
/handle: 'T113', gramps_id: 'I0105', gender: 1,\n        displayName: 'Lê Huy Bảng', surname: 'Lê', firstName: 'Huy Bảng',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\'F059\'\], parentFamilies: \['F056'\]/g,
`handle: 'T113', gramps_id: 'I0105', gender: 1,
        displayName: 'Lê Huy Bảng', surname: 'Lê', firstName: 'Huy Bảng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F059'], parentFamilies: ['F056a']`);

// 17. T114 (Tuấn) parentFam F056b, add F059a
replace('T114',
/handle: 'T114', gramps_id: 'I0106', gender: 1,\n        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F056'\]/g,
`handle: 'T114', gramps_id: 'I0106', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F059a'], parentFamilies: ['F056b']`);

// 18. T107 (Thụ) add F056a
replace('T107',
/handle: 'T107', gramps_id: 'I0099', gender: 1,\n        displayName: 'Lê Huy Thụ', surname: 'Lê', firstName: 'Huy Thụ',\n        generation: 13, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F054'\]/g,
`handle: 'T107', gramps_id: 'I0099', gender: 1,
        displayName: 'Lê Huy Thụ', surname: 'Lê', firstName: 'Huy Thụ',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F056a'], parentFamilies: ['F054']`);

// 19. T108 (Phú) add F056b
replace('T108',
/handle: 'T108', gramps_id: 'I0100', gender: 1,\n        displayName: 'Lê Huy Phú', surname: 'Lê', firstName: 'Huy Phú',\n        generation: 13, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F054'\]/g,
`handle: 'T108', gramps_id: 'I0100', gender: 1,
        displayName: 'Lê Huy Phú', surname: 'Lê', firstName: 'Huy Phú',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F056b'], parentFamilies: ['F054']`);

// 22. T121 (Anh) parentFam F059a
replace('T121',
/handle: 'T121', gramps_id: 'I0113', gender: 1,\n        displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh',\n        generation: 15, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F059'\]/g,
`handle: 'T121', gramps_id: 'I0113', gender: 1,
        displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F059a']`);

// Update existing families
replace('F055 (Đơng)',
/handle: 'F055', fatherHandle: 'T105',\n        children: \['T109', 'T110', 'T111', 'T112'\]/g,
`handle: 'F055', fatherHandle: 'T105',
        children: ['T109', 'T116', 'T110', 'T111', 'T112']`);

replace('F058 (Khôi)',
/handle: 'F058', fatherHandle: 'T112',\n        children: \['T116', 'T117', 'T118', 'T119'\]/g,
`handle: 'F058', fatherHandle: 'T112',
        children: ['T118', 'V108']`);

replace('F064 (Liễn)',
/handle: 'F064', fatherHandle: 'V105',\n        children: \['V107', 'V108'\]/g,
`handle: 'F064', fatherHandle: 'V105',
        children: []`);

replace('F056 (Quý)',
/handle: 'F056', fatherHandle: 'T106',\n        children: \['T113', 'T114'\]/g,
`handle: 'F056', fatherHandle: 'T106',
        children: []`);

replace('F059 (Bảng)',
/handle: 'F059', fatherHandle: 'T113',\n        children: \['T120', 'T121'\]/g,
`handle: 'F059', fatherHandle: 'T113',
        children: ['T120']`);

// Add new families
const newFams = `
    {
        handle: 'F056a', fatherHandle: 'T107',
        children: ['T113']
    },
    {
        handle: 'F056b', fatherHandle: 'T108',
        children: ['T114']
    },
    {
        handle: 'F058a', fatherHandle: 'T116',
        children: ['T117']
    },
    {
        handle: 'F059a', fatherHandle: 'T114',
        children: ['T121']
    },
    {
        handle: 'F064a', fatherHandle: 'V106',
        children: ['V107']
    },`;

data = data.replace(/handle: 'F064', fatherHandle: 'V105',\n        children: \[\]\n    },/g, `handle: 'F064', fatherHandle: 'V105',\n        children: []\n    },${newFams}`);

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Done.');

