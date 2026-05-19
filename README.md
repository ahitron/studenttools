# PHS Student Tools

A fast, mobile-friendly web app for high school students with two grade tools:

- **GPA Calculator** — credit-weighted GPA by year and cumulative, using PHS-specific grade point values for CP, Honors, and AP courses
- **Final Exam Forecast** — enter your four marking period grades and see exactly what exam score you need for each possible final grade

No login, no backend. Everything is saved locally in the browser.

---

## Development

```bash
pnpm install
pnpm dev          # starts dev server at http://localhost:5173
pnpm test         # run unit tests (Vitest)
pnpm build        # type-check + production build
```

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (custom color tokens, dark mode via `class` strategy)
- React Router v6 with `HashRouter`
- Vitest for unit tests
- `localStorage` for persistence (no backend)

## Routing

Hash-based (`/#/gpa-calculator`, `/#/final-exam-forecast`) so the app deploys to any static host without server redirect config.

## Deploying

`pnpm build` outputs to `dist/`. Drop it on GitHub Pages, Netlify, Firebase Hosting, or any static host — no configuration needed.
