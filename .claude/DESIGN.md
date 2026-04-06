# Design System: Midnight Rental & Arcade

## 1. Overview & Creative North Star

**Creative North Star: The Electric After-Hours**
This design system is not a mere "retro" skin; it is a high-end editorial recreation of a specific atmospheric memory: walking through a video rental store at midnight, where the only light sources are the hum of neon signs, the flicker of CRT monitors, and the glow of arcade cabinets. 

To move beyond generic 80s tropes, we employ **"Radiant Brutalism."** We embrace the rigid, sharp-edged geometry of the 0px border-radius scale (Physicality) and disrupt it with soft, organic light leaks and high-contrast color shifts (Atmosphere). The layout should feel like a curated shelf of VHS tapes—intentional, tactile, and densely packed with character. We break the "template" look by using exaggerated typographic scales and overlapping "scanline" overlays that provide a sense of depth and motion.

---

## 2. Colors

The palette is anchored in a high-contrast relationship between deep, light-absorbing voids and hyper-saturated light sources.

*   **Primary (#ff80e4) & Secondary (#00f1fd):** These represent the "Neon Pulse." Use these sparingly for high-impact CTAs and navigational anchors.
*   **Tertiary (#ffc965):** The "Amber Alert." This is your functional highlight—used for warnings, ratings, or "New Release" badges.
*   **The "No-Line" Rule:** Standard 1px borders are strictly prohibited for structural sectioning. Boundaries between content areas must be established via color blocking (e.g., a `surface-container-low` block against a `background` base) or through the "Neon Glow" effect.
*   **Surface Hierarchy:** 
    *   `surface-container-lowest (#000000)`: Used for the "VHS tape" well or recessed arcade bays.
    *   `surface (#140727)`: The primary floor of the application.
    *   `surface-bright (#352254)`: Reserved for elevated panels that are "caught" in the neon light.
*   **The Glass & Gradient Rule:** For floating headers or navigation bars, utilize `surface` colors at 70% opacity with a heavy `backdrop-blur` (20px+). Apply a subtle linear gradient from `primary` to `primary-container` on major CTAs to simulate the way neon light reflects off plastic surfaces.

---

## 3. Typography

The typography system is a tension between the "Glitch Display" of the past and the "Precision UI" of the future.

*   **Display & Headlines:** While the token system references `Space Grotesk`, these should be styled with a custom "Retro-Futuristic" treatment. Use all-caps, wide tracking (+5%), and apply a subtle `text-shadow` in `secondary` or `primary` to create a "chromatic aberration" effect. This conveys the store’s signage and marquee energy.
*   **Body (Space Grotesk):** This is your functional workhorse. It must remain clean and legible to balance the chaotic energy of the headings. 
*   **Label Scale:** Use `label-md` and `label-sm` for technical metadata (e.g., "Runtime," "Release Date," "Credits"). These should feel like the fine print on the back of a rental box.

---

## 4. Elevation & Depth

In this system, depth is not simulated through physical height, but through **Luminance and Layering.**

*   **The Layering Principle:** Treat the UI as a series of nested "bays." Place `surface-container-highest` elements within `surface-container-low` sections to create a natural, boxy lift.
*   **Ambient Shadows:** Traditional gray shadows are forbidden. Instead, use "Glow Casts." When a card needs to float, use a wide-spread shadow (30px-50px blur) tinted with `surface_tint` at 10% opacity. This mimics the ambient light spill seen in arcade alleys.
*   **The Ghost Border Fallback:** If a container requires a boundary, use a `1px` border of `outline-variant` at 20% opacity. This creates a "wireframe" look reminiscent of early 3D computer graphics.
*   **Scanline Textures:** Apply a global fixed-position SVG overlay of horizontal lines (2px height, 4px gap) at 3% opacity. This binds the disparate UI layers into a cohesive "CRT Monitor" experience.

---

## 5. Components

### Buttons
*   **Primary:** Sharp 0px corners. Background: `primary`. Text: `on_primary`. On hover, add a `box-shadow` glow using the `primary` token.
*   **Secondary:** Sharp 0px corners. Border: 2px `secondary`. Background: Transparent. On hover, fill with 10% `secondary` opacity.

### Input Fields
*   **Style:** Recessed boxes using `surface-container-lowest`. 
*   **States:** On focus, the bottom border "ignites" with a 2px `secondary` neon line and a matching glow. Helper text should use `label-sm` in `tertiary`.

### Cards & Lists
*   **The "Tape" Card:** No dividers. Use `surface-container` shifts to separate items. A card should look like a VHS sleeve—bold imagery on top, metadata in `Space Grotesk` below. 
*   **Interactive State:** On hover, the card should slightly scale (1.02) and trigger a flicker effect in its border glow.

### Additional: The "Marquee" Chip
*   A scrolling text component (marquee) for announcements, using `tertiary_fixed` text on a `surface_container_highest` background. This mimics the scrolling LED displays found on arcade machines.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace the 0px radius. The 80s/90s aesthetic is about hard edges and modularity.
*   **Do** use intentional asymmetry. Place a pixel-art accent or a "tracking" glitch effect in the corner of a container to break the digital perfection.
*   **Do** ensure high contrast for accessibility. The `on_background` (#eee0ff) provides excellent legibility against the `background` (#140727).

### Don'ts
*   **Don't** use rounded corners. Even a 2px radius will break the "Arcade Cabinet" immersion.
*   **Don't** use standard drop shadows. If it doesn't look like light reflecting off a surface, it doesn't belong in this store.
*   **Don't** overcrowd with neon. If everything glows, nothing is important. Use the `primary` and `secondary` tokens as directional cues, not as wallpaper.