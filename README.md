# Interactive English–Arabic Syllabus

Classroom vocabulary site built with Astro. All words are transcribed from
**“Toppers Dictionary for Secondary Stage 2022”** (Toppers Team), in original book order —
Part 1 topics, Part 2 A–Z, expressions & idioms, irregular verbs (~2700 words).
Click any English word for British pronunciation (browser speechSynthesis, en-GB);
Focus mode gives a minimal projector-friendly bar with Prev/Next and autoplay.

## Structure

- `src/pages/index.astro` — main table UI (single file app)
- `src/pages/about.astro` — source & contact page
- `src/data/sheets/*.json` — one unit per file: `{ id, title, source, categories: [{ category, words: [{ en, ar }] }] }`
- `Toppers.pdf` — source book (not deployed)

## Commands

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm test` | Data integrity tests (vitest) |
| `pnpm build` | Static build to `./dist/` |
| `pnpm deploy` | Build + deploy to Cloudflare Pages |

Contact: contact@miuarc.com
