/**
 * Minimal person/family data for editable scope computation.
 * In production, this would come from Gramps API.
 * For now, mirrors the frontend mock-genealogy.ts structure.
 */

export interface MockPerson {
    handle: string;
    displayName: string;
    families?: string[];
    parentFamilies?: string[];
}

export interface MockFamily {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}

// 26 người, 5 đời — matches frontend mock
export const MOCK_PEOPLE: MockPerson[] = [
    // Đời 1
    { handle: 'P01', displayName: 'Lê Văn Tổ', families: ['F01'] },
    { handle: 'P02', displayName: 'Nguyễn Thị Từ', families: ['F01'] },
    // Đời 2
    { handle: 'P03', displayName: 'Lê Văn Nhất', families: ['F02'], parentFamilies: ['F01'] },
    { handle: 'P04', displayName: 'Trần Thị Một', families: ['F02'] },
    { handle: 'P05', displayName: 'Lê Văn Nhị', families: ['F03'], parentFamilies: ['F01'] },
    { handle: 'P06', displayName: 'Phạm Thị Hai', families: ['F03'] },
    // Đời 3
    { handle: 'P07', displayName: 'Lê Văn Đức', families: ['F04'], parentFamilies: ['F02'] },
    { handle: 'P08', displayName: 'Nguyễn Thị Lan', families: ['F04'] },
    { handle: 'P09', displayName: 'Lê Thị Hương', parentFamilies: ['F02'] },
    { handle: 'P10', displayName: 'Lê Văn Hoàng', families: ['F05'], parentFamilies: ['F03'] },
    { handle: 'P11', displayName: 'Đỗ Thị Mai', families: ['F05'] },
    { handle: 'P12', displayName: 'Lê Văn Thắng', families: ['F06'], parentFamilies: ['F03'] },
    { handle: 'P13', displayName: 'Vũ Thị Ngọc', families: ['F06'] },
    // Đời 4
    { handle: 'P14', displayName: 'Lê Minh Tuấn', families: ['F07'], parentFamilies: ['F04'] },
    { handle: 'P15', displayName: 'Hoàng Thị Thanh', families: ['F07'] },
    { handle: 'P16', displayName: 'Lê Minh Phong', families: ['F08'], parentFamilies: ['F04'] },
    { handle: 'P17', displayName: 'Trần Thị Hà', families: ['F08'] },
    { handle: 'P18', displayName: 'Lê Thành Trung', families: ['F09'], parentFamilies: ['F05'] },
    { handle: 'P19', displayName: 'Nguyễn Thị Bích', families: ['F09'] },
    { handle: 'P20', displayName: 'Lê Thị Hoa', parentFamilies: ['F05'] },
    { handle: 'P21', displayName: 'Lê Văn Nam', parentFamilies: ['F06'] },
    // Đời 5
    { handle: 'P22', displayName: 'Lê Minh An', parentFamilies: ['F07'] },
    { handle: 'P23', displayName: 'Lê Thị Bảo Ngọc', parentFamilies: ['F07'] },
    { handle: 'P24', displayName: 'Lê Nhật Minh', parentFamilies: ['F08'] },
    { handle: 'P25', displayName: 'Lê Huy', parentFamilies: ['F08'] },
    { handle: 'P26', displayName: 'Lê Thùy Linh', parentFamilies: ['F09'] },
    { handle: 'P27', displayName: 'Lê Bảo Long', parentFamilies: ['F09'] },
    { handle: 'P28', displayName: 'Lê Thanh Tùng', parentFamilies: ['F09'] },
];

export const MOCK_FAMILIES: MockFamily[] = [
    { handle: 'F01', fatherHandle: 'P01', motherHandle: 'P02', children: ['P03', 'P05'] },
    { handle: 'F02', fatherHandle: 'P03', motherHandle: 'P04', children: ['P07', 'P09'] },
    { handle: 'F03', fatherHandle: 'P05', motherHandle: 'P06', children: ['P10', 'P12'] },
    { handle: 'F04', fatherHandle: 'P07', motherHandle: 'P08', children: ['P14', 'P16'] },
    { handle: 'F05', fatherHandle: 'P10', motherHandle: 'P11', children: ['P18', 'P20'] },
    { handle: 'F06', fatherHandle: 'P12', motherHandle: 'P13', children: ['P21'] },
    { handle: 'F07', fatherHandle: 'P14', motherHandle: 'P15', children: ['P22', 'P23'] },
    { handle: 'F08', fatherHandle: 'P16', motherHandle: 'P17', children: ['P24', 'P25'] },
    { handle: 'F09', fatherHandle: 'P18', motherHandle: 'P19', children: ['P26', 'P27', 'P28'] },
];
