/**
 * Mock genealogy — Dòng họ Lê, 5 đời, 26 người
 *
 * Xuất phát từ 1 người tổ tiên: Lê Văn Tổ
 * Chính tộc: nối trực tiếp, người kết hôn xếp bên cạnh
 * Con gái gả đi: ghi nhận con cái, không theo dõi tiếp (⛔)
 *
 * ĐỜI 1 ─ Thủy tổ
 *   Lê Văn Tổ (1880–1950) ❤ Nguyễn Thị Từ (1885–1960)
 *
 * ĐỜI 2 ─ 2 con trai
 *   ├── Lê Văn Nhất (1910–1975) ❤ Trần Thị Một (1914–1988)
 *   └── Lê Văn Nhị  (1913–1980) ❤ Phạm Thị Hai (1917–1990)
 *
 * ĐỜI 3 ─ Cháu
 *   Nhất+Một:
 *   ├── Lê Văn Đức   (1940–2018) ❤ Nguyễn Thị Mai
 *   └── [Lê Thị Hương] (1943)    ❤ Đặng Văn Ba → Đặng Minh Hải ⛔
 *   Nhị+Hai:
 *   ├── Lê Văn Hoàng (1942–2020) ❤ Phạm Thị Hoa
 *   └── Lê Văn Thắng (1945–2015) ❤ Đinh Thị Lan
 *
 * ĐỜI 4 ─ Chắt
 *   Đức+Mai:
 *   ├── Lê Minh Tuấn  (1970) ❤ Vũ Thu Hà
 *   └── [Lê Thị Ngọc] (1972) ❤ Đỗ Quốc Bảo → Đỗ Gia Bảo ⛔
 *   Hoàng+Hoa:
 *   └── Lê Thành Trung (1974) ❤ Hoàng Minh Châu
 *   Thắng+Lan:
 *   └── Lê Văn Nam    (1978) ❤ Phan Thị Thanh
 *
 * ĐỜI 5 ─ Chút
 *   Tuấn+Hà:   Lê Huy (1998), Lê Thùy Linh (2001)
 *   Trung+Châu: Lê Minh Khôi (2005)
 *   Nam+Thanh:  Lê Bảo Long (2006)
 */

export interface TreeNode {
    handle: string;
    displayName: string;
    gender: number; // 1=male, 2=female
    birthYear?: number;
    deathYear?: number;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    isPatrilineal: boolean;
    families: string[];
    parentFamilies: string[];
}

export interface TreeFamily {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}


export interface PersonDetail {
    handle: string;
    gramps_id: string;
    gender: number;
    displayName: string;
    surname: string;
    firstName: string;
    birthYear?: number;
    birthDate?: string;
    birthPlace?: string;
    deathYear?: number;
    deathDate?: string;
    deathPlace?: string;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    isPatrilineal: boolean;
    families?: string[];
    parentFamilies?: string[];
    mediaCount?: number;

    // ── Contact ──
    phone?: string;
    email?: string;
    zalo?: string;
    facebook?: string;

    // ── Address ──
    currentAddress?: string;
    hometown?: string;

    // ── Professional ──
    occupation?: string;
    company?: string;

    // ── Education ──
    education?: string;

    // ── Identity ──
    nickName?: string;

    // ── Notes & Matching ──
    notes?: string;
    biography?: string;
    tags?: string[];
    _privacyNote?: string;
}

// ═══ Zodiac Year Helper ═══
const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];


export function zodiacYear(year?: number): string | undefined {
    if (!year) return undefined;
    return `${CAN[year % 10]} ${CHI[year % 12]}`;
}

