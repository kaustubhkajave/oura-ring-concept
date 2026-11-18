# Oura Ring 5: Website Concept & UX Proposal

Design inspiration: a UX/UI concept, presented the way a designer would pitch it to a client. It has two parts:

- **`index.html`: the concept site.** A working product page and purchase flow for the Oura Ring 5.
- **`proposal.html`: the design rationale.** The client-facing pitch: problems, proto-personas, heuristic review, principles, page structure, the key flow, design decisions, design system, accessibility, success metrics and project plan.

> Not affiliated with or endorsed by Oura Health Oy. Built for a design portfolio. Product details come from Oura's public pages and the Ring 5 launch coverage (May 2026), current as of November 2026.

## The problem in one line

Ring 5 is a considered purchase: $399–$499 plus a membership, it has to fit perfectly, and its value isn't obvious until you've worn it. The design removes those three hesitations: **fit, cost and value**.

## What the concept demonstrates

| Decision | Where |
|---|---|
| Price **and** membership disclosed in the first screen | Hero |
| Outcome-led storytelling (Sleep, Readiness, Activity) before specs | "What it tells you" |
| Size-first purchase flow, with the sizing kit as the recommended default | Configurator, step 2 |
| Finish cards show the price; selection never relies on colour alone | Configurator, step 1 |
| "Due today" separated from the recurring cost | Order summary |
| Honest cost-of-ownership calculator (the yearly plan saves only $1.89 a year, and we say so) | Membership section |
| Comparison table with verified rows only | Compare |
| Inline, persistent error messages with `aria-invalid` and `aria-describedby` | Size field |
| Compact sticky preview on mobile, so feedback stays in view while choosing | Configurator, mobile |

## Accessibility (WCAG 2.2 AA)

- Every text colour pair was contrast-checked (ink 16.6:1, body 7.8:1, captions 5.2:1, accent 7.3:1)
- Native radio inputs in fieldsets with legends; visible 3px focus rings; 44px+ targets
- Live regions for price changes; a native `<dialog>` for the bag, which returns focus on close
- Skip link, landmarks, a single H1, no skipped heading levels (audited automatically)
- `prefers-reduced-motion` respected

## Tech

Plain HTML, CSS and vanilla JavaScript. No build step, no frameworks. The ring illustration is an SVG generated per finish in code.

```
index.html      concept product page
proposal.html   design rationale / client pitch
styles.css      design tokens + concept site styles
proposal.css    rationale page styles
js/app.js       configurator, ring renderer, cost calculator, bag
```

## Make it yours

- The concept assumes sizes 4–15 (Oura's listed range for Ring 4). Confirm this for Ring 5 before presenting it as final.

## Run locally / host for free

Open `index.html` directly in a browser, or host the folder on GitHub Pages or Netlify Drop. No server is required.
