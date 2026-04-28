# Junky Rabbit Labor - Business Website

## Project Overview

A professional service website for Junky Rabbit Labor, a general labor business in the Detroit Metro area. Services include moving, junk removal, snow removal, painting, and landscaping.

Brand: lime #B8F000, dark green #2D7A1A, near-black #0d1a08, CTA orange #FF4500.
Phone: 248.818.1130 (display) / +12488181130 (tel:). NO dashes in visible copy.

## Tech Stack

- **Static Site Generator:** Eleventy (11ty) v2.0.1
- **Templating:** Nunjucks
- **Styling:** SASS/SCSS compiled to CSS
- **CMS:** Decap CMS (for blog content management)
- **JavaScript:** Vanilla JS + AOS (Animate On Scroll)
- **Package Manager:** npm

## Project Structure

- `src/` — Source directory
  - `_data/` — Global JSON data (client info, etc.)
  - `_includes/` — Reusable components and layouts
  - `assets/` — SASS, CSS, images, fonts, JS
  - `content/` — Pages and blog posts (Markdown/HTML)
  - `config/` — Eleventy server and build configuration
  - `admin/` — Decap CMS configuration
- `public/` — Generated output (not committed)

## Development

- **Start dev server:** `npm-run-all --parallel watch:sass watch:eleventy`
- **Build for production:** `npm run build`
- Dev server runs on port 5000 (0.0.0.0)

## Deployment

- Configured as a **static site** deployment
- Build command: `npm run build`
- Public directory: `public`

## Programmatic SEO Pages (added)

- **6 dedicated service pages** auto-generated from `src/_data/services.json` via Eleventy pagination
  - `/services/moving-help/`, `/services/junk-removal/`, `/services/snow-removal/`, `/services/painting/`, `/services/yard-cleanup/`, `/services/demolition-hauling/`
  - Each page: unique h1, service description, what's included list, pricing box, service-specific FAQ, cross-links to other services, service area section, JSON-LD Service schema
- **20 location pages** auto-generated from `src/_data/locations.json` via Eleventy pagination
  - `/locations/detroit/`, `/locations/warren/`, `/locations/sterling-heights/`, etc. (all 20 Metro Detroit cities)
  - Each page: city-specific h1 + blurb, county/trust bar, all 6 service cards with "Learn More" links, stats block, service area, JSON-LD LocalBusiness schema
- **Service area component** updated — city `<span>` pills are now `<a>` links pointing to `/locations/[slug]/`
- **Main services page** updated — each service block now has a "Full Details →" link to its dedicated sub-page

## PageSpeed / Performance Optimizations (completed)

- All large images converted to WebP (hero-movers.png 2.5MB→233KB, all portfolio/service/about images)
- Hero uses `<picture>` tag with WebP source + fetchpriority="high" + LCP preload hint
- All CSS backgrounds and inline `<img>` src attributes updated to `.webp`
- AOS CSS deferred (media="print" onload trick)
- `src/_headers` with full security headers (HSTS, CSP, X-Frame-Options, COOP, etc.) — wired into `.eleventy.js` passthrough

## SEO Optimizations (completed)

- Unique, keyword-rich page titles — brand name appended by layout template only
- Meta descriptions on all pages
- LocalBusiness JSON-LD schema with geo + hasOfferCatalog in base.html
- robots meta (index,follow) + canonical tags + OG/Twitter card tags
- og:image = home1.webp, og:site_name, og:locale on all pages
- robots.txt and sitemap.xml included

## Accessibility Fixes (completed)

- ARIA: changed `<aside role="dialog">` to `<div role="dialog">` (aside's allowed roles don't include dialog)
- Heading hierarchy: footer columns changed from `h4` → `h3` (fixed h2→h4 skip on every page)
- Contrast: bumped low-opacity text elements (0.35–0.55) to 0.78–0.82 on dark backgrounds:
  - FAQ header sub-description
  - Before/after section caption
  - Pricing table footnote
  - Portfolio gallery caption
  - Mobile nav meta bar
