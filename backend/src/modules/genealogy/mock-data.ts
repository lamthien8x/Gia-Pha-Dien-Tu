/**
 * Mock genealogy data — Dòng họ Lê Huy Tộc (356 người, TH1-15)
 * Used when Gramps Web is unavailable for UI development/testing.
 * Dữ liệu chuẩn hóa từ gia phả gốc.
 */

import type { GrampsPerson, GrampsFamily } from './types';

const person_P001: GrampsPerson = {
    handle: 'P001',
    gramps_id: 'I0001',
    gender: 1,
    primary_name: { first_name: 'Đức Tính', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F001'],
    parent_family_list: [],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P002: GrampsPerson = {
    handle: 'P002',
    gramps_id: 'I0002',
    gender: 1,
    primary_name: { first_name: 'Đức Thiệu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F002'],
    parent_family_list: ['F001'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P003: GrampsPerson = {
    handle: 'P003',
    gramps_id: 'I0003',
    gender: 1,
    primary_name: { first_name: 'Đức Hậu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F003'],
    parent_family_list: ['F002'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P004: GrampsPerson = {
    handle: 'P004',
    gramps_id: 'I0004',
    gender: 1,
    primary_name: { first_name: 'Đức Thận', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F004'],
    parent_family_list: ['F003'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P005: GrampsPerson = {
    handle: 'P005',
    gramps_id: 'I0005',
    gender: 1,
    primary_name: { first_name: 'Đức Trạch', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F005'],
    parent_family_list: ['F003'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P006: GrampsPerson = {
    handle: 'P006',
    gramps_id: 'I0006',
    gender: 1,
    primary_name: { first_name: 'Đức Thuần', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F006'],
    parent_family_list: ['F003'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P007: GrampsPerson = {
    handle: 'P007',
    gramps_id: 'I0007',
    gender: 1,
    primary_name: { first_name: 'Tuấn Đạt', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F007'],
    parent_family_list: ['F004'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P008: GrampsPerson = {
    handle: 'P008',
    gramps_id: 'I0008',
    gender: 1,
    primary_name: { first_name: 'Huy Đoài', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F008'],
    parent_family_list: ['F005'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P009: GrampsPerson = {
    handle: 'P009',
    gramps_id: 'I0009',
    gender: 1,
    primary_name: { first_name: 'Huy Thể', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F009'],
    parent_family_list: ['F006'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P010: GrampsPerson = {
    handle: 'P010',
    gramps_id: 'I0010',
    gender: 1,
    primary_name: { first_name: 'Thuần Chất', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F010'],
    parent_family_list: ['F007'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P011: GrampsPerson = {
    handle: 'P011',
    gramps_id: 'I0011',
    gender: 1,
    primary_name: { first_name: 'Đức Phấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F007'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P012: GrampsPerson = {
    handle: 'P012',
    gramps_id: 'I0012',
    gender: 1,
    primary_name: { first_name: 'Huệ Thực', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F007'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P013: GrampsPerson = {
    handle: 'P013',
    gramps_id: 'I0013',
    gender: 1,
    primary_name: { first_name: 'Bá Dương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F011'],
    parent_family_list: ['F008'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P014: GrampsPerson = {
    handle: 'P014',
    gramps_id: 'I0014',
    gender: 1,
    primary_name: { first_name: 'Huy Chiểu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F012'],
    parent_family_list: ['F009'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P015: GrampsPerson = {
    handle: 'P015',
    gramps_id: 'I0015',
    gender: 1,
    primary_name: { first_name: 'Huy Tùy', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F013'],
    parent_family_list: ['F010'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P016: GrampsPerson = {
    handle: 'P016',
    gramps_id: 'I0016',
    gender: 1,
    primary_name: { first_name: 'Huy Tiêu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F014'],
    parent_family_list: ['F010'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P017: GrampsPerson = {
    handle: 'P017',
    gramps_id: 'I0017',
    gender: 1,
    primary_name: { first_name: 'Huy Vịnh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F010'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P018: GrampsPerson = {
    handle: 'P018',
    gramps_id: 'I0018',
    gender: 1,
    primary_name: { first_name: 'Bá Năng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F011'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P019: GrampsPerson = {
    handle: 'P019',
    gramps_id: 'I0019',
    gender: 1,
    primary_name: { first_name: 'Bá Đằng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F015'],
    parent_family_list: ['F011'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P020: GrampsPerson = {
    handle: 'P020',
    gramps_id: 'I0020',
    gender: 1,
    primary_name: { first_name: 'Nhu Hóa', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F016'],
    parent_family_list: ['F012'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P021: GrampsPerson = {
    handle: 'P021',
    gramps_id: 'I0021',
    gender: 1,
    primary_name: { first_name: 'Huy Cẩm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F017'],
    parent_family_list: ['F013'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P022: GrampsPerson = {
    handle: 'P022',
    gramps_id: 'I0022',
    gender: 1,
    primary_name: { first_name: 'Huy Kiều', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F018'],
    parent_family_list: ['F014'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P023: GrampsPerson = {
    handle: 'P023',
    gramps_id: 'I0023',
    gender: 1,
    primary_name: { first_name: 'Bá Lương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F019'],
    parent_family_list: ['F015'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P024: GrampsPerson = {
    handle: 'P024',
    gramps_id: 'I0024',
    gender: 1,
    primary_name: { first_name: 'Huy Kiểm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F020'],
    parent_family_list: ['F016'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P025: GrampsPerson = {
    handle: 'P025',
    gramps_id: 'I0025',
    gender: 1,
    primary_name: { first_name: 'Huy Soạn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F021'],
    parent_family_list: ['F016'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P026: GrampsPerson = {
    handle: 'P026',
    gramps_id: 'I0026',
    gender: 1,
    primary_name: { first_name: 'Huy Mễ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F022'],
    parent_family_list: ['F016'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P027: GrampsPerson = {
    handle: 'P027',
    gramps_id: 'I0027',
    gender: 1,
    primary_name: { first_name: 'Huy Khởi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F023'],
    parent_family_list: ['F016'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P028: GrampsPerson = {
    handle: 'P028',
    gramps_id: 'I0028',
    gender: 1,
    primary_name: { first_name: 'Huy Điểng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F024'],
    parent_family_list: ['F017'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P029: GrampsPerson = {
    handle: 'P029',
    gramps_id: 'I0029',
    gender: 1,
    primary_name: { first_name: 'Huy Mẫn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F025'],
    parent_family_list: ['F017'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P030: GrampsPerson = {
    handle: 'P030',
    gramps_id: 'I0030',
    gender: 1,
    primary_name: { first_name: 'Huy Ba', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F026'],
    parent_family_list: ['F017'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P031: GrampsPerson = {
    handle: 'P031',
    gramps_id: 'I0031',
    gender: 1,
    primary_name: { first_name: 'Huy Thứu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F027'],
    parent_family_list: ['F017'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P032: GrampsPerson = {
    handle: 'P032',
    gramps_id: 'I0032',
    gender: 1,
    primary_name: { first_name: 'Huy Uy', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F028'],
    parent_family_list: ['F018'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P033: GrampsPerson = {
    handle: 'P033',
    gramps_id: 'I0033',
    gender: 1,
    primary_name: { first_name: 'Huy Tiệm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F029'],
    parent_family_list: ['F018'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P034: GrampsPerson = {
    handle: 'P034',
    gramps_id: 'I0034',
    gender: 1,
    primary_name: { first_name: 'Bá Chung', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F030'],
    parent_family_list: ['F019'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P035: GrampsPerson = {
    handle: 'P035',
    gramps_id: 'I0035',
    gender: 1,
    primary_name: { first_name: 'Huy Túc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F031'],
    parent_family_list: ['F020'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P036: GrampsPerson = {
    handle: 'P036',
    gramps_id: 'I0036',
    gender: 1,
    primary_name: { first_name: 'Huy Lầng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F032'],
    parent_family_list: ['F021'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P037: GrampsPerson = {
    handle: 'P037',
    gramps_id: 'I0037',
    gender: 1,
    primary_name: { first_name: 'Huy Đạo', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F033'],
    parent_family_list: ['F022'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P038: GrampsPerson = {
    handle: 'P038',
    gramps_id: 'I0038',
    gender: 1,
    primary_name: { first_name: 'Huy Ước', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F034'],
    parent_family_list: ['F023'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P039: GrampsPerson = {
    handle: 'P039',
    gramps_id: 'I0039',
    gender: 1,
    primary_name: { first_name: 'Huy Bổng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F035'],
    parent_family_list: ['F024'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P040: GrampsPerson = {
    handle: 'P040',
    gramps_id: 'I0040',
    gender: 1,
    primary_name: { first_name: 'Huy Toản', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F051'],
    parent_family_list: ['F025'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P041: GrampsPerson = {
    handle: 'P041',
    gramps_id: 'I0041',
    gender: 1,
    primary_name: { first_name: 'Huy Đản', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F065'],
    parent_family_list: ['F026'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P042: GrampsPerson = {
    handle: 'P042',
    gramps_id: 'I0042',
    gender: 1,
    primary_name: { first_name: 'Huy Lạp', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F079'],
    parent_family_list: ['F027'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P043: GrampsPerson = {
    handle: 'P043',
    gramps_id: 'I0043',
    gender: 1,
    primary_name: { first_name: 'Huy Vụ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F061'],
    parent_family_list: ['F028'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P044: GrampsPerson = {
    handle: 'P044',
    gramps_id: 'I0044',
    gender: 1,
    primary_name: { first_name: 'Huy An', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F029'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P045: GrampsPerson = {
    handle: 'P045',
    gramps_id: 'I0045',
    gender: 1,
    primary_name: { first_name: 'Huy Quyền', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F030'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P046: GrampsPerson = {
    handle: 'P046',
    gramps_id: 'I0046',
    gender: 1,
    primary_name: { first_name: 'Huy Chuy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F030'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P047: GrampsPerson = {
    handle: 'P047',
    gramps_id: 'I0047',
    gender: 1,
    primary_name: { first_name: 'Huy Châu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F030'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P048: GrampsPerson = {
    handle: 'P048',
    gramps_id: 'I0048',
    gender: 1,
    primary_name: { first_name: 'Huy Cung', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F106'],
    parent_family_list: ['F031'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P049: GrampsPerson = {
    handle: 'P049',
    gramps_id: 'I0049',
    gender: 1,
    primary_name: { first_name: 'Huy Cớn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F126'],
    parent_family_list: ['F032'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P050: GrampsPerson = {
    handle: 'P050',
    gramps_id: 'I0050',
    gender: 1,
    primary_name: { first_name: 'Huy Liêu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F133'],
    parent_family_list: ['F033'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P051: GrampsPerson = {
    handle: 'P051',
    gramps_id: 'I0051',
    gender: 1,
    primary_name: { first_name: 'Huy Uẩn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F148'],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P052: GrampsPerson = {
    handle: 'P052',
    gramps_id: 'I0052',
    gender: 1,
    primary_name: { first_name: 'Huy Chước', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F149'],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P053: GrampsPerson = {
    handle: 'P053',
    gramps_id: 'I0053',
    gender: 1,
    primary_name: { first_name: 'Huy Thước', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F163'],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P054: GrampsPerson = {
    handle: 'P054',
    gramps_id: 'I0054',
    gender: 1,
    primary_name: { first_name: 'Huy Duy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P055: GrampsPerson = {
    handle: 'P055',
    gramps_id: 'I0055',
    gender: 1,
    primary_name: { first_name: 'Huy Tuy', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F169'],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_P056: GrampsPerson = {
    handle: 'P056',
    gramps_id: 'I0056',
    gender: 1,
    primary_name: { first_name: 'Huy Tước', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F176'],
    parent_family_list: ['F034'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B101: GrampsPerson = {
    handle: 'B101',
    gramps_id: 'I0057',
    gender: 1,
    primary_name: { first_name: 'Huy Lương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F036'],
    parent_family_list: ['F035'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B102: GrampsPerson = {
    handle: 'B102',
    gramps_id: 'I0058',
    gender: 1,
    primary_name: { first_name: 'Huy Du', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F037'],
    parent_family_list: ['F035'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B103: GrampsPerson = {
    handle: 'B103',
    gramps_id: 'I0059',
    gender: 1,
    primary_name: { first_name: 'Huy Giới', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F038'],
    parent_family_list: ['F036'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B104: GrampsPerson = {
    handle: 'B104',
    gramps_id: 'I0060',
    gender: 1,
    primary_name: { first_name: 'Huy Kỳ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F039'],
    parent_family_list: ['F036'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B105: GrampsPerson = {
    handle: 'B105',
    gramps_id: 'I0061',
    gender: 1,
    primary_name: { first_name: 'Huy Cốc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F040'],
    parent_family_list: ['F037'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B106: GrampsPerson = {
    handle: 'B106',
    gramps_id: 'I0062',
    gender: 1,
    primary_name: { first_name: 'Huy Nguyên', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F041'],
    parent_family_list: ['F037'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B107: GrampsPerson = {
    handle: 'B107',
    gramps_id: 'I0063',
    gender: 1,
    primary_name: { first_name: 'Huy Ngoan', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F042'],
    parent_family_list: ['F037'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B108: GrampsPerson = {
    handle: 'B108',
    gramps_id: 'I0064',
    gender: 1,
    primary_name: { first_name: 'Huy Cảnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F043'],
    parent_family_list: ['F038'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B109: GrampsPerson = {
    handle: 'B109',
    gramps_id: 'I0065',
    gender: 1,
    primary_name: { first_name: 'Huy Trản', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F038'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B110: GrampsPerson = {
    handle: 'B110',
    gramps_id: 'I0066',
    gender: 1,
    primary_name: { first_name: 'Huy Sâm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F044'],
    parent_family_list: ['F038'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B111: GrampsPerson = {
    handle: 'B111',
    gramps_id: 'I0067',
    gender: 1,
    primary_name: { first_name: 'Huy Ban', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F045'],
    parent_family_list: ['F038'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B112: GrampsPerson = {
    handle: 'B112',
    gramps_id: 'I0068',
    gender: 1,
    primary_name: { first_name: 'Huy Bảo', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F039'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B113: GrampsPerson = {
    handle: 'B113',
    gramps_id: 'I0069',
    gender: 1,
    primary_name: { first_name: 'Huy Xuyến', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F039'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B114: GrampsPerson = {
    handle: 'B114',
    gramps_id: 'I0070',
    gender: 1,
    primary_name: { first_name: 'Huy Hồng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F046'],
    parent_family_list: ['F039'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B115: GrampsPerson = {
    handle: 'B115',
    gramps_id: 'I0071',
    gender: 1,
    primary_name: { first_name: 'Huy Ngô', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F040'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B116: GrampsPerson = {
    handle: 'B116',
    gramps_id: 'I0072',
    gender: 1,
    primary_name: { first_name: 'Huy Lân', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F047'],
    parent_family_list: ['F041'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B117: GrampsPerson = {
    handle: 'B117',
    gramps_id: 'I0073',
    gender: 1,
    primary_name: { first_name: 'Huy Dân', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F048'],
    parent_family_list: ['F042'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B118: GrampsPerson = {
    handle: 'B118',
    gramps_id: 'I0074',
    gender: 1,
    primary_name: { first_name: 'Huy Lân', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F049'],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B119: GrampsPerson = {
    handle: 'B119',
    gramps_id: 'I0075',
    gender: 1,
    primary_name: { first_name: 'Huy Trương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B120: GrampsPerson = {
    handle: 'B120',
    gramps_id: 'I0076',
    gender: 1,
    primary_name: { first_name: 'Huy Tư', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B121: GrampsPerson = {
    handle: 'B121',
    gramps_id: 'I0077',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B122: GrampsPerson = {
    handle: 'B122',
    gramps_id: 'I0078',
    gender: 1,
    primary_name: { first_name: 'Huy Quân', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B123: GrampsPerson = {
    handle: 'B123',
    gramps_id: 'I0079',
    gender: 1,
    primary_name: { first_name: 'Huy Thông', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F043'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B124: GrampsPerson = {
    handle: 'B124',
    gramps_id: 'I0080',
    gender: 1,
    primary_name: { first_name: 'Huy Vĩnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F050'],
    parent_family_list: ['F044'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B125: GrampsPerson = {
    handle: 'B125',
    gramps_id: 'I0081',
    gender: 1,
    primary_name: { first_name: 'Huy Lộc', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F044'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B126: GrampsPerson = {
    handle: 'B126',
    gramps_id: 'I0082',
    gender: 1,
    primary_name: { first_name: 'Huy Lực', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F044'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B127: GrampsPerson = {
    handle: 'B127',
    gramps_id: 'I0083',
    gender: 1,
    primary_name: { first_name: 'Huy Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F045'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B128: GrampsPerson = {
    handle: 'B128',
    gramps_id: 'I0084',
    gender: 1,
    primary_name: { first_name: 'Huy Linh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F046'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B129: GrampsPerson = {
    handle: 'B129',
    gramps_id: 'I0085',
    gender: 1,
    primary_name: { first_name: 'Huy Khánh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F047'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B130: GrampsPerson = {
    handle: 'B130',
    gramps_id: 'I0086',
    gender: 1,
    primary_name: { first_name: 'Huy Thành', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F048'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B131: GrampsPerson = {
    handle: 'B131',
    gramps_id: 'I0087',
    gender: 1,
    primary_name: { first_name: 'Huy Long', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F049'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B132: GrampsPerson = {
    handle: 'B132',
    gramps_id: 'I0088',
    gender: 1,
    primary_name: { first_name: 'Huy Nam', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F049'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B133: GrampsPerson = {
    handle: 'B133',
    gramps_id: 'I0089',
    gender: 1,
    primary_name: { first_name: 'Huy Tiến', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F050'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B134: GrampsPerson = {
    handle: 'B134',
    gramps_id: 'I0090',
    gender: 1,
    primary_name: { first_name: 'Huy Linh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F050'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B135: GrampsPerson = {
    handle: 'B135',
    gramps_id: 'I0091',
    gender: 1,
    primary_name: { first_name: 'Huy Giang', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F050'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_B136: GrampsPerson = {
    handle: 'B136',
    gramps_id: 'I0092',
    gender: 1,
    primary_name: { first_name: 'Huy Minh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F050'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T101: GrampsPerson = {
    handle: 'T101',
    gramps_id: 'I0093',
    gender: 1,
    primary_name: { first_name: 'Huy Vạn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F052'],
    parent_family_list: ['F051'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T102: GrampsPerson = {
    handle: 'T102',
    gramps_id: 'I0094',
    gender: 1,
    primary_name: { first_name: 'Huy Quơi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F053'],
    parent_family_list: ['F051'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T103: GrampsPerson = {
    handle: 'T103',
    gramps_id: 'I0095',
    gender: 1,
    primary_name: { first_name: 'Huy Lới', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F054'],
    parent_family_list: ['F052'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T104: GrampsPerson = {
    handle: 'T104',
    gramps_id: 'I0096',
    gender: 1,
    primary_name: { first_name: 'Huy Hiệp', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F052'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T105: GrampsPerson = {
    handle: 'T105',
    gramps_id: 'I0097',
    gender: 1,
    primary_name: { first_name: 'Huy Đơng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F055'],
    parent_family_list: ['F053'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T106: GrampsPerson = {
    handle: 'T106',
    gramps_id: 'I0098',
    gender: 1,
    primary_name: { first_name: 'Huy Quý', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F056'],
    parent_family_list: ['F054'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T107: GrampsPerson = {
    handle: 'T107',
    gramps_id: 'I0099',
    gender: 1,
    primary_name: { first_name: 'Huy Thụ', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F054'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T108: GrampsPerson = {
    handle: 'T108',
    gramps_id: 'I0100',
    gender: 1,
    primary_name: { first_name: 'Huy Phú', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F054'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T109: GrampsPerson = {
    handle: 'T109',
    gramps_id: 'I0101',
    gender: 1,
    primary_name: { first_name: 'Huy Vơn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F057'],
    parent_family_list: ['F055'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T110: GrampsPerson = {
    handle: 'T110',
    gramps_id: 'I0102',
    gender: 1,
    primary_name: { first_name: 'Huy Nhĩ', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F055'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T111: GrampsPerson = {
    handle: 'T111',
    gramps_id: 'I0103',
    gender: 1,
    primary_name: { first_name: 'Huy Tâng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F055'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T112: GrampsPerson = {
    handle: 'T112',
    gramps_id: 'I0104',
    gender: 1,
    primary_name: { first_name: 'Huy Khôi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F058'],
    parent_family_list: ['F055'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T113: GrampsPerson = {
    handle: 'T113',
    gramps_id: 'I0105',
    gender: 1,
    primary_name: { first_name: 'Huy Bảng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F059'],
    parent_family_list: ['F056'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T114: GrampsPerson = {
    handle: 'T114',
    gramps_id: 'I0106',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F056'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T115: GrampsPerson = {
    handle: 'T115',
    gramps_id: 'I0107',
    gender: 1,
    primary_name: { first_name: 'Huy Khoa', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F060'],
    parent_family_list: ['F057'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T116: GrampsPerson = {
    handle: 'T116',
    gramps_id: 'I0108',
    gender: 1,
    primary_name: { first_name: 'Huy Viện', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F058'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T117: GrampsPerson = {
    handle: 'T117',
    gramps_id: 'I0109',
    gender: 1,
    primary_name: { first_name: 'Huy Thế', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F058'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T118: GrampsPerson = {
    handle: 'T118',
    gramps_id: 'I0110',
    gender: 1,
    primary_name: { first_name: 'Huy Việt', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F058'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T119: GrampsPerson = {
    handle: 'T119',
    gramps_id: 'I0111',
    gender: 1,
    primary_name: { first_name: 'Huy Nam', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F058'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T120: GrampsPerson = {
    handle: 'T120',
    gramps_id: 'I0112',
    gender: 1,
    primary_name: { first_name: 'Huy Nam', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F059'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T121: GrampsPerson = {
    handle: 'T121',
    gramps_id: 'I0113',
    gender: 1,
    primary_name: { first_name: 'Huy Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F059'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_T122: GrampsPerson = {
    handle: 'T122',
    gramps_id: 'I0114',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F060'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V101: GrampsPerson = {
    handle: 'V101',
    gramps_id: 'I0115',
    gender: 1,
    primary_name: { first_name: 'Huy Hàm', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F061'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V102: GrampsPerson = {
    handle: 'V102',
    gramps_id: 'I0116',
    gender: 1,
    primary_name: { first_name: 'Huy Nghĩa', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F061'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V103: GrampsPerson = {
    handle: 'V103',
    gramps_id: 'I0117',
    gender: 1,
    primary_name: { first_name: 'Huy Lở', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F062'],
    parent_family_list: ['F061'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V104: GrampsPerson = {
    handle: 'V104',
    gramps_id: 'I0118',
    gender: 1,
    primary_name: { first_name: 'Huy Hồ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F063'],
    parent_family_list: ['F062'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V105: GrampsPerson = {
    handle: 'V105',
    gramps_id: 'I0119',
    gender: 1,
    primary_name: { first_name: 'Huy Liễn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F064'],
    parent_family_list: ['F063'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V106: GrampsPerson = {
    handle: 'V106',
    gramps_id: 'I0120',
    gender: 1,
    primary_name: { first_name: 'Huy Thế', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F063'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V107: GrampsPerson = {
    handle: 'V107',
    gramps_id: 'I0121',
    gender: 1,
    primary_name: { first_name: 'Huy Tùng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F064'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_V108: GrampsPerson = {
    handle: 'V108',
    gramps_id: 'I0122',
    gender: 1,
    primary_name: { first_name: 'Huy Văn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F064'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D101: GrampsPerson = {
    handle: 'D101',
    gramps_id: 'I0123',
    gender: 1,
    primary_name: { first_name: 'Huy Lương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F066'],
    parent_family_list: ['F065'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D102: GrampsPerson = {
    handle: 'D102',
    gramps_id: 'I0124',
    gender: 1,
    primary_name: { first_name: 'Huy Phổ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F067'],
    parent_family_list: ['F065'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D103: GrampsPerson = {
    handle: 'D103',
    gramps_id: 'I0125',
    gender: 1,
    primary_name: { first_name: 'Huy Thảng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F068'],
    parent_family_list: ['F066'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D104: GrampsPerson = {
    handle: 'D104',
    gramps_id: 'I0126',
    gender: 1,
    primary_name: { first_name: 'Huy Đợi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F069'],
    parent_family_list: ['F066'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D105: GrampsPerson = {
    handle: 'D105',
    gramps_id: 'I0127',
    gender: 1,
    primary_name: { first_name: 'Huy Chơn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F070'],
    parent_family_list: ['F067'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D106: GrampsPerson = {
    handle: 'D106',
    gramps_id: 'I0128',
    gender: 1,
    primary_name: { first_name: 'Huy Hiểu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F071'],
    parent_family_list: ['F068'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D107: GrampsPerson = {
    handle: 'D107',
    gramps_id: 'I0129',
    gender: 1,
    primary_name: { first_name: 'Huy Cầu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F068'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D108: GrampsPerson = {
    handle: 'D108',
    gramps_id: 'I0130',
    gender: 1,
    primary_name: { first_name: 'Huy Quán', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F068'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D109: GrampsPerson = {
    handle: 'D109',
    gramps_id: 'I0131',
    gender: 1,
    primary_name: { first_name: 'Huy Cống', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F078'],
    parent_family_list: ['F068'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D110: GrampsPerson = {
    handle: 'D110',
    gramps_id: 'I0132',
    gender: 1,
    primary_name: { first_name: 'Huy Lành', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F072'],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D111: GrampsPerson = {
    handle: 'D111',
    gramps_id: 'I0133',
    gender: 1,
    primary_name: { first_name: 'Huy Cúc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F073'],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D112: GrampsPerson = {
    handle: 'D112',
    gramps_id: 'I0134',
    gender: 1,
    primary_name: { first_name: 'Huy Sen', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D113: GrampsPerson = {
    handle: 'D113',
    gramps_id: 'I0135',
    gender: 1,
    primary_name: { first_name: 'Huy Năm', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D114: GrampsPerson = {
    handle: 'D114',
    gramps_id: 'I0136',
    gender: 1,
    primary_name: { first_name: 'Huy Sơn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F074'],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D115: GrampsPerson = {
    handle: 'D115',
    gramps_id: 'I0137',
    gender: 1,
    primary_name: { first_name: 'Huy Thủy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F069'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D116: GrampsPerson = {
    handle: 'D116',
    gramps_id: 'I0138',
    gender: 1,
    primary_name: { first_name: 'Huy Tuyết', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F075'],
    parent_family_list: ['F070'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D117: GrampsPerson = {
    handle: 'D117',
    gramps_id: 'I0139',
    gender: 1,
    primary_name: { first_name: 'Huy Cương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F071'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D118: GrampsPerson = {
    handle: 'D118',
    gramps_id: 'I0140',
    gender: 1,
    primary_name: { first_name: 'Huy Quyết', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F071'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D119: GrampsPerson = {
    handle: 'D119',
    gramps_id: 'I0141',
    gender: 1,
    primary_name: { first_name: 'Huy Dũng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F071'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D120: GrampsPerson = {
    handle: 'D120',
    gramps_id: 'I0142',
    gender: 1,
    primary_name: { first_name: 'Huy Cường', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F071'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D121: GrampsPerson = {
    handle: 'D121',
    gramps_id: 'I0143',
    gender: 1,
    primary_name: { first_name: 'Huy Hậu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F072'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D122: GrampsPerson = {
    handle: 'D122',
    gramps_id: 'I0144',
    gender: 1,
    primary_name: { first_name: 'Huy Tiên', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F072'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D123: GrampsPerson = {
    handle: 'D123',
    gramps_id: 'I0145',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F072'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D124: GrampsPerson = {
    handle: 'D124',
    gramps_id: 'I0146',
    gender: 1,
    primary_name: { first_name: 'Huy Tú', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F076'],
    parent_family_list: ['F072'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D125: GrampsPerson = {
    handle: 'D125',
    gramps_id: 'I0147',
    gender: 1,
    primary_name: { first_name: 'Huy Cường', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F073'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D126: GrampsPerson = {
    handle: 'D126',
    gramps_id: 'I0148',
    gender: 1,
    primary_name: { first_name: 'Huy Đức', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F077'],
    parent_family_list: ['F073'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D127: GrampsPerson = {
    handle: 'D127',
    gramps_id: 'I0149',
    gender: 1,
    primary_name: { first_name: 'Huy Trường', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F073'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D128: GrampsPerson = {
    handle: 'D128',
    gramps_id: 'I0150',
    gender: 1,
    primary_name: { first_name: 'Huy Hóa', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F074'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D129: GrampsPerson = {
    handle: 'D129',
    gramps_id: 'I0151',
    gender: 1,
    primary_name: { first_name: 'Huy Hải', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F075'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D130: GrampsPerson = {
    handle: 'D130',
    gramps_id: 'I0152',
    gender: 1,
    primary_name: { first_name: 'Huy Hưng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F075'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D131: GrampsPerson = {
    handle: 'D131',
    gramps_id: 'I0153',
    gender: 1,
    primary_name: { first_name: 'Huy Chung', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F075'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D132: GrampsPerson = {
    handle: 'D132',
    gramps_id: 'I0154',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F076'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D133: GrampsPerson = {
    handle: 'D133',
    gramps_id: 'I0155',
    gender: 1,
    primary_name: { first_name: 'Huy Vũ', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F076'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D134: GrampsPerson = {
    handle: 'D134',
    gramps_id: 'I0156',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F077'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D135: GrampsPerson = {
    handle: 'D135',
    gramps_id: 'I0157',
    gender: 1,
    primary_name: { first_name: 'Huy Đức', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F077'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D136: GrampsPerson = {
    handle: 'D136',
    gramps_id: 'I0158',
    gender: 1,
    primary_name: { first_name: 'Huy Lương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F078'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_D137: GrampsPerson = {
    handle: 'D137',
    gramps_id: 'I0159',
    gender: 1,
    primary_name: { first_name: 'Huy Giang', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F078'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L101: GrampsPerson = {
    handle: 'L101',
    gramps_id: 'I0160',
    gender: 1,
    primary_name: { first_name: 'Huy Nhênh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F080'],
    parent_family_list: ['F079'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L102: GrampsPerson = {
    handle: 'L102',
    gramps_id: 'I0161',
    gender: 1,
    primary_name: { first_name: 'Huy Kênh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F081'],
    parent_family_list: ['F079'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L103: GrampsPerson = {
    handle: 'L103',
    gramps_id: 'I0162',
    gender: 1,
    primary_name: { first_name: 'Huy Trớc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F082'],
    parent_family_list: ['F079'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L104: GrampsPerson = {
    handle: 'L104',
    gramps_id: 'I0163',
    gender: 1,
    primary_name: { first_name: 'Huy Nhinh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F083'],
    parent_family_list: ['F079'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L105: GrampsPerson = {
    handle: 'L105',
    gramps_id: 'I0164',
    gender: 1,
    primary_name: { first_name: 'Huy Inh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F084'],
    parent_family_list: ['F079'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L106: GrampsPerson = {
    handle: 'L106',
    gramps_id: 'I0165',
    gender: 1,
    primary_name: { first_name: 'Huy Xích', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F085'],
    parent_family_list: ['F080'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L107: GrampsPerson = {
    handle: 'L107',
    gramps_id: 'I0166',
    gender: 1,
    primary_name: { first_name: 'Huy Diệc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F086'],
    parent_family_list: ['F081'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L108: GrampsPerson = {
    handle: 'L108',
    gramps_id: 'I0167',
    gender: 1,
    primary_name: { first_name: 'Huy Lạng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F087'],
    parent_family_list: ['F082'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L109: GrampsPerson = {
    handle: 'L109',
    gramps_id: 'I0168',
    gender: 1,
    primary_name: { first_name: 'Huy Lô', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F088'],
    parent_family_list: ['F083'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L110: GrampsPerson = {
    handle: 'L110',
    gramps_id: 'I0169',
    gender: 1,
    primary_name: { first_name: 'Huy Mợi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F089'],
    parent_family_list: ['F084'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L111: GrampsPerson = {
    handle: 'L111',
    gramps_id: 'I0170',
    gender: 1,
    primary_name: { first_name: 'Huy Đạo', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F090'],
    parent_family_list: ['F084'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L112: GrampsPerson = {
    handle: 'L112',
    gramps_id: 'I0171',
    gender: 1,
    primary_name: { first_name: 'Huy Thạo', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F091'],
    parent_family_list: ['F084'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L113: GrampsPerson = {
    handle: 'L113',
    gramps_id: 'I0172',
    gender: 1,
    primary_name: { first_name: 'Huy Thanh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F092'],
    parent_family_list: ['F085'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L114: GrampsPerson = {
    handle: 'L114',
    gramps_id: 'I0173',
    gender: 1,
    primary_name: { first_name: 'Huy Quế', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F093'],
    parent_family_list: ['F085'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L115: GrampsPerson = {
    handle: 'L115',
    gramps_id: 'I0174',
    gender: 1,
    primary_name: { first_name: 'Huy Hoan', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F094'],
    parent_family_list: ['F086'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L116: GrampsPerson = {
    handle: 'L116',
    gramps_id: 'I0175',
    gender: 1,
    primary_name: { first_name: 'Huy Hiền', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F095'],
    parent_family_list: ['F086'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L117: GrampsPerson = {
    handle: 'L117',
    gramps_id: 'I0176',
    gender: 1,
    primary_name: { first_name: 'Huy Sáu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F096'],
    parent_family_list: ['F087'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L118: GrampsPerson = {
    handle: 'L118',
    gramps_id: 'I0177',
    gender: 1,
    primary_name: { first_name: 'Huy Chiến', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F097'],
    parent_family_list: ['F087'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L119: GrampsPerson = {
    handle: 'L119',
    gramps_id: 'I0178',
    gender: 1,
    primary_name: { first_name: 'Huy Tám', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F098'],
    parent_family_list: ['F088'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L120: GrampsPerson = {
    handle: 'L120',
    gramps_id: 'I0179',
    gender: 1,
    primary_name: { first_name: 'Huy Oánh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F105'],
    parent_family_list: ['F088'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L121: GrampsPerson = {
    handle: 'L121',
    gramps_id: 'I0180',
    gender: 1,
    primary_name: { first_name: 'Huy Duyệt', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F099'],
    parent_family_list: ['F088'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L122: GrampsPerson = {
    handle: 'L122',
    gramps_id: 'I0181',
    gender: 1,
    primary_name: { first_name: 'Huy Đàn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F100'],
    parent_family_list: ['F088'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L123: GrampsPerson = {
    handle: 'L123',
    gramps_id: 'I0182',
    gender: 1,
    primary_name: { first_name: 'Huy Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F101'],
    parent_family_list: ['F089'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L124: GrampsPerson = {
    handle: 'L124',
    gramps_id: 'I0183',
    gender: 1,
    primary_name: { first_name: 'Huy Đạo', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F089'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L125: GrampsPerson = {
    handle: 'L125',
    gramps_id: 'I0184',
    gender: 1,
    primary_name: { first_name: 'Huy Thành', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F102'],
    parent_family_list: ['F090'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L126: GrampsPerson = {
    handle: 'L126',
    gramps_id: 'I0185',
    gender: 1,
    primary_name: { first_name: 'Huy Tính', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F103'],
    parent_family_list: ['F091'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L127: GrampsPerson = {
    handle: 'L127',
    gramps_id: 'I0186',
    gender: 1,
    primary_name: { first_name: 'Huy Hạnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F104'],
    parent_family_list: ['F091'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L128: GrampsPerson = {
    handle: 'L128',
    gramps_id: 'I0187',
    gender: 1,
    primary_name: { first_name: 'Huy Hiếu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F092'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L129: GrampsPerson = {
    handle: 'L129',
    gramps_id: 'I0188',
    gender: 1,
    primary_name: { first_name: 'Huy Lâm', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F092'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L130: GrampsPerson = {
    handle: 'L130',
    gramps_id: 'I0189',
    gender: 1,
    primary_name: { first_name: 'Huy Sơn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F093'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L131: GrampsPerson = {
    handle: 'L131',
    gramps_id: 'I0190',
    gender: 1,
    primary_name: { first_name: 'Huy Minh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F094'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L132: GrampsPerson = {
    handle: 'L132',
    gramps_id: 'I0191',
    gender: 1,
    primary_name: { first_name: 'Huy Tuân', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F095'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L133: GrampsPerson = {
    handle: 'L133',
    gramps_id: 'I0192',
    gender: 1,
    primary_name: { first_name: 'Huy Hải', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F096'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L134: GrampsPerson = {
    handle: 'L134',
    gramps_id: 'I0193',
    gender: 1,
    primary_name: { first_name: 'Huy Dương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F097'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L135: GrampsPerson = {
    handle: 'L135',
    gramps_id: 'I0194',
    gender: 1,
    primary_name: { first_name: 'Huy Cương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F098'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L136: GrampsPerson = {
    handle: 'L136',
    gramps_id: 'I0195',
    gender: 1,
    primary_name: { first_name: 'Huy Thái', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F099'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L137: GrampsPerson = {
    handle: 'L137',
    gramps_id: 'I0196',
    gender: 1,
    primary_name: { first_name: 'Huy Dung', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F099'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L138: GrampsPerson = {
    handle: 'L138',
    gramps_id: 'I0197',
    gender: 1,
    primary_name: { first_name: 'Lê Huy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F100'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L139: GrampsPerson = {
    handle: 'L139',
    gramps_id: 'I0198',
    gender: 1,
    primary_name: { first_name: 'Huy Hướng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F101'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L140: GrampsPerson = {
    handle: 'L140',
    gramps_id: 'I0199',
    gender: 1,
    primary_name: { first_name: 'Huy Việt', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F102'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L141: GrampsPerson = {
    handle: 'L141',
    gramps_id: 'I0200',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F102'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L142: GrampsPerson = {
    handle: 'L142',
    gramps_id: 'I0201',
    gender: 1,
    primary_name: { first_name: 'Huy Vịnh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F103'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L143: GrampsPerson = {
    handle: 'L143',
    gramps_id: 'I0202',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F104'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_L144: GrampsPerson = {
    handle: 'L144',
    gramps_id: 'I0203',
    gender: 1,
    primary_name: { first_name: 'Huy Doãn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F105'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C101: GrampsPerson = {
    handle: 'C101',
    gramps_id: 'I0204',
    gender: 1,
    primary_name: { first_name: 'Huy Trung', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F107'],
    parent_family_list: ['F106'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C102: GrampsPerson = {
    handle: 'C102',
    gramps_id: 'I0205',
    gender: 1,
    primary_name: { first_name: 'Huy Thẩm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F108'],
    parent_family_list: ['F106'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C103: GrampsPerson = {
    handle: 'C103',
    gramps_id: 'I0206',
    gender: 1,
    primary_name: { first_name: 'Huy Hớn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F109'],
    parent_family_list: ['F106'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C104: GrampsPerson = {
    handle: 'C104',
    gramps_id: 'I0207',
    gender: 1,
    primary_name: { first_name: 'Huy Hào', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F110'],
    parent_family_list: ['F106'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C105: GrampsPerson = {
    handle: 'C105',
    gramps_id: 'I0208',
    gender: 1,
    primary_name: { first_name: 'Huy Dương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F111'],
    parent_family_list: ['F107'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C106: GrampsPerson = {
    handle: 'C106',
    gramps_id: 'I0209',
    gender: 1,
    primary_name: { first_name: 'Huy Mùi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F112'],
    parent_family_list: ['F108'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C107: GrampsPerson = {
    handle: 'C107',
    gramps_id: 'I0210',
    gender: 1,
    primary_name: { first_name: 'Huy Hiểu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F113'],
    parent_family_list: ['F109'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C108: GrampsPerson = {
    handle: 'C108',
    gramps_id: 'I0211',
    gender: 1,
    primary_name: { first_name: 'Huy Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F114'],
    parent_family_list: ['F110'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C109: GrampsPerson = {
    handle: 'C109',
    gramps_id: 'I0212',
    gender: 1,
    primary_name: { first_name: 'Huy Khuôn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F115'],
    parent_family_list: ['F110'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C110: GrampsPerson = {
    handle: 'C110',
    gramps_id: 'I0213',
    gender: 1,
    primary_name: { first_name: 'Huy Điển', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F116'],
    parent_family_list: ['F110'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C111: GrampsPerson = {
    handle: 'C111',
    gramps_id: 'I0214',
    gender: 1,
    primary_name: { first_name: 'Huy Viễn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F117'],
    parent_family_list: ['F110'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C112: GrampsPerson = {
    handle: 'C112',
    gramps_id: 'I0215',
    gender: 1,
    primary_name: { first_name: 'Huy Hân', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F111'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C113: GrampsPerson = {
    handle: 'C113',
    gramps_id: 'I0216',
    gender: 1,
    primary_name: { first_name: 'Huy Hạnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F118'],
    parent_family_list: ['F111'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C114: GrampsPerson = {
    handle: 'C114',
    gramps_id: 'I0217',
    gender: 1,
    primary_name: { first_name: 'Huy Hoan', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F111'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C115: GrampsPerson = {
    handle: 'C115',
    gramps_id: 'I0218',
    gender: 1,
    primary_name: { first_name: 'Huy Mạnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F119'],
    parent_family_list: ['F112'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C116: GrampsPerson = {
    handle: 'C116',
    gramps_id: 'I0219',
    gender: 1,
    primary_name: { first_name: 'Huy Tảo', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F120'],
    parent_family_list: ['F113'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C117: GrampsPerson = {
    handle: 'C117',
    gramps_id: 'I0220',
    gender: 1,
    primary_name: { first_name: 'Huy Nguyễn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F121'],
    parent_family_list: ['F113'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C118: GrampsPerson = {
    handle: 'C118',
    gramps_id: 'I0221',
    gender: 1,
    primary_name: { first_name: 'Huy Thành', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F122'],
    parent_family_list: ['F114'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C119: GrampsPerson = {
    handle: 'C119',
    gramps_id: 'I0222',
    gender: 1,
    primary_name: { first_name: 'Huy Sơn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F123'],
    parent_family_list: ['F114'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C120: GrampsPerson = {
    handle: 'C120',
    gramps_id: 'I0223',
    gender: 1,
    primary_name: { first_name: 'Huy Dương', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F124'],
    parent_family_list: ['F115'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C121: GrampsPerson = {
    handle: 'C121',
    gramps_id: 'I0224',
    gender: 1,
    primary_name: { first_name: 'Hữu Khanh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F125'],
    parent_family_list: ['F116'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C122: GrampsPerson = {
    handle: 'C122',
    gramps_id: 'I0225',
    gender: 1,
    primary_name: { first_name: 'Huy Phong', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F117'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C123: GrampsPerson = {
    handle: 'C123',
    gramps_id: 'I0226',
    gender: 1,
    primary_name: { first_name: 'Huy Tùng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F117'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C124: GrampsPerson = {
    handle: 'C124',
    gramps_id: 'I0227',
    gender: 1,
    primary_name: { first_name: 'Huy Hiếu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F118'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C125: GrampsPerson = {
    handle: 'C125',
    gramps_id: 'I0228',
    gender: 1,
    primary_name: { first_name: 'Huy Cường', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F118'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C126: GrampsPerson = {
    handle: 'C126',
    gramps_id: 'I0229',
    gender: 1,
    primary_name: { first_name: 'Huy Nam', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F119'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C127: GrampsPerson = {
    handle: 'C127',
    gramps_id: 'I0230',
    gender: 1,
    primary_name: { first_name: 'Huy Tiến', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F120'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C128: GrampsPerson = {
    handle: 'C128',
    gramps_id: 'I0231',
    gender: 1,
    primary_name: { first_name: 'Huy Tưởng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F121'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C129: GrampsPerson = {
    handle: 'C129',
    gramps_id: 'I0232',
    gender: 1,
    primary_name: { first_name: 'Thanh Long', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F122'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C130: GrampsPerson = {
    handle: 'C130',
    gramps_id: 'I0233',
    gender: 1,
    primary_name: { first_name: 'Minh Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F123'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C131: GrampsPerson = {
    handle: 'C131',
    gramps_id: 'I0234',
    gender: 1,
    primary_name: { first_name: 'Huy Đức', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F124'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_C132: GrampsPerson = {
    handle: 'C132',
    gramps_id: 'I0235',
    gender: 1,
    primary_name: { first_name: 'Gia Bảo', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F125'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN01: GrampsPerson = {
    handle: 'CN01',
    gramps_id: 'I0236',
    gender: 1,
    primary_name: { first_name: 'Huy Chỉnh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F127'],
    parent_family_list: ['F126'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN02: GrampsPerson = {
    handle: 'CN02',
    gramps_id: 'I0237',
    gender: 1,
    primary_name: { first_name: 'Huy Ngát', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F128'],
    parent_family_list: ['F127'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN03: GrampsPerson = {
    handle: 'CN03',
    gramps_id: 'I0238',
    gender: 1,
    primary_name: { first_name: 'Huy Hồng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F129'],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN04: GrampsPerson = {
    handle: 'CN04',
    gramps_id: 'I0239',
    gender: 1,
    primary_name: { first_name: 'Huy Hiên', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN05: GrampsPerson = {
    handle: 'CN05',
    gramps_id: 'I0240',
    gender: 1,
    primary_name: { first_name: 'Huy Huê', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F130'],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN06: GrampsPerson = {
    handle: 'CN06',
    gramps_id: 'I0241',
    gender: 1,
    primary_name: { first_name: 'Huy Hiệu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F131'],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN07: GrampsPerson = {
    handle: 'CN07',
    gramps_id: 'I0242',
    gender: 1,
    primary_name: { first_name: 'Huy Hanh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F132'],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN08: GrampsPerson = {
    handle: 'CN08',
    gramps_id: 'I0243',
    gender: 1,
    primary_name: { first_name: 'Lê Huy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F128'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN09: GrampsPerson = {
    handle: 'CN09',
    gramps_id: 'I0244',
    gender: 1,
    primary_name: { first_name: 'Huy Phong', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F129'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN10: GrampsPerson = {
    handle: 'CN10',
    gramps_id: 'I0245',
    gender: 1,
    primary_name: { first_name: 'Huy Đắc', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F129'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN11: GrampsPerson = {
    handle: 'CN11',
    gramps_id: 'I0246',
    gender: 1,
    primary_name: { first_name: 'Huy Quân', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F129'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN12: GrampsPerson = {
    handle: 'CN12',
    gramps_id: 'I0247',
    gender: 1,
    primary_name: { first_name: 'Huy Hưng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F130'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN13: GrampsPerson = {
    handle: 'CN13',
    gramps_id: 'I0248',
    gender: 1,
    primary_name: { first_name: 'Đức Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F131'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN14: GrampsPerson = {
    handle: 'CN14',
    gramps_id: 'I0249',
    gender: 1,
    primary_name: { first_name: 'Huy Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F131'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN15: GrampsPerson = {
    handle: 'CN15',
    gramps_id: 'I0250',
    gender: 1,
    primary_name: { first_name: 'Việt Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F132'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CN16: GrampsPerson = {
    handle: 'CN16',
    gramps_id: 'I0251',
    gender: 1,
    primary_name: { first_name: 'Phi Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F132'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI01: GrampsPerson = {
    handle: 'LI01',
    gramps_id: 'I0252',
    gender: 1,
    primary_name: { first_name: 'Huy Diêu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F134'],
    parent_family_list: ['F133'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI02: GrampsPerson = {
    handle: 'LI02',
    gramps_id: 'I0253',
    gender: 1,
    primary_name: { first_name: 'Huy Dơng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F135'],
    parent_family_list: ['F133'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI03: GrampsPerson = {
    handle: 'LI03',
    gramps_id: 'I0254',
    gender: 1,
    primary_name: { first_name: 'Huy Miêu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F136'],
    parent_family_list: ['F134'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI04: GrampsPerson = {
    handle: 'LI04',
    gramps_id: 'I0255',
    gender: 1,
    primary_name: { first_name: 'Huy Mạch', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F137'],
    parent_family_list: ['F134'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI05: GrampsPerson = {
    handle: 'LI05',
    gramps_id: 'I0256',
    gender: 1,
    primary_name: { first_name: 'Huy Đậu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F138'],
    parent_family_list: ['F134'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI06: GrampsPerson = {
    handle: 'LI06',
    gramps_id: 'I0257',
    gender: 1,
    primary_name: { first_name: 'Huy Hòa', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F139'],
    parent_family_list: ['F134'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI07: GrampsPerson = {
    handle: 'LI07',
    gramps_id: 'I0258',
    gender: 1,
    primary_name: { first_name: 'Huy Mơng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F140'],
    parent_family_list: ['F135'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI08: GrampsPerson = {
    handle: 'LI08',
    gramps_id: 'I0259',
    gender: 1,
    primary_name: { first_name: 'Huy Lăng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F141'],
    parent_family_list: ['F135'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI09: GrampsPerson = {
    handle: 'LI09',
    gramps_id: 'I0260',
    gender: 1,
    primary_name: { first_name: 'Huy Quang', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F143'],
    parent_family_list: ['F136'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI10: GrampsPerson = {
    handle: 'LI10',
    gramps_id: 'I0261',
    gender: 1,
    primary_name: { first_name: 'Huy Thủy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F136'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI11: GrampsPerson = {
    handle: 'LI11',
    gramps_id: 'I0262',
    gender: 1,
    primary_name: { first_name: 'Huy Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F144'],
    parent_family_list: ['F137'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI12: GrampsPerson = {
    handle: 'LI12',
    gramps_id: 'I0263',
    gender: 1,
    primary_name: { first_name: 'Huy Long', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F137'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI13: GrampsPerson = {
    handle: 'LI13',
    gramps_id: 'I0264',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F138'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI14: GrampsPerson = {
    handle: 'LI14',
    gramps_id: 'I0265',
    gender: 1,
    primary_name: { first_name: 'Huy Hiếu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F138'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI15: GrampsPerson = {
    handle: 'LI15',
    gramps_id: 'I0266',
    gender: 1,
    primary_name: { first_name: 'Huy Hậu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F145'],
    parent_family_list: ['F139'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI16: GrampsPerson = {
    handle: 'LI16',
    gramps_id: 'I0267',
    gender: 1,
    primary_name: { first_name: 'Huy Bá', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F146'],
    parent_family_list: ['F140'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI17: GrampsPerson = {
    handle: 'LI17',
    gramps_id: 'I0268',
    gender: 1,
    primary_name: { first_name: 'Huy Long', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F147'],
    parent_family_list: ['F140'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI18: GrampsPerson = {
    handle: 'LI18',
    gramps_id: 'I0269',
    gender: 1,
    primary_name: { first_name: 'Huy Linh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F140'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI19: GrampsPerson = {
    handle: 'LI19',
    gramps_id: 'I0270',
    gender: 1,
    primary_name: { first_name: 'Huy Giáp', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F141'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI20: GrampsPerson = {
    handle: 'LI20',
    gramps_id: 'I0271',
    gender: 1,
    primary_name: { first_name: 'Huy Dũng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F142'],
    parent_family_list: ['F141'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI21: GrampsPerson = {
    handle: 'LI21',
    gramps_id: 'I0272',
    gender: 1,
    primary_name: { first_name: 'Huy Dương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F141'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI22: GrampsPerson = {
    handle: 'LI22',
    gramps_id: 'I0273',
    gender: 1,
    primary_name: { first_name: 'Huy Quý', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F142'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI23: GrampsPerson = {
    handle: 'LI23',
    gramps_id: 'I0274',
    gender: 1,
    primary_name: { first_name: 'Huy Huấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F143'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI24: GrampsPerson = {
    handle: 'LI24',
    gramps_id: 'I0275',
    gender: 1,
    primary_name: { first_name: 'Huy Hải', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F143'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI25: GrampsPerson = {
    handle: 'LI25',
    gramps_id: 'I0276',
    gender: 1,
    primary_name: { first_name: 'Hoàng Minh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F144'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI26: GrampsPerson = {
    handle: 'LI26',
    gramps_id: 'I0277',
    gender: 1,
    primary_name: { first_name: 'Thế Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F145'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI27: GrampsPerson = {
    handle: 'LI27',
    gramps_id: 'I0278',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F145'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI28: GrampsPerson = {
    handle: 'LI28',
    gramps_id: 'I0279',
    gender: 1,
    primary_name: { first_name: 'Huy Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F146'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI29: GrampsPerson = {
    handle: 'LI29',
    gramps_id: 'I0280',
    gender: 1,
    primary_name: { first_name: 'Huy Hiếu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F146'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_LI30: GrampsPerson = {
    handle: 'LI30',
    gramps_id: 'I0281',
    gender: 1,
    primary_name: { first_name: 'Huy Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F147'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_U101: GrampsPerson = {
    handle: 'U101',
    gramps_id: 'I0282',
    gender: 1,
    primary_name: { first_name: 'Huy Bồn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F148'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_U102: GrampsPerson = {
    handle: 'U102',
    gramps_id: 'I0283',
    gender: 1,
    primary_name: { first_name: 'Huy Thịnh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F148'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH01: GrampsPerson = {
    handle: 'CH01',
    gramps_id: 'I0284',
    gender: 1,
    primary_name: { first_name: 'Huy Trước', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F150'],
    parent_family_list: ['F149'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH02: GrampsPerson = {
    handle: 'CH02',
    gramps_id: 'I0285',
    gender: 1,
    primary_name: { first_name: 'Huy Quảng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F151'],
    parent_family_list: ['F150'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH03: GrampsPerson = {
    handle: 'CH03',
    gramps_id: 'I0286',
    gender: 1,
    primary_name: { first_name: 'Huy Bàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F150'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH04: GrampsPerson = {
    handle: 'CH04',
    gramps_id: 'I0287',
    gender: 1,
    primary_name: { first_name: 'Huy Ới', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F152'],
    parent_family_list: ['F150'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH05: GrampsPerson = {
    handle: 'CH05',
    gramps_id: 'I0288',
    gender: 1,
    primary_name: { first_name: 'Huy Chinh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F153'],
    parent_family_list: ['F150'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH06: GrampsPerson = {
    handle: 'CH06',
    gramps_id: 'I0289',
    gender: 1,
    primary_name: { first_name: 'Huy Thanh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F154'],
    parent_family_list: ['F151'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH07: GrampsPerson = {
    handle: 'CH07',
    gramps_id: 'I0290',
    gender: 1,
    primary_name: { first_name: 'Huy Trường', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F155'],
    parent_family_list: ['F151'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH08: GrampsPerson = {
    handle: 'CH08',
    gramps_id: 'I0291',
    gender: 1,
    primary_name: { first_name: 'Huy Thọ', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F156'],
    parent_family_list: ['F151'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH09: GrampsPerson = {
    handle: 'CH09',
    gramps_id: 'I0292',
    gender: 1,
    primary_name: { first_name: 'Huy Đại', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F157'],
    parent_family_list: ['F151'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH10: GrampsPerson = {
    handle: 'CH10',
    gramps_id: 'I0293',
    gender: 1,
    primary_name: { first_name: 'Huy Hải', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F158'],
    parent_family_list: ['F151'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH11: GrampsPerson = {
    handle: 'CH11',
    gramps_id: 'I0294',
    gender: 1,
    primary_name: { first_name: 'Huy Thực', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F159'],
    parent_family_list: ['F152'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH12: GrampsPerson = {
    handle: 'CH12',
    gramps_id: 'I0295',
    gender: 1,
    primary_name: { first_name: 'Huy Thức', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F160'],
    parent_family_list: ['F152'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH13: GrampsPerson = {
    handle: 'CH13',
    gramps_id: 'I0296',
    gender: 1,
    primary_name: { first_name: 'Huy Tiễn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F161'],
    parent_family_list: ['F152'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH14: GrampsPerson = {
    handle: 'CH14',
    gramps_id: 'I0297',
    gender: 1,
    primary_name: { first_name: 'Huy Thiện', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F162'],
    parent_family_list: ['F153'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH15: GrampsPerson = {
    handle: 'CH15',
    gramps_id: 'I0298',
    gender: 1,
    primary_name: { first_name: 'Huy Hoàng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F153'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH16: GrampsPerson = {
    handle: 'CH16',
    gramps_id: 'I0299',
    gender: 1,
    primary_name: { first_name: 'Huy Chương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F154'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH17: GrampsPerson = {
    handle: 'CH17',
    gramps_id: 'I0300',
    gender: 1,
    primary_name: { first_name: 'Huy Hảo', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F155'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH18: GrampsPerson = {
    handle: 'CH18',
    gramps_id: 'I0301',
    gender: 1,
    primary_name: { first_name: 'Huy Hà', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F156'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH19: GrampsPerson = {
    handle: 'CH19',
    gramps_id: 'I0302',
    gender: 1,
    primary_name: { first_name: 'Huy Phúc', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F157'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH20: GrampsPerson = {
    handle: 'CH20',
    gramps_id: 'I0303',
    gender: 1,
    primary_name: { first_name: 'Huy Huân', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F158'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH21: GrampsPerson = {
    handle: 'CH21',
    gramps_id: 'I0304',
    gender: 1,
    primary_name: { first_name: 'Đức Anh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F159'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH22: GrampsPerson = {
    handle: 'CH22',
    gramps_id: 'I0305',
    gender: 1,
    primary_name: { first_name: 'Huy Tuấn', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F160'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH23: GrampsPerson = {
    handle: 'CH23',
    gramps_id: 'I0306',
    gender: 1,
    primary_name: { first_name: 'Huy Tú', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F161'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_CH24: GrampsPerson = {
    handle: 'CH24',
    gramps_id: 'I0307',
    gender: 1,
    primary_name: { first_name: 'Trường Danh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F162'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH01: GrampsPerson = {
    handle: 'TH01',
    gramps_id: 'I0308',
    gender: 1,
    primary_name: { first_name: 'Huy Chính', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F164'],
    parent_family_list: ['F163'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH02: GrampsPerson = {
    handle: 'TH02',
    gramps_id: 'I0309',
    gender: 1,
    primary_name: { first_name: 'Huy Sơn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F165'],
    parent_family_list: ['F164'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH03: GrampsPerson = {
    handle: 'TH03',
    gramps_id: 'I0310',
    gender: 1,
    primary_name: { first_name: 'Huy Lâm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F166'],
    parent_family_list: ['F164'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH04: GrampsPerson = {
    handle: 'TH04',
    gramps_id: 'I0311',
    gender: 1,
    primary_name: { first_name: 'Huy Hải', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F167'],
    parent_family_list: ['F164'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH05: GrampsPerson = {
    handle: 'TH05',
    gramps_id: 'I0312',
    gender: 1,
    primary_name: { first_name: 'Huy Chế', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F168'],
    parent_family_list: ['F164'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH06: GrampsPerson = {
    handle: 'TH06',
    gramps_id: 'I0313',
    gender: 1,
    primary_name: { first_name: 'Huy Dũng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F165'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH07: GrampsPerson = {
    handle: 'TH07',
    gramps_id: 'I0314',
    gender: 1,
    primary_name: { first_name: 'Huy Độ', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F165'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH08: GrampsPerson = {
    handle: 'TH08',
    gramps_id: 'I0315',
    gender: 1,
    primary_name: { first_name: 'Huy Việt', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F166'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH09: GrampsPerson = {
    handle: 'TH09',
    gramps_id: 'I0316',
    gender: 1,
    primary_name: { first_name: 'Huy Minh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F166'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH10: GrampsPerson = {
    handle: 'TH10',
    gramps_id: 'I0317',
    gender: 1,
    primary_name: { first_name: 'Huy Đức', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F167'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH11: GrampsPerson = {
    handle: 'TH11',
    gramps_id: 'I0318',
    gender: 1,
    primary_name: { first_name: 'Huy Đông', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F167'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH12: GrampsPerson = {
    handle: 'TH12',
    gramps_id: 'I0319',
    gender: 1,
    primary_name: { first_name: 'Huy Vận', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F167'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH13: GrampsPerson = {
    handle: 'TH13',
    gramps_id: 'I0320',
    gender: 1,
    primary_name: { first_name: 'Huy Nghĩa', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F167'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH14: GrampsPerson = {
    handle: 'TH14',
    gramps_id: 'I0321',
    gender: 1,
    primary_name: { first_name: 'Huy Hưng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH15: GrampsPerson = {
    handle: 'TH15',
    gramps_id: 'I0322',
    gender: 1,
    primary_name: { first_name: 'Huy Hanh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH16: GrampsPerson = {
    handle: 'TH16',
    gramps_id: 'I0323',
    gender: 1,
    primary_name: { first_name: 'Huy Hồng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH17: GrampsPerson = {
    handle: 'TH17',
    gramps_id: 'I0324',
    gender: 1,
    primary_name: { first_name: 'Huy Phương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH18: GrampsPerson = {
    handle: 'TH18',
    gramps_id: 'I0325',
    gender: 1,
    primary_name: { first_name: 'Huy Hiệu', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH19: GrampsPerson = {
    handle: 'TH19',
    gramps_id: 'I0326',
    gender: 1,
    primary_name: { first_name: 'Huy Đính', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH20: GrampsPerson = {
    handle: 'TH20',
    gramps_id: 'I0327',
    gender: 1,
    primary_name: { first_name: 'Huy Mạnh', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH21: GrampsPerson = {
    handle: 'TH21',
    gramps_id: 'I0328',
    gender: 1,
    primary_name: { first_name: 'Huy Lượng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH22: GrampsPerson = {
    handle: 'TH22',
    gramps_id: 'I0329',
    gender: 1,
    primary_name: { first_name: 'Huy Tiếp', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TH23: GrampsPerson = {
    handle: 'TH23',
    gramps_id: 'I0330',
    gender: 1,
    primary_name: { first_name: 'Huy Lộc', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F168'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU01: GrampsPerson = {
    handle: 'TU01',
    gramps_id: 'I0331',
    gender: 1,
    primary_name: { first_name: 'Huy Nghi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F170'],
    parent_family_list: ['F169'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU02: GrampsPerson = {
    handle: 'TU02',
    gramps_id: 'I0332',
    gender: 1,
    primary_name: { first_name: 'Huy Phúc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F171'],
    parent_family_list: ['F169'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU03: GrampsPerson = {
    handle: 'TU03',
    gramps_id: 'I0333',
    gender: 1,
    primary_name: { first_name: 'Huy Dân', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F172'],
    parent_family_list: ['F170'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU04: GrampsPerson = {
    handle: 'TU04',
    gramps_id: 'I0334',
    gender: 1,
    primary_name: { first_name: 'Huy Toàn', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F173'],
    parent_family_list: ['F170'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU05: GrampsPerson = {
    handle: 'TU05',
    gramps_id: 'I0335',
    gender: 1,
    primary_name: { first_name: 'Huy Lợi', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F174'],
    parent_family_list: ['F171'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU06: GrampsPerson = {
    handle: 'TU06',
    gramps_id: 'I0336',
    gender: 1,
    primary_name: { first_name: 'Huy Thắng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F175'],
    parent_family_list: ['F171'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU07: GrampsPerson = {
    handle: 'TU07',
    gramps_id: 'I0337',
    gender: 1,
    primary_name: { first_name: 'Huy Thuận', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F172'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU08: GrampsPerson = {
    handle: 'TU08',
    gramps_id: 'I0338',
    gender: 1,
    primary_name: { first_name: 'Huy Luận', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F172'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU09: GrampsPerson = {
    handle: 'TU09',
    gramps_id: 'I0339',
    gender: 1,
    primary_name: { first_name: 'Huy Nghị', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F173'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU10: GrampsPerson = {
    handle: 'TU10',
    gramps_id: 'I0340',
    gender: 1,
    primary_name: { first_name: 'Huy Quy', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F173'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU11: GrampsPerson = {
    handle: 'TU11',
    gramps_id: 'I0341',
    gender: 1,
    primary_name: { first_name: 'Huy Nam', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F174'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU12: GrampsPerson = {
    handle: 'TU12',
    gramps_id: 'I0342',
    gender: 1,
    primary_name: { first_name: 'Huy Lâm', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F174'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU13: GrampsPerson = {
    handle: 'TU13',
    gramps_id: 'I0343',
    gender: 1,
    primary_name: { first_name: 'Huy Trọng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F175'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TU14: GrampsPerson = {
    handle: 'TU14',
    gramps_id: 'I0344',
    gender: 1,
    primary_name: { first_name: 'Huy Tùng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F175'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC01: GrampsPerson = {
    handle: 'TC01',
    gramps_id: 'I0345',
    gender: 1,
    primary_name: { first_name: 'Huy Dũng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F177'],
    parent_family_list: ['F176'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC02: GrampsPerson = {
    handle: 'TC02',
    gramps_id: 'I0346',
    gender: 1,
    primary_name: { first_name: 'Huy Minh', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F178'],
    parent_family_list: ['F176'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC03: GrampsPerson = {
    handle: 'TC03',
    gramps_id: 'I0347',
    gender: 1,
    primary_name: { first_name: 'Huy Hùng', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F179'],
    parent_family_list: ['F177'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC04: GrampsPerson = {
    handle: 'TC04',
    gramps_id: 'I0348',
    gender: 1,
    primary_name: { first_name: 'Huy Năm', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F180'],
    parent_family_list: ['F177'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC05: GrampsPerson = {
    handle: 'TC05',
    gramps_id: 'I0349',
    gender: 1,
    primary_name: { first_name: 'Huy Sáu', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F181'],
    parent_family_list: ['F178'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC06: GrampsPerson = {
    handle: 'TC06',
    gramps_id: 'I0350',
    gender: 1,
    primary_name: { first_name: 'Huy Lộc', surname_list: [{ surname: 'Lê' }] },
    family_list: ['F182'],
    parent_family_list: ['F178'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC07: GrampsPerson = {
    handle: 'TC07',
    gramps_id: 'I0351',
    gender: 1,
    primary_name: { first_name: 'Huy Lương', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F179'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC08: GrampsPerson = {
    handle: 'TC08',
    gramps_id: 'I0352',
    gender: 1,
    primary_name: { first_name: 'Huy Việt', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F179'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC09: GrampsPerson = {
    handle: 'TC09',
    gramps_id: 'I0353',
    gender: 1,
    primary_name: { first_name: 'Huy Tâm', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F180'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC10: GrampsPerson = {
    handle: 'TC10',
    gramps_id: 'I0354',
    gender: 1,
    primary_name: { first_name: 'Huy Tự', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F181'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC11: GrampsPerson = {
    handle: 'TC11',
    gramps_id: 'I0355',
    gender: 1,
    primary_name: { first_name: 'Huy Giáp', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F182'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const person_TC12: GrampsPerson = {
    handle: 'TC12',
    gramps_id: 'I0356',
    gender: 1,
    primary_name: { first_name: 'Huy Dũng', surname_list: [{ surname: 'Lê' }] },
    family_list: [],
    parent_family_list: ['F182'],
    media_list: [],
    note_list: [],
    attribute_list: [],
    change: 0,
};

const family_F001: GrampsFamily = {
    handle: 'F001',
    gramps_id: 'F001',
    father_handle: 'P001',
    child_ref_list: [{ ref: 'P002' }],
    type: 'Married',
};

const family_F002: GrampsFamily = {
    handle: 'F002',
    gramps_id: 'F002',
    father_handle: 'P002',
    child_ref_list: [{ ref: 'P003' }],
    type: 'Married',
};

const family_F003: GrampsFamily = {
    handle: 'F003',
    gramps_id: 'F003',
    father_handle: 'P003',
    child_ref_list: [{ ref: 'P004' }, { ref: 'P005' }, { ref: 'P006' }],
    type: 'Married',
};

const family_F004: GrampsFamily = {
    handle: 'F004',
    gramps_id: 'F004',
    father_handle: 'P004',
    child_ref_list: [{ ref: 'P007' }],
    type: 'Married',
};

const family_F005: GrampsFamily = {
    handle: 'F005',
    gramps_id: 'F005',
    father_handle: 'P005',
    child_ref_list: [{ ref: 'P008' }],
    type: 'Married',
};

const family_F006: GrampsFamily = {
    handle: 'F006',
    gramps_id: 'F006',
    father_handle: 'P006',
    child_ref_list: [{ ref: 'P009' }],
    type: 'Married',
};

const family_F007: GrampsFamily = {
    handle: 'F007',
    gramps_id: 'F007',
    father_handle: 'P007',
    child_ref_list: [{ ref: 'P010' }, { ref: 'P011' }, { ref: 'P012' }],
    type: 'Married',
};

const family_F008: GrampsFamily = {
    handle: 'F008',
    gramps_id: 'F008',
    father_handle: 'P008',
    child_ref_list: [{ ref: 'P013' }],
    type: 'Married',
};

const family_F009: GrampsFamily = {
    handle: 'F009',
    gramps_id: 'F009',
    father_handle: 'P009',
    child_ref_list: [{ ref: 'P014' }],
    type: 'Married',
};

const family_F010: GrampsFamily = {
    handle: 'F010',
    gramps_id: 'F010',
    father_handle: 'P010',
    child_ref_list: [{ ref: 'P015' }, { ref: 'P016' }, { ref: 'P017' }],
    type: 'Married',
};

const family_F011: GrampsFamily = {
    handle: 'F011',
    gramps_id: 'F011',
    father_handle: 'P013',
    child_ref_list: [{ ref: 'P018' }, { ref: 'P019' }],
    type: 'Married',
};

const family_F012: GrampsFamily = {
    handle: 'F012',
    gramps_id: 'F012',
    father_handle: 'P014',
    child_ref_list: [{ ref: 'P020' }],
    type: 'Married',
};

const family_F013: GrampsFamily = {
    handle: 'F013',
    gramps_id: 'F013',
    father_handle: 'P015',
    child_ref_list: [{ ref: 'P021' }],
    type: 'Married',
};

const family_F014: GrampsFamily = {
    handle: 'F014',
    gramps_id: 'F014',
    father_handle: 'P016',
    child_ref_list: [{ ref: 'P022' }],
    type: 'Married',
};

const family_F015: GrampsFamily = {
    handle: 'F015',
    gramps_id: 'F015',
    father_handle: 'P019',
    child_ref_list: [{ ref: 'P023' }],
    type: 'Married',
};

const family_F016: GrampsFamily = {
    handle: 'F016',
    gramps_id: 'F016',
    father_handle: 'P020',
    child_ref_list: [{ ref: 'P024' }, { ref: 'P025' }, { ref: 'P026' }, { ref: 'P027' }],
    type: 'Married',
};

const family_F017: GrampsFamily = {
    handle: 'F017',
    gramps_id: 'F017',
    father_handle: 'P021',
    child_ref_list: [{ ref: 'P028' }, { ref: 'P029' }, { ref: 'P030' }, { ref: 'P031' }],
    type: 'Married',
};

const family_F018: GrampsFamily = {
    handle: 'F018',
    gramps_id: 'F018',
    father_handle: 'P022',
    child_ref_list: [{ ref: 'P032' }, { ref: 'P033' }],
    type: 'Married',
};

const family_F019: GrampsFamily = {
    handle: 'F019',
    gramps_id: 'F019',
    father_handle: 'P023',
    child_ref_list: [{ ref: 'P034' }],
    type: 'Married',
};

const family_F020: GrampsFamily = {
    handle: 'F020',
    gramps_id: 'F020',
    father_handle: 'P024',
    child_ref_list: [{ ref: 'P035' }],
    type: 'Married',
};

const family_F021: GrampsFamily = {
    handle: 'F021',
    gramps_id: 'F021',
    father_handle: 'P025',
    child_ref_list: [{ ref: 'P036' }],
    type: 'Married',
};

const family_F022: GrampsFamily = {
    handle: 'F022',
    gramps_id: 'F022',
    father_handle: 'P026',
    child_ref_list: [{ ref: 'P037' }],
    type: 'Married',
};

const family_F023: GrampsFamily = {
    handle: 'F023',
    gramps_id: 'F023',
    father_handle: 'P027',
    child_ref_list: [{ ref: 'P038' }],
    type: 'Married',
};

const family_F024: GrampsFamily = {
    handle: 'F024',
    gramps_id: 'F024',
    father_handle: 'P028',
    child_ref_list: [{ ref: 'P039' }],
    type: 'Married',
};

const family_F025: GrampsFamily = {
    handle: 'F025',
    gramps_id: 'F025',
    father_handle: 'P029',
    child_ref_list: [{ ref: 'P040' }],
    type: 'Married',
};

const family_F026: GrampsFamily = {
    handle: 'F026',
    gramps_id: 'F026',
    father_handle: 'P030',
    child_ref_list: [{ ref: 'P041' }],
    type: 'Married',
};

const family_F027: GrampsFamily = {
    handle: 'F027',
    gramps_id: 'F027',
    father_handle: 'P031',
    child_ref_list: [{ ref: 'P042' }],
    type: 'Married',
};

const family_F028: GrampsFamily = {
    handle: 'F028',
    gramps_id: 'F028',
    father_handle: 'P032',
    child_ref_list: [{ ref: 'P043' }],
    type: 'Married',
};

const family_F029: GrampsFamily = {
    handle: 'F029',
    gramps_id: 'F029',
    father_handle: 'P033',
    child_ref_list: [{ ref: 'P044' }],
    type: 'Married',
};

const family_F030: GrampsFamily = {
    handle: 'F030',
    gramps_id: 'F030',
    father_handle: 'P034',
    child_ref_list: [{ ref: 'P045' }, { ref: 'P046' }, { ref: 'P047' }],
    type: 'Married',
};

const family_F031: GrampsFamily = {
    handle: 'F031',
    gramps_id: 'F031',
    father_handle: 'P035',
    child_ref_list: [{ ref: 'P048' }],
    type: 'Married',
};

const family_F032: GrampsFamily = {
    handle: 'F032',
    gramps_id: 'F032',
    father_handle: 'P036',
    child_ref_list: [{ ref: 'P049' }],
    type: 'Married',
};

const family_F033: GrampsFamily = {
    handle: 'F033',
    gramps_id: 'F033',
    father_handle: 'P037',
    child_ref_list: [{ ref: 'P050' }],
    type: 'Married',
};

const family_F034: GrampsFamily = {
    handle: 'F034',
    gramps_id: 'F034',
    father_handle: 'P038',
    child_ref_list: [{ ref: 'P051' }, { ref: 'P052' }, { ref: 'P053' }, { ref: 'P054' }, { ref: 'P055' }, { ref: 'P056' }],
    type: 'Married',
};

const family_F035: GrampsFamily = {
    handle: 'F035',
    gramps_id: 'F035',
    father_handle: 'P039',
    child_ref_list: [{ ref: 'B101' }, { ref: 'B102' }],
    type: 'Married',
};

const family_F036: GrampsFamily = {
    handle: 'F036',
    gramps_id: 'F036',
    father_handle: 'B101',
    child_ref_list: [{ ref: 'B103' }, { ref: 'B104' }],
    type: 'Married',
};

const family_F037: GrampsFamily = {
    handle: 'F037',
    gramps_id: 'F037',
    father_handle: 'B102',
    child_ref_list: [{ ref: 'B105' }, { ref: 'B106' }, { ref: 'B107' }],
    type: 'Married',
};

const family_F038: GrampsFamily = {
    handle: 'F038',
    gramps_id: 'F038',
    father_handle: 'B103',
    child_ref_list: [{ ref: 'B108' }, { ref: 'B109' }, { ref: 'B110' }, { ref: 'B111' }],
    type: 'Married',
};

const family_F039: GrampsFamily = {
    handle: 'F039',
    gramps_id: 'F039',
    father_handle: 'B104',
    child_ref_list: [{ ref: 'B112' }, { ref: 'B113' }, { ref: 'B114' }],
    type: 'Married',
};

const family_F040: GrampsFamily = {
    handle: 'F040',
    gramps_id: 'F040',
    father_handle: 'B105',
    child_ref_list: [{ ref: 'B115' }],
    type: 'Married',
};

const family_F041: GrampsFamily = {
    handle: 'F041',
    gramps_id: 'F041',
    father_handle: 'B106',
    child_ref_list: [{ ref: 'B116' }],
    type: 'Married',
};

const family_F042: GrampsFamily = {
    handle: 'F042',
    gramps_id: 'F042',
    father_handle: 'B107',
    child_ref_list: [{ ref: 'B117' }],
    type: 'Married',
};

const family_F043: GrampsFamily = {
    handle: 'F043',
    gramps_id: 'F043',
    father_handle: 'B108',
    child_ref_list: [{ ref: 'B118' }, { ref: 'B119' }, { ref: 'B120' }, { ref: 'B121' }, { ref: 'B122' }, { ref: 'B123' }],
    type: 'Married',
};

const family_F044: GrampsFamily = {
    handle: 'F044',
    gramps_id: 'F044',
    father_handle: 'B110',
    child_ref_list: [{ ref: 'B124' }, { ref: 'B125' }, { ref: 'B126' }],
    type: 'Married',
};

const family_F045: GrampsFamily = {
    handle: 'F045',
    gramps_id: 'F045',
    father_handle: 'B111',
    child_ref_list: [{ ref: 'B127' }],
    type: 'Married',
};

const family_F046: GrampsFamily = {
    handle: 'F046',
    gramps_id: 'F046',
    father_handle: 'B114',
    child_ref_list: [{ ref: 'B128' }],
    type: 'Married',
};

const family_F047: GrampsFamily = {
    handle: 'F047',
    gramps_id: 'F047',
    father_handle: 'B116',
    child_ref_list: [{ ref: 'B129' }],
    type: 'Married',
};

const family_F048: GrampsFamily = {
    handle: 'F048',
    gramps_id: 'F048',
    father_handle: 'B117',
    child_ref_list: [{ ref: 'B130' }],
    type: 'Married',
};

const family_F049: GrampsFamily = {
    handle: 'F049',
    gramps_id: 'F049',
    father_handle: 'B118',
    child_ref_list: [{ ref: 'B131' }, { ref: 'B132' }],
    type: 'Married',
};

const family_F050: GrampsFamily = {
    handle: 'F050',
    gramps_id: 'F050',
    father_handle: 'B124',
    child_ref_list: [{ ref: 'B133' }, { ref: 'B134' }, { ref: 'B135' }, { ref: 'B136' }],
    type: 'Married',
};

const family_F051: GrampsFamily = {
    handle: 'F051',
    gramps_id: 'F051',
    father_handle: 'P040',
    child_ref_list: [{ ref: 'T101' }, { ref: 'T102' }],
    type: 'Married',
};

const family_F052: GrampsFamily = {
    handle: 'F052',
    gramps_id: 'F052',
    father_handle: 'T101',
    child_ref_list: [{ ref: 'T103' }, { ref: 'T104' }],
    type: 'Married',
};

const family_F053: GrampsFamily = {
    handle: 'F053',
    gramps_id: 'F053',
    father_handle: 'T102',
    child_ref_list: [{ ref: 'T105' }],
    type: 'Married',
};

const family_F054: GrampsFamily = {
    handle: 'F054',
    gramps_id: 'F054',
    father_handle: 'T103',
    child_ref_list: [{ ref: 'T106' }, { ref: 'T107' }, { ref: 'T108' }],
    type: 'Married',
};

const family_F055: GrampsFamily = {
    handle: 'F055',
    gramps_id: 'F055',
    father_handle: 'T105',
    child_ref_list: [{ ref: 'T109' }, { ref: 'T110' }, { ref: 'T111' }, { ref: 'T112' }],
    type: 'Married',
};

const family_F056: GrampsFamily = {
    handle: 'F056',
    gramps_id: 'F056',
    father_handle: 'T106',
    child_ref_list: [{ ref: 'T113' }, { ref: 'T114' }],
    type: 'Married',
};

const family_F057: GrampsFamily = {
    handle: 'F057',
    gramps_id: 'F057',
    father_handle: 'T109',
    child_ref_list: [{ ref: 'T115' }],
    type: 'Married',
};

const family_F058: GrampsFamily = {
    handle: 'F058',
    gramps_id: 'F058',
    father_handle: 'T112',
    child_ref_list: [{ ref: 'T116' }, { ref: 'T117' }, { ref: 'T118' }, { ref: 'T119' }],
    type: 'Married',
};

const family_F059: GrampsFamily = {
    handle: 'F059',
    gramps_id: 'F059',
    father_handle: 'T113',
    child_ref_list: [{ ref: 'T120' }, { ref: 'T121' }],
    type: 'Married',
};

const family_F060: GrampsFamily = {
    handle: 'F060',
    gramps_id: 'F060',
    father_handle: 'T115',
    child_ref_list: [{ ref: 'T122' }],
    type: 'Married',
};

const family_F061: GrampsFamily = {
    handle: 'F061',
    gramps_id: 'F061',
    father_handle: 'P043',
    child_ref_list: [{ ref: 'V101' }, { ref: 'V102' }, { ref: 'V103' }],
    type: 'Married',
};

const family_F062: GrampsFamily = {
    handle: 'F062',
    gramps_id: 'F062',
    father_handle: 'V103',
    child_ref_list: [{ ref: 'V104' }],
    type: 'Married',
};

const family_F063: GrampsFamily = {
    handle: 'F063',
    gramps_id: 'F063',
    father_handle: 'V104',
    child_ref_list: [{ ref: 'V105' }, { ref: 'V106' }],
    type: 'Married',
};

const family_F064: GrampsFamily = {
    handle: 'F064',
    gramps_id: 'F064',
    father_handle: 'V105',
    child_ref_list: [{ ref: 'V107' }, { ref: 'V108' }],
    type: 'Married',
};

const family_F065: GrampsFamily = {
    handle: 'F065',
    gramps_id: 'F065',
    father_handle: 'P041',
    child_ref_list: [{ ref: 'D101' }, { ref: 'D102' }],
    type: 'Married',
};

const family_F066: GrampsFamily = {
    handle: 'F066',
    gramps_id: 'F066',
    father_handle: 'D101',
    child_ref_list: [{ ref: 'D103' }, { ref: 'D104' }],
    type: 'Married',
};

const family_F067: GrampsFamily = {
    handle: 'F067',
    gramps_id: 'F067',
    father_handle: 'D102',
    child_ref_list: [{ ref: 'D105' }],
    type: 'Married',
};

const family_F068: GrampsFamily = {
    handle: 'F068',
    gramps_id: 'F068',
    father_handle: 'D103',
    child_ref_list: [{ ref: 'D106' }, { ref: 'D107' }, { ref: 'D108' }, { ref: 'D109' }],
    type: 'Married',
};

const family_F069: GrampsFamily = {
    handle: 'F069',
    gramps_id: 'F069',
    father_handle: 'D104',
    child_ref_list: [{ ref: 'D110' }, { ref: 'D111' }, { ref: 'D112' }, { ref: 'D113' }, { ref: 'D114' }, { ref: 'D115' }],
    type: 'Married',
};

const family_F070: GrampsFamily = {
    handle: 'F070',
    gramps_id: 'F070',
    father_handle: 'D105',
    child_ref_list: [{ ref: 'D116' }],
    type: 'Married',
};

const family_F071: GrampsFamily = {
    handle: 'F071',
    gramps_id: 'F071',
    father_handle: 'D106',
    child_ref_list: [{ ref: 'D117' }, { ref: 'D118' }, { ref: 'D119' }, { ref: 'D120' }],
    type: 'Married',
};

const family_F072: GrampsFamily = {
    handle: 'F072',
    gramps_id: 'F072',
    father_handle: 'D110',
    child_ref_list: [{ ref: 'D121' }, { ref: 'D122' }, { ref: 'D123' }, { ref: 'D124' }],
    type: 'Married',
};

const family_F073: GrampsFamily = {
    handle: 'F073',
    gramps_id: 'F073',
    father_handle: 'D111',
    child_ref_list: [{ ref: 'D125' }, { ref: 'D126' }, { ref: 'D127' }],
    type: 'Married',
};

const family_F074: GrampsFamily = {
    handle: 'F074',
    gramps_id: 'F074',
    father_handle: 'D114',
    child_ref_list: [{ ref: 'D128' }],
    type: 'Married',
};

const family_F075: GrampsFamily = {
    handle: 'F075',
    gramps_id: 'F075',
    father_handle: 'D116',
    child_ref_list: [{ ref: 'D129' }, { ref: 'D130' }, { ref: 'D131' }],
    type: 'Married',
};

const family_F076: GrampsFamily = {
    handle: 'F076',
    gramps_id: 'F076',
    father_handle: 'D124',
    child_ref_list: [{ ref: 'D132' }, { ref: 'D133' }],
    type: 'Married',
};

const family_F077: GrampsFamily = {
    handle: 'F077',
    gramps_id: 'F077',
    father_handle: 'D126',
    child_ref_list: [{ ref: 'D134' }, { ref: 'D135' }],
    type: 'Married',
};

const family_F078: GrampsFamily = {
    handle: 'F078',
    gramps_id: 'F078',
    father_handle: 'D109',
    child_ref_list: [{ ref: 'D136' }, { ref: 'D137' }],
    type: 'Married',
};

const family_F079: GrampsFamily = {
    handle: 'F079',
    gramps_id: 'F079',
    father_handle: 'P042',
    child_ref_list: [{ ref: 'L101' }, { ref: 'L102' }, { ref: 'L103' }, { ref: 'L104' }, { ref: 'L105' }],
    type: 'Married',
};

const family_F080: GrampsFamily = {
    handle: 'F080',
    gramps_id: 'F080',
    father_handle: 'L101',
    child_ref_list: [{ ref: 'L106' }],
    type: 'Married',
};

const family_F081: GrampsFamily = {
    handle: 'F081',
    gramps_id: 'F081',
    father_handle: 'L102',
    child_ref_list: [{ ref: 'L107' }],
    type: 'Married',
};

const family_F082: GrampsFamily = {
    handle: 'F082',
    gramps_id: 'F082',
    father_handle: 'L103',
    child_ref_list: [{ ref: 'L108' }],
    type: 'Married',
};

const family_F083: GrampsFamily = {
    handle: 'F083',
    gramps_id: 'F083',
    father_handle: 'L104',
    child_ref_list: [{ ref: 'L109' }],
    type: 'Married',
};

const family_F084: GrampsFamily = {
    handle: 'F084',
    gramps_id: 'F084',
    father_handle: 'L105',
    child_ref_list: [{ ref: 'L110' }, { ref: 'L111' }, { ref: 'L112' }],
    type: 'Married',
};

const family_F085: GrampsFamily = {
    handle: 'F085',
    gramps_id: 'F085',
    father_handle: 'L106',
    child_ref_list: [{ ref: 'L113' }, { ref: 'L114' }],
    type: 'Married',
};

const family_F086: GrampsFamily = {
    handle: 'F086',
    gramps_id: 'F086',
    father_handle: 'L107',
    child_ref_list: [{ ref: 'L115' }, { ref: 'L116' }],
    type: 'Married',
};

const family_F087: GrampsFamily = {
    handle: 'F087',
    gramps_id: 'F087',
    father_handle: 'L108',
    child_ref_list: [{ ref: 'L117' }, { ref: 'L118' }],
    type: 'Married',
};

const family_F088: GrampsFamily = {
    handle: 'F088',
    gramps_id: 'F088',
    father_handle: 'L109',
    child_ref_list: [{ ref: 'L119' }, { ref: 'L120' }, { ref: 'L121' }, { ref: 'L122' }],
    type: 'Married',
};

const family_F089: GrampsFamily = {
    handle: 'F089',
    gramps_id: 'F089',
    father_handle: 'L110',
    child_ref_list: [{ ref: 'L123' }, { ref: 'L124' }],
    type: 'Married',
};

const family_F090: GrampsFamily = {
    handle: 'F090',
    gramps_id: 'F090',
    father_handle: 'L111',
    child_ref_list: [{ ref: 'L125' }],
    type: 'Married',
};

const family_F091: GrampsFamily = {
    handle: 'F091',
    gramps_id: 'F091',
    father_handle: 'L112',
    child_ref_list: [{ ref: 'L126' }, { ref: 'L127' }],
    type: 'Married',
};

const family_F092: GrampsFamily = {
    handle: 'F092',
    gramps_id: 'F092',
    father_handle: 'L113',
    child_ref_list: [{ ref: 'L128' }, { ref: 'L129' }],
    type: 'Married',
};

const family_F093: GrampsFamily = {
    handle: 'F093',
    gramps_id: 'F093',
    father_handle: 'L114',
    child_ref_list: [{ ref: 'L130' }],
    type: 'Married',
};

const family_F094: GrampsFamily = {
    handle: 'F094',
    gramps_id: 'F094',
    father_handle: 'L115',
    child_ref_list: [{ ref: 'L131' }],
    type: 'Married',
};

const family_F095: GrampsFamily = {
    handle: 'F095',
    gramps_id: 'F095',
    father_handle: 'L116',
    child_ref_list: [{ ref: 'L132' }],
    type: 'Married',
};

const family_F096: GrampsFamily = {
    handle: 'F096',
    gramps_id: 'F096',
    father_handle: 'L117',
    child_ref_list: [{ ref: 'L133' }],
    type: 'Married',
};

const family_F097: GrampsFamily = {
    handle: 'F097',
    gramps_id: 'F097',
    father_handle: 'L118',
    child_ref_list: [{ ref: 'L134' }],
    type: 'Married',
};

const family_F098: GrampsFamily = {
    handle: 'F098',
    gramps_id: 'F098',
    father_handle: 'L119',
    child_ref_list: [{ ref: 'L135' }],
    type: 'Married',
};

const family_F099: GrampsFamily = {
    handle: 'F099',
    gramps_id: 'F099',
    father_handle: 'L121',
    child_ref_list: [{ ref: 'L136' }, { ref: 'L137' }],
    type: 'Married',
};

const family_F100: GrampsFamily = {
    handle: 'F100',
    gramps_id: 'F100',
    father_handle: 'L122',
    child_ref_list: [{ ref: 'L138' }],
    type: 'Married',
};

const family_F101: GrampsFamily = {
    handle: 'F101',
    gramps_id: 'F101',
    father_handle: 'L123',
    child_ref_list: [{ ref: 'L139' }],
    type: 'Married',
};

const family_F102: GrampsFamily = {
    handle: 'F102',
    gramps_id: 'F102',
    father_handle: 'L125',
    child_ref_list: [{ ref: 'L140' }, { ref: 'L141' }],
    type: 'Married',
};

const family_F103: GrampsFamily = {
    handle: 'F103',
    gramps_id: 'F103',
    father_handle: 'L126',
    child_ref_list: [{ ref: 'L142' }],
    type: 'Married',
};

const family_F104: GrampsFamily = {
    handle: 'F104',
    gramps_id: 'F104',
    father_handle: 'L127',
    child_ref_list: [{ ref: 'L143' }],
    type: 'Married',
};

const family_F105: GrampsFamily = {
    handle: 'F105',
    gramps_id: 'F105',
    father_handle: 'L120',
    child_ref_list: [{ ref: 'L144' }],
    type: 'Married',
};

const family_F106: GrampsFamily = {
    handle: 'F106',
    gramps_id: 'F106',
    father_handle: 'P048',
    child_ref_list: [{ ref: 'C101' }, { ref: 'C102' }, { ref: 'C103' }, { ref: 'C104' }],
    type: 'Married',
};

const family_F107: GrampsFamily = {
    handle: 'F107',
    gramps_id: 'F107',
    father_handle: 'C101',
    child_ref_list: [{ ref: 'C105' }],
    type: 'Married',
};

const family_F108: GrampsFamily = {
    handle: 'F108',
    gramps_id: 'F108',
    father_handle: 'C102',
    child_ref_list: [{ ref: 'C106' }],
    type: 'Married',
};

const family_F109: GrampsFamily = {
    handle: 'F109',
    gramps_id: 'F109',
    father_handle: 'C103',
    child_ref_list: [{ ref: 'C107' }],
    type: 'Married',
};

const family_F110: GrampsFamily = {
    handle: 'F110',
    gramps_id: 'F110',
    father_handle: 'C104',
    child_ref_list: [{ ref: 'C108' }, { ref: 'C109' }, { ref: 'C110' }, { ref: 'C111' }],
    type: 'Married',
};

const family_F111: GrampsFamily = {
    handle: 'F111',
    gramps_id: 'F111',
    father_handle: 'C105',
    child_ref_list: [{ ref: 'C112' }, { ref: 'C113' }, { ref: 'C114' }],
    type: 'Married',
};

const family_F112: GrampsFamily = {
    handle: 'F112',
    gramps_id: 'F112',
    father_handle: 'C106',
    child_ref_list: [{ ref: 'C115' }],
    type: 'Married',
};

const family_F113: GrampsFamily = {
    handle: 'F113',
    gramps_id: 'F113',
    father_handle: 'C107',
    child_ref_list: [{ ref: 'C116' }, { ref: 'C117' }],
    type: 'Married',
};

const family_F114: GrampsFamily = {
    handle: 'F114',
    gramps_id: 'F114',
    father_handle: 'C108',
    child_ref_list: [{ ref: 'C118' }, { ref: 'C119' }],
    type: 'Married',
};

const family_F115: GrampsFamily = {
    handle: 'F115',
    gramps_id: 'F115',
    father_handle: 'C109',
    child_ref_list: [{ ref: 'C120' }],
    type: 'Married',
};

const family_F116: GrampsFamily = {
    handle: 'F116',
    gramps_id: 'F116',
    father_handle: 'C110',
    child_ref_list: [{ ref: 'C121' }],
    type: 'Married',
};

const family_F117: GrampsFamily = {
    handle: 'F117',
    gramps_id: 'F117',
    father_handle: 'C111',
    child_ref_list: [{ ref: 'C122' }, { ref: 'C123' }],
    type: 'Married',
};

const family_F118: GrampsFamily = {
    handle: 'F118',
    gramps_id: 'F118',
    father_handle: 'C113',
    child_ref_list: [{ ref: 'C124' }, { ref: 'C125' }],
    type: 'Married',
};

const family_F119: GrampsFamily = {
    handle: 'F119',
    gramps_id: 'F119',
    father_handle: 'C115',
    child_ref_list: [{ ref: 'C126' }],
    type: 'Married',
};

const family_F120: GrampsFamily = {
    handle: 'F120',
    gramps_id: 'F120',
    father_handle: 'C116',
    child_ref_list: [{ ref: 'C127' }],
    type: 'Married',
};

const family_F121: GrampsFamily = {
    handle: 'F121',
    gramps_id: 'F121',
    father_handle: 'C117',
    child_ref_list: [{ ref: 'C128' }],
    type: 'Married',
};

const family_F122: GrampsFamily = {
    handle: 'F122',
    gramps_id: 'F122',
    father_handle: 'C118',
    child_ref_list: [{ ref: 'C129' }],
    type: 'Married',
};

const family_F123: GrampsFamily = {
    handle: 'F123',
    gramps_id: 'F123',
    father_handle: 'C119',
    child_ref_list: [{ ref: 'C130' }],
    type: 'Married',
};

const family_F124: GrampsFamily = {
    handle: 'F124',
    gramps_id: 'F124',
    father_handle: 'C120',
    child_ref_list: [{ ref: 'C131' }],
    type: 'Married',
};

const family_F125: GrampsFamily = {
    handle: 'F125',
    gramps_id: 'F125',
    father_handle: 'C121',
    child_ref_list: [{ ref: 'C132' }],
    type: 'Married',
};

const family_F126: GrampsFamily = {
    handle: 'F126',
    gramps_id: 'F126',
    father_handle: 'P049',
    child_ref_list: [{ ref: 'CN01' }],
    type: 'Married',
};

const family_F127: GrampsFamily = {
    handle: 'F127',
    gramps_id: 'F127',
    father_handle: 'CN01',
    child_ref_list: [{ ref: 'CN02' }],
    type: 'Married',
};

const family_F128: GrampsFamily = {
    handle: 'F128',
    gramps_id: 'F128',
    father_handle: 'CN02',
    child_ref_list: [{ ref: 'CN03' }, { ref: 'CN04' }, { ref: 'CN05' }, { ref: 'CN06' }, { ref: 'CN07' }, { ref: 'CN08' }],
    type: 'Married',
};

const family_F129: GrampsFamily = {
    handle: 'F129',
    gramps_id: 'F129',
    father_handle: 'CN03',
    child_ref_list: [{ ref: 'CN09' }, { ref: 'CN10' }, { ref: 'CN11' }],
    type: 'Married',
};

const family_F130: GrampsFamily = {
    handle: 'F130',
    gramps_id: 'F130',
    father_handle: 'CN05',
    child_ref_list: [{ ref: 'CN12' }],
    type: 'Married',
};

const family_F131: GrampsFamily = {
    handle: 'F131',
    gramps_id: 'F131',
    father_handle: 'CN06',
    child_ref_list: [{ ref: 'CN13' }, { ref: 'CN14' }],
    type: 'Married',
};

const family_F132: GrampsFamily = {
    handle: 'F132',
    gramps_id: 'F132',
    father_handle: 'CN07',
    child_ref_list: [{ ref: 'CN15' }, { ref: 'CN16' }],
    type: 'Married',
};

const family_F133: GrampsFamily = {
    handle: 'F133',
    gramps_id: 'F133',
    father_handle: 'P050',
    child_ref_list: [{ ref: 'LI01' }, { ref: 'LI02' }],
    type: 'Married',
};

const family_F134: GrampsFamily = {
    handle: 'F134',
    gramps_id: 'F134',
    father_handle: 'LI01',
    child_ref_list: [{ ref: 'LI03' }, { ref: 'LI04' }, { ref: 'LI05' }, { ref: 'LI06' }],
    type: 'Married',
};

const family_F135: GrampsFamily = {
    handle: 'F135',
    gramps_id: 'F135',
    father_handle: 'LI02',
    child_ref_list: [{ ref: 'LI07' }, { ref: 'LI08' }],
    type: 'Married',
};

const family_F136: GrampsFamily = {
    handle: 'F136',
    gramps_id: 'F136',
    father_handle: 'LI03',
    child_ref_list: [{ ref: 'LI09' }, { ref: 'LI10' }],
    type: 'Married',
};

const family_F137: GrampsFamily = {
    handle: 'F137',
    gramps_id: 'F137',
    father_handle: 'LI04',
    child_ref_list: [{ ref: 'LI11' }, { ref: 'LI12' }],
    type: 'Married',
};

const family_F138: GrampsFamily = {
    handle: 'F138',
    gramps_id: 'F138',
    father_handle: 'LI05',
    child_ref_list: [{ ref: 'LI13' }, { ref: 'LI14' }],
    type: 'Married',
};

const family_F139: GrampsFamily = {
    handle: 'F139',
    gramps_id: 'F139',
    father_handle: 'LI06',
    child_ref_list: [{ ref: 'LI15' }],
    type: 'Married',
};

const family_F140: GrampsFamily = {
    handle: 'F140',
    gramps_id: 'F140',
    father_handle: 'LI07',
    child_ref_list: [{ ref: 'LI16' }, { ref: 'LI17' }, { ref: 'LI18' }],
    type: 'Married',
};

const family_F141: GrampsFamily = {
    handle: 'F141',
    gramps_id: 'F141',
    father_handle: 'LI08',
    child_ref_list: [{ ref: 'LI19' }, { ref: 'LI20' }, { ref: 'LI21' }],
    type: 'Married',
};

const family_F142: GrampsFamily = {
    handle: 'F142',
    gramps_id: 'F142',
    father_handle: 'LI20',
    child_ref_list: [{ ref: 'LI22' }],
    type: 'Married',
};

const family_F143: GrampsFamily = {
    handle: 'F143',
    gramps_id: 'F143',
    father_handle: 'LI09',
    child_ref_list: [{ ref: 'LI23' }, { ref: 'LI24' }],
    type: 'Married',
};

const family_F144: GrampsFamily = {
    handle: 'F144',
    gramps_id: 'F144',
    father_handle: 'LI11',
    child_ref_list: [{ ref: 'LI25' }],
    type: 'Married',
};

const family_F145: GrampsFamily = {
    handle: 'F145',
    gramps_id: 'F145',
    father_handle: 'LI15',
    child_ref_list: [{ ref: 'LI26' }, { ref: 'LI27' }],
    type: 'Married',
};

const family_F146: GrampsFamily = {
    handle: 'F146',
    gramps_id: 'F146',
    father_handle: 'LI16',
    child_ref_list: [{ ref: 'LI28' }, { ref: 'LI29' }],
    type: 'Married',
};

const family_F147: GrampsFamily = {
    handle: 'F147',
    gramps_id: 'F147',
    father_handle: 'LI17',
    child_ref_list: [{ ref: 'LI30' }],
    type: 'Married',
};

const family_F148: GrampsFamily = {
    handle: 'F148',
    gramps_id: 'F148',
    father_handle: 'P051',
    child_ref_list: [{ ref: 'U101' }, { ref: 'U102' }],
    type: 'Married',
};

const family_F149: GrampsFamily = {
    handle: 'F149',
    gramps_id: 'F149',
    father_handle: 'P052',
    child_ref_list: [{ ref: 'CH01' }],
    type: 'Married',
};

const family_F150: GrampsFamily = {
    handle: 'F150',
    gramps_id: 'F150',
    father_handle: 'CH01',
    child_ref_list: [{ ref: 'CH02' }, { ref: 'CH03' }, { ref: 'CH04' }, { ref: 'CH05' }],
    type: 'Married',
};

const family_F151: GrampsFamily = {
    handle: 'F151',
    gramps_id: 'F151',
    father_handle: 'CH02',
    child_ref_list: [{ ref: 'CH06' }, { ref: 'CH07' }, { ref: 'CH08' }, { ref: 'CH09' }, { ref: 'CH10' }],
    type: 'Married',
};

const family_F152: GrampsFamily = {
    handle: 'F152',
    gramps_id: 'F152',
    father_handle: 'CH04',
    child_ref_list: [{ ref: 'CH11' }, { ref: 'CH12' }, { ref: 'CH13' }],
    type: 'Married',
};

const family_F153: GrampsFamily = {
    handle: 'F153',
    gramps_id: 'F153',
    father_handle: 'CH05',
    child_ref_list: [{ ref: 'CH14' }, { ref: 'CH15' }],
    type: 'Married',
};

const family_F154: GrampsFamily = {
    handle: 'F154',
    gramps_id: 'F154',
    father_handle: 'CH06',
    child_ref_list: [{ ref: 'CH16' }],
    type: 'Married',
};

const family_F155: GrampsFamily = {
    handle: 'F155',
    gramps_id: 'F155',
    father_handle: 'CH07',
    child_ref_list: [{ ref: 'CH17' }],
    type: 'Married',
};

const family_F156: GrampsFamily = {
    handle: 'F156',
    gramps_id: 'F156',
    father_handle: 'CH08',
    child_ref_list: [{ ref: 'CH18' }],
    type: 'Married',
};

const family_F157: GrampsFamily = {
    handle: 'F157',
    gramps_id: 'F157',
    father_handle: 'CH09',
    child_ref_list: [{ ref: 'CH19' }],
    type: 'Married',
};

const family_F158: GrampsFamily = {
    handle: 'F158',
    gramps_id: 'F158',
    father_handle: 'CH10',
    child_ref_list: [{ ref: 'CH20' }],
    type: 'Married',
};

const family_F159: GrampsFamily = {
    handle: 'F159',
    gramps_id: 'F159',
    father_handle: 'CH11',
    child_ref_list: [{ ref: 'CH21' }],
    type: 'Married',
};

const family_F160: GrampsFamily = {
    handle: 'F160',
    gramps_id: 'F160',
    father_handle: 'CH12',
    child_ref_list: [{ ref: 'CH22' }],
    type: 'Married',
};

const family_F161: GrampsFamily = {
    handle: 'F161',
    gramps_id: 'F161',
    father_handle: 'CH13',
    child_ref_list: [{ ref: 'CH23' }],
    type: 'Married',
};

const family_F162: GrampsFamily = {
    handle: 'F162',
    gramps_id: 'F162',
    father_handle: 'CH14',
    child_ref_list: [{ ref: 'CH24' }],
    type: 'Married',
};

const family_F163: GrampsFamily = {
    handle: 'F163',
    gramps_id: 'F163',
    father_handle: 'P053',
    child_ref_list: [{ ref: 'TH01' }],
    type: 'Married',
};

const family_F164: GrampsFamily = {
    handle: 'F164',
    gramps_id: 'F164',
    father_handle: 'TH01',
    child_ref_list: [{ ref: 'TH02' }, { ref: 'TH03' }, { ref: 'TH04' }, { ref: 'TH05' }],
    type: 'Married',
};

const family_F165: GrampsFamily = {
    handle: 'F165',
    gramps_id: 'F165',
    father_handle: 'TH02',
    child_ref_list: [{ ref: 'TH06' }, { ref: 'TH07' }],
    type: 'Married',
};

const family_F166: GrampsFamily = {
    handle: 'F166',
    gramps_id: 'F166',
    father_handle: 'TH03',
    child_ref_list: [{ ref: 'TH08' }, { ref: 'TH09' }],
    type: 'Married',
};

const family_F167: GrampsFamily = {
    handle: 'F167',
    gramps_id: 'F167',
    father_handle: 'TH04',
    child_ref_list: [{ ref: 'TH10' }, { ref: 'TH11' }, { ref: 'TH12' }, { ref: 'TH13' }],
    type: 'Married',
};

const family_F168: GrampsFamily = {
    handle: 'F168',
    gramps_id: 'F168',
    father_handle: 'TH05',
    child_ref_list: [{ ref: 'TH14' }, { ref: 'TH15' }, { ref: 'TH16' }, { ref: 'TH17' }, { ref: 'TH18' }, { ref: 'TH19' }, { ref: 'TH20' }, { ref: 'TH21' }, { ref: 'TH22' }, { ref: 'TH23' }],
    type: 'Married',
};

const family_F169: GrampsFamily = {
    handle: 'F169',
    gramps_id: 'F169',
    father_handle: 'P055',
    child_ref_list: [{ ref: 'TU01' }, { ref: 'TU02' }],
    type: 'Married',
};

const family_F170: GrampsFamily = {
    handle: 'F170',
    gramps_id: 'F170',
    father_handle: 'TU01',
    child_ref_list: [{ ref: 'TU03' }, { ref: 'TU04' }],
    type: 'Married',
};

const family_F171: GrampsFamily = {
    handle: 'F171',
    gramps_id: 'F171',
    father_handle: 'TU02',
    child_ref_list: [{ ref: 'TU05' }, { ref: 'TU06' }],
    type: 'Married',
};

const family_F172: GrampsFamily = {
    handle: 'F172',
    gramps_id: 'F172',
    father_handle: 'TU03',
    child_ref_list: [{ ref: 'TU07' }, { ref: 'TU08' }],
    type: 'Married',
};

const family_F173: GrampsFamily = {
    handle: 'F173',
    gramps_id: 'F173',
    father_handle: 'TU04',
    child_ref_list: [{ ref: 'TU09' }, { ref: 'TU10' }],
    type: 'Married',
};

const family_F174: GrampsFamily = {
    handle: 'F174',
    gramps_id: 'F174',
    father_handle: 'TU05',
    child_ref_list: [{ ref: 'TU11' }, { ref: 'TU12' }],
    type: 'Married',
};

const family_F175: GrampsFamily = {
    handle: 'F175',
    gramps_id: 'F175',
    father_handle: 'TU06',
    child_ref_list: [{ ref: 'TU13' }, { ref: 'TU14' }],
    type: 'Married',
};

const family_F176: GrampsFamily = {
    handle: 'F176',
    gramps_id: 'F176',
    father_handle: 'P056',
    child_ref_list: [{ ref: 'TC01' }, { ref: 'TC02' }],
    type: 'Married',
};

const family_F177: GrampsFamily = {
    handle: 'F177',
    gramps_id: 'F177',
    father_handle: 'TC01',
    child_ref_list: [{ ref: 'TC03' }, { ref: 'TC04' }],
    type: 'Married',
};

const family_F178: GrampsFamily = {
    handle: 'F178',
    gramps_id: 'F178',
    father_handle: 'TC02',
    child_ref_list: [{ ref: 'TC05' }, { ref: 'TC06' }],
    type: 'Married',
};

const family_F179: GrampsFamily = {
    handle: 'F179',
    gramps_id: 'F179',
    father_handle: 'TC03',
    child_ref_list: [{ ref: 'TC07' }, { ref: 'TC08' }],
    type: 'Married',
};

const family_F180: GrampsFamily = {
    handle: 'F180',
    gramps_id: 'F180',
    father_handle: 'TC04',
    child_ref_list: [{ ref: 'TC09' }],
    type: 'Married',
};

const family_F181: GrampsFamily = {
    handle: 'F181',
    gramps_id: 'F181',
    father_handle: 'TC05',
    child_ref_list: [{ ref: 'TC10' }],
    type: 'Married',
};

const family_F182: GrampsFamily = {
    handle: 'F182',
    gramps_id: 'F182',
    father_handle: 'TC06',
    child_ref_list: [{ ref: 'TC11' }, { ref: 'TC12' }],
    type: 'Married',
};

// === Export ===
export const MOCK_PEOPLE: GrampsPerson[] = [
    person_P001,
    person_P002,
    person_P003,
    person_P004,
    person_P005,
    person_P006,
    person_P007,
    person_P008,
    person_P009,
    person_P010,
    person_P011,
    person_P012,
    person_P013,
    person_P014,
    person_P015,
    person_P016,
    person_P017,
    person_P018,
    person_P019,
    person_P020,
    person_P021,
    person_P022,
    person_P023,
    person_P024,
    person_P025,
    person_P026,
    person_P027,
    person_P028,
    person_P029,
    person_P030,
    person_P031,
    person_P032,
    person_P033,
    person_P034,
    person_P035,
    person_P036,
    person_P037,
    person_P038,
    person_P039,
    person_P040,
    person_P041,
    person_P042,
    person_P043,
    person_P044,
    person_P045,
    person_P046,
    person_P047,
    person_P048,
    person_P049,
    person_P050,
    person_P051,
    person_P052,
    person_P053,
    person_P054,
    person_P055,
    person_P056,
    person_B101,
    person_B102,
    person_B103,
    person_B104,
    person_B105,
    person_B106,
    person_B107,
    person_B108,
    person_B109,
    person_B110,
    person_B111,
    person_B112,
    person_B113,
    person_B114,
    person_B115,
    person_B116,
    person_B117,
    person_B118,
    person_B119,
    person_B120,
    person_B121,
    person_B122,
    person_B123,
    person_B124,
    person_B125,
    person_B126,
    person_B127,
    person_B128,
    person_B129,
    person_B130,
    person_B131,
    person_B132,
    person_B133,
    person_B134,
    person_B135,
    person_B136,
    person_T101,
    person_T102,
    person_T103,
    person_T104,
    person_T105,
    person_T106,
    person_T107,
    person_T108,
    person_T109,
    person_T110,
    person_T111,
    person_T112,
    person_T113,
    person_T114,
    person_T115,
    person_T116,
    person_T117,
    person_T118,
    person_T119,
    person_T120,
    person_T121,
    person_T122,
    person_V101,
    person_V102,
    person_V103,
    person_V104,
    person_V105,
    person_V106,
    person_V107,
    person_V108,
    person_D101,
    person_D102,
    person_D103,
    person_D104,
    person_D105,
    person_D106,
    person_D107,
    person_D108,
    person_D109,
    person_D110,
    person_D111,
    person_D112,
    person_D113,
    person_D114,
    person_D115,
    person_D116,
    person_D117,
    person_D118,
    person_D119,
    person_D120,
    person_D121,
    person_D122,
    person_D123,
    person_D124,
    person_D125,
    person_D126,
    person_D127,
    person_D128,
    person_D129,
    person_D130,
    person_D131,
    person_D132,
    person_D133,
    person_D134,
    person_D135,
    person_D136,
    person_D137,
    person_L101,
    person_L102,
    person_L103,
    person_L104,
    person_L105,
    person_L106,
    person_L107,
    person_L108,
    person_L109,
    person_L110,
    person_L111,
    person_L112,
    person_L113,
    person_L114,
    person_L115,
    person_L116,
    person_L117,
    person_L118,
    person_L119,
    person_L120,
    person_L121,
    person_L122,
    person_L123,
    person_L124,
    person_L125,
    person_L126,
    person_L127,
    person_L128,
    person_L129,
    person_L130,
    person_L131,
    person_L132,
    person_L133,
    person_L134,
    person_L135,
    person_L136,
    person_L137,
    person_L138,
    person_L139,
    person_L140,
    person_L141,
    person_L142,
    person_L143,
    person_L144,
    person_C101,
    person_C102,
    person_C103,
    person_C104,
    person_C105,
    person_C106,
    person_C107,
    person_C108,
    person_C109,
    person_C110,
    person_C111,
    person_C112,
    person_C113,
    person_C114,
    person_C115,
    person_C116,
    person_C117,
    person_C118,
    person_C119,
    person_C120,
    person_C121,
    person_C122,
    person_C123,
    person_C124,
    person_C125,
    person_C126,
    person_C127,
    person_C128,
    person_C129,
    person_C130,
    person_C131,
    person_C132,
    person_CN01,
    person_CN02,
    person_CN03,
    person_CN04,
    person_CN05,
    person_CN06,
    person_CN07,
    person_CN08,
    person_CN09,
    person_CN10,
    person_CN11,
    person_CN12,
    person_CN13,
    person_CN14,
    person_CN15,
    person_CN16,
    person_LI01,
    person_LI02,
    person_LI03,
    person_LI04,
    person_LI05,
    person_LI06,
    person_LI07,
    person_LI08,
    person_LI09,
    person_LI10,
    person_LI11,
    person_LI12,
    person_LI13,
    person_LI14,
    person_LI15,
    person_LI16,
    person_LI17,
    person_LI18,
    person_LI19,
    person_LI20,
    person_LI21,
    person_LI22,
    person_LI23,
    person_LI24,
    person_LI25,
    person_LI26,
    person_LI27,
    person_LI28,
    person_LI29,
    person_LI30,
    person_U101,
    person_U102,
    person_CH01,
    person_CH02,
    person_CH03,
    person_CH04,
    person_CH05,
    person_CH06,
    person_CH07,
    person_CH08,
    person_CH09,
    person_CH10,
    person_CH11,
    person_CH12,
    person_CH13,
    person_CH14,
    person_CH15,
    person_CH16,
    person_CH17,
    person_CH18,
    person_CH19,
    person_CH20,
    person_CH21,
    person_CH22,
    person_CH23,
    person_CH24,
    person_TH01,
    person_TH02,
    person_TH03,
    person_TH04,
    person_TH05,
    person_TH06,
    person_TH07,
    person_TH08,
    person_TH09,
    person_TH10,
    person_TH11,
    person_TH12,
    person_TH13,
    person_TH14,
    person_TH15,
    person_TH16,
    person_TH17,
    person_TH18,
    person_TH19,
    person_TH20,
    person_TH21,
    person_TH22,
    person_TH23,
    person_TU01,
    person_TU02,
    person_TU03,
    person_TU04,
    person_TU05,
    person_TU06,
    person_TU07,
    person_TU08,
    person_TU09,
    person_TU10,
    person_TU11,
    person_TU12,
    person_TU13,
    person_TU14,
    person_TC01,
    person_TC02,
    person_TC03,
    person_TC04,
    person_TC05,
    person_TC06,
    person_TC07,
    person_TC08,
    person_TC09,
    person_TC10,
    person_TC11,
    person_TC12,
];

export const MOCK_FAMILIES: GrampsFamily[] = [
    family_F001,
    family_F002,
    family_F003,
    family_F004,
    family_F005,
    family_F006,
    family_F007,
    family_F008,
    family_F009,
    family_F010,
    family_F011,
    family_F012,
    family_F013,
    family_F014,
    family_F015,
    family_F016,
    family_F017,
    family_F018,
    family_F019,
    family_F020,
    family_F021,
    family_F022,
    family_F023,
    family_F024,
    family_F025,
    family_F026,
    family_F027,
    family_F028,
    family_F029,
    family_F030,
    family_F031,
    family_F032,
    family_F033,
    family_F034,
    family_F035,
    family_F036,
    family_F037,
    family_F038,
    family_F039,
    family_F040,
    family_F041,
    family_F042,
    family_F043,
    family_F044,
    family_F045,
    family_F046,
    family_F047,
    family_F048,
    family_F049,
    family_F050,
    family_F051,
    family_F052,
    family_F053,
    family_F054,
    family_F055,
    family_F056,
    family_F057,
    family_F058,
    family_F059,
    family_F060,
    family_F061,
    family_F062,
    family_F063,
    family_F064,
    family_F065,
    family_F066,
    family_F067,
    family_F068,
    family_F069,
    family_F070,
    family_F071,
    family_F072,
    family_F073,
    family_F074,
    family_F075,
    family_F076,
    family_F077,
    family_F078,
    family_F079,
    family_F080,
    family_F081,
    family_F082,
    family_F083,
    family_F084,
    family_F085,
    family_F086,
    family_F087,
    family_F088,
    family_F089,
    family_F090,
    family_F091,
    family_F092,
    family_F093,
    family_F094,
    family_F095,
    family_F096,
    family_F097,
    family_F098,
    family_F099,
    family_F100,
    family_F101,
    family_F102,
    family_F103,
    family_F104,
    family_F105,
    family_F106,
    family_F107,
    family_F108,
    family_F109,
    family_F110,
    family_F111,
    family_F112,
    family_F113,
    family_F114,
    family_F115,
    family_F116,
    family_F117,
    family_F118,
    family_F119,
    family_F120,
    family_F121,
    family_F122,
    family_F123,
    family_F124,
    family_F125,
    family_F126,
    family_F127,
    family_F128,
    family_F129,
    family_F130,
    family_F131,
    family_F132,
    family_F133,
    family_F134,
    family_F135,
    family_F136,
    family_F137,
    family_F138,
    family_F139,
    family_F140,
    family_F141,
    family_F142,
    family_F143,
    family_F144,
    family_F145,
    family_F146,
    family_F147,
    family_F148,
    family_F149,
    family_F150,
    family_F151,
    family_F152,
    family_F153,
    family_F154,
    family_F155,
    family_F156,
    family_F157,
    family_F158,
    family_F159,
    family_F160,
    family_F161,
    family_F162,
    family_F163,
    family_F164,
    family_F165,
    family_F166,
    family_F167,
    family_F168,
    family_F169,
    family_F170,
    family_F171,
    family_F172,
    family_F173,
    family_F174,
    family_F175,
    family_F176,
    family_F177,
    family_F178,
    family_F179,
    family_F180,
    family_F181,
    family_F182,
];
