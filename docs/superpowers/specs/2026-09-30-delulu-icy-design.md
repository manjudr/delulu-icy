# Delulu Icy — brand site design

**Date:** 2026-09-30
**Status:** implemented

## Purpose

A single-page brand site for Delulu Icy. It exists to make someone feel
something about the brand — nothing is for sale, and the site deliberately
carries no address, hours, opening date or sign-up.

## Constraints

Fixed by the brief:

- Type and colour come from the storefront signage and may not be changed.
- Apple-caliber restraint. Not a local-parlour page.
- Fully responsive: phone, tablet, laptop.
- Vanilla HTML/CSS/JS. No build step, no dependencies.
- SEO-strong.
- No social links.
- `deluluicy.com` is canonical; `.in` forwards to it.

Fixed by circumstance:

- The only brand asset is one AI-generated storefront photo. There are no real
  product photographs and none can be taken.

## Decisions

### Palette from the photograph

The reference is lit by amber LEDs, so raw sampled values are warm-shifted.
The sampled colours were white-balanced before becoming tokens. Lavender and
sage carry the brand; cream is the ground; a warm glow token reproduces the
sign's backlight.

### The wordmark is a component, not a picture

The signage lockup has four distinct parts: bubble-face "Delulu", a melt
running off the D, a script "Icy", and a small outline heart. Rendering this
as an image would mean a raster that blurs and can't restyle. Instead it is
one `.mark` component sized entirely in `em`, so a single `font-size` scales
every part together. It is reused at three sizes — intro curtain, hero,
footer — which is what makes the brand read as consistent rather than
assembled.

The melt is an inline SVG absolutely positioned inside the D's own span, at
negative `z-index` within an isolated stacking context. Isolation matters:
without it the melt escapes behind any section background (this is exactly
what hid it in the dark footer).

### Drawn products, not photographs

Every product — cone, shake, sundae — is built from CSS shapes inside a
square aspect-ratio stage with percentage positioning. This is a direct
consequence of having no photography: drawn art stays sharp at every size,
costs no image bytes, and can be recoloured from the same tokens. It also
reads as deliberate illustration rather than as a missing photo.

### Motion that cannot break the page

Two pinned scroll sequences (the creed, the product trio) are driven by
`position: sticky` inside a tall parent, with progress computed from
`getBoundingClientRect()` in a rAF-throttled scroll handler.

Scroll reveals are **fail-safe by construction**. The reveal CSS is scoped
behind a `.js` class that the page adds to itself in `<head>` and *removes
again after 3s* unless `main.js` has signalled it is alive. On top of that the
observer uses `threshold: 0` (so an element taller than the viewport still
fires), force-reveals anything already above the fold on load, and has an 8s
backstop that reveals everything. No combination of observer failure, script
error or restored scroll position can leave content invisible.

`prefers-reduced-motion` un-pins both sequences and flattens them to ordinary
stacked sections. `prefers-contrast: more` is honoured too.

### SEO

Semantic sectioning, exactly one `h1`, canonical URL, Open Graph and Twitter
cards, `sitemap.xml`, `robots.txt`. JSON-LD uses an `@graph` of
`Organization` + `Brand` + `WebSite`.

`LocalBusiness` is deliberately **not** used. It requires address and hours,
which the brief forbids stating; emitting it with invented or omitted
properties would be worse than not emitting it.

### Self-hosted fonts

Baloo, Poppins, Pacifico and Caveat are served from the repo as latin-subset
woff2. This removes third-party requests, removes a tracking surface, and
avoids the flash of unstyled text that would undermine a brand-first hero.

## Rejected

- **Hosting both domains on Pages.** GitHub Pages supports one custom domain.
  `.in` forwards at the registrar.
- **A CSS framework.** The page is one document with a bespoke layout; a
  framework would add bytes and a build step for no structural gain.
- **Stock ice-cream photography.** It would not be this brand's product, and
  the mismatch would read as generic.
