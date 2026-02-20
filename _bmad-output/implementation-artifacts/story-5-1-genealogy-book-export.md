---
id: 5.1
title: Genealogy Book Export — Xuất sách gia phả dạng văn bản
epic: 5 - Genealogy Book & Print
status: planned
assigned: dev
planned: 2026-02
---

# Story 5.1: Xuất Sách Gia Phả Dạng Văn Bản

## User Story

As a **family member / elder**,
I want to export the genealogy data as a formatted book-style text document,
So that I can print it, distribute to family members, and easily look up lineage information offline.

## Bối Cảnh

Nhiều thành viên dòng họ (đặc biệt người lớn tuổi) cần tra cứu thông tin gia phả ở dạng in giấy — không phải ai cũng dùng web. Tính năng này chuyển dữ liệu cây gia phả thành **sách gia phả** định dạng HTML/PDF có cấu trúc rõ ràng, dễ in, dễ tra cứu.

## Nội Dung Sách Gia Phả

### 1. Trang bìa
- Tên dòng họ: "GIA PHẢ DÒNG HỌ LÊ HUY"
- Năm xuất bản / ngày xuất
- Số thế hệ, tổng số thành viên

### 2. Mục lục
- Danh sách các đời (thế hệ) có link/trang
- Chỉ mục tên theo alphabet

### 3. Lời tựa / Giới thiệu
- Tổng quan dòng họ
- Thông tin tổ tiên đầu tiên

### 4. Nội dung chính — Theo từng đời

Mỗi đời (thế hệ) là một chương:

```
═══════════════════════════════════════
  ĐỜI THỨ I — THỦY TỔ
═══════════════════════════════════════

┌─────────────────────────────────────┐
│  LÊ VĂN TỔ (1880 – 1950)          │
│  Vợ: Nguyễn Thị Từ (1885 – 1960)  │
│                                     │
│  Con:                               │
│    1. Lê Văn Nhất (1910 – 1975)    │
│    2. Lê Văn Nhị (1913 – 1985)     │
└─────────────────────────────────────┘

═══════════════════════════════════════
  ĐỜI THỨ II
═══════════════════════════════════════

┌─────────────────────────────────────┐
│  1. LÊ VĂN NHẤT (1910 – 1975)     │
│  Cha: Lê Văn Tổ                    │
│  Vợ: Trần Thị Một (1914 – 1988)   │
│                                     │
│  Con:                               │
│    1. Lê Văn Đức (1938 – nay)      │
│    2. Lê Thị Hương (1943 – nay)    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  2. LÊ VĂN NHỊ (1913 – 1985)      │
│  Cha: Lê Văn Tổ                    │
│  Vợ: Phạm Thị Hai (1920 – 1995)   │
│                                     │
│  Con:                               │
│    1. Lê Văn Hoàng (1942 – 2020)   │
│    2. Lê Văn Thắng (1945 – nay)    │
└─────────────────────────────────────┘
```

### 5. Phụ lục
- Bảng tổng hợp thống kê (số người mỗi đời, sống/mất)
- Chỉ mục tên A-Z với số trang/đời

### 6. Format xuất
- **HTML** — mở trực tiếp trên trình duyệt, hỗ trợ in (print CSS)
- **PDF** (optional phase 2) — dùng thư viện generate từ HTML

## Acceptance Criteria

- [ ] AC1: Trang `/book` hoặc `/export/book` hiển thị sách gia phả full-page
- [ ] AC2: Sách có trang bìa, mục lục, nội dung theo đời, phụ lục
- [ ] AC3: Mỗi người chính tộc (Lê) có entry riêng với đầy đủ: tên, năm sinh/mất, cha mẹ, vợ/chồng, danh sách con
- [ ] AC4: Ngoại tộc được ghi nhận bên cạnh người chính tộc (vai trò vợ/chồng)
- [ ] AC5: Có nút "In sách" — trigger browser print dialog với CSS tối ưu cho in
- [ ] AC6: Layout trang in đúng A4, font serif dễ đọc, nội dung chia trang hợp lý
- [ ] AC7: Có chỉ mục tên A-Z ở cuối sách
- [ ] AC8: Privacy filter tuân thủ — người còn sống bị filter theo role

## Technical Approach

### Frontend — `/app/(main)/book/page.tsx`

1. Fetch genealogy data (reuse existing API/mock)
2. Organize by generation:
   - Duyệt cây BFS từ thủy tổ, gán đời cho mỗi người
   - Group theo đời, sort theo thứ tự sinh
3. Render HTML book layout:
   - CSS `@media print` cho layout A4
   - Font: Noto Serif Vietnamese (Google Fonts)
   - Page breaks giữa các đời
4. Nút "In sách" → `window.print()`

### Data Structures

```typescript
interface BookPerson {
  handle: string;
  name: string;
  gender: number;
  birthYear?: number;
  deathYear?: number;
  isLiving: boolean;
  isPatrilineal: boolean;
  generation: number;
  father?: string;        // tên cha
  mother?: string;        // tên mẹ
  spouse?: string;        // tên vợ/chồng
  spouseNote?: string;    // (ngoại tộc)
  children: string[];     // danh sách tên con
  childIndex?: number;    // thứ tự con (1, 2, 3...)
}

interface BookChapter {
  generation: number;
  title: string;          // "ĐỜI THỨ I — THỦY TỔ"
  members: BookPerson[];
}

interface BookData {
  familyName: string;
  exportDate: string;
  totalGenerations: number;
  totalMembers: number;
  chapters: BookChapter[];
  nameIndex: { name: string; generation: number }[];
}
```

### Files Needed

| File | Type | Description |
|------|------|-------------|
| `frontend/src/app/(main)/book/page.tsx` | NEW | Book page component |
| `frontend/src/lib/book-generator.ts` | NEW | Transform tree data → BookData |
| `frontend/src/app/(main)/book/print.css` | NEW | Print-optimized CSS |

### Print CSS Strategy

```css
@media print {
  body { font-family: 'Noto Serif', serif; font-size: 11pt; }
  .no-print { display: none; }
  .page-break { page-break-before: always; }
  .chapter { page-break-inside: avoid; }
  @page { size: A4; margin: 2cm; }
}
```

## Tasks

- [ ] T1: Tạo `book-generator.ts` — transform tree data → BookData
- [ ] T2: Tạo `/book/page.tsx` — render sách gia phả
- [ ] T3: Style trang bìa + mục lục
- [ ] T4: Render nội dung từng đời (chapters)
- [ ] T5: Tạo chỉ mục tên A-Z (phụ lục)
- [ ] T6: Print CSS cho A4
- [ ] T7: Thêm link "Sách gia phả" vào sidebar navigation
- [ ] T8: Test in / print preview

## Dependencies

- Dữ liệu genealogy (mock hoặc API) — đã có sẵn
- Font Noto Serif Vietnamese — cần import từ Google Fonts
