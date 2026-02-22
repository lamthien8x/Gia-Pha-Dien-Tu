const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

function replace(desc, regex, replacement) {
  if (!data.match(regex)) { console.error("FAILED to find:", desc); return; }
  data = data.replace(regex, replacement);
  console.log("Applied:", desc);
}

// Extract families for reference
const famRegex = /handle:\s*'([^']+)',\s*fatherHandle:\s*'([^']+)',\s*children:\s*\[([^\]]*)\]/gs;
let match;
const fMap = {};
while ((match = famRegex.exec(data)) !== null) {
  fMap[match[2]] = match[1]; // fatherHandle -> F handle
}

// 1. L113 (Thanh) -> Hiếu, Lâm (D992)
replace('F086 (Thanh)',
/handle: 'F086', fatherHandle: 'L113',\n        children: \['L128'\]/g,
`handle: 'F086', fatherHandle: 'L113',
        children: ['L128', 'D992']`);

// 2. L118 (Chiến) -> Dương (L134), Cương (L135), Thái (L136), Lê Huy (L138)
replace('F091 (Chiến)',
/handle: 'F091', fatherHandle: 'L118',\n        children: \['L134'\]/g,
`handle: 'F091', fatherHandle: 'L118',
        children: ['L134', 'L135', 'L136', 'L138']`);

// 3. L109 (Lô) -> Tám (L119), Oánh (L120), Duyệt (L121), Doãn (L144), Đàn (L122)
replace('F084 (Lô)',
/handle: 'F084', fatherHandle: 'L109',\n        children: \['L119', 'L120', 'L121', 'L122'\]/g,
`handle: 'F084', fatherHandle: 'L109',
        children: ['L119', 'L120', 'L121', 'L144', 'L122']`);

// 4. L119 (Tám) -> Vịnh (L142)
replace('F092 (Tám)',
/handle: 'F092', fatherHandle: 'L119',\n        children: \['L135'\]/g,
`handle: 'F092', fatherHandle: 'L119',
        children: ['L142']`);

// 5. L120 (Oánh) -> Tuấn (L141)
replace('F093 (Oánh)',
/handle: 'F093', fatherHandle: 'L120',\n        children: \['L144'\]/g,
`handle: 'F093', fatherHandle: 'L120',
        children: ['L141']`);

// 6. L121 (Duyệt) -> Việt (L140)
replace('F094 (Duyệt)',
/handle: 'F094', fatherHandle: 'L121',\n        children: \['L136', 'L137'\]/g,
`handle: 'F094', fatherHandle: 'L121',
        children: ['L140']`);

// 7. L122 (Đàn) -> empty
replace('F095 (Đàn)',
/handle: 'F095', fatherHandle: 'L122',\n        children: \['L138'\]/g,
`handle: 'F095', fatherHandle: 'L122',
        children: []`);

// 8. L110 (Mợi) -> Hùng (L123), Hạnh (L127)
replace('F085 (Mợi)',
/handle: 'F085', fatherHandle: 'L110',\n        children: \['L123', 'L124'\]/g,
`handle: 'F085', fatherHandle: 'L110',
        children: ['L123', 'L127']`);

// 9. L111 (Đạo G12) -> empty
replace('F100 (Đạo G12)',
/handle: 'F100', fatherHandle: 'L111',\n        children: \['L125'\]/g,
`handle: 'F100', fatherHandle: 'L111',
        children: []`);

// 10. L112 (Thạo) -> Thành (L125), Tính (L126)
replace('F101 (Thạo)',
/handle: 'F101', fatherHandle: 'L112',\n        children: \['L126', 'L127'\]/g,
`handle: 'F101', fatherHandle: 'L112',
        children: ['L125', 'L126']`);

// 11. L123 (Hùng) -> empty
replace('F096 (Hùng)',
/handle: 'F096', fatherHandle: 'L123',\n        children: \['L139'\]/g,
`handle: 'F096', fatherHandle: 'L123',
        children: []`);

// 12. L127 (Hạnh) -> empty
replace('F103 (Hạnh)',
/handle: 'F103', fatherHandle: 'L127',\n        children: \['L143'\]/g,
`handle: 'F103', fatherHandle: 'L127',
        children: []`);

// 13. L125 (Thành) -> empty
replace('F101a (Thành)',  // Wait! Did L125 have an F? Let's check fMap!
/handle: 'F101', fatherHandle: 'L125',\n        children: \['L140', 'L141'\]/g,
`handle: 'F101a', fatherHandle: 'L125',
        children: []`);
// Wait, I am replacing F101. But F101 was already Thạo above!
// Ah, the DB could have Duplicated F handles or Thành uses a different F.
// Let me just replace by fatherHandle instead.
replace('Thành Fam',
/fatherHandle: 'L125',\n        children: \['L140', 'L141'\]/g,
`fatherHandle: 'L125',
        children: []`);

// 14. L126 (Tính) -> Hoàng (L143)
replace('Tính Fam',
/fatherHandle: 'L126',\n        children: \['L142'\]/g,
`fatherHandle: 'L126',
        children: ['L143']`);

// Update parentFamilies for individuals
// Doãn (L144) parent: F093(Oánh) -> F084(Lô)
replace('L144 parent', /handle: 'L144'[\s\S]*?parentFamilies: \['F093'\]/g, match => match.replace("'F093'", "'F084'"));
// Vịnh (L142) parent: F102(Tính) -> F092(Tám)
replace('L142 parent', /handle: 'L142'[\s\S]*?parentFamilies: \['F102'\]/g, match => match.replace("'F102'", "'F092'"));
// Tuấn (L141) parent: Thành -> F093(Oánh)
replace('L141 parent', /handle: 'L141'[\s\S]*?parentFamilies: \['F101'\]/g, match => match.replace("'F101'", "'F093'"));
// Việt (L140) parent: Thành -> F094(Duyệt)
replace('L140 parent', /handle: 'L140'[\s\S]*?parentFamilies: \['F101'\]/g, match => match.replace("'F101'", "'F094'"));
// Cương (L135) parent: F092(Tám) -> F091(Chiến)
replace('L135 parent', /handle: 'L135'[\s\S]*?parentFamilies: \['F092'\]/g, match => match.replace("'F092'", "'F091'"));
// Thái (L136) parent: F094(Duyệt) -> F091(Chiến)
replace('L136 parent', /handle: 'L136'[\s\S]*?parentFamilies: \['F094'\]/g, match => match.replace("'F094'", "'F091'"));
// Lê Huy (L138) parent: F095(Đàn) -> F091(Chiến)
replace('L138 parent', /handle: 'L138'[\s\S]*?parentFamilies: \['F095'\]/g, match => match.replace("'F095'", "'F091'"));
// Hạnh (L127) parent: F101(Thạo) -> F085(Mợi)
replace('L127 parent', /handle: 'L127'[\s\S]*?parentFamilies: \['F101'\]/g, match => match.replace("'F101'", "'F085'"));
// Thành (L125) parent: F100(Đạo) -> F101(Thạo)
replace('L125 parent', /handle: 'L125'[\s\S]*?parentFamilies: \['F100'\]/g, match => match.replace("'F100'", "'F101'"));
// Hoàng (L143) parent: F103(Hạnh) -> F102(Tính) 
replace('L143 parent', /handle: 'L143'[\s\S]*?parentFamilies: \['F103'\]/g, match => match.replace("'F103'", "'F102'"));
// Hướng (L139), Dung (L137), Đạo G13 (L124) -> no parents
replace('L139 parent', /handle: 'L139'[\s\S]*?parentFamilies: \['F096'\]/g, match => match.replace("'F096'", ""));
replace('L137 parent', /handle: 'L137'[\s\S]*?parentFamilies: \['F094'\]/g, match => match.replace("'F094'", ""));
replace('L124 parent', /handle: 'L124'[\s\S]*?parentFamilies: \['F085'\]/g, match => match.replace("'F085'", ""));


// Add new person D992 (Lâm)
const newPeople = `
    {
        handle: 'D992', gramps_id: 'ID992', gender: 1,
        displayName: 'Lê Huy Lâm', surname: 'Lê', firstName: 'Huy Lâm',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F086']
    },`;

data = data.replace(/handle: 'L144', gramps_id: 'I0180', gender: 1,\n        displayName: 'Lê Huy Doãn', surname: 'Lê', firstName: 'Huy Doãn',\n        generation: 14, chi: 1,\n        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,\n        families: \[\], parentFamilies: \['F084'\]\n    },/g, 
`handle: 'L144', gramps_id: 'I0180', gender: 1,
        displayName: 'Lê Huy Doãn', surname: 'Lê', firstName: 'Huy Doãn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F084']
    },${newPeople}`);

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Done.');
