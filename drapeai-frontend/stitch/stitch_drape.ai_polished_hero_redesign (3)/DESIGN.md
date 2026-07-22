---
name: Drape.AI Luxury Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#655e4f'
  on-secondary: '#ffffff'
  secondary-container: '#e9decc'
  on-secondary-container: '#696253'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#281809'
  on-tertiary-container: '#997f6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ece1cf'
  secondary-fixed-dim: '#d0c5b4'
  on-secondary-fixed: '#201b10'
  on-secondary-fixed-variant: '#4d4639'
  tertiary-fixed: '#fcddc4'
  tertiary-fixed-dim: '#dfc1a9'
  on-tertiary-fixed: '#281809'
  on-tertiary-fixed-variant: '#574331'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 84px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
  watermark:
    fontFamily: Bodoni Moda
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 120px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 128px
---

## Brand & Style

The design system embodies the "Quiet Luxury" movement, characterized by understated elegance, superior craftsmanship, and a focus on essential form. The target audience is the discerning fashion enthusiast who values exclusivity, high-quality materials, and a seamless, high-touch shopping experience.

The visual style is a hybrid of **Editorial Minimalism** and **Modern Glassmorphism**. It leverages expansive white space (negative space) to allow product photography to breathe, creating an atmosphere of a physical luxury boutique or a high-fashion print magazine. Parallax layering and translucent surfaces introduce a sense of physical depth and tactility, while sharp, high-contrast typography provides the authoritative voice of a premium fashion house. The emotional response should be one of calm, sophistication, and timelessness.

## Colors

The palette is rooted in earth-toned neutrals and high-contrast blacks to evoke a sense of organic luxury.

- **Primary (#111111):** A deep near-black used for primary text, iconography, and high-impact structural elements. It provides the "ink" on the page.
- **Secondary (#E5DAC8):** A soft sand tone used for subtle backgrounds, secondary containers, and soft dividers.
- **Tertiary (#5A4533):** A rich dark brown used for depth, accent text, and sophisticated hover states.
- **Accent (#C5B299):** A warm tan used for subtle highlights and complementary UI elements.
- **Pure White (#FFFFFF):** The foundational canvas color for the light mode interface, providing the necessary negative space.

## Typography

This design system utilizes a high-contrast typographic pairing to balance heritage with modernity.

- **Headlines (Bodoni Moda):** A sharp, high-contrast serif that radiates luxury and editorial authority. Use for hero sections, collection titles, and prominent product names.
- **Body & UI (Hanken Grotesk):** A clean, minimalist sans-serif that ensures high legibility for product descriptions and functional UI elements.
- **Watermark Style:** Large-scale, low-opacity serif text is used as a background texture behind product imagery to reinforce brand identity without obstructing content.
- **Spacing Note:** Generous line heights (1.6x - 1.8x) should be applied to body text to maintain the spacious, airy feel of the brand.

## Layout & Spacing

The layout philosophy is built on an **Editorial Fluid Grid**. It prioritizes extreme white space to separate different product narratives and collections.

- **The Grid:** A 12-column grid for desktop with wide 64px margins. Content should often be offset from the center or span irregular column counts (e.g., a 5-column image next to a 3-column text block) to create a dynamic, magazine-like flow.
- **Section Gaps:** Use large vertical spacing (128px+) between major sections to ensure users focus on one story at a time.
- **Mobile Reflow:** On mobile, the grid collapses to 1 or 2 columns with a 20px margin. Large display type should scale down significantly while maintaining its high-contrast serif character.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

- **Glass Surfaces:** Navigation bars, quick-view modals, and product filters use a high-blur (20px-40px) backdrop filter with a semi-transparent white or sand background (#FFFFFF10). This creates a sense of light passing through expensive materials.
- **Layering:** Subtle parallax effects should be applied to product images so they appear to float slightly above the background canvas.
- **Outlines:** Use ultra-thin (0.5px) borders in the Tan (#C5B299) or Dark Brown (#5A4533) colors for input fields and card borders to maintain a crisp, refined structure without adding visual bulk.

## Shapes

The shape language is dominated by **Pill-shaped (3)** elements and soft, organic containers. This softness offsets the sharp, angular nature of the serif typography.

- **Buttons:** Fully rounded pill shapes for all primary and secondary actions.
- **Product Cards:** Softly rounded corners (24px or `rounded-xl`) to mirror the drape of high-end fabrics.
- **Icons:** Minimalist, thin-stroke (1px) icons with slightly rounded terminals to match the UI sans-serif.

## Components

- **Buttons:** Primary buttons are solid Near-Black (#111111) with white Hanken Grotesk text in all-caps. Secondary buttons use a transparent background with a thin Tan border.
- **Product Cards:** Cards feature full-bleed imagery with minimal text overlays. Price and title appear in a subtle, semi-transparent glass panel at the bottom of the image on hover.
- **Inputs:** Underlined or thin-bordered fields with Hanken Grotesk labels. Focus states transition the border from Tan to Dark Brown.
- **Navigation:** A floating glassmorphic bar at the top of the screen. Links are in all-caps Hanken Grotesk with 0.15em letter spacing.
- **Chips/Filters:** Small, pill-shaped elements with a secondary color (#E5DAC8) background and dark brown text.
- **Watermark Labels:** Use the `watermark` typography style behind collection headers, partially obscured by product cutouts to create a 3D layered effect.