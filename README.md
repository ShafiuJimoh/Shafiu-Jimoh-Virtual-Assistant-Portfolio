# Shafiu Jimoh, Executive Virtual Assistant Portfolio

Live site: https://shafiujimoh.github.io/Shafiu-Jimoh-Virtual-Assistant-Portfolio/

Professional portfolio for Shafiu Jimoh, an Executive Virtual Assistant and
Remote Operations Specialist based in Abuja, Nigeria, supporting founders and
executives with calendar management, workflow automation, project
coordination and administrative support.

## Design direction

The site uses a restrained glass-on-ink surface finished with Victorian
ornament (hairline brass rules, diamond dividers, serif display type) and a
bohemian, warm-toned palette (brass, wine, moss on a deep ink ground). There
is no purple gradient theme, no pill-shaped buttons, and no fabricated
counters or review widgets. Section figures in the Results area are tied to
named engagements described in the Experience timeline rather than generic
marketing statistics.

Layered on top of that restraint is a cohesive **immersive layer**, built to
feel like a considered environment rather than a static page rather than
a pile of unrelated gimmicks. A second wave of functional components, added
after studying [hancore.dev](https://hancore.dev/site/#about)'s
terminal-as-navigation concept, adapts that same spirit of "the UI is a
small live tool" into features that fit a professional VA portfolio:

- **Session Console** — press the backtick key or the nav's `console`
  button to open a small command panel (`help`, `open <section>`,
  `whoami`, `stats`, `theme <name>`, `resume`, `email`, `github`, `clear`).
  `stats` makes a live `fetch()` to the public GitHub REST API for this
  profile; every other command reaches a destination that is also
  reachable from the ordinary nav, so the console is additive, never a
  gate.
- **Theme switcher** — four accent palettes (brass/wine/moss/parchment)
  swapped instantly via CSS custom properties, saved to `localStorage`,
  with no page reload and no extra request, directly adapting hancore.dev's
  `:colorscheme` command to a point-and-click control (and reachable from
  the console too, via `theme wine` etc.).
- **Live status bar** — a fixed strip showing the real current time in
  Abuja (`Intl` time zone conversion) and a genuine page-visit counter
  from a public counting API; both are fetched/computed live and show a
  quiet fallback rather than a fabricated number if a request fails.
- **Live GitHub pulse** — a credentials-section strip that calls the
  public GitHub API client-side for this exact account's real repo count,
  follower count and join year, with a visible loading state.
- **Quick filters** — live-filter inputs above the skills tag cloud/tool
  stack and the certifications grid, functionally equivalent to
  hancore.dev's instant project search, applied here to skills and
  credentials.
- **Lightbox** — click-to-enlarge viewer for both portraits, with
  Escape/backdrop/close-button dismissal and sensible focus return.
- **Tooltip engine** — a single floating tooltip positioned from
  `data-tip` attributes, the same lightweight single-instance pattern
  hancore.dev uses for its UI hints.

All of the above degrade safely: every `init*` function checks for its DOM
hooks before doing anything, so loading `script.js` on the legal pages
(which don't include this markup) is a silent no-op, and every effect
respects `prefers-reduced-motion` where motion is involved.

- **Ink-and-brass preloader** — a one-second entrance arc, skipped instantly
  for `prefers-reduced-motion` and hard-capped so it never blocks content.
- **Lantern cursor** — a soft brass glow and ring trail the pointer on
  desktop, widening over interactive elements; absent on touch devices.
- **Hero motes** — a handful of slow canvas particles drifting behind the
  hero copy, evoking dust in lamplight; paused off-screen.
- **Live portrait & Abuja time chip** — the real hero/about portrait sits in
  a brass-rimmed frame with parallax tilt, and a chip shows the current time
  in Abuja (WAT) via `Intl` time zone conversion, so visitors anywhere can
  gauge overlap at a glance.
- **The Ledger** — a fixed chapter-progress rail (desktop, wide viewports)
  that fills with scroll depth and highlights the active section.
- **The Call Bell** — a keyboard-first command palette (press `/` or the nav
  bell) for jumping to any section or firing a quick action, with arrow-key
  navigation and live filtering.
- **Ambient sound toggle** — an optional, muted-by-default gramophone control
  that only ever plays after an explicit click.
- **Magnetic buttons & staggered reveals** — primary buttons drift gently
  toward the cursor; grid sections (results, services, credentials, working
  style) reveal with a light stagger instead of a single flat fade.

Every effect above degrades to plain, fully functional markup for reduced-
motion users, touch devices and narrow viewports — none of it is required to
read the site or reach the contact form.

## Structure

```
.
├── index.html                  Main site
├── privacy-policy.html         Privacy policy
├── terms-and-conditions.html   Terms and conditions
├── styles.css                  Design system, layout and immersive layer
├── script.js                   Navigation, reveal, tabs, contact form,
│                                immersive layer (preloader, cursor, motes,
│                                time chip, progress rail, command palette,
│                                ambient sound, magnetic buttons)
├── assets/
│   ├── logo.svg                 Hand-drawn monogram (source)
│   ├── logo-512.png
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── img/                     Portrait crops (hero + about, JPG/WebP)
│   └── audio/                   Optional ambient loop (gramophone toggle)
└── README.md
```

## Sections

- Hero, with a short statement of positioning and a live portrait
- About, covering background and areas of focus, with a matching portrait
- Results, with figures tied to specific roles in the experience timeline
- Skills, organized by tabbed category
- Services, six offerings including workflow automation
- Experience, a five-role timeline from 2022 to present
- Credentials, covering education and nine certifications, including HRCI
  aPHR and a 2025 digital marketing certification (PPC, SEO, SMM, GTM, GA4)
- Working style, four short principles
- Contact, with a working form and direct contact details

## Running locally

```bash
git clone https://github.com/ShafiuJimoh/Shafiu-Jimoh-Virtual-Assistant-Portfolio.git
cd Shafiu-Jimoh-Virtual-Assistant-Portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

No build step is required. The site is plain HTML, CSS and JavaScript.

## Contact

- Email: [shafiujimoh2003@gmail.com](mailto:shafiujimoh2003@gmail.com)
- Phone / WhatsApp: +234 813 030 7875
- LinkedIn: [linkedin.com/in/shafiujimoh](https://www.linkedin.com/in/shafiujimoh)
- Location: Abuja, Nigeria, available remotely

## License

© 2026 Shafiu Jimoh. All rights reserved.
