/**
 * Mock genealogy — Dòng họ Lê Huy Tộc
 * 356 thành viên, 182 gia đình, thế hệ 1-15
 * Dữ liệu chuẩn hóa từ gia phả gốc (12 file .doc)
 * Chỉ có dữ liệu nam giới (cha-con). Vợ và con gái để bổ sung sau.
 */

export interface TreeNode {
    handle: string;
    displayName: string;
    gender: number; // 1=male, 2=female
    birthYear?: number;
    deathYear?: number;
    generation: number;
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
    generation: number;
    chi?: number;
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
    phone?: string;
    email?: string;
    zalo?: string;
    facebook?: string;
    currentAddress?: string;
    hometown?: string;
    occupation?: string;
    company?: string;
    education?: string;
    nickName?: string;
    notes?: string;
    biography?: string;
    tags?: string[];
    _privacyNote?: string;
}

// ═══ Zodiac Year Helper ═══
const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI_ZD = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

export function zodiacYear(year?: number): string | undefined {
    if (!year) return undefined;
    return `${CAN[year % 10]} ${CHI_ZD[year % 12]}`;
}

// ════════════════════════════════════════════════════════════════════════
// PEOPLE — 356 người, thế hệ 1-15
// ════════════════════════════════════════════════════════════════════════
export const MOCK_PEOPLE: PersonDetail[] = [
    {
        handle: 'P001', gramps_id: 'I0001', gender: 1,
        displayName: 'Lê Đức Tính', surname: 'Lê', firstName: 'Đức Tính',
        generation: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F001'], parentFamilies: []
    },
    {
        handle: 'P002', gramps_id: 'I0002', gender: 1,
        displayName: 'Lê Đức Thiệu', surname: 'Lê', firstName: 'Đức Thiệu',
        generation: 2,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F002'], parentFamilies: ['F001']
    },
    {
        handle: 'P003', gramps_id: 'I0003', gender: 1,
        displayName: 'Lê Đức Hậu', surname: 'Lê', firstName: 'Đức Hậu',
        generation: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F003'], parentFamilies: ['F002']
    },
    {
        handle: 'P004', gramps_id: 'I0004', gender: 1,
        displayName: 'Lê Đức Thận', surname: 'Lê', firstName: 'Đức Thận',
        generation: 4,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F004'], parentFamilies: ['F003']
    },
    {
        handle: 'P005', gramps_id: 'I0005', gender: 1,
        displayName: 'Lê Đức Trạch', surname: 'Lê', firstName: 'Đức Trạch',
        generation: 4,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F005'], parentFamilies: ['F003']
    },
    {
        handle: 'P006', gramps_id: 'I0006', gender: 1,
        displayName: 'Lê Đức Thuần', surname: 'Lê', firstName: 'Đức Thuần',
        generation: 4,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F006'], parentFamilies: ['F003']
    },
    {
        handle: 'P007', gramps_id: 'I0007', gender: 1,
        displayName: 'Lê Tuấn Đạt', surname: 'Lê', firstName: 'Tuấn Đạt',
        generation: 5,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F007'], parentFamilies: ['F004']
    },
    {
        handle: 'P008', gramps_id: 'I0008', gender: 1,
        displayName: 'Lê Huy Đoài', surname: 'Lê', firstName: 'Huy Đoài',
        generation: 5,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F008'], parentFamilies: ['F005']
    },
    {
        handle: 'P009', gramps_id: 'I0009', gender: 1,
        displayName: 'Lê Huy Thể', surname: 'Lê', firstName: 'Huy Thể',
        generation: 5,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F009'], parentFamilies: ['F006']
    },
    {
        handle: 'P010', gramps_id: 'I0010', gender: 1,
        displayName: 'Lê Thuần Chất', surname: 'Lê', firstName: 'Thuần Chất',
        generation: 6,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F010'], parentFamilies: ['F007']
    },
    {
        handle: 'P011', gramps_id: 'I0011', gender: 1,
        displayName: 'Lê Đức Phấn', surname: 'Lê', firstName: 'Đức Phấn',
        generation: 6,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F007']
    },
    {
        handle: 'P012', gramps_id: 'I0012', gender: 1,
        displayName: 'Lê Huệ Thực', surname: 'Lê', firstName: 'Huệ Thực',
        generation: 6,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F007']
    },
    {
        handle: 'P013', gramps_id: 'I0013', gender: 1,
        displayName: 'Lê Bá Dương', surname: 'Lê', firstName: 'Bá Dương',
        generation: 6,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F011'], parentFamilies: ['F008']
    },
    {
        handle: 'P014', gramps_id: 'I0014', gender: 1,
        displayName: 'Lê Huy Chiểu', surname: 'Lê', firstName: 'Huy Chiểu',
        generation: 6,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F012'], parentFamilies: ['F009']
    },
    {
        handle: 'P015', gramps_id: 'I0015', gender: 1,
        displayName: 'Lê Huy Tùy', surname: 'Lê', firstName: 'Huy Tùy',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F013'], parentFamilies: ['F010']
    },
    {
        handle: 'P016', gramps_id: 'I0016', gender: 1,
        displayName: 'Lê Huy Tiêu', surname: 'Lê', firstName: 'Huy Tiêu',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F014'], parentFamilies: ['F010']
    },
    {
        handle: 'P017', gramps_id: 'I0017', gender: 1,
        displayName: 'Lê Huy Vịnh', surname: 'Lê', firstName: 'Huy Vịnh',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F010']
    },
    {
        handle: 'P018', gramps_id: 'I0018', gender: 1,
        displayName: 'Lê Bá Năng', surname: 'Lê', firstName: 'Bá Năng',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F015'], parentFamilies: ['F011']
    },
    {
        handle: 'P019', gramps_id: 'I0019', gender: 1,
        displayName: 'Lê Bá Đằng', surname: 'Lê', firstName: 'Bá Đằng',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F011']
    },
    {
        handle: 'P020', gramps_id: 'I0020', gender: 1,
        displayName: 'Lê Nhu Hóa', surname: 'Lê', firstName: 'Nhu Hóa',
        generation: 7,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F016'], parentFamilies: ['F012']
    },
    {
        handle: 'P021', gramps_id: 'I0021', gender: 1,
        displayName: 'Lê Huy Cẩm', surname: 'Lê', firstName: 'Huy Cẩm',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F017'], parentFamilies: ['F013']
    },
    {
        handle: 'P022', gramps_id: 'I0022', gender: 1,
        displayName: 'Lê Huy Kiều', surname: 'Lê', firstName: 'Huy Kiều',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F018'], parentFamilies: ['F014']
    },
    {
        handle: 'P023', gramps_id: 'I0023', gender: 1,
        displayName: 'Lê Bá Lương', surname: 'Lê', firstName: 'Bá Lương',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F019'], parentFamilies: ['F015']
    },
    {
        handle: 'P024', gramps_id: 'I0024', gender: 1,
        displayName: 'Lê Huy Kiểm', surname: 'Lê', firstName: 'Huy Kiểm',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F020'], parentFamilies: ['F016']
    },
    {
        handle: 'P025', gramps_id: 'I0025', gender: 1,
        displayName: 'Lê Huy Soạn', surname: 'Lê', firstName: 'Huy Soạn',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F021'], parentFamilies: ['F016']
    },
    {
        handle: 'P026', gramps_id: 'I0026', gender: 1,
        displayName: 'Lê Huy Mễ', surname: 'Lê', firstName: 'Huy Mễ',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F022'], parentFamilies: ['F016']
    },
    {
        handle: 'P027', gramps_id: 'I0027', gender: 1,
        displayName: 'Lê Huy Khởi', surname: 'Lê', firstName: 'Huy Khởi',
        generation: 8,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F023'], parentFamilies: ['F016']
    },
    {
        handle: 'P028', gramps_id: 'I0028', gender: 1,
        displayName: 'Lê Huy Điểng', surname: 'Lê', firstName: 'Huy Điểng',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F024'], parentFamilies: ['F017']
    },
    {
        handle: 'P029', gramps_id: 'I0029', gender: 1,
        displayName: 'Lê Huy Mẫn', surname: 'Lê', firstName: 'Huy Mẫn',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F025'], parentFamilies: ['F017']
    },
    {
        handle: 'P030', gramps_id: 'I0030', gender: 1,
        displayName: 'Lê Huy Ba', surname: 'Lê', firstName: 'Huy Ba',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F026'], parentFamilies: ['F017']
    },
    {
        handle: 'P031', gramps_id: 'I0031', gender: 1,
        displayName: 'Lê Huy Thứu', surname: 'Lê', firstName: 'Huy Thứu',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F027'], parentFamilies: ['F017']
    },
    {
        handle: 'P032', gramps_id: 'I0032', gender: 1,
        displayName: 'Lê Huy Uy', surname: 'Lê', firstName: 'Huy Uy',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F028'], parentFamilies: ['F018']
    },
    {
        handle: 'P033', gramps_id: 'I0033', gender: 1,
        displayName: 'Lê Huy Tiệm', surname: 'Lê', firstName: 'Huy Tiệm',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F029'], parentFamilies: ['F018']
    },
    {
        handle: 'P034', gramps_id: 'I0034', gender: 1,
        displayName: 'Lê Bá Chung', surname: 'Lê', firstName: 'Bá Chung',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F030'], parentFamilies: ['F019']
    },
    {
        handle: 'P035', gramps_id: 'I0035', gender: 1,
        displayName: 'Lê Huy Túc', surname: 'Lê', firstName: 'Huy Túc',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F031'], parentFamilies: ['F020']
    },
    {
        handle: 'P036', gramps_id: 'I0036', gender: 1,
        displayName: 'Lê Huy Lầng', surname: 'Lê', firstName: 'Huy Lầng',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F032'], parentFamilies: ['F021']
    },
    {
        handle: 'P037', gramps_id: 'I0037', gender: 1,
        displayName: 'Lê Huy Đạo', surname: 'Lê', firstName: 'Huy Đạo',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F033'], parentFamilies: ['F022']
    },
    {
        handle: 'P038', gramps_id: 'I0038', gender: 1,
        displayName: 'Lê Huy Ước', surname: 'Lê', firstName: 'Huy Ước',
        generation: 9,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F034'], parentFamilies: ['F023']
    },
    {
        handle: 'P039', gramps_id: 'I0039', gender: 1,
        displayName: 'Lê Huy Bổng', surname: 'Lê', firstName: 'Huy Bổng',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F035'], parentFamilies: ['F024']
    },
    {
        handle: 'P040', gramps_id: 'I0040', gender: 1,
        displayName: 'Lê Huy Toản', surname: 'Lê', firstName: 'Huy Toản',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F051'], parentFamilies: ['F026']
    },
    {
        handle: 'P041', gramps_id: 'I0041', gender: 1,
        displayName: 'Lê Huy Đản', surname: 'Lê', firstName: 'Huy Đản',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F065'], parentFamilies: ['F026']
    },
    {
        handle: 'P042', gramps_id: 'I0042', gender: 1,
        displayName: 'Lê Huy Lạp', surname: 'Lê', firstName: 'Huy Lạp',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F079'], parentFamilies: ['F027']
    },
    {
        handle: 'P043', gramps_id: 'I0043', gender: 1,
        displayName: 'Lê Huy Vụ', surname: 'Lê', firstName: 'Huy Vụ',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F061'], parentFamilies: ['F028']
    },
    {
        handle: 'P044', gramps_id: 'I0044', gender: 1,
        displayName: 'Lê Huy An', surname: 'Lê', firstName: 'Huy An',
        generation: 10, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F029']
    },
    {
        handle: 'P045', gramps_id: 'I0045', gender: 1,
        displayName: 'Lê Huy Quyền', surname: 'Lê', firstName: 'Huy Quyền',
        generation: 10,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F030']
    },
    {
        handle: 'P046', gramps_id: 'I0046', gender: 1,
        displayName: 'Lê Huy Chuy', surname: 'Lê', firstName: 'Huy Chuy',
        generation: 10,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F030']
    },
    {
        handle: 'P047', gramps_id: 'I0047', gender: 1,
        displayName: 'Lê Huy Châu', surname: 'Lê', firstName: 'Huy Châu',
        generation: 10,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F030']
    },
    {
        handle: 'P048', gramps_id: 'I0048', gender: 1,
        displayName: 'Lê Huy Cung', surname: 'Lê', firstName: 'Huy Cung',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F106'], parentFamilies: ['F031']
    },
    {
        handle: 'P049', gramps_id: 'I0049', gender: 1,
        displayName: 'Lê Huy Cớn', surname: 'Lê', firstName: 'Huy Cớn',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F126'], parentFamilies: ['F032']
    },
    {
        handle: 'P050', gramps_id: 'I0050', gender: 1,
        displayName: 'Lê Huy Liệu', surname: 'Lê', firstName: 'Huy Liệu',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F133'], parentFamilies: ['F033']
    },
    {
        handle: 'P051', gramps_id: 'I0051', gender: 1,
        displayName: 'Lê Huy Uẩn', surname: 'Lê', firstName: 'Huy Uẩn',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F148'], parentFamilies: ['F034']
    },
    {
        handle: 'P052', gramps_id: 'I0052', gender: 1,
        displayName: 'Lê Huy Chước', surname: 'Lê', firstName: 'Huy Chước',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F149'], parentFamilies: ['F034']
    },
    {
        handle: 'P053', gramps_id: 'I0053', gender: 1,
        displayName: 'Lê Huy Thước', surname: 'Lê', firstName: 'Huy Thước',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F163'], parentFamilies: ['F034']
    },
    {
        handle: 'P054', gramps_id: 'I0054', gender: 1,
        displayName: 'Lê Huy Duy', surname: 'Lê', firstName: 'Huy Duy',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F034']
    },
    {
        handle: 'P055', gramps_id: 'I0055', gender: 1,
        displayName: 'Lê Huy Tuy', surname: 'Lê', firstName: 'Huy Tuy',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F169'], parentFamilies: ['F034']
    },
    {
        handle: 'P056', gramps_id: 'I0056', gender: 1,
        displayName: 'Lê Huy Tước', surname: 'Lê', firstName: 'Huy Tước',
        generation: 10, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F176'], parentFamilies: ['F034']
    },
    {
        handle: 'A001', gramps_id: 'I0057', gender: 1,
        displayName: 'Lê Huy Lương', surname: 'Lê', firstName: 'Huy Lương',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F036'], parentFamilies: ['F035']
    },
    {
        handle: 'A002', gramps_id: 'I0058', gender: 1,
        displayName: 'Lê Huy Du', surname: 'Lê', firstName: 'Huy Du',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F037'], parentFamilies: ['F035']
    },
    {
        handle: 'A003', gramps_id: 'I0059', gender: 1,
        displayName: 'Lê Huy Giới', surname: 'Lê', firstName: 'Huy Giới',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F038'], parentFamilies: ['F036']
    },
    {
        handle: 'A004', gramps_id: 'I0060', gender: 1,
        displayName: 'Lê Huy Kỳ', surname: 'Lê', firstName: 'Huy Kỳ',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F039'], parentFamilies: ['F036']
    },
    {
        handle: 'A005', gramps_id: 'I0061', gender: 1,
        displayName: 'Lê Huy Cốc', surname: 'Lê', firstName: 'Huy Cốc',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F040'], parentFamilies: ['F037']
    },
    {
        handle: 'A006', gramps_id: 'I0062', gender: 1,
        displayName: 'Lê Huy Nguyên', surname: 'Lê', firstName: 'Huy Nguyên',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F041'], parentFamilies: ['F037']
    },
    {
        handle: 'A007', gramps_id: 'I0063', gender: 1,
        displayName: 'Lê Huy Ngoan', surname: 'Lê', firstName: 'Huy Ngoan',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F042'], parentFamilies: ['F037']
    },
    {
        handle: 'A008', gramps_id: 'I0064', gender: 1,
        displayName: 'Lê Huy Cảnh', surname: 'Lê', firstName: 'Huy Cảnh',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F043'], parentFamilies: ['F038']
    },
    {
        handle: 'A009', gramps_id: 'I0065', gender: 1,
        displayName: 'Lê Huy Trản', surname: 'Lê', firstName: 'Huy Trản',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F038']
    },
    {
        handle: 'A010', gramps_id: 'I0066', gender: 1,
        displayName: 'Lê Huy Sâm', surname: 'Lê', firstName: 'Huy Sâm',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F044'], parentFamilies: ['F038']
    },
    {
        handle: 'A011', gramps_id: 'I0067', gender: 1,
        displayName: 'Lê Huy Ban', surname: 'Lê', firstName: 'Huy Ban',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F045'], parentFamilies: ['F038']
    },
    {
        handle: 'A012', gramps_id: 'I0068', gender: 1,
        displayName: 'Lê Huy Bảo', surname: 'Lê', firstName: 'Huy Bảo',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F039']
    },
    {
        handle: 'A013', gramps_id: 'I0069', gender: 1,
        displayName: 'Lê Huy Xuyến', surname: 'Lê', firstName: 'Huy Xuyến',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F039']
    },
    {
        handle: 'A014', gramps_id: 'I0070', gender: 1,
        displayName: 'Lê Huy Hồng', surname: 'Lê', firstName: 'Huy Hồng',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F046'], parentFamilies: ['F039']
    },
    {
        handle: 'A015', gramps_id: 'I0071', gender: 1,
        displayName: 'Lê Huy Ngô', surname: 'Lê', firstName: 'Huy Ngô',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F048a'], parentFamilies: ['F040']
    },
    {
        handle: 'A016', gramps_id: 'I0072', gender: 1,
        displayName: 'Lê Huy Lân', surname: 'Lê', firstName: 'Huy Lân',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F047'], parentFamilies: ['F041']
    },
    {
        handle: 'A017', gramps_id: 'I0073', gender: 1,
        displayName: 'Lê Huy Dân', surname: 'Lê', firstName: 'Huy Dân',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F048'], parentFamilies: ['F042']
    },
    {
        handle: 'A018', gramps_id: 'I0074', gender: 1,
        displayName: 'Lê Huy Lân', surname: 'Lê', firstName: 'Huy Lân',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F049'], parentFamilies: ['F043']
    },
    {
        handle: 'A019', gramps_id: 'I0075', gender: 1,
        displayName: 'Lê Huy Trương', surname: 'Lê', firstName: 'Huy Trương',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F043']
    },
    {
        handle: 'A020', gramps_id: 'I0076', gender: 1,
        displayName: 'Lê Huy Tư', surname: 'Lê', firstName: 'Huy Tư',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F043']
    },
    {
        handle: 'A021', gramps_id: 'I0077', gender: 1,
        displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F043']
    },
    {
        handle: 'A022', gramps_id: 'I0078', gender: 1,
        displayName: 'Lê Huy Quân', surname: 'Lê', firstName: 'Huy Quân',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F043']
    },
    {
        handle: 'A023', gramps_id: 'I0079', gender: 1,
        displayName: 'Lê Huy Thông', surname: 'Lê', firstName: 'Huy Thông',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F043']
    },
    {
        handle: 'A024', gramps_id: 'I0080', gender: 1,
        displayName: 'Lê Huy Vĩnh', surname: 'Lê', firstName: 'Huy Vĩnh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F050'], parentFamilies: ['F044']
    },
    {
        handle: 'A025', gramps_id: 'I0081', gender: 1,
        displayName: 'Lê Huy Lộc', surname: 'Lê', firstName: 'Huy Lộc',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F044']
    },
    {
        handle: 'A026', gramps_id: 'I0082', gender: 1,
        displayName: 'Lê Huy Lực', surname: 'Lê', firstName: 'Huy Lực',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F044']
    },
    {
        handle: 'A027', gramps_id: 'I0083', gender: 1,
        displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F045']
    },
    {
        handle: 'A028', gramps_id: 'I0084', gender: 1,
        displayName: 'Lê Huy Linh', surname: 'Lê', firstName: 'Huy Linh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F046']
    },
    {
        handle: 'A029', gramps_id: 'I0085', gender: 1,
        displayName: 'Lê Huy Khánh', surname: 'Lê', firstName: 'Huy Khánh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F047']
    },
    {
        handle: 'A030', gramps_id: 'I0086', gender: 1,
        displayName: 'Lê Huy Thành', surname: 'Lê', firstName: 'Huy Thành',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F047']
    },
    {
        handle: 'A037', gramps_id: 'I0999', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F048a']
    },
    {
        handle: 'A031', gramps_id: 'I0087', gender: 1,
        displayName: 'Lê Huy Long', surname: 'Lê', firstName: 'Huy Long',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F049']
    },
    {
        handle: 'A032', gramps_id: 'I0088', gender: 1,
        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F049']
    },
    {
        handle: 'A033', gramps_id: 'I0089', gender: 1,
        displayName: 'Lê Huy Tiến', surname: 'Lê', firstName: 'Huy Tiến',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F050']
    },
    {
        handle: 'A034', gramps_id: 'I0090', gender: 1,
        displayName: 'Lê Huy Linh', surname: 'Lê', firstName: 'Huy Linh',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F050']
    },
    {
        handle: 'A035', gramps_id: 'I0091', gender: 1,
        displayName: 'Lê Huy Giang', surname: 'Lê', firstName: 'Huy Giang',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F050']
    },
    {
        handle: 'A036', gramps_id: 'I0092', gender: 1,
        displayName: 'Lê Huy Minh', surname: 'Lê', firstName: 'Huy Minh',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F050']
    },
    {
        handle: 'D001', gramps_id: 'I0093', gender: 1,
        displayName: 'Lê Huy Vạn', surname: 'Lê', firstName: 'Huy Vạn',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F052'], parentFamilies: ['F051']
    },
    {
        handle: 'D002', gramps_id: 'I0094', gender: 1,
        displayName: 'Lê Huy Quơi', surname: 'Lê', firstName: 'Huy Quơi',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F053'], parentFamilies: ['F051']
    },
    {
        handle: 'D003', gramps_id: 'I0095', gender: 1,
        displayName: 'Lê Huy Lới', surname: 'Lê', firstName: 'Huy Lới',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F054'], parentFamilies: ['F052']
    },
    {
        handle: 'D004', gramps_id: 'I0096', gender: 1,
        displayName: 'Lê Huy Hiệp', surname: 'Lê', firstName: 'Huy Hiệp',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F052']
    },
    {
        handle: 'D005', gramps_id: 'I0097', gender: 1,
        displayName: 'Lê Huy Đơng', surname: 'Lê', firstName: 'Huy Đơng',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F055'], parentFamilies: ['F053']
    },
    {
        handle: 'D006', gramps_id: 'I0098', gender: 1,
        displayName: 'Lê Huy Quý', surname: 'Lê', firstName: 'Huy Quý',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F056'], parentFamilies: ['F054']
    },
    {
        handle: 'D007', gramps_id: 'I0099', gender: 1,
        displayName: 'Lê Huy Thụ', surname: 'Lê', firstName: 'Huy Thụ',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F056a'], parentFamilies: ['F054']
    },
    {
        handle: 'D008', gramps_id: 'I0100', gender: 1,
        displayName: 'Lê Huy Phú', surname: 'Lê', firstName: 'Huy Phú',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F056b'], parentFamilies: ['F054']
    },
    {
        handle: 'D009', gramps_id: 'I0101', gender: 1,
        displayName: 'Lê Huy Vơn', surname: 'Lê', firstName: 'Huy Vơn',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F057'], parentFamilies: ['F055']
    },
    {
        handle: 'D010', gramps_id: 'I0102', gender: 1,
        displayName: 'Lê Huy Nhĩ', surname: 'Lê', firstName: 'Huy Nhĩ',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F055']
    },
    {
        handle: 'D011', gramps_id: 'I0103', gender: 1,
        displayName: 'Lê Huy Tâng', surname: 'Lê', firstName: 'Huy Tâng',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F055']
    },
    {
        handle: 'D012', gramps_id: 'I0104', gender: 1,
        displayName: 'Lê Huy Khôi', surname: 'Lê', firstName: 'Huy Khôi',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F058'], parentFamilies: ['F055']
    },
    {
        handle: 'D013', gramps_id: 'I0105', gender: 1,
        displayName: 'Lê Huy Bảng', surname: 'Lê', firstName: 'Huy Bảng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F059'], parentFamilies: ['F056a']
    },
    {
        handle: 'D014', gramps_id: 'I0106', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F059a'], parentFamilies: ['F056b']
    },
    {
        handle: 'D015', gramps_id: 'I0107', gender: 1,
        displayName: 'Lê Huy Khoa', surname: 'Lê', firstName: 'Huy Khoa',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F060'], parentFamilies: ['F057']
    },
    {
        handle: 'D016', gramps_id: 'I0108', gender: 1,
        displayName: 'Lê Huy Viện', surname: 'Lê', firstName: 'Huy Viện',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F058a'], parentFamilies: ['F055']
    },
    {
        handle: 'D017', gramps_id: 'I0109', gender: 1,
        displayName: 'Lê Huy Viên', surname: 'Lê', firstName: 'Huy Viên',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F058a']
    },
    {
        handle: 'D018', gramps_id: 'I0110', gender: 1,
        displayName: 'Lê Huy Việt', surname: 'Lê', firstName: 'Huy Việt',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F058']
    },
    {
        handle: 'D019', gramps_id: 'I0112', gender: 1,
        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F059']
    },
    {
        handle: 'D020', gramps_id: 'I0113', gender: 1,
        displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F059a']
    },
    {
        handle: 'D021', gramps_id: 'I0114', gender: 1,
        displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F060']
    },
    {
        handle: 'E001', gramps_id: 'I0115', gender: 1,
        displayName: 'Lê Huy Hàm', surname: 'Lê', firstName: 'Huy Hàm',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F061']
    },
    {
        handle: 'E002', gramps_id: 'I0116', gender: 1,
        displayName: 'Lê Huy Nghĩa', surname: 'Lê', firstName: 'Huy Nghĩa',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F061']
    },
    {
        handle: 'E003', gramps_id: 'I0117', gender: 1,
        displayName: 'Lê Huy Lở', surname: 'Lê', firstName: 'Huy Lở',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F062'], parentFamilies: ['F061']
    },
    {
        handle: 'E004', gramps_id: 'I0118', gender: 1,
        displayName: 'Lê Huy Hồ', surname: 'Lê', firstName: 'Huy Hồ',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F063'], parentFamilies: ['F062']
    },
    {
        handle: 'E005', gramps_id: 'I0119', gender: 1,
        displayName: 'Lê Huy Liễn', surname: 'Lê', firstName: 'Huy Liễn',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F064'], parentFamilies: ['F063']
    },
    {
        handle: 'E006', gramps_id: 'I0120', gender: 1,
        displayName: 'Lê Huy Thế', surname: 'Lê', firstName: 'Huy Thế',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F064a'], parentFamilies: ['F063']
    },
    {
        handle: 'E007', gramps_id: 'I0121', gender: 1,
        displayName: 'Lê Huy Tùng', surname: 'Lê', firstName: 'Huy Tùng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F064a']
    },
    {
        handle: 'E008', gramps_id: 'I0122', gender: 1,
        displayName: 'Lê Huy Văn', surname: 'Lê', firstName: 'Huy Văn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F058']
    },
    {
        handle: 'B001', gramps_id: 'I0123', gender: 1,
        displayName: 'Lê Huy Lương', surname: 'Lê', firstName: 'Huy Lương',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F066'], parentFamilies: ['F065']
    },
    {
        handle: 'B002', gramps_id: 'I0124', gender: 1,
        displayName: 'Lê Huy Phổ', surname: 'Lê', firstName: 'Huy Phổ',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F067'], parentFamilies: ['F065']
    },
    {
        handle: 'B003', gramps_id: 'I0125', gender: 1,
        displayName: 'Lê Huy Thảng', surname: 'Lê', firstName: 'Huy Thảng',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F068'], parentFamilies: ['F066']
    },
    {
        handle: 'B004', gramps_id: 'I0126', gender: 1,
        displayName: 'Lê Huy Đợi', surname: 'Lê', firstName: 'Huy Đợi',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F069'], parentFamilies: ['F066']
    },
    {
        handle: 'B005', gramps_id: 'I0127', gender: 1,
        displayName: 'Lê Huy Chơn', surname: 'Lê', firstName: 'Huy Chơn',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F070'], parentFamilies: ['F067']
    },
    {
        handle: 'B006', gramps_id: 'I0128', gender: 1,
        displayName: 'Lê Huy Hiểu', surname: 'Lê', firstName: 'Huy Hiểu',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F071'], parentFamilies: ['F068']
    },
    {
        handle: 'B007', gramps_id: 'I0129', gender: 1,
        displayName: 'Lê Huy Cầu', surname: 'Lê', firstName: 'Huy Cầu',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F068']
    },
    {
        handle: 'B008', gramps_id: 'I0130', gender: 1,
        displayName: 'Lê Huy Quán', surname: 'Lê', firstName: 'Huy Quán',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F068']
    },
    {
        handle: 'B009', gramps_id: 'I0131', gender: 1,
        displayName: 'Lê Huy Cống', surname: 'Lê', firstName: 'Huy Cống',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F078'], parentFamilies: ['F068']
    },
    {
        handle: 'B010', gramps_id: 'I0132', gender: 1,
        displayName: 'Lê Huy Lành', surname: 'Lê', firstName: 'Huy Lành',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F072'], parentFamilies: ['F069']
    },
    {
        handle: 'B011', gramps_id: 'I0133', gender: 1,
        displayName: 'Lê Huy Cúc', surname: 'Lê', firstName: 'Huy Cúc',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F073'], parentFamilies: ['F069']
    },
    {
        handle: 'B012', gramps_id: 'I0134', gender: 1,
        displayName: 'Lê Huy Sen', surname: 'Lê', firstName: 'Huy Sen',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F069']
    },
    {
        handle: 'B013', gramps_id: 'I0135', gender: 1,
        displayName: 'Lê Huy Năm', surname: 'Lê', firstName: 'Huy Năm',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F069']
    },
    {
        handle: 'B014', gramps_id: 'I0136', gender: 1,
        displayName: 'Lê Huy Sơn', surname: 'Lê', firstName: 'Huy Sơn',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F074'], parentFamilies: ['F069']
    },
    {
        handle: 'B015', gramps_id: 'I0137', gender: 1,
        displayName: 'Lê Huy Thúy', surname: 'Lê', firstName: 'Huy Thúy',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F069']
    },
    {
        handle: 'B016', gramps_id: 'I0138', gender: 1,
        displayName: 'Lê Huy Tuyết', surname: 'Lê', firstName: 'Huy Tuyết',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F075'], parentFamilies: ['F070']
    },
    {
        handle: 'B017', gramps_id: 'I0139', gender: 1,
        displayName: 'Lê Huy Cương', surname: 'Lê', firstName: 'Huy Cương',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F071']
    },
    {
        handle: 'B018', gramps_id: 'I0140', gender: 1,
        displayName: 'Lê Huy Quyết', surname: 'Lê', firstName: 'Huy Quyết',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F071']
    },
    {
        handle: 'B019', gramps_id: 'I0141', gender: 1,
        displayName: 'Lê Huy Dũng', surname: 'Lê', firstName: 'Huy Dũng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F071']
    },
    {
        handle: 'B020', gramps_id: 'I0142', gender: 1,
        displayName: 'Lê Huy Cường', surname: 'Lê', firstName: 'Huy Cường',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F071']
    },
    {
        handle: 'B021', gramps_id: 'I0143', gender: 1,
        displayName: 'Lê Huy Hậu', surname: 'Lê', firstName: 'Huy Hậu',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F072']
    },
    {
        handle: 'B022', gramps_id: 'I0144', gender: 1,
        displayName: 'Lê Huy Tiên', surname: 'Lê', firstName: 'Huy Tiên',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F072']
    },
    {
        handle: 'B023', gramps_id: 'I0145', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F072']
    },
    {
        handle: 'B024', gramps_id: 'I0146', gender: 1,
        displayName: 'Lê Huy Tú', surname: 'Lê', firstName: 'Huy Tú',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F076'], parentFamilies: ['F072']
    },
    {
        handle: 'B025', gramps_id: 'I0147', gender: 1,
        displayName: 'Lê Huy Cường', surname: 'Lê', firstName: 'Huy Cường',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F073']
    },
    {
        handle: 'B026', gramps_id: 'I0148', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F077'], parentFamilies: ['F073']
    },
    {
        handle: 'B027', gramps_id: 'I0149', gender: 1,
        displayName: 'Lê Huy Trường', surname: 'Lê', firstName: 'Huy Trường',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F073']
    },
    {
        handle: 'B028', gramps_id: 'I0150', gender: 1,
        displayName: 'Lê Huy Hóa', surname: 'Lê', firstName: 'Huy Hóa',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F074']
    },
    {
        handle: 'B029', gramps_id: 'I0151', gender: 1,
        displayName: 'Lê Huy Hải', surname: 'Lê', firstName: 'Huy Hải',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F998'], parentFamilies: ['F075']
    },
    {
        handle: 'B030', gramps_id: 'I0152', gender: 1,
        displayName: 'Lê Huy Hưng', surname: 'Lê', firstName: 'Huy Hưng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F997'], parentFamilies: ['F075']
    },
    {
        handle: 'B031', gramps_id: 'I0153', gender: 1,
        displayName: 'Lê Huy Chung', surname: 'Lê', firstName: 'Huy Chung',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F075']
    },
    {
        handle: 'B032', gramps_id: 'I0154', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F076']
    },
    {
        handle: 'B033', gramps_id: 'I0155', gender: 1,
        displayName: 'Lê Huy Vũ', surname: 'Lê', firstName: 'Huy Vũ',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F076']
    },
    {
        handle: 'B034', gramps_id: 'I0156', gender: 1,
        displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F077']
    },
    {
        handle: 'B035', gramps_id: 'I0157', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F077']
    },
    {
        handle: 'B036', gramps_id: 'I0158', gender: 1,
        displayName: 'Lê Huy Lương', surname: 'Lê', firstName: 'Huy Lương',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F078']
    },
    {
        handle: 'B037', gramps_id: 'I0159', gender: 1,
        displayName: 'Lê Huy Giang', surname: 'Lê', firstName: 'Huy Giang',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F078']
    },
    {
        handle: 'C001', gramps_id: 'I0160', gender: 1,
        displayName: 'Lê Huy Nhênh', surname: 'Lê', firstName: 'Huy Nhênh',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F080'], parentFamilies: ['F079']
    },
    {
        handle: 'C002', gramps_id: 'I0161', gender: 1,
        displayName: 'Lê Huy Kênh', surname: 'Lê', firstName: 'Huy Kênh',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F081'], parentFamilies: ['F079']
    },
    {
        handle: 'C003', gramps_id: 'I0162', gender: 1,
        displayName: 'Lê Huy Trớc', surname: 'Lê', firstName: 'Huy Trớc',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F082'], parentFamilies: ['F079']
    },
    {
        handle: 'C004', gramps_id: 'I0163', gender: 1,
        displayName: 'Lê Huy Nhinh', surname: 'Lê', firstName: 'Huy Nhinh',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F083'], parentFamilies: ['F079']
    },
    {
        handle: 'C005', gramps_id: 'I0164', gender: 1,
        displayName: 'Lê Huy Inh', surname: 'Lê', firstName: 'Huy Inh',
        generation: 11, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F084'], parentFamilies: ['F079']
    },
    {
        handle: 'C006', gramps_id: 'I0165', gender: 1,
        displayName: 'Lê Huy Xích', surname: 'Lê', firstName: 'Huy Xích',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F085'], parentFamilies: ['F080']
    },
    {
        handle: 'C007', gramps_id: 'I0166', gender: 1,
        displayName: 'Lê Huy Diệc', surname: 'Lê', firstName: 'Huy Diệc',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F086'], parentFamilies: ['F081']
    },
    {
        handle: 'C008', gramps_id: 'I0167', gender: 1,
        displayName: 'Lê Huy Lạng', surname: 'Lê', firstName: 'Huy Lạng',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F087'], parentFamilies: ['F082']
    },
    {
        handle: 'C009', gramps_id: 'I0168', gender: 1,
        displayName: 'Lê Huy Lô', surname: 'Lê', firstName: 'Huy Lô',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F088'], parentFamilies: ['F083']
    },
    {
        handle: 'C010', gramps_id: 'I0169', gender: 1,
        displayName: 'Lê Huy Mợi', surname: 'Lê', firstName: 'Huy Mợi',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F089'], parentFamilies: ['F084']
    },
    {
        handle: 'C011', gramps_id: 'I0170', gender: 1,
        displayName: 'Lê Huy Đạo', surname: 'Lê', firstName: 'Huy Đạo',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F090'], parentFamilies: ['F084']
    },
    {
        handle: 'C012', gramps_id: 'I0171', gender: 1,
        displayName: 'Lê Huy Thạo', surname: 'Lê', firstName: 'Huy Thạo',
        generation: 12, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F091'], parentFamilies: ['F084']
    },
    {
        handle: 'C013', gramps_id: 'I0172', gender: 1,
        displayName: 'Lê Huy Thanh', surname: 'Lê', firstName: 'Huy Thanh',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F092'], parentFamilies: ['F085']
    },
    {
        handle: 'C014', gramps_id: 'I0173', gender: 1,
        displayName: 'Lê Huy Quế', surname: 'Lê', firstName: 'Huy Quế',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F093'], parentFamilies: ['F085']
    },
    {
        handle: 'C015', gramps_id: 'I0174', gender: 1,
        displayName: 'Lê Huy Hoan', surname: 'Lê', firstName: 'Huy Hoan',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F094'], parentFamilies: ['F086']
    },
    {
        handle: 'C016', gramps_id: 'I0175', gender: 1,
        displayName: 'Lê Huy Hiền', surname: 'Lê', firstName: 'Huy Hiền',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F095'], parentFamilies: ['F086']
    },
    {
        handle: 'C017', gramps_id: 'I0176', gender: 1,
        displayName: 'Lê Huy Sáu', surname: 'Lê', firstName: 'Huy Sáu',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F096'], parentFamilies: ['F087']
    },
    {
        handle: 'C018', gramps_id: 'I0177', gender: 1,
        displayName: 'Lê Huy Chiến', surname: 'Lê', firstName: 'Huy Chiến',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F097'], parentFamilies: ['F087']
    },
    {
        handle: 'C019', gramps_id: 'I0178', gender: 1,
        displayName: 'Lê Huy Tám', surname: 'Lê', firstName: 'Huy Tám',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F098'], parentFamilies: ['F088']
    },
    {
        handle: 'C020', gramps_id: 'I0179', gender: 1,
        displayName: 'Lê Huy Oánh', surname: 'Lê', firstName: 'Huy Oánh',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F105'], parentFamilies: ['F088']
    },
    {
        handle: 'C021', gramps_id: 'I0180', gender: 1,
        displayName: 'Lê Huy Duyệt', surname: 'Lê', firstName: 'Huy Duyệt',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F099'], parentFamilies: ['F088']
    },
    {
        handle: 'C022', gramps_id: 'I0181', gender: 1,
        displayName: 'Lê Huy Đàn', surname: 'Lê', firstName: 'Huy Đàn',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F100'], parentFamilies: ['F088']
    },
    {
        handle: 'C023', gramps_id: 'I0182', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F101'], parentFamilies: ['F089']
    },
    {
        handle: 'C024', gramps_id: 'I0184', gender: 1,
        displayName: 'Lê Huy Thành', surname: 'Lê', firstName: 'Huy Thành',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F102'], parentFamilies: ['F091']
    },
    {
        handle: 'C025', gramps_id: 'I0185', gender: 1,
        displayName: 'Lê Huy Tính', surname: 'Lê', firstName: 'Huy Tính',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F103'], parentFamilies: ['F091']
    },
    {
        handle: 'C026', gramps_id: 'I0186', gender: 1,
        displayName: 'Lê Huy Hạnh', surname: 'Lê', firstName: 'Huy Hạnh',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F104'], parentFamilies: ['F089']
    },
    {
        handle: 'C027', gramps_id: 'I0187', gender: 1,
        displayName: 'Lê Huy Hiếu', surname: 'Lê', firstName: 'Huy Hiếu',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F092']
    },
    {
        handle: 'C028', gramps_id: 'I0189', gender: 1,
        displayName: 'Lê Huy Sơn', surname: 'Lê', firstName: 'Huy Sơn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F093']
    },
    {
        handle: 'C029', gramps_id: 'I0190', gender: 1,
        displayName: 'Lê Huy Minh', surname: 'Lê', firstName: 'Huy Minh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F094']
    },
    {
        handle: 'C030', gramps_id: 'I0191', gender: 1,
        displayName: 'Lê Huy Tuân', surname: 'Lê', firstName: 'Huy Tuân',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F095']
    },
    {
        handle: 'C031', gramps_id: 'I0192', gender: 1,
        displayName: 'Lê Huy Hải', surname: 'Lê', firstName: 'Huy Hải',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F096']
    },
    {
        handle: 'C032', gramps_id: 'I0193', gender: 1,
        displayName: 'Lê Huy Dương', surname: 'Lê', firstName: 'Huy Dương',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F097']
    },
    {
        handle: 'C033', gramps_id: 'I0194', gender: 1,
        displayName: 'Lê Huy Cương', surname: 'Lê', firstName: 'Huy Cương',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F097']
    },
    {
        handle: 'C034', gramps_id: 'I0195', gender: 1,
        displayName: 'Lê Huy Thái', surname: 'Lê', firstName: 'Huy Thái',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F097']
    },
    {
        handle: 'C035', gramps_id: 'I0197', gender: 1,
        displayName: 'Lê Lê Huy', surname: 'Lê', firstName: 'Lê Huy',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F097']
    },
    {
        handle: 'C036', gramps_id: 'I0199', gender: 1,
        displayName: 'Lê Huy Việt', surname: 'Lê', firstName: 'Huy Việt',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F099']
    },
    {
        handle: 'C037', gramps_id: 'I0200', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F105']
    },
    {
        handle: 'C038', gramps_id: 'I0201', gender: 1,
        displayName: 'Lê Huy Vịnh', surname: 'Lê', firstName: 'Huy Vịnh',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F098']
    },
    {
        handle: 'C039', gramps_id: 'I0202', gender: 1,
        displayName: 'Lê Huy Hoàng', surname: 'Lê', firstName: 'Huy Hoàng',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F103']
    },
    {
        handle: 'C040', gramps_id: 'I0180', gender: 1,
        displayName: 'Lê Huy Doãn', surname: 'Lê', firstName: 'Huy Doãn',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F088']
    },
    {
        handle: 'B040', gramps_id: 'ID992', gender: 1,
        displayName: 'Lê Huy Lâm', surname: 'Lê', firstName: 'Huy Lâm',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F086']
    },
    {
        handle: 'B044', gramps_id: 'ID999', gender: 1,
        displayName: 'Lê Huy Hiền', surname: 'Lê', firstName: 'Huy Hiền',
        generation: 13, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F999'], parentFamilies: ['F069']
    },
    {
        handle: 'B043', gramps_id: 'ID998', gender: 1,
        displayName: 'Lê Huy Gian', surname: 'Lê', firstName: 'Huy Gian',
        generation: 14, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F999']
    },
    {
        handle: 'B042', gramps_id: 'ID994', gender: 1,
        displayName: 'Lê Huy Hải (con)', surname: 'Lê', firstName: 'Huy Hải (con)',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F998']
    },
    {
        handle: 'B041', gramps_id: 'ID993', gender: 1,
        displayName: 'Lê Huy Hưng (con)', surname: 'Lê', firstName: 'Huy Hưng (con)',
        generation: 15, chi: 1,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F997']
    },
    {
        handle: 'K001', gramps_id: 'I0204', gender: 1,
        displayName: 'Lê Huy Trung', surname: 'Lê', firstName: 'Huy Trung',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F107'], parentFamilies: ['F106']
    },
    {
        handle: 'K002', gramps_id: 'I0205', gender: 1,
        displayName: 'Lê Huy Thẩm', surname: 'Lê', firstName: 'Huy Thẩm',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F108'], parentFamilies: ['F106']
    },
    {
        handle: 'K003', gramps_id: 'I0206', gender: 1,
        displayName: 'Lê Huy Hớn', surname: 'Lê', firstName: 'Huy Hớn',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F109'], parentFamilies: ['F106']
    },
    {
        handle: 'K004', gramps_id: 'I0207', gender: 1,
        displayName: 'Lê Huy Hào', surname: 'Lê', firstName: 'Huy Hào',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F110'], parentFamilies: ['F106']
    },
    {
        handle: 'K005', gramps_id: 'I0208', gender: 1,
        displayName: 'Lê Huy Dung', surname: 'Lê', firstName: 'Huy Dung',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F111'], parentFamilies: ['F107']
    },
    {
        handle: 'K006', gramps_id: 'I0209', gender: 1,
        displayName: 'Lê Huy Mùi', surname: 'Lê', firstName: 'Huy Mùi',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F112'], parentFamilies: ['F108']
    },
    {
        handle: 'K007', gramps_id: 'I0210', gender: 1,
        displayName: 'Lê Huy Hiểu', surname: 'Lê', firstName: 'Huy Hiểu',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F113'], parentFamilies: ['F109']
    },
    {
        handle: 'K008', gramps_id: 'I0211', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F114'], parentFamilies: ['F110']
    },
    {
        handle: 'K009', gramps_id: 'I0212', gender: 1,
        displayName: 'Lê Huy Khuôn', surname: 'Lê', firstName: 'Huy Khuôn',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F115'], parentFamilies: ['F110']
    },
    {
        handle: 'K010', gramps_id: 'I0213', gender: 1,
        displayName: 'Lê Huy Điển', surname: 'Lê', firstName: 'Huy Điển',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F116'], parentFamilies: ['F110']
    },
    {
        handle: 'K011', gramps_id: 'I0214', gender: 1,
        displayName: 'Lê Huy Viễn', surname: 'Lê', firstName: 'Huy Viễn',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F117'], parentFamilies: ['F110']
    },
    {
        handle: 'K012', gramps_id: 'I0215', gender: 1,
        displayName: 'Lê Huy Hân', surname: 'Lê', firstName: 'Huy Hân',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F_K012'], parentFamilies: ['F111']
    },
    {
        handle: 'K013', gramps_id: 'I0216', gender: 1,
        displayName: 'Lê Huy Hạnh', surname: 'Lê', firstName: 'Huy Hạnh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F118'], parentFamilies: ['F111']
    },
    {
        handle: 'K014', gramps_id: 'I0217', gender: 1,
        displayName: 'Lê Huy Hoan', surname: 'Lê', firstName: 'Huy Hoan',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F111']
    },
    {
        handle: 'K015', gramps_id: 'I0218', gender: 1,
        displayName: 'Lê Huy Mạnh', surname: 'Lê', firstName: 'Huy Mạnh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F119'], parentFamilies: ['F112']
    },
    {
        handle: 'K016', gramps_id: 'I0219', gender: 1,
        displayName: 'Lê Huy Tảo', surname: 'Lê', firstName: 'Huy Tảo',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F120'], parentFamilies: ['F112']
    },
    {
        handle: 'K017', gramps_id: 'I0220', gender: 1,
        displayName: 'Lê Huy Nguyễn', surname: 'Lê', firstName: 'Huy Nguyễn',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F121'], parentFamilies: ['F112']
    },
    {
        handle: 'K018', gramps_id: 'I0221', gender: 1,
        displayName: 'Lê Huy Thành', surname: 'Lê', firstName: 'Huy Thành',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F122'], parentFamilies: ['F113']
    },
    {
        handle: 'K019', gramps_id: 'I0222', gender: 1,
        displayName: 'Lê Huy Sơn', surname: 'Lê', firstName: 'Huy Sơn',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F123'], parentFamilies: ['F113']
    },
    {
        handle: 'K020', gramps_id: 'I0223', gender: 1,
        displayName: 'Lê Huy Dương', surname: 'Lê', firstName: 'Huy Dương',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F124'], parentFamilies: ['F114']
    },
    {
        handle: 'K021', gramps_id: 'I0224', gender: 1,
        displayName: 'Lê Hữu Khanh', surname: 'Lê', firstName: 'Hữu Khanh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F125'], parentFamilies: ['F115']
    },
    {
        handle: 'K022', gramps_id: 'I0225', gender: 1,
        displayName: 'Lê Huy Phong', surname: 'Lê', firstName: 'Huy Phong',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F117']
    },
    {
        handle: 'K023', gramps_id: 'I0226', gender: 1,
        displayName: 'Lê Huy Tùng', surname: 'Lê', firstName: 'Huy Tùng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F117']
    },
    {
        handle: 'K024', gramps_id: 'I0227', gender: 1,
        displayName: 'Lê Huy Hiếu', surname: 'Lê', firstName: 'Huy Hiếu',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_K012']
    },
    {
        handle: 'K025', gramps_id: 'I0228', gender: 1,
        displayName: 'Lê Huy Cường', surname: 'Lê', firstName: 'Huy Cường',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_K012']
    },
    {
        handle: 'K026', gramps_id: 'I0229', gender: 1,
        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F119']
    },
    {
        handle: 'K027', gramps_id: 'I0230', gender: 1,
        displayName: 'Lê Huy Tiến', surname: 'Lê', firstName: 'Huy Tiến',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F120']
    },
    {
        handle: 'K028', gramps_id: 'I0231', gender: 1,
        displayName: 'Lê Huy Tưởng', surname: 'Lê', firstName: 'Huy Tưởng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F_K028'], parentFamilies: ['F112']
    },
    {
        handle: 'K029', gramps_id: 'I0232', gender: 1,
        displayName: 'Lê Thanh Long', surname: 'Lê', firstName: 'Thanh Long',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F122']
    },
    {
        handle: 'K030', gramps_id: 'I0233', gender: 1,
        displayName: 'Lê Minh Hoàng', surname: 'Lê', firstName: 'Minh Hoàng',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F123']
    },
    {
        handle: 'K031', gramps_id: 'I0234', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F124']
    },
    {
        handle: 'K032', gramps_id: 'I0235', gender: 1,
        displayName: 'Lê Gia Bảo', surname: 'Lê', firstName: 'Gia Bảo',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F125']
    },
    {
        handle: 'B039', gramps_id: 'ID991', gender: 1,
        displayName: 'Lê Huy Đương', surname: 'Lê', firstName: 'Huy Đương',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_K028']
    },
    {
        handle: 'J001', gramps_id: 'I0236', gender: 1,
        displayName: 'Lê Huy Chỉnh', surname: 'Lê', firstName: 'Huy Chỉnh',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F127'], parentFamilies: ['F126']
    },
    {
        handle: 'J002', gramps_id: 'I0237', gender: 1,
        displayName: 'Lê Huy Ngát', surname: 'Lê', firstName: 'Huy Ngát',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F128'], parentFamilies: ['F127']
    },
    {
        handle: 'J003', gramps_id: 'I0238', gender: 1,
        displayName: 'Lê Huy Hồng', surname: 'Lê', firstName: 'Huy Hồng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F129'], parentFamilies: ['F128']
    },
    {
        handle: 'J004', gramps_id: 'I0239', gender: 1,
        displayName: 'Lê Huy Hiên', surname: 'Lê', firstName: 'Huy Hiên',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F128']
    },
    {
        handle: 'J005', gramps_id: 'I0240', gender: 1,
        displayName: 'Lê Huy Huê', surname: 'Lê', firstName: 'Huy Huê',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F130'], parentFamilies: ['F128']
    },
    {
        handle: 'J006', gramps_id: 'I0241', gender: 1,
        displayName: 'Lê Huy Hiệu', surname: 'Lê', firstName: 'Huy Hiệu',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F131'], parentFamilies: ['F128']
    },
    {
        handle: 'J007', gramps_id: 'I0242', gender: 1,
        displayName: 'Lê Huy Hanh', surname: 'Lê', firstName: 'Huy Hanh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F132'], parentFamilies: ['F128']
    },
    {
        handle: 'J008', gramps_id: 'I0243', gender: 1,
        displayName: 'Lê Lê Huy', surname: 'Lê', firstName: 'Lê Huy',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F_J008'], parentFamilies: ['F128']
    },
    {
        handle: 'J009', gramps_id: 'I0244', gender: 1,
        displayName: 'Lê Huy Phong', surname: 'Lê', firstName: 'Huy Phong',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F129']
    },
    {
        handle: 'J010', gramps_id: 'I0245', gender: 1,
        displayName: 'Lê Huy Đắc', surname: 'Lê', firstName: 'Huy Đắc',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F129']
    },
    {
        handle: 'J011', gramps_id: 'I0246', gender: 1,
        displayName: 'Lê Huy Quân', surname: 'Lê', firstName: 'Huy Quân',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F129']
    },
    {
        handle: 'J012', gramps_id: 'I0247', gender: 1,
        displayName: 'Lê Huy Hưng', surname: 'Lê', firstName: 'Huy Hưng',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F130']
    },
    {
        handle: 'J013', gramps_id: 'I0248', gender: 1,
        displayName: 'Lê Đức Anh', surname: 'Lê', firstName: 'Đức Anh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F131']
    },
    {
        handle: 'J014', gramps_id: 'I0249', gender: 1,
        displayName: 'Lê Huy Anh', surname: 'Lê', firstName: 'Huy Anh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F131']
    },
    {
        handle: 'J015', gramps_id: 'I0250', gender: 1,
        displayName: 'Lê Việt Anh', surname: 'Lê', firstName: 'Việt Anh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F132']
    },
    {
        handle: 'J016', gramps_id: 'I0251', gender: 1,
        displayName: 'Lê Phi Hùng', surname: 'Lê', firstName: 'Phi Hùng',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_J008']
    },
    {
        handle: 'L001', gramps_id: 'I0252', gender: 1,
        displayName: 'Lê Huy Diêu', surname: 'Lê', firstName: 'Huy Diêu',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F134'], parentFamilies: ['F133']
    },
    {
        handle: 'L002', gramps_id: 'I0253', gender: 1,
        displayName: 'Lê Huy Dơng', surname: 'Lê', firstName: 'Huy Dơng',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F135'], parentFamilies: ['F133']
    },
    {
        handle: 'L003', gramps_id: 'I0254', gender: 1,
        displayName: 'Lê Huy Miều', surname: 'Lê', firstName: 'Huy Miều',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F136'], parentFamilies: ['F134']
    },
    {
        handle: 'L004', gramps_id: 'I0255', gender: 1,
        displayName: 'Lê Huy Mạch', surname: 'Lê', firstName: 'Huy Mạch',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F137'], parentFamilies: ['F134']
    },
    {
        handle: 'L005', gramps_id: 'I0256', gender: 1,
        displayName: 'Lê Huy Đậu', surname: 'Lê', firstName: 'Huy Đậu',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F138'], parentFamilies: ['F134']
    },
    {
        handle: 'L006', gramps_id: 'I0257', gender: 1,
        displayName: 'Lê Huy Hòa', surname: 'Lê', firstName: 'Huy Hòa',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F139'], parentFamilies: ['F134']
    },
    {
        handle: 'L007', gramps_id: 'I0258', gender: 1,
        displayName: 'Lê Huy Mơng', surname: 'Lê', firstName: 'Huy Mơng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F140'], parentFamilies: ['F135']
    },
    {
        handle: 'L008', gramps_id: 'I0259', gender: 1,
        displayName: 'Lê Huy Lãng', surname: 'Lê', firstName: 'Huy Lãng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F141'], parentFamilies: ['F135']
    },
    {
        handle: 'L009', gramps_id: 'I0260', gender: 1,
        displayName: 'Lê Huy Quan', surname: 'Lê', firstName: 'Huy Quan',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F143'], parentFamilies: ['F136']
    },
    {
        handle: 'L010', gramps_id: 'I0261', gender: 1,
        displayName: 'Lê Huy Thúy', surname: 'Lê', firstName: 'Huy Thúy',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F136']
    },
    {
        handle: 'L011', gramps_id: 'I0262', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F144'], parentFamilies: ['F137']
    },
    {
        handle: 'L012', gramps_id: 'I0263', gender: 1,
        displayName: 'Lê Huy Long', surname: 'Lê', firstName: 'Huy Long',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F137']
    },
    {
        handle: 'L013', gramps_id: 'I0264', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F138']
    },
    {
        handle: 'L014', gramps_id: 'I0265', gender: 1,
        displayName: 'Lê Huy Hiếu', surname: 'Lê', firstName: 'Huy Hiếu',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F138']
    },
    {
        handle: 'L015', gramps_id: 'I0266', gender: 1,
        displayName: 'Lê Huy Hậu', surname: 'Lê', firstName: 'Huy Hậu',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F145'], parentFamilies: ['F139']
    },
    {
        handle: 'L016', gramps_id: 'I0267', gender: 1,
        displayName: 'Lê Huy Bá', surname: 'Lê', firstName: 'Huy Bá',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F146'], parentFamilies: ['F140']
    },
    {
        handle: 'L017', gramps_id: 'I0268', gender: 1,
        displayName: 'Lê Huy Long', surname: 'Lê', firstName: 'Huy Long',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F147'], parentFamilies: ['F140']
    },
    {
        handle: 'L018', gramps_id: 'I0269', gender: 1,
        displayName: 'Lê Huy Linh', surname: 'Lê', firstName: 'Huy Linh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F140']
    },
    {
        handle: 'B038', gramps_id: 'ID990', gender: 1,
        displayName: 'Lê Huy Hưng', surname: 'Lê', firstName: 'Huy Hưng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F140']
    },
    {
        handle: 'L019', gramps_id: 'I0270', gender: 1,
        displayName: 'Lê Huy Giáp', surname: 'Lê', firstName: 'Huy Giáp',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F_L019'], parentFamilies: ['F_M001']
    },
    {
        handle: 'L020', gramps_id: 'I0271', gender: 1,
        displayName: 'Lê Huy Dũng', surname: 'Lê', firstName: 'Huy Dũng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F142'], parentFamilies: ['F_M001']
    },
    {
        handle: 'L021', gramps_id: 'I0272', gender: 1,
        displayName: 'Lê Huy Dương', surname: 'Lê', firstName: 'Huy Dương',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_M001']
    },
    {
        handle: 'L022', gramps_id: 'I0273', gender: 1,
        displayName: 'Lê Huy Quý', surname: 'Lê', firstName: 'Huy Quý',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F_L019']
    },
    {
        handle: 'L023', gramps_id: 'I0274', gender: 1,
        displayName: 'Lê Huy Huấn', surname: 'Lê', firstName: 'Huy Huấn',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F143']
    },
    {
        handle: 'L024', gramps_id: 'I0275', gender: 1,
        displayName: 'Lê Huy Hải', surname: 'Lê', firstName: 'Huy Hải',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F143']
    },
    {
        handle: 'L025', gramps_id: 'I0276', gender: 1,
        displayName: 'Lê Hoàng Minh', surname: 'Lê', firstName: 'Hoàng Minh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F144']
    },
    {
        handle: 'L026', gramps_id: 'I0277', gender: 1,
        displayName: 'Lê Thế Anh', surname: 'Lê', firstName: 'Thế Anh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F145']
    },
    {
        handle: 'L027', gramps_id: 'I0278', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F145']
    },
    {
        handle: 'L028', gramps_id: 'I0279', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F146']
    },
    {
        handle: 'L029', gramps_id: 'I0280', gender: 1,
        displayName: 'Lê Huy Hiếu', surname: 'Lê', firstName: 'Huy Hiếu',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F146']
    },
    {
        handle: 'M001', gramps_id: 'I0282', gender: 1,
        displayName: 'Lê Huy Bồn', surname: 'Lê', firstName: 'Huy Bồn',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F_M001'], parentFamilies: ['F148']
    },
    {
        handle: 'M002', gramps_id: 'I0283', gender: 1,
        displayName: 'Lê Huy Thịnh', surname: 'Lê', firstName: 'Huy Thịnh',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F148']
    },
    {
        handle: 'I001', gramps_id: 'I0284', gender: 1,
        displayName: 'Lê Huy Trước', surname: 'Lê', firstName: 'Huy Trước',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F150'], parentFamilies: ['F149']
    },
    {
        handle: 'I002', gramps_id: 'I0285', gender: 1,
        displayName: 'Lê Huy Quảng', surname: 'Lê', firstName: 'Huy Quảng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F151'], parentFamilies: ['F150']
    },
    {
        handle: 'I003', gramps_id: 'I0286', gender: 1,
        displayName: 'Lê Huy Bảng', surname: 'Lê', firstName: 'Huy Bảng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F150']
    },
    {
        handle: 'I004', gramps_id: 'I0287', gender: 1,
        displayName: 'Lê Huy Ới', surname: 'Lê', firstName: 'Huy Ới',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F152'], parentFamilies: ['F150']
    },
    {
        handle: 'I005', gramps_id: 'I0288', gender: 1,
        displayName: 'Lê Huy Chinh', surname: 'Lê', firstName: 'Huy Chinh',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F153'], parentFamilies: ['F150']
    },
    {
        handle: 'I006', gramps_id: 'I0289', gender: 1,
        displayName: 'Lê Huy Thanh', surname: 'Lê', firstName: 'Huy Thanh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F154'], parentFamilies: ['F151']
    },
    {
        handle: 'I007', gramps_id: 'I0290', gender: 1,
        displayName: 'Lê Huy Trường', surname: 'Lê', firstName: 'Huy Trường',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F155'], parentFamilies: ['F151']
    },
    {
        handle: 'I008', gramps_id: 'I0291', gender: 1,
        displayName: 'Lê Huy Thọ', surname: 'Lê', firstName: 'Huy Thọ',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F156'], parentFamilies: ['F151']
    },
    {
        handle: 'I009', gramps_id: 'I0292', gender: 1,
        displayName: 'Lê Huy Đại', surname: 'Lê', firstName: 'Huy Đại',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F157'], parentFamilies: ['F151']
    },
    {
        handle: 'I010', gramps_id: 'I0293', gender: 1,
        displayName: 'Lê Huy Hải', surname: 'Lê', firstName: 'Huy Hải',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F158'], parentFamilies: ['F151']
    },
    {
        handle: 'I011', gramps_id: 'I0294', gender: 1,
        displayName: 'Lê Huy Thực', surname: 'Lê', firstName: 'Huy Thực',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F159'], parentFamilies: ['F152']
    },
    {
        handle: 'I012', gramps_id: 'I0295', gender: 1,
        displayName: 'Lê Huy Thức', surname: 'Lê', firstName: 'Huy Thức',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F160'], parentFamilies: ['F152']
    },
    {
        handle: 'I013', gramps_id: 'I0296', gender: 1,
        displayName: 'Lê Huy Tiễn', surname: 'Lê', firstName: 'Huy Tiễn',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F161'], parentFamilies: ['F152']
    },
    {
        handle: 'I014', gramps_id: 'I0297', gender: 1,
        displayName: 'Lê Huy Thiện', surname: 'Lê', firstName: 'Huy Thiện',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F162'], parentFamilies: ['F153']
    },
    {
        handle: 'I015', gramps_id: 'I0298', gender: 1,
        displayName: 'Lê Huy Hoàn', surname: 'Lê', firstName: 'Huy Hoàn',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F153']
    },
    {
        handle: 'I016', gramps_id: 'I0299', gender: 1,
        displayName: 'Lê Huy Chương', surname: 'Lê', firstName: 'Huy Chương',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F154']
    },
    {
        handle: 'I017', gramps_id: 'I0300', gender: 1,
        displayName: 'Lê Huy Hảo', surname: 'Lê', firstName: 'Huy Hảo',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F155']
    },
    {
        handle: 'I018', gramps_id: 'I0301', gender: 1,
        displayName: 'Lê Huy Hà', surname: 'Lê', firstName: 'Huy Hà',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F156']
    },
    {
        handle: 'I019', gramps_id: 'I0302', gender: 1,
        displayName: 'Lê Huy Phúc', surname: 'Lê', firstName: 'Huy Phúc',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F157']
    },
    {
        handle: 'I020', gramps_id: 'I0303', gender: 1,
        displayName: 'Lê Huy Huân', surname: 'Lê', firstName: 'Huy Huân',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F158']
    },
    {
        handle: 'I021', gramps_id: 'I0304', gender: 1,
        displayName: 'Lê Đức Anh', surname: 'Lê', firstName: 'Đức Anh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F159']
    },
    {
        handle: 'I022', gramps_id: 'I0305', gender: 1,
        displayName: 'Lê Huy Tuấn', surname: 'Lê', firstName: 'Huy Tuấn',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F160']
    },
    {
        handle: 'I023', gramps_id: 'I0306', gender: 1,
        displayName: 'Lê Huy Tú', surname: 'Lê', firstName: 'Huy Tú',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F161']
    },
    {
        handle: 'I024', gramps_id: 'I0307', gender: 1,
        displayName: 'Lê Trường Danh', surname: 'Lê', firstName: 'Trường Danh',
        generation: 14, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F162']
    },
    {
        handle: 'F001', gramps_id: 'I0308', gender: 1,
        displayName: 'Lê Huy Chính', surname: 'Lê', firstName: 'Huy Chính',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F164'], parentFamilies: ['F163']
    },
    {
        handle: 'F002', gramps_id: 'I0309', gender: 1,
        displayName: 'Lê Huy Sơn', surname: 'Lê', firstName: 'Huy Sơn',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F165'], parentFamilies: ['F164']
    },
    {
        handle: 'F003', gramps_id: 'I0310', gender: 1,
        displayName: 'Lê Huy Lâm', surname: 'Lê', firstName: 'Huy Lâm',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F166'], parentFamilies: ['F164']
    },
    {
        handle: 'F004', gramps_id: 'I0311', gender: 1,
        displayName: 'Lê Huy Hải', surname: 'Lê', firstName: 'Huy Hải',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F167'], parentFamilies: ['F164']
    },
    {
        handle: 'F005', gramps_id: 'I0312', gender: 1,
        displayName: 'Lê Huy Chế', surname: 'Lê', firstName: 'Huy Chế',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F168'], parentFamilies: ['F164']
    },
    {
        handle: 'F006', gramps_id: 'I0313', gender: 1,
        displayName: 'Lê Huy Dũng', surname: 'Lê', firstName: 'Huy Dũng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F165']
    },
    {
        handle: 'F007', gramps_id: 'I0314', gender: 1,
        displayName: 'Lê Huy Độ', surname: 'Lê', firstName: 'Huy Độ',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F165']
    },
    {
        handle: 'F008', gramps_id: 'I0315', gender: 1,
        displayName: 'Lê Huy Việt', surname: 'Lê', firstName: 'Huy Việt',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F166']
    },
    {
        handle: 'F009', gramps_id: 'I0316', gender: 1,
        displayName: 'Lê Huy Minh', surname: 'Lê', firstName: 'Huy Minh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F166']
    },
    {
        handle: 'F010', gramps_id: 'I0317', gender: 1,
        displayName: 'Lê Huy Đức', surname: 'Lê', firstName: 'Huy Đức',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F167']
    },
    {
        handle: 'F011', gramps_id: 'I0318', gender: 1,
        displayName: 'Lê Huy Đông', surname: 'Lê', firstName: 'Huy Đông',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F167']
    },
    {
        handle: 'F012', gramps_id: 'I0319', gender: 1,
        displayName: 'Lê Huy Vận', surname: 'Lê', firstName: 'Huy Vận',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F167']
    },
    {
        handle: 'F013', gramps_id: 'I0320', gender: 1,
        displayName: 'Lê Huy Nghĩa', surname: 'Lê', firstName: 'Huy Nghĩa',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F167']
    },
    {
        handle: 'F014', gramps_id: 'I0321', gender: 1,
        displayName: 'Lê Huy Hưng', surname: 'Lê', firstName: 'Huy Hưng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F015', gramps_id: 'I0322', gender: 1,
        displayName: 'Lê Huy Hanh', surname: 'Lê', firstName: 'Huy Hanh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F016', gramps_id: 'I0323', gender: 1,
        displayName: 'Lê Huy Hồng', surname: 'Lê', firstName: 'Huy Hồng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F017', gramps_id: 'I0324', gender: 1,
        displayName: 'Lê Huy Phương', surname: 'Lê', firstName: 'Huy Phương',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F018', gramps_id: 'I0325', gender: 1,
        displayName: 'Lê Huy Hiệu', surname: 'Lê', firstName: 'Huy Hiệu',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F019', gramps_id: 'I0326', gender: 1,
        displayName: 'Lê Huy Đính', surname: 'Lê', firstName: 'Huy Đính',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F020', gramps_id: 'I0327', gender: 1,
        displayName: 'Lê Huy Mạnh', surname: 'Lê', firstName: 'Huy Mạnh',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F021', gramps_id: 'I0328', gender: 1,
        displayName: 'Lê Huy Lượng', surname: 'Lê', firstName: 'Huy Lượng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F022', gramps_id: 'I0329', gender: 1,
        displayName: 'Lê Huy Tiếp', surname: 'Lê', firstName: 'Huy Tiếp',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'F023', gramps_id: 'I0330', gender: 1,
        displayName: 'Lê Huy Lộc', surname: 'Lê', firstName: 'Huy Lộc',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F168']
    },
    {
        handle: 'G001', gramps_id: 'I0331', gender: 1,
        displayName: 'Lê Huy Nghi', surname: 'Lê', firstName: 'Huy Nghi',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F170'], parentFamilies: ['F169']
    },
    {
        handle: 'G002', gramps_id: 'I0332', gender: 1,
        displayName: 'Lê Huy Phúc', surname: 'Lê', firstName: 'Huy Phúc',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F171'], parentFamilies: ['F169']
    },
    {
        handle: 'G003', gramps_id: 'I0333', gender: 1,
        displayName: 'Lê Huy Dân', surname: 'Lê', firstName: 'Huy Dân',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F172'], parentFamilies: ['F170']
    },
    {
        handle: 'G004', gramps_id: 'I0334', gender: 1,
        displayName: 'Lê Huy Toàn', surname: 'Lê', firstName: 'Huy Toàn',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F173'], parentFamilies: ['F170']
    },
    {
        handle: 'G005', gramps_id: 'I0335', gender: 1,
        displayName: 'Lê Huy Lợi', surname: 'Lê', firstName: 'Huy Lợi',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F174'], parentFamilies: ['F171']
    },
    {
        handle: 'G006', gramps_id: 'I0336', gender: 1,
        displayName: 'Lê Huy Thắng', surname: 'Lê', firstName: 'Huy Thắng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F175'], parentFamilies: ['F171']
    },
    {
        handle: 'G007', gramps_id: 'I0337', gender: 1,
        displayName: 'Lê Huy Thuận', surname: 'Lê', firstName: 'Huy Thuận',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F172']
    },
    {
        handle: 'G008', gramps_id: 'I0338', gender: 1,
        displayName: 'Lê Huy Luận', surname: 'Lê', firstName: 'Huy Luận',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F172']
    },
    {
        handle: 'G009', gramps_id: 'I0339', gender: 1,
        displayName: 'Lê Huy Nghị', surname: 'Lê', firstName: 'Huy Nghị',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F173']
    },
    {
        handle: 'G010', gramps_id: 'I0340', gender: 1,
        displayName: 'Lê Huy Quy', surname: 'Lê', firstName: 'Huy Quy',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F173']
    },
    {
        handle: 'G011', gramps_id: 'I0341', gender: 1,
        displayName: 'Lê Huy Nam', surname: 'Lê', firstName: 'Huy Nam',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F174']
    },
    {
        handle: 'G012', gramps_id: 'I0342', gender: 1,
        displayName: 'Lê Huy Lâm', surname: 'Lê', firstName: 'Huy Lâm',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F174']
    },
    {
        handle: 'G013', gramps_id: 'I0343', gender: 1,
        displayName: 'Lê Huy Trọng', surname: 'Lê', firstName: 'Huy Trọng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F175']
    },
    {
        handle: 'G014', gramps_id: 'I0344', gender: 1,
        displayName: 'Lê Huy Tùng', surname: 'Lê', firstName: 'Huy Tùng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F175']
    },
    {
        handle: 'H001', gramps_id: 'I0345', gender: 1,
        displayName: 'Lê Huy Dũng', surname: 'Lê', firstName: 'Huy Dũng',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F177'], parentFamilies: ['F176']
    },
    {
        handle: 'H002', gramps_id: 'I0346', gender: 1,
        displayName: 'Lê Huy Minh', surname: 'Lê', firstName: 'Huy Minh',
        generation: 11, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F178'], parentFamilies: ['F176']
    },
    {
        handle: 'H003', gramps_id: 'I0347', gender: 1,
        displayName: 'Lê Huy Hùng', surname: 'Lê', firstName: 'Huy Hùng',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F179'], parentFamilies: ['F177']
    },
    {
        handle: 'H004', gramps_id: 'I0348', gender: 1,
        displayName: 'Lê Huy Năm', surname: 'Lê', firstName: 'Huy Năm',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F180'], parentFamilies: ['F177']
    },
    {
        handle: 'H005', gramps_id: 'I0349', gender: 1,
        displayName: 'Lê Huy Sáu', surname: 'Lê', firstName: 'Huy Sáu',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F181'], parentFamilies: ['F178']
    },
    {
        handle: 'H006', gramps_id: 'I0350', gender: 1,
        displayName: 'Lê Huy Lộc', surname: 'Lê', firstName: 'Huy Lộc',
        generation: 12, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: ['F182'], parentFamilies: ['F178']
    },
    {
        handle: 'H007', gramps_id: 'I0351', gender: 1,
        displayName: 'Lê Huy Lương', surname: 'Lê', firstName: 'Huy Lương',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F179']
    },
    {
        handle: 'H008', gramps_id: 'I0352', gender: 1,
        displayName: 'Lê Huy Việt', surname: 'Lê', firstName: 'Huy Việt',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F179']
    },
    {
        handle: 'H009', gramps_id: 'I0353', gender: 1,
        displayName: 'Lê Huy Tâm', surname: 'Lê', firstName: 'Huy Tâm',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F180']
    },
    {
        handle: 'H010', gramps_id: 'I0354', gender: 1,
        displayName: 'Lê Huy Tự', surname: 'Lê', firstName: 'Huy Tự',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F181']
    },
    {
        handle: 'H011', gramps_id: 'I0355', gender: 1,
        displayName: 'Lê Huy Giáp', surname: 'Lê', firstName: 'Huy Giáp',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F182']
    },
    {
        handle: 'H012', gramps_id: 'I0356', gender: 1,
        displayName: 'Lê Huy Dũng', surname: 'Lê', firstName: 'Huy Dũng',
        generation: 13, chi: 3,
        isLiving: true, isPrivacyFiltered: false, isPatrilineal: true,
        families: [], parentFamilies: ['F182']
    },
];

