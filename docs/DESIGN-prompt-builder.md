# 🎨 DESIGN: JSON Prompt Builder

**Ngày tạo:** 2026-03-12
**Nguồn:** `GeminiClient.kt` lines 174–1394

---

## 1. Data Flow

```
UserInput → TuViLogic.anSao() → LasoData → buildPromptJson() → JSON (~1500 dòng) → Gemini AI
                                                                                   → 📋 Copy
```

`buildPromptJson()` KHÔNG thay đổi engine. Chỉ đọc `LasoData` và chuyển đổi sang JSON chuyên gia.

---

## 2. Function Mapping: Kotlin → TypeScript

| # | Kotlin (`GeminiClient.kt`) | TypeScript (`prompt-builder.ts`) | Loại |
|---|---|---|---|
| 1 | `constructPrompt()` | `buildPromptJson(data: LasoData): string` | Entry |
| 2 | `buildAbsoluteRulesJson()` | `buildAbsoluteRules(data)` | Tĩnh* |
| 3 | `buildPipelineJson()` | `buildPipeline()` | Tĩnh |
| 4 | `buildMethodsJson()` | `buildMethods()` | Tĩnh |
| 5 | `buildPalaceMethodJson()` | `buildPalaceMethod()` | Tĩnh |
| 6 | `buildOutputFormatJson()` | `buildOutputFormat(data)` | Tĩnh* |
| 7 | `buildNotationJson()` | `buildNotation()` | Tĩnh |
| 8 | `buildMistakesJson()` | `buildMistakes()` | Tĩnh |
| 9 | `buildChartDataJson()` | `buildChartData(data)` | Động |
| 10 | `buildPalacesJsonArray()` | `buildPalaces(cungList)` | Động |
| 11 | `parseStarToJson()` | `parseStar(raw, isMain)` | Động |
| 12 | `buildAxisMappingJson()` | `buildAxisMapping(cungList)` | Động |
| 13 | `buildTuHoaSummaryJson()` | `buildTuHoaSummary(cungList)` | Động |
| 14 | `detectBoSao()` | `detectBoSao(cungList)` | Động |
| 15 | `parsePhiTinhToJson()` | `parsePhiTinh(raw)` | Chuyển đổi |
| 16 | `parseDaiVanToJson()` | `parseDaiVan(raw)` | Chuyển đổi |

> *Tĩnh**: Hầu hết tĩnh nhưng cần `data` cho child rule hoặc viewing mode.

---

## 3. Star Classification

```typescript
const SAT_TINH = new Set([
  "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh",
  "Địa Không", "Địa Kiếp", "Thiên Hình", "Kiếp Sát"
]);

const CAT_TINH = new Set([
  "Văn Xương", "Văn Khúc", "Tả Phù", "Hữu Bật",
  "Thiên Khôi", "Thiên Việt", "Lộc Tồn", "Thiên Mã",
  "Đào Hoa", "Hồng Loan", "Thiên Hỷ", "Long Trì",
  "Phượng Các", "Thiên Đức", "Nguyệt Đức", "Ân Quang",
  "Thiên Quý", "Thiên Quan", "Thiên Phúc", "Quốc Ấn",
  "Đường Phù", "Thai Phụ", "Phong Cáo", "Tam Thai",
  "Bát Tọa", "Thiên Giải", "Địa Giải", "Giải Thần"
]);
```

**Logic:** Tứ hóa `(...)` → `tu_hoa` > Chính tinh → `main_star` > SAT_TINH → `sat_tinh` > CAT_TINH → `cat_tinh` > Còn lại → `sub_star`

---

## 4. Palace JSON Format

```typescript
interface PalaceJson {
  name: string;               // "Tuất"
  element: string;            // "Thổ"
  function: string;           // "Mệnh"
  flags?: string[];           // ["Gặp Tuần", "Cung Đại Vận"]
  fixed_stars: StarJson[];    // Sao bản mệnh
  transit_stars?: StarJson[]; // Sao vận hạn (ĐV. + L.)
}

interface StarJson {
  name: string;
  type: "main_star" | "sat_tinh" | "cat_tinh" | "sub_star" | "tu_hoa";
  state?: string;            // "M" | "V" | "Đ" | "Bình" | "H"
  flags?: string[];          // ["BỊ TUẦN KHÔNG"]
}
```

