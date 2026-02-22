const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-genealogy.ts', 'utf8');

data = data.replace(/displayName: 'Lê Huy Bàng', surname: 'Lê', firstName: 'Huy Bàng'/g,
    "displayName: 'Lê Huy Bảng', surname: 'Lê', firstName: 'Huy Bảng'");

data = data.replace(/handle: 'CH15'([\s\S]*?)displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng'/g,
    "handle: 'CH15'$1displayName: 'Lê Huy Hoàn', surname: 'Lê', firstName: 'Huy Hoàn'");

fs.writeFileSync('src/lib/mock-genealogy.ts', data);
console.log('Script completed.');
