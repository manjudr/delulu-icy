# Delulu Icy

Brand site for **Delulu Icy** — ice cream, shakes and sundaes.
Static, zero dependencies, no build step. Hand-written HTML, modern CSS and
one small vanilla JS file.

Live at **https://deluluicy.com**

## What's here

```
index.html            the whole site — 7 sections + footer
assets/css/styles.css design tokens, layout, motion
assets/js/main.js     scroll choreography (progressive enhancement only)
assets/fonts/         self-hosted woff2, latin subset
assets/img/           favicon, apple touch icon, Open Graph card
CNAME .nojekyll robots.txt sitemap.xml site.webmanifest
```

## Design notes

**Palette** is sampled from the storefront signage and white-balanced to remove
the amber cast of the sign's LEDs:

| Token | Value | Use |
|---|---|---|
| `--lav` | `#B49AC8` | "Delulu", primary |
| `--sage` | `#A8BE92` | "Icy", secondary |
| `--cream` | `#FBF5EC` | page ground |
| `--glow` | `#FFE9C4` | backlight |
| `--ink` | `#1F1A1D` | text |

**The wordmark** is one reusable component (`.mark`) driven entirely by `em`,
so setting `font-size` scales the whole lockup — the bubble "Delulu", the melt
running off the D, the script "Icy" and the outline heart all stay in
proportion. It appears in the intro curtain, the hero and the footer.

**No photography.** Every product is drawn in CSS, so it stays sharp at any
size and costs no image bytes.

**Motion is optional.** Scroll reveals are gated behind a `.js` class that the
page sets on itself and disarms after 3s if `main.js` never runs, so content
can never be left invisible. `prefers-reduced-motion` flattens the pinned
sequences entirely.

### Regenerating the social image

`assets/img/og.png` (1200×630) and `assets/img/apple-touch-icon.png` (180×180)
were rendered from the site's own CSS with headless Chrome. To redo them,
build a small HTML that imports `styles.css` and screenshot it:

```
chrome --headless=new --window-size=1200,630 \
       --run-all-compositor-stages-before-draw \
       --screenshot=assets/img/og.png <url>
```

## Local preview

```
python3 -m http.server 8777
```

Then open http://127.0.0.1:8777/ — root-absolute asset paths need a server,
not `file://`.

## Deploying

GitHub Pages serves this repo as-is. In **Settings → Pages**, set the source to
the `main` branch, root folder. `CNAME` already pins the custom domain and
`.nojekyll` stops Jekyll from touching the output.

### DNS at GoDaddy

GitHub Pages supports exactly one custom domain, so `deluluicy.com` is the
canonical host. Point the apex at GitHub's four Pages IPs:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<github-username>.github.io` |

For **deluluicy.in**, use GoDaddy's domain forwarding to redirect to
`https://deluluicy.com` — it cannot be a second Pages domain.

Once DNS resolves, tick **Enforce HTTPS** in Settings → Pages.
