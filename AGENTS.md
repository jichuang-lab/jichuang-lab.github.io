# AGENTS.md

Recruitment landing page for 极创创新工作室, deployed via GitHub Pages at https://jichuang-lab.github.io/ (remote `jichuang-lab/jichuang-lab.github.io`, branch `main`). Pure static HTML/CSS/JS — no package.json, no build step, no CDN dependencies.

Note: the site root is the `jichuang-lab-recruitment/` subfolder. The parent directory holds raw user-provided material (photos, videos, WeChat exports), not site code.

## Sources of truth
- `CONTRACT.md` — binding interface between index.html / css/style.css / js/main.js: required section ids, class names, `[data-*]` animation hooks, acceptance checklist. New sections need the id, both nav menus (`.nav-menu` + `.side-nav`), and CSS added together.
- `REQUIREMENTS.md` — content spec; items marked 【待补充】 are intentionally unfilled placeholders.

## Validation (no test/lint suite exists)
```powershell
node --check js\main.js
# CSS syntax: parse css/style.css with Python tinycss2, count rules of type 'error'
python -m http.server 8765   # then HEAD-check index.html + touched assets return 200
```
Commits follow conventional style (`feat:`, `fix:`, `chore:`), messages in English.

## Layout gotchas
- `#proof` `.proof-grid` assigns children to named grid areas **by position**: 1=`span-2` (medal), 2=detail, 3=desc, 4=media (full-width), 5=`.alumni-card`. Inserting or reordering children silently breaks the desktop bento layout. Mobile resets via `.proof-grid > * { grid-area: auto !important; }`.
- Mobile (`<=768px`) is a deliberately separate single-column design — keep desktop-only patterns from leaking in, and add matching mobile rules when adding components.
- Award gallery `.drag-carousel`: do NOT call `setPointerCapture` on the carousel — it redirects the subsequent `click` to the container, so per-item click handlers (the lightbox) never fire. Item `<img>`s use `pointer-events:none`; bind clicks to `.drag-item`.
- Tall screenshots (e.g., internship offer): never force `.ratio-*` frames — `object-fit: cover` crops them into weird strips. Use the `.internship-frame` pattern (aspect-ratio auto, `object-fit: contain`).
- Counters: `<span data-count="N">0</span>` animates 0→N; put suffixes like `+` outside the span.

## Theming
- Base tokens in `:root` describe the original amber palette (per CONTRACT.md §5), but `body[data-theme="engineering"]` at the end of style.css overrides them to blue; `?theme=campus|night` switches variants (`initThemePreview`). Don't trust CONTRACT.md §5 colors alone.

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
