# Design

## Intent
A sharp, high-craft SaaS aesthetic that escapes the "AI default" look. It should feel like a precision instrument for professionals. We rely on strict geometry, absolute white/gray backgrounds, and highly deliberate, restrained use of the brand colors (Green/Yellow).

## Layout
- **Density:** High. Information should be compact and easy to scan.
- **Hierarchy:** Established through typography weight, spacing, and subtle 1px borders, *not* by nesting cards inside cards or using drop shadows.
- **Grids:** Asymmetrical, data-first grids.

## Components
- **Radii:** Very tight. Use 4px (`--r-sm`), 6px (`--r-md`), 8px (`--r-lg`). No massive 16px/24px pill shapes for standard containers.
- **Shadows:** Eliminated for structural elements. Reserved *only* for floating elements (dropdowns, modals) to indicate Z-axis elevation.
- **Borders:** Crisp 1px borders (`var(--border)`) used structurally to divide sections, instead of background tints.

## Typography
- **Headings:** Kanit. Tighter tracking (`letter-spacing: -0.02em`), structural weights (500, 600).
- **Body:** Inter. Crisp, legible at small sizes.
- **Data/Prices:** JetBrains Mono or similar monospaced font. Essential for aligning prices, order IDs, and calculations.

## Color
- **Surface:** Absolute stark white (`#FFFFFF`) or strict neutral grays. No warm, sandy, or green-tinted backgrounds.
- **Brand (Primary):** Forest Green `oklch(0.5 0.15 145)`. Deep, saturated, professional.
- **Accent (Secondary):** Sharp Yellow `oklch(0.85 0.18 90)`. Used sparingly to highlight critical data (like Profit) or alerts.
- **Ink:** High contrast grays (near black for primary text, cool gray for secondary).

## Anti-Patterns to Avoid
- Avoid `--shadow-sm` on every card.
- Avoid `--r-xl` or large rounded corners.
- Avoid tinting the main app background `var(--surface-2)`. Make it `#FFFFFF` or a very stark, cold gray `#F8F9FA`.