// ════════════════════════════════════════════════════════════════════════
// FAMILIES — 182 gia đình
// ════════════════════════════════════════════════════════════════════════
export const MOCK_FAMILIES: TreeFamily[] = [
    {
        handle: 'F001', fatherHandle: 'P001',
        children: ['P002']
    },
    {
        handle: 'F002', fatherHandle: 'P002',
        children: ['P003']
    },
    {
        handle: 'F003', fatherHandle: 'P003',
        children: ['P004', 'P005', 'P006']
    },
    {
        handle: 'F004', fatherHandle: 'P004',
        children: ['P007']
    },
    {
        handle: 'F005', fatherHandle: 'P005',
        children: ['P008']
    },
    {
        handle: 'F006', fatherHandle: 'P006',
        children: ['P009']
    },
    {
        handle: 'F007', fatherHandle: 'P007',
        children: ['P010', 'P011', 'P012']
    },
    {
        handle: 'F008', fatherHandle: 'P008',
        children: ['P013']
    },
    {
        handle: 'F009', fatherHandle: 'P009',
        children: ['P014']
    },
    {
        handle: 'F010', fatherHandle: 'P010',
        children: ['P015', 'P016', 'P017']
    },
    {
        handle: 'F011', fatherHandle: 'P013',
        children: ['P018', 'P019']
    },
    {
        handle: 'F012', fatherHandle: 'P014',
        children: ['P020']
    },
    {
        handle: 'F013', fatherHandle: 'P015',
        children: ['P021']
    },
    {
        handle: 'F014', fatherHandle: 'P016',
        children: ['P022']
    },
    {
        handle: 'F015', fatherHandle: 'P018',
        children: ['P023']
    },
    {
        handle: 'F016', fatherHandle: 'P020',
        children: ['P024', 'P025', 'P026', 'P027']
    },
    {
        handle: 'F017', fatherHandle: 'P021',
        children: ['P028', 'P029', 'P030', 'P031']
    },
    {
        handle: 'F018', fatherHandle: 'P022',
        children: ['P032', 'P033']
    },
    {
        handle: 'F019', fatherHandle: 'P023',
        children: ['P034']
    },
    {
        handle: 'F020', fatherHandle: 'P024',
        children: ['P035']
    },
    {
        handle: 'F021', fatherHandle: 'P025',
        children: ['P036']
    },
    {
        handle: 'F022', fatherHandle: 'P026',
        children: ['P037']
    },
    {
        handle: 'F023', fatherHandle: 'P027',
        children: ['P038']
    },
    {
        handle: 'F024', fatherHandle: 'P028',
        children: ['P039']
    },
    {
        handle: 'F025', fatherHandle: 'P029',
        children: []
    },
    {
        handle: 'F026', fatherHandle: 'P030',
        children: ['P040', 'P041']
    },
    {
        handle: 'F027', fatherHandle: 'P031',
        children: ['P042']
    },
    {
        handle: 'F028', fatherHandle: 'P032',
        children: ['P043']
    },
    {
        handle: 'F029', fatherHandle: 'P033',
        children: ['P044']
    },
    {
        handle: 'F030', fatherHandle: 'P034',
        children: ['P045', 'P046', 'P047']
    },
    {
        handle: 'F031', fatherHandle: 'P035',
        children: ['P048']
    },
    {
        handle: 'F032', fatherHandle: 'P036',
        children: ['P049']
    },
    {
        handle: 'F033', fatherHandle: 'P037',
        children: ['P050']
    },
    {
        handle: 'F034', fatherHandle: 'P038',
        children: ['P051', 'P052', 'P053', 'P054', 'P055', 'P056']
    },
    {
        handle: 'F035', fatherHandle: 'P039',
        children: ['A001', 'A002']
    },
    {
        handle: 'F036', fatherHandle: 'A001',
        children: ['A003', 'A004']
    },
    {
        handle: 'F037', fatherHandle: 'A002',
        children: ['A005', 'A006', 'A007']
    },
    {
        handle: 'F038', fatherHandle: 'A003',
        children: ['A008', 'A009', 'A010', 'A011']
    },
    {
        handle: 'F039', fatherHandle: 'A004',
        children: ['A012', 'A013', 'A014']
    },
    {
        handle: 'F040', fatherHandle: 'A005',
        children: ['A015']
    },
    {
        handle: 'F041', fatherHandle: 'A006',
        children: ['A016']
    },
    {
        handle: 'F042', fatherHandle: 'A007',
        children: ['A017']
    },
    {
        handle: 'F043', fatherHandle: 'A008',
        children: ['A018', 'A019', 'A020', 'A021', 'A022', 'A023']
    },
    {
        handle: 'F044', fatherHandle: 'A010',
        children: ['A024', 'A025', 'A026']
    },
    {
        handle: 'F045', fatherHandle: 'A011',
        children: ['A027']
    },
    {
        handle: 'F046', fatherHandle: 'A014',
        children: ['A028']
    },
    {
        handle: 'F047', fatherHandle: 'A016',
        children: ['A029', 'A030']
    },
    {
        handle: 'F048', fatherHandle: 'A017',
        children: []
    },
    {
        handle: 'F048a', fatherHandle: 'A015',
        children: ['A037']
    },
    {
        handle: 'F049', fatherHandle: 'A018',
        children: ['A031', 'A032']
    },
    {
        handle: 'F050', fatherHandle: 'A024',
        children: ['A033', 'A034', 'A035', 'A036']
    },
    {
        handle: 'F051', fatherHandle: 'P040',
        children: ['D001', 'D002']
    },
    {
        handle: 'F052', fatherHandle: 'D001',
        children: ['D003', 'D004']
    },
    {
        handle: 'F053', fatherHandle: 'D002',
        children: ['D005']
    },
    {
        handle: 'F054', fatherHandle: 'D003',
        children: ['D006', 'D007', 'D008']
    },
    {
        handle: 'F055', fatherHandle: 'D005',
        children: ['D009', 'D016', 'D010', 'D011', 'D012']
    },
    {
        handle: 'F056', fatherHandle: 'D006',
        children: []
    },
    {
        handle: 'F057', fatherHandle: 'D009',
        children: ['D015']
    },
    {
        handle: 'F058', fatherHandle: 'D012',
        children: ['D018', 'E008']
    },
    {
        handle: 'F059', fatherHandle: 'D013',
        children: ['D019']
    },
    {
        handle: 'F060', fatherHandle: 'D015',
        children: ['D021']
    },
    {
        handle: 'F061', fatherHandle: 'P043',
        children: ['E001', 'E002', 'E003']
    },
    {
        handle: 'F062', fatherHandle: 'E003',
        children: ['E004']
    },
    {
        handle: 'F063', fatherHandle: 'E004',
        children: ['E005', 'E006']
    },
    {
        handle: 'F064', fatherHandle: 'E005',
        children: []
    },
    {
        handle: 'F056a', fatherHandle: 'D007',
        children: ['D013']
    },
    {
        handle: 'F056b', fatherHandle: 'D008',
        children: ['D014']
    },
    {
        handle: 'F058a', fatherHandle: 'D016',
        children: ['D017']
    },
    {
        handle: 'F059a', fatherHandle: 'D014',
        children: ['D020']
    },
    {
        handle: 'F064a', fatherHandle: 'E006',
        children: ['E007']
    },
    {
        handle: 'F065', fatherHandle: 'P041',
        children: ['B001', 'B002']
    },
    {
        handle: 'F066', fatherHandle: 'B001',
        children: ['B003', 'B004']
    },
    {
        handle: 'F067', fatherHandle: 'B002',
        children: ['B005']
    },
    {
        handle: 'F068', fatherHandle: 'B003',
        children: ['B006', 'B007', 'B008', 'B009']
    },
    {
        handle: 'F069', fatherHandle: 'B004',
        children: ['B044', 'B010', 'B011', 'B012', 'B013', 'B014', 'B015']
    },
    {
        handle: 'F999', fatherHandle: 'B044',
        children: ['B021', 'B043']
    },
    {
        handle: 'F998', fatherHandle: 'B029',
        children: ['B042']
    },
    {
        handle: 'F997', fatherHandle: 'B030',
        children: ['B041']
    },
    {
        handle: 'F070', fatherHandle: 'B005',
        children: ['B016']
    },
    {
        handle: 'F071', fatherHandle: 'B006',
        children: ['B017', 'B018', 'B019', 'B020']
    },
    {
        handle: 'F072', fatherHandle: 'B010',
        children: ['B021', 'B022', 'B023', 'B024']
    },
    {
        handle: 'F073', fatherHandle: 'B011',
        children: ['B025', 'B026', 'B027']
    },
    {
        handle: 'F074', fatherHandle: 'B014',
        children: ['B028']
    },
    {
        handle: 'F075', fatherHandle: 'B016',
        children: ['B029', 'B030', 'B031']
    },
    {
        handle: 'F076', fatherHandle: 'B024',
        children: ['B032', 'B033']
    },
    {
        handle: 'F077', fatherHandle: 'B026',
        children: ['B034', 'B035']
    },
    {
        handle: 'F078', fatherHandle: 'B009',
        children: ['B036', 'B037']
    },
    {
        handle: 'F079', fatherHandle: 'P042',
        children: ['C001', 'C002', 'C003', 'C004', 'C005']
    },
    {
        handle: 'F080', fatherHandle: 'C001',
        children: ['C006']
    },
    {
        handle: 'F081', fatherHandle: 'C002',
        children: ['C007']
    },
    {
        handle: 'F082', fatherHandle: 'C003',
        children: ['C008']
    },
    {
        handle: 'F083', fatherHandle: 'C004',
        children: ['C009']
    },
    {
        handle: 'F084', fatherHandle: 'C005',
        children: ['C010', 'C011', 'C012']
    },
    {
        handle: 'F085', fatherHandle: 'C006',
        children: ['C013', 'C014']
    },
    {
        handle: 'F086', fatherHandle: 'C007',
        children: ['C015', 'C016']
    },
    {
        handle: 'F087', fatherHandle: 'C008',
        children: ['C017', 'C018']
    },
    {
        handle: 'F088', fatherHandle: 'C009',
        children: ['C019', 'C020', 'C021', 'C040', 'C022']
    },
    {
        handle: 'F089', fatherHandle: 'C010',
        children: ['C023', 'C026']
    },
    {
        handle: 'F090', fatherHandle: 'C011',
        children: []
    },
    {
        handle: 'F091', fatherHandle: 'C012',
        children: ['C024', 'C025']
    },
    {
        handle: 'F092', fatherHandle: 'C013',
        children: ['C027', 'B040']
    },
    {
        handle: 'F093', fatherHandle: 'C014',
        children: ['C028']
    },
    {
        handle: 'F094', fatherHandle: 'C015',
        children: ['C029']
    },
    {
        handle: 'F095', fatherHandle: 'C016',
        children: ['C030']
    },
    {
        handle: 'F096', fatherHandle: 'C017',
        children: ['C031']
    },
    {
        handle: 'F097', fatherHandle: 'C018',
        children: ['C032', 'C033', 'C034', 'C035']
    },
    {
        handle: 'F098', fatherHandle: 'C019',
        children: ['C038']
    },
    {
        handle: 'F099', fatherHandle: 'C021',
        children: ['C036']
    },
    {
        handle: 'F100', fatherHandle: 'C022',
        children: []
    },
    {
        handle: 'F101', fatherHandle: 'C023',
        children: []
    },
    {
        handle: 'F102', fatherHandle: 'C024',
        children: []
    },
    {
        handle: 'F103', fatherHandle: 'C025',
        children: ['C039']
    },
    {
        handle: 'F104', fatherHandle: 'C026',
        children: []
    },
    {
        handle: 'F105', fatherHandle: 'C020',
        children: ['C037']
    },
    {
        handle: 'F106', fatherHandle: 'P048',
        children: ['K001', 'K002', 'K003', 'K004']
    },
    {
        handle: 'F107', fatherHandle: 'K001',
        children: ['K005']
    },
    {
        handle: 'F108', fatherHandle: 'K002',
        children: ['K006']
    },
    {
        handle: 'F109', fatherHandle: 'K003',
        children: ['K007']
    },
    {
        handle: 'F110', fatherHandle: 'K004',
        children: ['K008', 'K009', 'K010', 'K011']
    },
    {
        handle: 'F111', fatherHandle: 'K005',
        children: ['K012', 'K013', 'K014']
    },
    {
        handle: 'F112', fatherHandle: 'K006',
        children: ['K015', 'K016', 'K028', 'K017']
    },
    {
        handle: 'F113', fatherHandle: 'K007',
        children: ['K018', 'K019']
    },
    {
        handle: 'F114', fatherHandle: 'K008',
        children: ['K020']
    },
    {
        handle: 'F115', fatherHandle: 'K009',
        children: ['K021']
    },
    {
        handle: 'F116', fatherHandle: 'K010',
        children: []
    },
    {
        handle: 'F117', fatherHandle: 'K011',
        children: ['K022', 'K023']
    },
    {
        handle: 'F118', fatherHandle: 'K013',
        children: []
    },
    {
        handle: 'F119', fatherHandle: 'K015',
        children: ['K026']
    },
    {
        handle: 'F120', fatherHandle: 'K016',
        children: ['K027']
    },
    {
        handle: 'F121', fatherHandle: 'K017',
        children: []
    },
    {
        handle: 'F122', fatherHandle: 'K018',
        children: ['K029']
    },
    {
        handle: 'F123', fatherHandle: 'K019',
        children: ['K030']
    },
    {
        handle: 'F124', fatherHandle: 'K020',
        children: ['K031']
    },
    {
        handle: 'F125', fatherHandle: 'K021',
        children: ['K032']
    },
    {
        handle: 'F126', fatherHandle: 'P049',
        children: ['J001']
    },
    {
        handle: 'F127', fatherHandle: 'J001',
        children: ['J002']
    },
    {
        handle: 'F128', fatherHandle: 'J002',
        children: ['J003', 'J004', 'J005', 'J006', 'J007', 'J008']
    },
    {
        handle: 'F129', fatherHandle: 'J003',
        children: ['J009', 'J010', 'J011']
    },
    {
        handle: 'F130', fatherHandle: 'J005',
        children: ['J012']
    },
    {
        handle: 'F131', fatherHandle: 'J006',
        children: ['J013', 'J014']
    },
    {
        handle: 'F132', fatherHandle: 'J007',
        children: ['J015']
    },
    {
        handle: 'F133', fatherHandle: 'P050',
        children: ['L001', 'L002']
    },
    {
        handle: 'F134', fatherHandle: 'L001',
        children: ['L003', 'L004', 'L005', 'L006']
    },
    {
        handle: 'F135', fatherHandle: 'L002',
        children: ['L007', 'L008']
    },
    {
        handle: 'F136', fatherHandle: 'L003',
        children: ['L009', 'L010']
    },
    {
        handle: 'F137', fatherHandle: 'L004',
        children: ['L011', 'L012']
    },
    {
        handle: 'F138', fatherHandle: 'L005',
        children: ['L013', 'L014']
    },
    {
        handle: 'F139', fatherHandle: 'L006',
        children: ['L015']
    },
    {
        handle: 'F140', fatherHandle: 'L007',
        children: ['B038', 'L016', 'L017', 'L018']
    },
    {
        handle: 'F141', fatherHandle: 'L008',
        children: []
    },
    {
        handle: 'F142', fatherHandle: 'L020',
        children: []
    },
    {
        handle: 'F143', fatherHandle: 'L009',
        children: ['L023', 'L024']
    },
    {
        handle: 'F144', fatherHandle: 'L011',
        children: ['L025']
    },
    {
        handle: 'F145', fatherHandle: 'L015',
        children: ['L026', 'L027']
    },
    {
        handle: 'F146', fatherHandle: 'L016',
        children: ['L028', 'L029']
    },
    {
        handle: 'F147', fatherHandle: 'L017',
        children: []
    },
    {
        handle: 'F148', fatherHandle: 'P051',
        children: ['M001', 'M002']
    },
    {
        handle: 'F_L019', fatherHandle: 'L019',
        children: ['L022']
    },
    {
        handle: 'F_M001', fatherHandle: 'M001',
        children: ['L019', 'L020', 'L021']
    },
    {
        handle: 'F_J008', fatherHandle: 'J008',
        children: ['J016']
    },
    {
        handle: 'F_K028', fatherHandle: 'K028',
        children: ['B039']
    },
    {
        handle: 'F_K012', fatherHandle: 'K012',
        children: ['K024', 'K025']
    },
    {
        handle: 'F149', fatherHandle: 'P052',
        children: ['I001']
    },
    {
        handle: 'F150', fatherHandle: 'I001',
        children: ['I002', 'I003', 'I004', 'I005']
    },
    {
        handle: 'F151', fatherHandle: 'I002',
        children: ['I006', 'I007', 'I008', 'I009', 'I010']
    },
    {
        handle: 'F152', fatherHandle: 'I004',
        children: ['I011', 'I012', 'I013']
    },
    {
        handle: 'F153', fatherHandle: 'I005',
        children: ['I014', 'I015']
    },
    {
        handle: 'F154', fatherHandle: 'I006',
        children: ['I016']
    },
    {
        handle: 'F155', fatherHandle: 'I007',
        children: ['I017']
    },
    {
        handle: 'F156', fatherHandle: 'I008',
        children: ['I018']
    },
    {
        handle: 'F157', fatherHandle: 'I009',
        children: ['I019']
    },
    {
        handle: 'F158', fatherHandle: 'I010',
        children: ['I020']
    },
    {
        handle: 'F159', fatherHandle: 'I011',
        children: ['I021']
    },
    {
        handle: 'F160', fatherHandle: 'I012',
        children: ['I022']
    },
    {
        handle: 'F161', fatherHandle: 'I013',
        children: ['I023']
    },
    {
        handle: 'F162', fatherHandle: 'I014',
        children: ['I024']
    },
    {
        handle: 'F163', fatherHandle: 'P053',
        children: ['F001']
    },
    {
        handle: 'F164', fatherHandle: 'F001',
        children: ['F002', 'F003', 'F004', 'F005']
    },
    {
        handle: 'F165', fatherHandle: 'F002',
        children: ['F006', 'F007']
    },
    {
        handle: 'F166', fatherHandle: 'F003',
        children: ['F008', 'F009']
    },
    {
        handle: 'F167', fatherHandle: 'F004',
        children: ['F010', 'F011', 'F012', 'F013']
    },
    {
        handle: 'F168', fatherHandle: 'F005',
        children: ['F014', 'F015', 'F016', 'F017', 'F018', 'F019', 'F020', 'F021', 'F022', 'F023']
    },
    {
        handle: 'F169', fatherHandle: 'P055',
        children: ['G001', 'G002']
    },
    {
        handle: 'F170', fatherHandle: 'G001',
        children: ['G003', 'G004']
    },
    {
        handle: 'F171', fatherHandle: 'G002',
        children: ['G005', 'G006']
    },
    {
        handle: 'F172', fatherHandle: 'G003',
        children: ['G007', 'G008']
    },
    {
        handle: 'F173', fatherHandle: 'G004',
        children: ['G009', 'G010']
    },
    {
        handle: 'F174', fatherHandle: 'G005',
        children: ['G011', 'G012']
    },
    {
        handle: 'F175', fatherHandle: 'G006',
        children: ['G013', 'G014']
    },
    {
        handle: 'F176', fatherHandle: 'P056',
        children: ['H001', 'H002']
    },
    {
        handle: 'F177', fatherHandle: 'H001',
        children: ['H003', 'H004']
    },
    {
        handle: 'F178', fatherHandle: 'H002',
        children: ['H005', 'H006']
    },
    {
        handle: 'F179', fatherHandle: 'H003',
        children: ['H007', 'H008']
    },
    {
        handle: 'F180', fatherHandle: 'H004',
        children: ['H009']
    },
    {
        handle: 'F181', fatherHandle: 'H005',
        children: ['H010']
    },
    {
        handle: 'F182', fatherHandle: 'H006',
        children: ['H011', 'H012']
    },
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
    generation: p.generation,
    isLiving: p.isLiving,
    isPrivacyFiltered: p.isPrivacyFiltered,
    isPatrilineal: p.isPatrilineal,
    families: p.families || [],
    parentFamilies: p.parentFamilies || [],
}));

