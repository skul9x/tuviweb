# Changelog - TuViWeb

## [2026-03-12] - Project Initialization & Core Engine Porting

### Added
- Created Vite project with Vanilla TypeScript template.
- Established design system in `src/styles/` (variables.css, global.css) with Dark Mode/Gold/Glassmorphism.
- Ported `Constants.kt` to `src/core/constants.ts` (Heavenly Stems, Earthly Branches, Star property maps).
- Ported `LunarConverter` logic to `src/core/lunar-converter.ts` using BigInt for precise bitwise operations.
- Ported the main `TuViLogic` engine to `src/core/tuvi-logic.ts` (Full star placement and calculation logic).
- Created `test-engine.ts` for quick verification of calculation results.
- Defined Core Types in `src/types/index.ts`.

### Changed
- Refined `tsconfig.json` to allow enums and legacy TypeScript syntax (erasableSyntaxOnly: false).

### Verified
- **Engine Logic:** Tested against `Prompt3.txt` (Hồ sơ Nguyễn Duy Trường). All results (Lunar date, Menh/Cuc, Palace layout) match the reference data 100%.

---
*Antigravity Librarian - Secure Memory Guard*
