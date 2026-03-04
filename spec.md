# Bloom Preorder

## Current State
A full preorder landing page for Bloom Styling Glue™ with:
- Navbar, Hero, Product Showcase, Social Proof Counter, Preorder Form (COD), FAQ, Footer
- Admin dashboard with password gate and order management table
- Framer Motion (motion/react) already installed and used for scroll-triggered fade-in/slide animations
- Poppins font, pink/white/dark-gray palette via OKLCH tokens
- Tailwind custom animations: float, pulse-soft, fade-up, accordion
- No page-load intro animation exists; the page just fades in via the `motion.div` root wrapper

## Requested Changes (Diff)

### Add
- Page-load intro/splash animation: a brief branded splash screen that plays when the site first opens, transitions out, then reveals the full page. Should feel premium and feminine — the Bloom logo/name animates in, a subtle pink bloom/petal effect, then the overlay fades away smoothly into the hero.
- Floating petal particles in the hero background (CSS-only or lightweight canvas) for extra visual depth on load.
- `will-change: transform` and `contain: paint` hints on heavy animated elements.

### Modify
- Improve mobile responsiveness: hero text sizing, product showcase grid, admin dashboard table (horizontal scroll on small screens already exists but ensure padding/spacing is tight), preorder form field layout.
- Smooth transition improvements: ensure all `whileInView` animations have consistent `viewport={{ once: true }}` so they don't re-trigger on scroll back.
- Ensure all sections have correct `scroll-margin-top` so navbar doesn't overlap when scrolling to anchors.
- Add `loading="lazy"` to the product showcase image (already done for hero with `eager`).

### Remove
- Nothing to remove.

## Implementation Plan
1. Create a `SplashScreen` component in App.tsx that:
   - Renders as an overlay (`fixed inset-0 z-[100]`) with the bloom-hot-pink/blush gradient background.
   - Animates the Bloom logo + "Bloom Styling Glue™" text in with a spring stagger.
   - Shows a brief shimmer/petal bloom effect.
   - After ~1.8s auto-exits with a smooth fade+scale-up exit animation, revealing the page beneath.
   - Uses a `useState` flag `splashDone` in the App root; once true, unmount the splash.
   - Only shows once per session (sessionStorage flag so admin navigation doesn't re-trigger it).
2. Add floating petal particles to HeroSection: 6-8 small rounded divs with random positions, using CSS animation (`animate-float` with staggered delays) for a gentle drifting effect.
3. Fix `scroll-margin-top` on all section elements (add `pt-20` or `scroll-mt-20` on sections to clear the fixed navbar).
4. Ensure all `motion` viewport options use `once: true` consistently.
5. Validate: typecheck, lint, build pass.