// ════════════════════════════════════════════════════════════════════════
// EDITOR MODE — Data persistence (localStorage cache + filesystem via API)
// ════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'tree-family-overrides';
const PERSON_STORAGE_KEY = 'tree-person-overrides';

interface FamilyOverrides {
    [familyHandle: string]: { children: string[] };
}
interface PersonOverrides {
    [handle: string]: { isLiving?: boolean };
}

// ── localStorage helpers (fast synchronous cache) ──

function loadFamilyOverrides(): FamilyOverrides {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function saveFamilyOverrides(overrides: FamilyOverrides): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function loadPersonOverrides(): PersonOverrides {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(PERSON_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function savePersonOverrides(overrides: PersonOverrides): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PERSON_STORAGE_KEY, JSON.stringify(overrides));
    }
}

// ── API helpers (persist to filesystem) ──

function syncToServer(families: FamilyOverrides, persons: PersonOverrides): void {
    fetch('/api/tree-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ families, persons }),
    }).catch(err => console.warn('Failed to sync overrides to server:', err));
}

/** Load overrides from server (for initial load) */
export async function loadOverridesFromServer(): Promise<{
    families: FamilyOverrides;
    persons: PersonOverrides;
} | null> {
    try {
        const res = await fetch('/api/tree-overrides');
        if (res.ok) {
            const data = await res.json();
            // Sync to localStorage cache
            if (data.families && Object.keys(data.families).length > 0) {
                saveFamilyOverrides(data.families);
            }
            if (data.persons && Object.keys(data.persons).length > 0) {
                savePersonOverrides(data.persons);
            }
            return data;
        }
    } catch { /* fallback to localStorage */ }
    return null;
}

