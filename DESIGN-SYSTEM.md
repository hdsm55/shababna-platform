# Shababna Design System - Modern Edition

## Overview

Modern design system inspired by Stripe, Linear, and Vercel. Features clean aesthetics, smooth animations, and consistent spacing for a world-class user experience.

## Colors

### Primary Palette

- **Primary Blue:** #0ea5e9 (600) - Main brand color
- **Primary Dark:** #0369a1 (700) - Hover states
- **Primary Light:** #e0f2fe (100) - Backgrounds

### Secondary Palette

- **Secondary Gray:** #64748b (500) - Text and borders
- **Secondary Dark:** #334155 (700) - Headings
- **Secondary Light:** #f1f5f9 (100) - Backgrounds

### Accent Palette

- **Accent Purple:** #d946ef (500) - Highlights and CTAs
- **Accent Dark:** #a21caf (700) - Hover states
- **Accent Light:** #fae8ff (100) - Backgrounds

### Semantic Colors

- **Success:** #22c55e (500) - Success states
- **Warning:** #f59e0b (500) - Warning states
- **Error:** #ef4444 (500) - Error states

### Neutral Colors

- **Neutral 50:** #fafafa - Light backgrounds
- **Neutral 100:** #f5f5f5 - Subtle backgrounds
- **Neutral 200:** #e5e5e5 - Borders
- **Neutral 300:** #d4d4d4 - Disabled states
- **Neutral 400:** #a3a3a3 - Placeholder text
- **Neutral 500:** #737373 - Secondary text
- **Neutral 600:** #525252 - Body text
- **Neutral 700:** #404040 - Headings
- **Neutral 800:** #262626 - Dark text
- **Neutral 900:** #171717 - Primary text

## Typography

### Font Stack

- **Primary:** Inter (Latin), Tajawal (Arabic)
- **Fallback:** system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

### Font Weights

- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700
- **Extrabold:** 800

### Font Sizes

- **xs:** 0.75rem (12px)
- **sm:** 0.875rem (14px)
- **base:** 1rem (16px)
- **lg:** 1.125rem (18px)
- **xl:** 1.25rem (20px)
- **2xl:** 1.5rem (24px)
- **3xl:** 1.875rem (30px)
- **4xl:** 2.25rem (36px)
- **5xl:** 3rem (48px)
- **6xl:** 3.75rem (60px)
- **7xl:** 4.5rem (72px)

## Spacing

### Standard Spacing

- **0:** 0px
- **1:** 0.25rem (4px)
- **2:** 0.5rem (8px)
- **3:** 0.75rem (12px)
- **4:** 1rem (16px)
- **5:** 1.25rem (20px)
- **6:** 1.5rem (24px)
- **8:** 2rem (32px)
- **10:** 2.5rem (40px)
- **12:** 3rem (48px)
- **16:** 4rem (64px)
- **20:** 5rem (80px)
- **24:** 6rem (96px)

### Custom Spacing

- **18:** 4.5rem (72px)
- **88:** 22rem (352px)
- **128:** 32rem (512px)
- **144:** 36rem (576px)

## Border Radius

### Standard Radius

- **none:** 0px
- **sm:** 0.125rem (2px)
- **base:** 0.25rem (4px)
- **md:** 0.375rem (6px)
- **lg:** 0.5rem (8px)
- **xl:** 0.75rem (12px)
- **2xl:** 1rem (16px)
- **3xl:** 1.5rem (24px)
- **full:** 9999px

### Custom Radius

- **4xl:** 2rem (32px)
- **5xl:** 2.5rem (40px)

## Shadows

### Standard Shadows

- **soft:** 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)
- **medium:** 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- **large:** 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.04)

### Special Effects

- **glow:** 0 0 20px rgba(14, 165, 233, 0.15)
- **glow-lg:** 0 0 40px rgba(14, 165, 233, 0.25)

## Animations

### Transitions

- **duration-200:** 200ms
- **duration-300:** 300ms
- **duration-500:** 500ms

### Keyframes

- **fadeIn:** Opacity 0 to 1
- **fadeInUp:** Opacity 0 to 1 + translateY 20px to 0
- **fadeInDown:** Opacity 0 to 1 + translateY -20px to 0
- **slideUp:** translateY 20px to 0 + opacity 0 to 1
- **slideDown:** translateY -20px to 0 + opacity 0 to 1
- **scaleIn:** Scale 0.95 to 1 + opacity 0 to 1
- **float:** Continuous floating animation

## Components

### Button

- **Variants:** primary, secondary, outline, ghost, gradient, accent, success, error
- **Sizes:** sm, md, lg, xl
- **Features:** loading state, icons, RTL support, hover effects, focus rings

### Card

- **Variants:** default, elevated, outlined, glass
- **Features:** hover effects, gradient backgrounds, RTL support, padding options

### Input

- **Variants:** default, filled, outlined
- **Sizes:** sm, md, lg
- **Features:** label, error/success states, RTL support, focus rings, icons

### Alert

- **Types:** success, error, warning, info
- **Variants:** default, filled, outlined
- **Features:** icons, RTL support, closable option

### Modal

- **Sizes:** sm, md, lg, xl, full
- **Features:** backdrop blur, smooth animations, focus management, header options

### SectionTitle

- **Variants:** default, centered, with-subtitle, gradient
- **Sizes:** sm, md, lg, xl
- **Features:** animated underline, subtitle support, gradient text option

### LoadingSpinner

- **Variants:** default, dots, pulse, bars
- **Sizes:** sm, md, lg, xl
- **Features:** smooth animations, customizable colors, text support

## Layout

### Container

- **Max Width:** 7xl (80rem/1280px)
- **Padding:** Responsive (4px on mobile, 6px on tablet, 8px on desktop)

### Section

- **Padding:** py-16 lg:py-24 (64px/96px vertical)

### Grid

- **Gap:** 8 (32px) standard, 12 (48px) for larger sections

## Utilities

### CSS Classes

- **.btn:** Base button styles
- **.btn-primary:** Primary button variant
- **.btn-secondary:** Secondary button variant
- **.btn-outline:** Outline button variant
- **.btn-ghost:** Ghost button variant
- **.card:** Base card styles
- **.card-elevated:** Elevated card variant
- **.input:** Base input styles
- **.input-error:** Error input state
- **.input-success:** Success input state
- **.section:** Standard section spacing
- **.container:** Standard container
- **.gradient-text:** Gradient text effect
- **.glass:** Glass morphism effect
- **.hover-lift:** Hover lift effect
- **.hover-glow:** Hover glow effect

## Accessibility

### Standards

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Focus indicators** on all interactive elements
- **Screen reader** friendly
- **High contrast** ratios

### RTL Support

- **Full RTL** layout support
- **Arabic font** optimization
- **Direction-aware** spacing and positioning

## Usage Guidelines

### Do's

- Use consistent spacing (4, 8, 16, 24, 32, 48, 64)
- Apply hover effects to interactive elements
- Use semantic colors for states (success, error, warning)
- Maintain proper contrast ratios
- Use smooth transitions (200-300ms)

### Don'ts

- Don't mix different design patterns
- Don't use hard-coded colors
- Don't skip focus states
- Don't use inconsistent spacing
- Don't ignore RTL considerations

## Performance

### Optimizations

- **CSS-in-JS** for dynamic styles
- **Lazy loading** for animations
- **Optimized fonts** with proper fallbacks
- **Minimal bundle** size impact

---

**Last Updated:** [Today] - Modern design system implementation complete
**Version:** 2.0.0
**Inspiration:** Stripe, Linear, Vercel