// ════════════════════════════════════════════════════════════════════════
// PEOPLE — 26 người, 5 đời
// ════════════════════════════════════════════════════════════════════════
export const MOCK_PEOPLE: PersonDetail[] = [

    // ─── ĐỜI 1: Thủy tổ ─────────────────────────────────────────────────
    {
        handle: 'P01', gramps_id: 'I01', gender: 1,
        displayName: 'Lê Văn Tổ', surname: 'Lê', firstName: 'Văn Tổ',
        birthYear: 1880, deathYear: 1950,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F01'], parentFamilies: []
    },

    {
        handle: 'P02', gramps_id: 'I02', gender: 2,
        displayName: 'Nguyễn Thị Từ', surname: 'Nguyễn', firstName: 'Thị Từ',
        birthYear: 1885, deathYear: 1960,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: false,
        families: ['F01'], parentFamilies: []
    },

    // ─── ĐỜI 2: Con ──────────────────────────────────────────────────────
    {
        handle: 'P03', gramps_id: 'I03', gender: 1,
        displayName: 'Lê Văn Nhất', surname: 'Lê', firstName: 'Văn Nhất',
        birthYear: 1910, deathYear: 1975,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F02'], parentFamilies: ['F01']
    },

    {
        handle: 'P04', gramps_id: 'I04', gender: 2,
        displayName: 'Trần Thị Một', surname: 'Trần', firstName: 'Thị Một',
        birthYear: 1914, deathYear: 1988,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: false,
        families: ['F02'], parentFamilies: []
    },

    {
        handle: 'P05', gramps_id: 'I05', gender: 1,
        displayName: 'Lê Văn Nhị', surname: 'Lê', firstName: 'Văn Nhị',
        birthYear: 1913, deathYear: 1980,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F03'], parentFamilies: ['F01']
    },

    {
        handle: 'P06', gramps_id: 'I06', gender: 2,
        displayName: 'Phạm Thị Hai', surname: 'Phạm', firstName: 'Thị Hai',
        birthYear: 1917, deathYear: 1990,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: false,
        families: ['F03'], parentFamilies: []
    },

    // ─── ĐỜI 3: Cháu ─────────────────────────────────────────────────────
    // Nhánh Nhất
    {
        handle: 'P07', gramps_id: 'I07', gender: 1,
        displayName: 'Lê Văn Đức', surname: 'Lê', firstName: 'Văn Đức',
        birthYear: 1940, deathYear: 2018,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F04'], parentFamilies: ['F02']
    },

    {
        handle: 'P08', gramps_id: 'I08', gender: 2,
        displayName: 'Nguyễn Thị Mai', surname: 'Nguyễn', firstName: 'Thị Mai',
        birthYear: 1943, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F04'], parentFamilies: []
    },

    {
        handle: 'P09', gramps_id: 'I09', gender: 2,
        displayName: 'Lê Thị Hương', surname: 'Lê', firstName: 'Thị Hương',
        birthYear: 1943, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: ['F10'], parentFamilies: ['F02']
    },

    {
        handle: 'P10', gramps_id: 'I10', gender: 1,
        displayName: 'Đặng Văn Ba', surname: 'Đặng', firstName: 'Văn Ba',
        birthYear: 1940, deathYear: 2010,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: false,
        families: ['F10'], parentFamilies: []
    },

    // Nhánh Nhị
    {
        handle: 'P11', gramps_id: 'I11', gender: 1,
        displayName: 'Lê Văn Hoàng', surname: 'Lê', firstName: 'Văn Hoàng',
        birthYear: 1942, deathYear: 2020,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F05'], parentFamilies: ['F03']
    },

    {
        handle: 'P12', gramps_id: 'I12', gender: 2,
        displayName: 'Phạm Thị Hoa', surname: 'Phạm', firstName: 'Thị Hoa',
        birthYear: 1945, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F05'], parentFamilies: []
    },

    {
        handle: 'P13', gramps_id: 'I13', gender: 1,
        displayName: 'Lê Văn Thắng', surname: 'Lê', firstName: 'Văn Thắng',
        birthYear: 1945, deathYear: 2015,
        isLiving: false, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F06'], parentFamilies: ['F03']
    },

    {
        handle: 'P14', gramps_id: 'I14', gender: 2,
        displayName: 'Đinh Thị Lan', surname: 'Đinh', firstName: 'Thị Lan',
        birthYear: 1948, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F06'], parentFamilies: []
    },

    // Con gái gả đi — Đặng Minh Hải ⛔
    {
        handle: 'P15', gramps_id: 'I15', gender: 1,
        displayName: 'Đặng Minh Hải', surname: 'Đặng', firstName: 'Minh Hải',
        birthYear: 1968, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: [], parentFamilies: ['F10']
    },

    // ─── ĐỜI 4: Chắt ─────────────────────────────────────────────────────
    // Nhánh Đức
    {
        handle: 'P16', gramps_id: 'I16', gender: 1,
        displayName: 'Lê Minh Tuấn', surname: 'Lê', firstName: 'Minh Tuấn',
        birthYear: 1970, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: ['F07'], parentFamilies: ['F04'],
        nickName: 'Tuấn', phone: '0912 345 678', email: 'tuan.le@gmail.com',
        hometown: 'Hà Tĩnh', currentAddress: 'Quận Cầu Giấy, Hà Nội',
        occupation: 'Kỹ sư cầu đường', company: 'Tổng Công ty XDCTGT',
        education: 'ĐH Xây dựng Hà Nội',
        biography: 'Con trưởng dòng Lê Văn Đức, sinh sống tại Hà Nội từ năm 1992.',
        tags: ['Hà Nội', 'kỹ sư', 'đời 4'],
    },

    {
        handle: 'P17', gramps_id: 'I17', gender: 2,
        displayName: 'Vũ Thu Hà', surname: 'Vũ', firstName: 'Thu Hà',
        birthYear: 1973, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F07'], parentFamilies: []
    },

    {
        handle: 'P18', gramps_id: 'I18', gender: 2,
        displayName: 'Lê Thị Ngọc', surname: 'Lê', firstName: 'Thị Ngọc',
        birthYear: 1972, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: ['F11'], parentFamilies: ['F04']
    },

    {
        handle: 'P19', gramps_id: 'I19', gender: 1,
        displayName: 'Đỗ Quốc Bảo', surname: 'Đỗ', firstName: 'Quốc Bảo',
        birthYear: 1970, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F11'], parentFamilies: []
    },

    // Nhánh Hoàng
    {
        handle: 'P20', gramps_id: 'I20', gender: 1,
        displayName: 'Lê Thành Trung', surname: 'Lê', firstName: 'Thành Trung',
        birthYear: 1974, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: ['F08'], parentFamilies: ['F05'],
        phone: '0909 111 222', email: 'trung.le74@yahoo.com',
        hometown: 'Hà Tĩnh', currentAddress: 'TP. Hồ Chí Minh',
        occupation: 'Giám đốc kinh doanh', company: 'Công ty TNHH Hoàng Gia',
        education: 'ĐH Kinh tế TP.HCM',
        tags: ['HCM', 'kinh doanh', 'đời 4'],
    },

    {
        handle: 'P21', gramps_id: 'I21', gender: 2,
        displayName: 'Hoàng Minh Châu', surname: 'Hoàng', firstName: 'Minh Châu',
        birthYear: 1978, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F08'], parentFamilies: []
    },

    // Nhánh Thắng
    {
        handle: 'P22', gramps_id: 'I22', gender: 1,
        displayName: 'Lê Văn Nam', surname: 'Lê', firstName: 'Văn Nam',
        birthYear: 1978, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: ['F09'], parentFamilies: ['F06'],
        phone: '0933 456 789',
        hometown: 'Hà Tĩnh', currentAddress: 'Đà Nẵng',
        occupation: 'Bác sĩ', company: 'Bệnh viện Đà Nẵng',
        education: 'ĐH Y Huế',
        tags: ['Đà Nẵng', 'y tế', 'đời 4'],
    },

    {
        handle: 'P23', gramps_id: 'I23', gender: 2,
        displayName: 'Phan Thị Thanh', surname: 'Phan', firstName: 'Thị Thanh',
        birthYear: 1980, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: ['F09'], parentFamilies: []
    },

    // Con gái gả đi — Đỗ Gia Bảo ⛔
    {
        handle: 'P24', gramps_id: 'I24', gender: 1,
        displayName: 'Đỗ Gia Bảo', surname: 'Đỗ', firstName: 'Gia Bảo',
        birthYear: 2000, isLiving: true, isPrivacyFiltered: true, isPatrilineal: false,
        families: [], parentFamilies: ['F11']
    },

    // ─── ĐỜI 5: Chút ─────────────────────────────────────────────────────
    {
        handle: 'P25', gramps_id: 'I25', gender: 1,
        displayName: 'Lê Huy', surname: 'Lê', firstName: 'Huy',
        birthYear: 1998, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: [], parentFamilies: ['F07'],
        nickName: 'Huy', phone: '0368 123 456', email: 'lehuy98@gmail.com',
        zalo: '0368123456', facebook: 'fb.com/lehuy98',
        hometown: 'Hà Tĩnh', currentAddress: 'Quận 7, TP. Hồ Chí Minh',
        occupation: 'Software Engineer', company: 'ClanHub',
        education: 'ĐH Bách khoa TP.HCM',
        biography: 'Cháu đời 5, hiện là kỹ sư phần mềm tại TP.HCM. Đam mê lưu giữ và số hóa gia phả dòng họ.',
        tags: ['HCM', 'IT', 'đời 5', 'quản trị'],
    },

    {
        handle: 'P26', gramps_id: 'I26', gender: 2,
        displayName: 'Lê Thùy Linh', surname: 'Lê', firstName: 'Thùy Linh',
        birthYear: 2001, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: [], parentFamilies: ['F07'],
        nickName: 'Linh', phone: '0385 789 012', email: 'linhle2001@gmail.com',
        hometown: 'Hà Tĩnh', currentAddress: 'Hà Nội',
        occupation: 'Sinh viên', company: 'ĐH Ngoại thương Hà Nội',
        education: 'ĐH Ngoại thương',
        tags: ['Hà Nội', 'sinh viên', 'đời 5'],
    },

    {
        handle: 'P27', gramps_id: 'I27', gender: 1,
        displayName: 'Lê Minh Khôi', surname: 'Lê', firstName: 'Minh Khôi',
        birthYear: 2005, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: [], parentFamilies: ['F08']
    },

    {
        handle: 'P28', gramps_id: 'I28', gender: 1,
        displayName: 'Lê Bảo Long', surname: 'Lê', firstName: 'Bảo Long',
        birthYear: 2006, isLiving: true, isPrivacyFiltered: true, isPatrilineal: true,
        families: [], parentFamilies: ['F09']
    },
];