// ── Public API ──

/** Get families with overrides applied */
export function getFamiliesWithOverrides(): TreeFamily[] {
    const overrides = loadFamilyOverrides();
    return MOCK_FAMILIES.map(f => {
        const override = overrides[f.handle];
        return override ? { ...f, children: override.children } : f;
    });
}

/** Get tree nodes with person overrides applied */
export function getTreeNodesWithOverrides(): TreeNode[] {
    const overrides = loadPersonOverrides();
    return MOCK_TREE_NODES.map(p => {
        const ov = overrides[p.handle];
        return ov ? { ...p, isLiving: ov.isLiving ?? p.isLiving } : p;
    });
}

/** Reorder children within a family */
export function updateFamilyChildren(
    familyHandle: string,
    newChildrenOrder: string[]
): TreeFamily[] {
    const overrides = loadFamilyOverrides();
    overrides[familyHandle] = { children: newChildrenOrder };
    saveFamilyOverrides(overrides);
    syncToServer(overrides, loadPersonOverrides());
    return getFamiliesWithOverrides();
}

/** Move a child from one family to another (change parent) */
export function moveChildToFamily(
    childHandle: string,
    fromFamilyHandle: string,
    toFamilyHandle: string
): TreeFamily[] {
    const overrides = loadFamilyOverrides();
    const families = getFamiliesWithOverrides();

    const fromFam = families.find(f => f.handle === fromFamilyHandle);
    if (fromFam) {
        overrides[fromFamilyHandle] = {
            children: fromFam.children.filter(ch => ch !== childHandle),
        };
    }

    const toFam = families.find(f => f.handle === toFamilyHandle);
    if (toFam) {
        overrides[toFamilyHandle] = {
            children: [...toFam.children.filter(ch => ch !== childHandle), childHandle],
        };
    }

    saveFamilyOverrides(overrides);
    syncToServer(overrides, loadPersonOverrides());
    return getFamiliesWithOverrides();
}

