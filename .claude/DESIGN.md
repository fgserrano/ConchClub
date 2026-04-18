# Design System Specification: The Analog Archivist
 
## 1. Overview & Creative North Star
 
### Creative North Star: "The Curated Shelf"
This design system moves away from the sterile, flat aesthetics of modern SaaS and leans into the tactile, warm, and archival world of a classic VHS rental store. We are not just building an interface; we are building a library. The goal is to make the user feel like they are standing in a dimly lit aisle, surrounded by the warmth of wood shelves and the vibrant, chaotic promise of a thousand stories. The experience should feel like running your fingers across sun-bleached tape spines on a heavy oak shelf.
 
### Breaking the Template

We move beyond the "flat grid" by embracing **Intentional Density**. The layout should feel "stuffed" but expertly curated. We utilize a "Shelf-Logic" navigation where horizontal rows aren't just carousels—they are physical containers with weight. The increased `spacing` (set to `2` for 'Normal') supports this, providing enough room for elements to breathe without feeling sparse, enhancing the spacious, editorial feel of a well-organized library.

- **Asymmetry:** We lean into varying widths for VHS spine-style cards to mimic a real shelf.

- **Overlapping Elements:** Navigation labels and "Rental Stickers" (CTAs) should slightly overlap their parent containers, breaking the rigid containment of modern UI.
 
---
 
## 2. Colors
 
Our palette is rooted in the "Golden Hour" of the 1980s—creamy, sun-saturated bases punctuated by the deep, functional colors of commercial packaging.

### Accent Colors
- `accent-forest` (`#2A5A35`) – Deep forest green. Used for "Staff Pick" spine indicators and other positive accent moments.
- `accent-navy` (`#1D3557`) – Deep navy blue. Available for accent use where a cool, archival tone is needed.
- `accent-terracotta` (`#a23e2a`) – Matches `tertiary`. Used for "New Release" spine indicators and critical alerts.
 
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined through background color shifts. Use `surface-container-low` to sit against a `surface` background. The eye should perceive the edge through a change in "material," not a drawn line.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the surface-container tiers to create nested depth:
- **Base Layer:** `surface` (#fff9ec) – The "wall" of the shop.
- **Sectional Layer:** `surface-container-low` (#fff4c7) – Large organizational zones.
- **Interactive Layer:** `surface-container` (#ffefa0) or `surface-container-high` (#fae996) – The "shelf" or "tape box" itself.
 
### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating elements (like navigation bars or pop-over menus). Apply `surface-container-lowest` with a 70% opacity and a `backdrop-blur` of 12px. 
 
---
 
## 3. Typography
 
The typography strategy is a collision of two worlds: the technical precision of the machine and the warmth of the human hand.
 
*   **Display & Headlines (Space Grotesk):** This font brings a "slightly technical" feel, reminiscent of the dot-matrix labels and OCR fonts found on archival equipment. It feels modern but retains a utilitarian, mid-century edge.
*   **Body & Titles (Work Sans):** We swap to Work Sans for long-form reading. It is friendly, legible, and bridges the gap between the display font's geometry and the tactile atmosphere.
*   **The "Label" Aesthetic:** Use `label-md` and `label-sm` in all-caps with generous letter-spacing (0.05em) to mimic the printed labels on the spine of a tape.
 
---
 
## 4. Elevation & Depth
 
We reject traditional box shadows in favor of **Tonal Layering**.
 
*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The minute shift in creaminess creates a soft, natural lift that mimics heavy cardstock.
*   **Ambient Shadows:** For "floating" elements like Modals or Tooltips, shadows must be extra-diffused. 
    *   *Blur:* 24px - 40px. 
    *   *Opacity:* 6%. 
    *   *Color:* Use a tinted version of `on_surface` (#211b00) to ensure the shadow feels like a warm glow rather than a grey smudge.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** High-contrast `primary` background with `on_primary` text. No border. Radius: `sm` (0.125rem) to mimic a sharp, physical button.
*   **Secondary:** `secondary_container` background. Use `md` (0.375rem) corners to soften the secondary action.
*   **Hover State:** Shift the background color one tier higher (e.g., from `surface-container` to `surface-container-high`) rather than changing the color hue.
 
### Cards & Lists
*   **Rule:** Forbid the use of divider lines.
*   **Execution:** Separate list items with 16px of vertical white space (Spacing Scale). For cards, use `surface-container-lowest` with a "Ghost Border" (15% `outline-variant`) to provide just enough definition against the `surface`.
 
### Chips
*   **Selection Chips:** Use `tertiary_container` (#ff927c) to indicate active states. These should look like small, red "Rental" stickers.
*   **Border Radius:** `full` (9999px) to contrast against the rectangular nature of the "shelves" (cards).
 
### Input Fields
*   **Style (default):** Underlined only. Use `outline` (#827661) at 40% opacity for the underline. This mimics a ledger or an archival check-out sheet. Labels should be `label-md` tucked 4px above the line.
*   **Style (overlay/dark-background variant):** When inputs appear over a full-bleed image or dark overlay (e.g. the login page), use a full border in `primary-container` at 75% opacity with `rounded-b-sm rounded-tr-sm`. Labels adopt the **Folder Tab** treatment: `block w-fit bg-primary-container/75 text-on-primary-container px-2 py-0.5 rounded-t-sm`, flush against the top of the input border with no gap. Input text uses `text-surface-lowest` (off-white) rather than the standard `text-primary-container`.
 
### Special Component: "The Spine Indicator"
A vertical bar of `accent-terracotta` or `accent-forest` placed on the left edge of a card, list item, or page to indicate a "New Release" or "Staff Pick," mirroring the colored stickers on a tape spine. The bar must be **fully opaque and solid** — no gradients, no transparency. Width is typically `w-1.5` (6px) for page-level indicators and `w-1` (4px) for card-level indicators.

### Text Legibility on Overlays
When display text or labels appear over a full-bleed background image, apply a layered `text-shadow` to lift the text without altering its color:
```
textShadow: '0 0 16px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.85)'
```
This creates a soft dark halo (ambient) paired with a tight grounding shadow. It should feel like depth, not a visible drop shadow.
 
---
 
## 6. Do’s and Don'ts
 
### Do
*   **DO** use "staggered" layout grids. If you have a row of three cards, give the middle one a slightly different height or a subtle vertical offset (4-8px).
*   **DO** embrace the "Creamy Goldenrod" (`surface`). White space is not white; it is the color of aged paper.
*   **DO** use `tertiary` (#a23e2a) for critical alerts. It has the authoritative feel of a "BE KIND, REWIND" sticker.
 
### Don't
*   **DON'T** use pure blacks (#000000). Use `on_surface` (#211b00) for all "black" text to maintain warmth.
*   **DON'T** use sharp, high-contrast shadows. If you can see where the shadow ends, it's too dark.
*   **DON'T** use 100% opaque dividers. If you need a break, use a background color shift or 24px of empty space.
*   **DON'T** use "Standard" Material icons. Source icons that have a slightly heavier weight and rounded terminals to match the tactile atmosphere.