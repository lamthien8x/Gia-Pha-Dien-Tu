---
id: 2.5
title: Tree Panoramic UX — Semantic Zoom + Stats + Gen Headers + Collapsible Branches
epic: 2 - Genealogy Tree
status: done
assigned: dev
planned: 2026-02
stepsCompleted: []
tech_stack: [Next.js, TypeScript, React]
files_to_modify: [frontend/src/app/(main)/tree/page.tsx, frontend/src/lib/tree-layout.ts]
---

# Tech-Spec: Tree Panoramic UX — 4 Feature Groups

**Created:** 2026-02-21

## Overview

### Problem Statement

Khi zoom toàn cảnh cây gia phả 356 thành viên (zoom < 30%), các card trở thành chấm nhỏ vô nghĩa — không đọc được tên, không phân biệt nhánh, mất hoàn toàn giá trị hiển thị. Người dùng cần overview có ý nghĩa ở mọi mức zoom.

### Solution

Triển khai 4 nhóm tính năng song song trên cùng tree page:

| # | Tính năng | Giải quyết vấn đề |
|---|---|---|
| F1 | **Semantic Zoom (LOD)** | Card tự thay đổi nội dung theo zoom level |
| F2 | **Generation Row Headers** | Thanh đời cố định bên trái viewport |
| F3 | **Stats Overlay Panel** | Panel thống kê khi zoom rất nhỏ |
| F4 | **Collapsible Branches** | Thu gọn/mở rộng nhánh, hiện card tổng hợp |

### Scope

**In Scope:**
- 4 nhóm tính năng trên, chỉ frontend
- Sử dụng dữ liệu mock đã có (356 người, 15 đời)
- Pure CSS + React state, không thêm thư viện ngoài

**Out of Scope:**
- Thống kê địa lý (chưa có data quê quán đầy đủ)
- Backend API changes
- Chart thư viện bên ngoài (dùng CSS thuần)

---

## Context for Development

### Codebase Patterns

- **Component structure:** Tree page là single-file component `page.tsx` (636 lines)
- **Layout engine:** `tree-layout.ts` tính position cho mỗi node
- **Transform state:** `{ x, y, scale }` quản lý pan/zoom
- **Viewport culling:** Chỉ render visible nodes (performance optimization)
- **Memoized cards:** `MemoPersonCard` dùng `React.memo` với shallow comparison

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `frontend/src/app/(main)/tree/page.tsx` | Main tree page — sẽ modify |
| `frontend/src/lib/tree-layout.ts` | Layout engine — types & computeLayout |
| `frontend/src/lib/mock-genealogy.ts` | Mock data — MOCK_TREE_NODES, MOCK_FAMILIES |

### Technical Decisions

1. **Semantic Zoom dùng CSS transform thay vì re-render**: Thay đổi CSS classes dựa trên `transform.scale`, không re-compute layout
2. **Generation headers dùng absolute positioning + transform sync**: Overlay bên trái viewport, update position theo transform state
3. **Stats panel là React portal / overlay**: Xuất hiện/ẩn dựa trên zoom threshold, không tương tác với layout
4. **Collapsible branches dùng React state + layout re-compute**: Khi collapse, ẩn subtree nodes khỏi layout, thay bằng 1 summary card. Click expand → re-show nodes gốc

---

## Implementation Plan

### Feature 1: Semantic Zoom (Level of Detail)

#### Concept

```
zoom > 60%  →  FULL    (card đầy đủ: avatar, tên, năm, badge đời, trạng thái)
zoom 30-60% →  COMPACT (chỉ tên + badge đời, thu nhỏ card)
zoom < 30%  →  MINI    (chỉ chấm tròn màu + tooltip on hover)
```

#### Tasks

- [ ] **T1.1:** Tạo `ZoomLevel` type và hàm `getZoomLevel(scale: number)`
  - File: `page.tsx`
  - `type ZoomLevel = 'full' | 'compact' | 'mini'`
  - Thresholds: `>0.6 = full`, `0.3-0.6 = compact`, `<0.3 = mini`

- [ ] **T1.2:** Tạo component `CompactCard` cho zoom 30-60%
  - File: `page.tsx`
  - Chỉ hiện: tên (truncated) + "Đời X"
  - Kích thước nhỏ hơn: chiều cao ~40px thay vì 80px
  - Giữ màu nền theo giới tính/chính tộc

- [ ] **T1.3:** Tạo component `MiniDot` cho zoom < 30%
  - File: `page.tsx`
  - Circle 12x12px với màu: xanh (nam chính tộc), hồng (nữ), xám (ngoại tộc)
  - Tooltip hiện tên khi hover

- [ ] **T1.4:** Update `PersonCard` render logic
  - File: `page.tsx`
  - Switch render dựa trên `zoomLevel` prop
  - Truyền `zoomLevel` từ `useMemo` computed từ `transform.scale`

