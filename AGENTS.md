# AGENTS.md

Recruitment landing page for 极创创新工作室, deployed via GitHub Pages at https://jichuang-lab.github.io/ (remote `jichuang-lab/jichuang-lab.github.io`, branch `main`). Pure static HTML/CSS/JS — no package.json, no build step, no CDN dependencies.

Note: the site root is the `jichuang-lab-recruitment/` subfolder. The parent directory holds raw user-provided material (photos, videos, WeChat exports), not site code.

## Sources of truth
- `CONTRACT.md` — binding interface between index.html / css/style.css / js/main.js: required section ids, class names, `[data-*]` animation hooks, acceptance checklist. New sections need the id, both nav menus (`.nav-menu` + `.side-nav`), and CSS added together.
- `DESIGN.md` — binding visual spec (Neo-Brutalism): tokens, component semantics (stamp/kicker/card rotation rules), motion language, forbidden list.
- `REQUIREMENTS.md` — content spec; items marked 【待补充】 are intentionally unfilled placeholders. Its §3 visual-direction conclusions are historical (superseded by DESIGN.md).

## Validation (no test/lint suite exists)
```powershell
node --check js\main.js
# CSS syntax: parse css/style.css with Python tinycss2, count rules of type 'error'
python -m http.server 8765   # then HEAD-check index.html + touched assets return 200
```
Commits follow conventional style (`feat:`, `fix:`, `chore:`), messages in English.

## Layout gotchas
- `#proof` `.proof-grid` assigns children 1–4 to named grid areas **by position** (`:nth-child`): 1 must be `.proof-card.span-2` (medal), then detail, desc, media (full-width). Only `.alumni-card` carries its own `grid-area` and can sit anywhere. Inserting or reordering children 2–4 silently breaks the desktop bento layout. Mobile resets via `.proof-grid > * { grid-area: auto !important; }`.
- Mobile (`<=768px`) is a deliberately separate single-column design — keep desktop-only patterns from leaking in, and add matching mobile rules when adding components.
- Award gallery carousel (JS hook `[data-drag-carousel]`, class `.drag-carousel`): do NOT call `setPointerCapture` on it — it redirects the subsequent `click` to the container, so per-item click handlers (the lightbox) never fire. Item `<img>`s use `pointer-events:none`; bind clicks to `.drag-item`.
- Tall screenshots (e.g., internship offer): never force `.ratio-*` frames — `object-fit: cover` crops them into weird strips. Use the `.internship-frame` pattern (aspect-ratio auto, `object-fit: contain`).
- Cards holding large photos (`.alumni-card`): keep `min-width: 0` on the card and its children, and `max-width: 100%` on `.media-frame` — intrinsic image widths otherwise blow out grid tracks at narrow viewports (clipped by `overflow-x:hidden`, looks like an unscaled cropped photo). Ship photos pre-scaled (~1600px wide), never camera-original.
- Counters: `<span data-count="N">0</span>` animates 0→N; put suffixes like `+` outside the span.
- Reveal animations and card tilts use **individual CSS properties** (`translate:`, `rotate:`), not `transform` — `transform` is reserved for JS parallax inline styles (`[data-parallax]`). Don't put `transform` on reveal-animated or rotated elements or they will fight each other.

## Theming (2026-08 restyle: Neo-Brutalism, see DESIGN.md)
- The site was restyled from dark glassmorphism to **Neo-Brutalism** (paper `#fff` + 3-4px solid black borders + hard offset shadows with zero blur + candy accents red/teal/yellow/mint/coral). `DESIGN.md` is the binding visual spec; CONTRACT.md §5 now mirrors its tokens.
- index.html has NO default data-theme. JS `initThemePreview` still reads `?theme=`: only `night` has CSS (token-flipped variant); `engineering`/`campus` are silent no-ops showing the default.
- **Accessibility rule**: text on any candy-color surface must be `var(--on-accent)` (#000), never white and never `var(--ink)` — night mode flips `--ink` to near-white, which would break contrast on accent backgrounds.
- Hard rules of the new style: `border-radius: 0` everywhere; no blur shadows; no backdrop-filter; body text uses the monospace stack (`--font-body`).

## Hard rules
- **No emoji anywhere** in HTML/CSS/JS (contract acceptance item).
- Hidden easter egg: typing `jichuang` opens the `#future-question` dialog — don't break/remove it.
- Downloaded images go into `assets/` under descriptive names; delete unused downloads before committing to avoid repo bloat.

## Environment quirks (Windows PowerShell 5.1)
- Heredocs fail (`python - <<EOF`) — write a temp `.py` under `C:\Users\Episode\AppData\Local\Temp\opencode` and run it.
- CJK output prints as mojibake in the console — write results to a UTF-8 file and Read it instead of trusting stdout.
- Git warns "LF will be replaced by CRLF" on every commit — expected; do not "fix" line endings.
- `git push` frequently fails with connection reset / timeout; retry in a loop before concluding failure.

## External content
- Images hosted on `mmbiz.qpic.cn` (WeChat articles) download only with header `Referer: https://mp.weixin.qq.com/`.