// ════════════════════════════════════════════════════════════════════════
// FAMILIES — 11 gia đình
// ════════════════════════════════════════════════════════════════════════
export const MOCK_FAMILIES: TreeFamily[] = [
    // Đời 1 → 2
    {
        handle: 'F01', fatherHandle: 'P01', motherHandle: 'P02',
        children: ['P03', 'P05']
    },

    // Đời 2 → 3
    {
        handle: 'F02', fatherHandle: 'P03', motherHandle: 'P04',
        children: ['P07', 'P09']
    },                    // Nhất+Một → Đức, Hương(gả)
    {
        handle: 'F03', fatherHandle: 'P05', motherHandle: 'P06',
        children: ['P11', 'P13']
    },                    // Nhị+Hai → Hoàng, Thắng

    // Đời 3 → 4
    {
        handle: 'F04', fatherHandle: 'P07', motherHandle: 'P08',
        children: ['P16', 'P18']
    },                    // Đức+Mai → Tuấn, Ngọc(gả)
    {
        handle: 'F05', fatherHandle: 'P11', motherHandle: 'P12',
        children: ['P20']
    },                           // Hoàng+Hoa → Trung
    {
        handle: 'F06', fatherHandle: 'P13', motherHandle: 'P14',
        children: ['P22']
    },                           // Thắng+Lan → Nam

    // Đời 4 → 5 (chính tộc)
    {
        handle: 'F07', fatherHandle: 'P16', motherHandle: 'P17',
        children: ['P25', 'P26']
    },                    // Tuấn+Hà → Huy, Linh
    {
        handle: 'F08', fatherHandle: 'P20', motherHandle: 'P21',
        children: ['P27']
    },                           // Trung+Châu → Khôi
    {
        handle: 'F09', fatherHandle: 'P22', motherHandle: 'P23',
        children: ['P28']
    },                           // Nam+Thanh → Long

    // Con gái gả đi (ghi nhận, không mở rộng) ⛔
    {
        handle: 'F10', fatherHandle: 'P10', motherHandle: 'P09',
        children: ['P15']
    },                           // Ba+Hương → Đặng Minh Hải ⛔
    {
        handle: 'F11', fatherHandle: 'P19', motherHandle: 'P18',
        children: ['P24']
    },                           // Bảo+Ngọc → Đỗ Gia Bảo ⛔
];

// ════════════════════════════════════════════════════════════════════════
// TREE NODES (for tree view)
// ════════════════════════════════════════════════════════════════════════
export const MOCK_TREE_NODES: TreeNode[] = MOCK_PEOPLE.map(p => ({
    handle: p.handle,
    displayName: p.displayName,
    gender: p.gender,
    birthYear: p.birthYear,
    deathYear: p.deathYear,
    isLiving: p.isLiving,
    isPrivacyFiltered: p.isPrivacyFiltered,
    isPatrilineal: p.isPatrilineal,
    families: p.families || [],
    parentFamilies: p.parentFamilies || [],
}));