#### Acceptance Criteria (F1)

- [ ] AC1.1: Given zoom > 60%, When hiện tree, Then card đầy đủ như hiện tại
- [ ] AC1.2: Given zoom 30-60%, When hiện tree, Then chỉ thấy tên + đời, card nhỏ gọn
- [ ] AC1.3: Given zoom < 30%, When hiện tree, Then chỉ thấy chấm tròn màu
- [ ] AC1.4: Given zoom < 30% và hover mini dot, When hover, Then tooltip hiện tên + đời
- [ ] AC1.5: Given chuyển zoom level, When zoom in/out, Then transition mượt (CSS transition)

---

### Feature 2: Generation Row Headers

#### Concept

Bên trái viewport, hiện thanh header cho mỗi đời:

```
┌──────────────┬──────────────────────────────────────────┐
│ Đời 1 - 1    │  [card] ─── [card]                       │
│ Đời 2 - 2    │  [card]  [card]                           │
│ Đời 3 - 3    │  [card] [card] [card]                     │
│ ...          │                                           │
│ Đời 13 - 119 │  [card][card][card]...[card][card]        │
└──────────────┴──────────────────────────────────────────┘
```

#### Tasks

- [ ] **T2.1:** Tạo `GenerationHeaders` component
  - File: `page.tsx`
  - Props: `generations: Map<number, number>` (gen → count), `transform`, `cardH`, `vSpace`
  - Absolute positioned overlay bên trái viewport
  - Mỗi header: "Đời X — N người"
  
- [ ] **T2.2:** Compute generation stats từ layout data
  - File: `page.tsx`
  - `useMemo` tính: mỗi generation có bao nhiêu thành viên
  - Y position = generation * (CARD_H + V_SPACE) * scale + transform.y

- [ ] **T2.3:** Style generation headers
  - Background bán trong suốt, sticky bên trái
  - Font size tự điều chỉnh theo zoom
  - Horizontal line mờ kéo dài toàn viewport (generation separator)

#### Acceptance Criteria (F2)

- [ ] AC2.1: Given tree đã load, When xem tree, Then bên trái có thanh đời
- [ ] AC2.2: Given pan/zoom tree, When di chuyển, Then thanh đời di chuyển theo chiều dọc, giữ nguyên bên trái
- [ ] AC2.3: Given mỗi thanh đời, When hiện, Then hiện "Đời X — N người"
- [ ] AC2.4: Given thanh đời, khi zoom very small, Then headers vẫn đọc được (minimum font size)

---

### Feature 3: Stats Overlay Panel

#### Concept

Khi zoom < 25%, hiện floating panel overlay góc phải:

```
┌─────────────────────────┐
│ 📊 Tổng quan            │
│ 356 thành viên          │
│ 15 đời · 182 gia đình   │
│                         │
│ Phân bố theo đời:       │
│ Đ1  █ 1                 │
│ Đ2  ██ 2                │
│ Đ3  ██ 3                │
│ ...                     │
│ Đ13 ████████████████ 119 │
│ Đ14 ████████████ 90      │
│ Đ15 ██ 13                │
│                         │
│ Trạng thái:             │
│ ● Còn sống: 234         │
│ ✝ Đã mất: 122           │
│ 🧑 Chính tộc: 310       │
│ 👤 Ngoại tộc: 46         │
└─────────────────────────┘
```

#### Tasks

- [ ] **T3.1:** Tạo `StatsOverlay` component
  - File: `page.tsx`
  - Props: `visible: boolean`, `stats: TreeStats`
  - Floating card góc phải, animated entrance
  
- [ ] **T3.2:** Tạo `TreeStats` interface và function `computeTreeStats`
  - File: `page.tsx` hoặc tách `tree-stats.ts`
  - Tính: total, per-generation counts, living/dead, patrilineal/non

- [ ] **T3.3:** Implement bar chart phân bố đời (CSS thuần)
  - Horizontal bars, proportional width
  - Màu gradient theo đời (càng trẻ càng đậm)

- [ ] **T3.4:** Hook stats panel vào zoom state
  - Show khi `transform.scale < 0.25`
  - Fade in/out animation
  - Panel có nút đóng (X) để user hide thủ công

#### Acceptance Criteria (F3)

- [ ] AC3.1: Given zoom < 25%, When hiện tree, Then stats panel xuất hiện
- [ ] AC3.2: Given zoom > 25%, When zoom in, Then stats panel ẩn đi
- [ ] AC3.3: Given stats panel hiện, When xem, Then có đúng tổng số thành viên
- [ ] AC3.4: Given stats panel hiện, When xem bar chart, Then phân bố đúng per-generation
- [ ] AC3.5: Given stats panel hiện, When nhấn X, Then panel đóng lại (user override)

---