**Tách sao:**
- Không prefix → `fixed_stars`
- `ĐV.` / `(ĐV.` → `transit_stars`
- `L.` / `(L.` → `transit_stars`
- `[Cung Đại Vận]` → `flags`

---

## 5. parseStar Logic

**Input:** `"Phá Quân (Đ) [BỊ TUẦN KHÔNG]"`

```
1. Tách flags: /\[([^\]]+)\]/g → ["BỊ TUẦN KHÔNG"]
2. Xóa flags → "Phá Quân (Đ)"
3. Nếu "(X)" → {name: "X", type: "tu_hoa"}
4. Tách state: /^(.+?)\s*\(([MVĐHB]|Bình)\)$/
5. Xóa prefix ĐV./L. → baseName
6. Phân loại type theo baseName
```

**Output:** `{name: "Phá Quân", state: "Đ", type: "main_star", flags: ["BỊ TUẦN KHÔNG"]}`

---

## 6. Phi Tinh & Đại Vận Conversion

### Phi Tinh: `"Tý(Nhâm): H.Lộc→Tỵ, H.Quyền→Thìn, ..."` →
```json
{ "Tý": { "can": "Nhâm", "lộc": "Tỵ", "quyền": "Thìn", "khoa": "Tỵ", "kỵ": "Tý" } }
```
Regex: `/^(\S+)\((\S+)\):\s*(.+)$/` per line, `/H\.(\S+)→(\S+)/g` per part.

### Đại Vận: `"4–13: Canh Tuất | 14–23: Tân Hợi | ..."` →
```json
[{ "age": "4–13", "can": "Canh", "cung": "Tuất" }, ...]
```
Regex: `/^(\d+[–-]\d+):\s*(\S+)\s+(\S+)$/` per segment.

---

## 7. Star Formation Detection (detectBoSao)

| Bộ | Sao | Điều kiện |
|---|---|---|
| Sát Phá Tham | Thất Sát + Phá Quân + Tham Lang | 3 sao cùng tam hợp |
| Tử Phủ Vũ Tướng | Tử Vi + Thiên Phủ + Vũ Khúc + Thiên Tướng | 4 sao cùng hội hợp (tam hợp + đối cung) |
| Cơ Nguyệt Đồng Lương | Thiên Cơ + Thái Âm + Thiên Đồng + Thiên Lương | 4 sao cùng hội hợp |
| Nhật Nguyệt | Thái Dương + Thái Âm | Đồng cung / Đối chiếu / Hội chiếu |

---

## 8. Top-Level JSON Structure

```
role → style → methodology_sources → objective
→ absolute_rules → priority_rules
→ analysis_pipeline (steps 1–4) → analysis_methods (m1–m7)
→ palace_analysis_method → analysis_order → output_format
→ notation_rules → common_mistakes → reasoning_rules
→ chart_data { person, metadata, phi_tinh_tu_hoa, tu_hoa_summary,
               tu_hoa_10_can, palaces[12], fortune_context, fortune_request }
```

---

## 9. Acceptance Criteria

| # | Tiêu chí |
|---|----------|
| 1 | Output là valid JSON (`JSON.parse()` không lỗi) |
| 2 | `chart_data.palaces.length === 12` |
| 3 | Mỗi sao có field `type` |
| 4 | `tu_hoa_summary` có `ban_menh`, `dai_van`, `luu_nien` |
| 5 | `phi_tinh_tu_hoa` có 12 keys |
| 6 | Flags đúng (Tuần/Triệt/Vô chính diệu) |
| 7 | Sao ĐV./L. nằm trong `transit_stars` |
| 8 | `style.tone` thay đổi theo `ReadingStyle` |
| 9 | So sánh cùng input Prompt3.txt → cùng structure |
