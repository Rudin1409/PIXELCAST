---
name: Cyberfest Retro Wall
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c8c5cf'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#918f99'
  outline-variant: '#47464e'
  surface-tint: '#c3c2f2'
  primary: '#c3c2f2'
  on-primary: '#2c2c53'
  primary-container: '#1a1a40'
  on-primary-container: '#8382af'
  inverse-primary: '#5a5a84'
  secondary: '#ffffff'
  on-secondary: '#323200'
  secondary-container: '#eaea00'
  on-secondary-container: '#686800'
  tertiary: '#ffabf3'
  on-tertiary: '#5b005b'
  tertiary-container: '#3d003d'
  on-tertiary-container: '#ec00ec'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c2f2'
  on-primary-fixed: '#17173d'
  on-primary-fixed-variant: '#43436b'
  secondary-fixed: '#eaea00'
  secondary-fixed-dim: '#cdcd00'
  on-secondary-fixed: '#1d1d00'
  on-secondary-fixed-variant: '#494900'
  tertiary-fixed: '#ffd7f5'
  tertiary-fixed-dim: '#ffabf3'
  on-tertiary-fixed: '#380038'
  on-tertiary-fixed-variant: '#810081'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style
The design system captures the frenetic energy of a mid-90s arcade floor and the early web. It targets a tech-literate, nostalgic audience attending a futuristic IT festival. 

The aesthetic is **Retro-Futuristic Brutalism**. It combines the raw, jagged edges of 8-bit gaming with high-octane neon signage. The UI should feel physical, like an oversized arcade cabinet, utilizing heavy strokes, vibrant glowing accents, and intentional pixel-level imperfections. Visuals are loud, high-contrast, and unapologetically digital.

## Colors
The palette is built on a foundation of **Deep Cobalt Blue**, which serves as the canvas for high-frequency neon interactions.

- **Primary Canvas:** Deep Cobalt Blue (#1A1A40). Apply a subtle monochromatic noise grain (5% opacity) to all background surfaces to simulate an old CRT monitor.
- **Action/Highlight:** Electric Yellow (#FFFF00). Used for primary calls to action and critical status updates.
- **Vibe/Expression:** Neon Pink (#FF00FF). Used for "like" interactions, trophies, and user-generated social highlights.
- **Data/System:** Cyan (#00FFFF). Used for secondary data, timestamps, and technical metadata.
- **Structural:** Solid White (#FFFFFF) and Pure Black (#000000) are used exclusively for high-contrast borders and text backgrounds.

## Typography
The system uses a mix of technical monospace fonts and bold geometric sans-serifs to simulate a pixelated feel while maintaining modern legibility.

- **Headlines:** Space Grotesk is used with tight tracking to mimic the density of old game titles.
- **Body & UI:** JetBrains Mono provides the technical, "code-heavy" look required for an IT festival, ensuring that chat logs and data points look like terminal output.
- **Effects:** For major headings, apply a `4px 4px 0px #000000` drop shadow and a 2px stroke in a contrasting neon color to create a "sticker" effect.

## Layout & Spacing
Layouts are governed by a strict **8-pixel grid** to ensure all elements align with a "pixel-perfect" logic.

- **Grid:** Use a 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Structure:** Containers should not use soft margins; instead, they should be clearly defined by thick black borders (4px+) to create a "boxed-in" arcade feel.
- **Density:** Elements should be tightly packed. Avoid excessive white space; instead, use decorative ornaments (stars, dithered patterns) to fill "dead" zones.

## Elevation & Depth
Depth is not communicated through blurs or soft shadows, but through **Hard Offsets**.

- **Stacked Depth:** Use a "3D" offset effect where the primary surface is shifted 4px or 8px up and to the left of a solid black shadow block.
- **Active State:** When an element is pressed, it should "depress" by moving 4px down and to the right, effectively hiding its offset shadow.
- **Overlays:** Modals use a high-contrast black backdrop with 80% opacity, overlaid with a "Scanline" pattern (1px horizontal lines) to simulate old TV hardware.

## Shapes
The shape language is strictly **Rectilinear and Jagged**. 

- **Corners:** Absolutely no border-radius. Use "stepped" corners (4px notches) to simulate a pixelated curve for larger dialog boxes.
- **Borders:** All primary containers must have a 4px solid black border. 
- **Icons:** Use 16x16 or 32x32 pixel-art icons. The cursor must be a pixelated white hand with a black outline.

## Components

### Arcade Button CTAs
Large, circular (the only exception to the sharp rule) buttons with a 4px black outline and a 4px "bottom-heavy" shadow to make them look like physical plastic buttons. Labels are all-caps bold monospace.

### RPG Dialog Boxes
White backgrounds with a 4px jagged black border. Use a "blinking cursor" (solid block) at the end of the text. Include a small pixelated "down arrow" at the bottom right to indicate scrollable content.

### Chat Bubbles
Square boxes with "tails" made of 8px squares. User names are highlighted in Cyan; messages are in standard Body-MD.

### Loading Bars
A "segment" style progress bar. Instead of a smooth fill, use individual blocks (e.g., 10 segments). Fill segments with Neon Pink as they load.

### Game Ornaments
Scatter 8-bit stars (Electric Yellow) and hearts (Neon Pink) near the corners of the screen as decorative "floating" UI elements that occasionally pulse or rotate 90 degrees.