/** Remove a child from a family (unlink) */
export function removeChildFromFamily(
    childHandle: string,
    familyHandle: string
): TreeFamily[] {
    const overrides = loadFamilyOverrides();
    const families = getFamiliesWithOverrides();
    const fam = families.find(f => f.handle === familyHandle);
    if (fam) {
        overrides[familyHandle] = {
            children: fam.children.filter(ch => ch !== childHandle),
        };
    }
    saveFamilyOverrides(overrides);
    syncToServer(overrides, loadPersonOverrides());
    return getFamiliesWithOverrides();
}

/** Update a person's isLiving status */
export function updatePersonLiving(handle: string, isLiving: boolean): TreeNode[] {
    const overrides = loadPersonOverrides();
    overrides[handle] = { ...overrides[handle], isLiving };
    savePersonOverrides(overrides);
    syncToServer(loadFamilyOverrides(), overrides);
    return getTreeNodesWithOverrides();
}

/** Reset all overrides (restore original data) */
export function resetFamilyOverrides(): TreeFamily[] {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PERSON_STORAGE_KEY);
    }
    // Delete server file
    fetch('/api/tree-overrides', { method: 'DELETE' })
        .catch(err => console.warn('Failed to reset server overrides:', err));
    return [...MOCK_FAMILIES];
}
