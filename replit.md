# Junky Rabbit Labor - Business Website

## Project Overview

A professional service website for Junky Rabbit Labor, a general labor business in the Detroit Metro area. Services include moving, junk removal, snow removal, painting, and landscaping.

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