### Feature 4: Collapsible Branches (Thu gọn/Mở rộng nhánh)

#### Concept

Mỗi node có con được thêm nút toggle (▼/▶). Khi thu gọn, toàn bộ subtree ẩn đi và thay bằng **1 summary card** hiện thống kê nhánh:

```
  ┌──────────────────────┐
  │  Lê Huy Kiểm         │ ← parent card (có nút ▼)
  │  Đời 3 · Lê          │
  └──────────┬───────────┘
             │
  ┌──────────▼───────────┐
  │  📦 Nhánh: 45 người  │ ← summary card (click để mở)
  │  Đời 4 → 15          │
  │  🟢 32 sống · ✝ 13   │
  └──────────────────────┘

Khi expand (click summary card hoặc nút ▶):

  ┌──────────────────────┐
  │  Lê Huy Kiểm    ▼   │
  └──────────┬───────────┘
        ┌────┼────┐
       [con1] [con2] [con3]
         │     │
        ...   ...
```

#### Data Structure

```typescript
interface BranchSummary {
  parentHandle: string;        // handle của node cha
  totalDescendants: number;    // tổng con cháu
  generationRange: [number, number]; // [min, max] đời
  livingCount: number;
  deceasedCount: number;
  patrilinealCount: number;
}
```

#### Tasks

- [ ] **T4.1:** Thêm `collapsedBranches: Set<string>` state vào TreeViewPage
  - File: `page.tsx`
  - State lưu `Set` các `parentHandle` đang bị thu gọn
  - Toggle function: `toggleCollapse(handle: string)`

- [ ] **T4.2:** Tạo function `computeBranchSummary(handle, nodes, families)`
  - File: `page.tsx` hoặc `tree-layout.ts`
  - BFS/DFS từ handle → đếm descendants, generation range, living/dead
  - Memoize bằng `useMemo` theo layout data

- [ ] **T4.3:** Tạo `BranchSummaryCard` component
  - File: `page.tsx`
  - Kiểu card đặc biệt: nền vàng/gradient, icon 📦
  - Hiện: "X người · Đời A→B · N sống / M mất"
  - Click → expand branch (remove from collapsed set)
  - Kích thước = `CARD_W × CARD_H` (cùng kích thước card thường)

- [ ] **T4.4:** Thêm nút toggle (▼/▶) trên PersonCard có con
  - File: `page.tsx` trong `PersonCard` component
  - Chỉ hiện khi node có children (check families)
  - Click ▼ → collapse, ▶ → expand
  - Icon nhỏ góc phải dưới card

- [ ] **T4.5:** Update layout computation khi có collapsed branches
  - File: `page.tsx`
  - Filter nodes: ẩn tất cả descendants của collapsed handles
  - Thêm 1 placeholder node cho mỗi collapsed branch (summary card position)
  - Re-compute layout chỉ với visible nodes + placeholder

- [ ] **T4.6:** Update connection rendering cho collapsed branches
  - File: `page.tsx`
  - Parent → summary card: 1 vertical line (giống parent-child)
  - Summary card không có connections xuống dưới

#### Acceptance Criteria (F4)

- [ ] AC4.1: Given node có con, When hover card, Then thấy nút toggle ▼
- [ ] AC4.2: Given click ▼, When collapse, Then subtree ẩn và thay bằng summary card
- [ ] AC4.3: Given summary card hiện, When xem, Then đúng số người + range đời + sống/mất
- [ ] AC4.4: Given click summary card hoặc ▶, When expand, Then subtree hiện lại đầy đủ
- [ ] AC4.5: Given collapse 1 nhánh, When layout re-compute, Then cây co lại (width giảm)
- [ ] AC4.6: Given collapse multiple branches, When xem tree, Then mỗi branch có summary card riêng

## Additional Context

### Dependencies

- Không thêm thư viện ngoài — tất cả CSS thuần + React built-in
- Dữ liệu mock đã có: `MOCK_TREE_NODES` (356 nodes), `MOCK_FAMILIES` (182 families)

### Testing Strategy

- **Visual:** Browser test zoom in/out, verify card transitions
- **Manual:** Pan/zoom confirm header alignment
- **TypeScript:** `tsc --noEmit` pass

### Implementation Order

```
T4.1 → T4.2 → T4.3 → T4.4 → T4.5 → T4.6  (Collapsible Branches - giảm tải visual)
T1.1 → T1.2 → T1.3 → T1.4                  (Semantic Zoom - LOD)
T2.1 → T2.2 → T2.3                          (Generation Headers - orientation)
T3.1 → T3.2 → T3.3 → T3.4                  (Stats Panel - overview)
```

### Notes

- Performance: Ensure LOD switching doesn't cause re-render storms (use `useMemo` for zoom level)
- Accessibility: Mini dots need `aria-label` for screen readers
- Mobile: Stats panel should be full-width on small screens
