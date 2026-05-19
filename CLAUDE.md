# CLAUDE.md — PHS Student Tools

## Project Overview

**PHS Student Tools** is a React + Vite SPA for high school students. It provides two grade-related tools:
1. **GPA Calculator** — credit-weighted GPA by year and cumulative, using school-specific grade point values
2. **Final Exam Forecast** — given marking period grades, shows what final exam score ranges lead to each possible final course grade

No backend, no auth. All state is persisted to `localStorage`. The app must be responsive and work well on both mobile (375px+) and desktop.

---

## Tech Stack

- **React 18 + Vite** with **TypeScript** (`react-ts` template)
- **Tailwind CSS** (utility-first styling)
- **pnpm** as the package manager
- **React Router v6** with `HashRouter` for bookmarkable tool URLs
- **Vitest** for unit testing calculation logic
- **Dark mode** via Tailwind's `class` strategy — toggled by adding/removing the `dark` class on `<html>`
- No component library — build all UI from scratch with Tailwind
- `localStorage` for persistence

Hash-based routing (`/#/gpa-calculator`, `/#/final-exam-forecast`) is used instead of `BrowserRouter` because it works on all static hosts (GitHub Pages, Netlify, Firebase Hosting) without any server redirect configuration.

### Setup

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

> **Note:** `pnpm create vite@latest` cannot be auto-confirmed non-interactively. All config files (`package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, etc.) were written manually from the standard Vite react-ts template.

### `vite.config.ts` — important detail

Import from `vitest/config`, not `vite`, so the `test` property is recognized by TypeScript:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node' },
})
```

Test environment is `node` (not `jsdom`) — all tests are pure logic with no DOM dependency.

---

## Project Structure

```
./
├── CLAUDE.md
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── package.json
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── data/
    │   ├── gradeWeights.ts       ← GPA point lookup table
    │   ├── gradeScale.ts         ← numerical score → letter grade
    │   └── courseDurations.ts    ← credit duration options
    ├── types/
    │   └── index.ts              ← shared TypeScript interfaces
    ├── utils/
    │   ├── gpa.ts                ← GPA calculation logic
    │   ├── gpa.test.ts           ← Vitest tests for GPA logic
    │   ├── forecast.ts           ← final exam forecast logic
    │   └── forecast.test.ts      ← Vitest tests for forecast logic
    ├── hooks/
    │   └── useLocalStorage.ts    ← generic localStorage hook
    └── components/
        ├── Nav.tsx
        ├── LandingPage.tsx
        ├── GpaCalculator/
        │   ├── GpaCalculator.tsx
        │   ├── GradeYear.tsx     ← collapsible section per grade year
        │   └── CourseRow.tsx     ← single course input row
        └── FinalExamForecast/
            ├── FinalExamForecast.tsx
            ├── ForecastCourse.tsx  ← one course card with inputs + table
            └── ForecastTable.tsx   ← the score-range → grade output table
```

---

## Data Constants

### `src/data/gradeWeights.ts`

GPA points keyed by course level then letter grade.

```ts
export type CourseLevel = 'CP' | 'H' | 'AP';
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export const GRADE_WEIGHTS: Record<CourseLevel, Record<LetterGrade, number>> = {
  CP: {
    'A+': 4.33, 'A': 4.00, 'A-': 3.66,
    'B+': 3.33, 'B': 3.00, 'B-': 2.66,
    'C+': 2.33, 'C': 2.00, 'C-': 1.66,
    'D+': 1.33, 'D': 1.00, 'F': 0.00,
  },
  H: {
    'A+': 5.08, 'A': 4.75, 'A-': 4.41,
    'B+': 4.08, 'B': 3.75, 'B-': 3.41,
    'C+': 3.08, 'C': 2.75, 'C-': 2.41,
    'D+': 2.08, 'D': 1.75, 'F': 0.00,
  },
  AP: {
    'A+': 5.83, 'A': 5.50, 'A-': 5.16,
    'B+': 4.83, 'B': 4.50, 'B-': 4.16,
    'C+': 3.83, 'C': 3.50, 'C-': 3.16,
    'D+': 2.83, 'D': 2.50, 'F': 0.00,
  },
};

export const LEVELS: CourseLevel[] = ['CP', 'H', 'AP'];

export const LETTER_GRADES: LetterGrade[] = [
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D', 'F',
];
```

### `src/data/gradeScale.ts`

Maps a numerical score (0–100) to a letter grade. Used by the Final Exam Forecast.

```ts
import type { LetterGrade } from './gradeWeights';

export interface GradeScaleEntry {
  letter: LetterGrade;
  min: number;
  max: number;
}

// Ordered from highest to lowest. min and max are both inclusive.
export const GRADE_SCALE: GradeScaleEntry[] = [
  { letter: 'A+', min: 97, max: 100 },
  { letter: 'A',  min: 93, max: 96  },
  { letter: 'A-', min: 90, max: 92  },
  { letter: 'B+', min: 87, max: 89  },
  { letter: 'B',  min: 83, max: 86  },
  { letter: 'B-', min: 80, max: 82  },
  { letter: 'C+', min: 77, max: 79  },
  { letter: 'C',  min: 73, max: 76  },
  { letter: 'C-', min: 70, max: 72  },
  { letter: 'D+', min: 67, max: 69  },
  { letter: 'D',  min: 65, max: 66  },
  { letter: 'F',  min: 0,  max: 64  },
];

/** Returns the letter grade for a given numerical score, or null if out of range. */
export function scoreToLetter(score: number): LetterGrade | null {
  for (const { letter, min, max } of GRADE_SCALE) {
    if (score >= min && score <= max) return letter;
  }
  return null;
}
```

### `src/data/courseDurations.ts`

```ts
export interface CourseDuration {
  label: string;
  credits: number;
}

export const COURSE_DURATIONS: CourseDuration[] = [
  { label: 'Full Year',      credits: 5.00 },
  { label: 'Three Quarters', credits: 3.75 },
  { label: 'Semester',       credits: 2.50 },
  { label: 'One Quarter',    credits: 1.25 },
];
```

---

## Business Logic

### GPA Calculation (`src/utils/gpa.ts`)

Credit-weighted GPA:

```
GPA = Σ(gpaPoints_i × credits_i) / Σ(credits_i)
```

- `gpaPoints_i` = `GRADE_WEIGHTS[level][grade]`
- `credits_i` = credits from `COURSE_DURATIONS`
- Courses with no grade selected are excluded from the calculation
- Per-year GPA: same formula but scoped to one grade year's courses
- Cumulative GPA: all courses across all years

**Edge case:** If no courses have been entered (or all are incomplete), display `—` instead of a number.

### Final Exam Forecast (`src/utils/forecast.ts`)

**Formula:**

```
finalGrade = (MP1 + MP2 + MP3 + MP4) × 0.225 + examScore × 0.10
```

Note: 4 marking periods × 22.5% = 90%, plus final exam 10% = 100%.

**Algorithm:**

1. Compute `mpContribution = (MP1 + MP2 + MP3 + MP4) * 0.225`
2. Iterate `examScore` from 0 to 100 (integers)
3. For each: `finalScore = Math.round(mpContribution + examScore * 0.10)`
4. Map `finalScore` to letter grade via `scoreToLetter()`
5. Group consecutive exam scores that yield the same final letter grade into ranges
6. Also compute the range of exam scores that are **impossible**: if even a 100 on the exam still doesn't reach a grade, or if even a 0 still exceeds a grade, flag those outcomes as `"Not achievable"`

**Output:** A typed array of objects, ordered from best to worst outcome:

```ts
export interface ForecastRow {
  letter: LetterGrade;
  examRange: [number, number] | null; // [min, max] exam score, inclusive
  achievable: boolean;
}
```

Example:
```ts
[
  { letter: 'A+', examRange: null,      achievable: false },
  { letter: 'A',  examRange: [82, 100], achievable: true  },
  { letter: 'A-', examRange: [52, 81],  achievable: true  },
  ...
]
```

Always show all possible letter grades in the table (A+ through F), even if some are not achievable. This makes the table easier to read and immediately communicates what is and isn't possible.

---

## Shared Types (`src/types/index.ts`)

Define all shared interfaces here and import them throughout the app:

```ts
import type { CourseLevel, LetterGrade } from '../data/gradeWeights';

export type { CourseLevel, LetterGrade };

export interface GpaCourse {
  id: string;
  name: string;
  level: CourseLevel | '';
  grade: LetterGrade | '';
  duration: string; // matches CourseDuration.label
}

export interface ForecastCourseData {
  id: string;
  name: string;
  mp1: string;
  mp2: string;
  mp3: string;
  mp4: string;
}

export type GradeYear = '9' | '10' | '11' | '12';

export interface AppState {
  gpaCalculator: {
    years: Record<GradeYear, GpaCourse[]>;
  };
  finalExamForecast: {
    courses: ForecastCourseData[];
  };
}
```

---

## localStorage Schema

All data is stored under a single key: `phs-student-tools`, typed as `AppState`.

```ts
{
  gpaCalculator: {
    years: {
      "9":  [ { id, name, level, grade, duration }, ... ],
      "10": [ ... ],
      "11": [ ... ],
      "12": [ ... ],
    }
  },
  finalExamForecast: {
    courses: [
      { id, name, mp1, mp2, mp3, mp4 },
      ...
    ]
  }
}
```

- `id` fields are random UUIDs (use `crypto.randomUUID()`)
- MP score fields are stored as strings (controlled input values) and parsed to numbers only for calculation
- All fields default to `''` when a course row is first added
- Save to localStorage on every state change (debounce is not necessary given the small data size)

Theme preference is stored separately under its own key `phs-theme` with a value of `'light'` or `'dark'`. On app load, read this key first and apply the `dark` class to `<html>` before React renders, to avoid a flash of the wrong theme. If no preference is stored, default to the user's OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`.

### `src/hooks/useLocalStorage.ts`

Implement a generic `useLocalStorage<T>(key: string, initialValue: T)` hook that:
- Reads from localStorage on mount
- Returns `[value, setValue]` like `useState`
- Writes to localStorage whenever value changes

---

## Components

### `App.tsx`

- Wraps the app in `<HashRouter>` with three `<Route>` entries:
  - `/` → `<LandingPage />`
  - `/gpa-calculator` → `<GpaCalculator />`
  - `/final-exam-forecast` → `<FinalExamForecast />`
- Renders `<Nav />` outside the routes so it's always visible

### `Nav.tsx`

- Three navigation links using React Router's `<NavLink>`: **Home** (`/`), **GPA Calculator** (`/gpa-calculator`), and **Final Exam Forecast** (`/final-exam-forecast`)
- Use `NavLink`'s `isActive` prop to style the active tab
- Sticky at top on all screen sizes
- **Layout:** three-column CSS grid — Home anchored left, the two tool links centered, dark mode toggle anchored right
- Includes a light/dark mode toggle button on the right — a sun/moon icon that switches on click, updating both the `dark` class on `<html>` and the `phs-theme` localStorage key

### `LandingPage.tsx`

- A welcoming landing page for the app
- Should include:
  - App name ("PHS Student Tools") as a prominent heading
  - A brief one-line description of what the app is for
  - Two tool cards, one per tool, each with:
    - Tool name
    - Short description (2–3 sentences) of what it does and when a student would use it
    - A "Open" or "Go to tool" button linking to the tool's route
- Should feel like a real product landing page, not a plain list — visually polished, the first thing students see

### GPA Calculator

#### `GpaCalculator.tsx`
- Displays cumulative GPA prominently at the top
- Renders four `<GradeYear />` sections: Grade 9, Grade 10, Grade 11, Grade 12
- Computes and passes per-year and cumulative GPA values down as props

#### `GradeYear.tsx`
- Props: `year` (GradeYear), `courses` (GpaCourse[]), `onChange`, `onAddCourse`, `onDeleteCourse`
- Collapsible: click the section header to expand/collapse
  - Sections that have at least one course are **expanded by default** on load
  - Empty sections are **collapsed by default** on load
- Shows per-year GPA for this section (or `—` if no complete courses)
- "Add Course" button at the bottom of the expanded section
- Renders a `<CourseRow />` for each course

#### `CourseRow.tsx`
- Props: `course: GpaCourse`, `onChange`, `onDelete`
- Fields (all on one row, wrapping gracefully on mobile):
  - **Status icon** (leftmost, fixed width): empty when no required fields are filled; amber warning triangle (with tooltip "Missing fields — this course is excluded from GPA") when partially filled; green checkmark when level + grade + duration are all set
  - **Course Name**: text input, placeholder "Course name (optional)"
  - **Level**: dropdown — CP | H | AP
  - **Grade**: dropdown — A+ through F (12 options)
  - **Duration**: dropdown — Full Year | Three Quarters | Semester | One Quarter
  - **Delete button**: ✕ icon, removes this course row
- All dropdowns default to empty/unselected state initially; unselected courses are excluded from GPA calculation
- **Incomplete row styling:** when any required field is filled but not all three — amber background tint on the row, amber border on each missing dropdown

### Final Exam Forecast

#### `FinalExamForecast.tsx`
- "Add Course" button to add a new forecast course card
- Renders a `<ForecastCourse />` for each saved course
- If no courses exist, shows an empty state with a prompt to add one

#### `ForecastCourse.tsx`
- Props: `course: ForecastCourseData`, `onChange`, `onDelete`
- **Collapsible card:** header contains the course name input (always editable), a chevron toggle button, and a delete button. Cards start expanded.
- When collapsed, if all four MP scores are entered they display as a compact summary (e.g. `90 · 88 · 92 · 86`) in the header so you can see what's in the card at a glance.
- Expanded body contains MP1–MP4 number inputs (0–100, integer validation inline) and the forecast table.
- Renders `<ForecastTable />` only when all four MP scores are filled in and valid; otherwise shows placeholder: "Enter all four marking period grades to see your forecast."

#### `ForecastTable.tsx`
- Props: `forecastData: ForecastRow[]`
- Renders a table with columns: **Final Grade** | **Exam Score Needed**
- **Three-section layout** (not one row per grade):
  1. **Above row** (if any): one muted, italic row listing all not-achievable grades above the achievable range, comma-separated (e.g. `A+, A, A-, B+, B, B-`), with "Not achievable" in the score column
  2. **Achievable rows**: one row per achievable grade, highlighted with accent tint (`bg-accent/10`), full-contrast text
  3. **Below row** (if any): one muted, italic row listing all not-achievable grades below the achievable range, comma-separated (e.g. `D+, D, F`), with "Not achievable" in the score column
- Above/below rows are omitted entirely if there are no grades in that category

---

## Design Guidelines

- Clean, modern aesthetic — not flashy, not generic
- Use a distinctive font pairing (avoid Inter/Roboto/Arial/system fonts)
- Mobile-first layout: inputs should be comfortably tappable (min 44px height)
- Transitions on collapsible sections (smooth expand/collapse)
- GPA values should be visually prominent — large, bold type
- The app should feel polished and trustworthy, not like a rough student project

### Color Palette

Configure these as Tailwind CSS custom colors in `tailwind.config.ts`. Use the `dark:` variant throughout — do not use JavaScript to swap class names on individual elements.

Enable class-based dark mode in `tailwind.config.ts`:
```ts
darkMode: 'class',
```

#### Light Mode
Warm, off-white base with slate text and an indigo accent. Feels clean and academic without being clinical.

| Role | Token | Value |
|---|---|---|
| Page background | `bg-surface` | `#F7F6F3` (warm off-white) |
| Card / panel background | `bg-panel` | `#FFFFFF` |
| Primary text | `text-primary` | `#1E1E2E` (near-black with blue tint) |
| Secondary / muted text | `text-muted` | `#6B7280` |
| Accent (buttons, active tab, highlights) | `accent` | `#4F46E5` (indigo-600) |
| Accent text on dark bg | `accent-fg` | `#FFFFFF` |
| Border | `border-default` | `#E5E3DC` |
| Input background | `bg-input` | `#FFFFFF` |
| Danger / delete | `danger` | `#DC2626` |

#### Dark Mode
Deep navy base — not pure black — with soft slate panels and the same indigo accent shifted slightly brighter.

| Role | Token | Value |
|---|---|---|
| Page background | `dark:bg-surface` | `#0F1117` (deep navy-black) |
| Card / panel background | `dark:bg-panel` | `#1A1D27` |
| Primary text | `dark:text-primary` | `#E8E8F0` |
| Secondary / muted text | `dark:text-muted` | `#9CA3AF` |
| Accent | `dark:accent` | `#6366F1` (indigo-500, slightly brighter than light) |
| Border | `dark:border-default` | `#2D3048` |
| Input background | `dark:bg-input` | `#22253A` |
| Danger / delete | `dark:danger` | `#F87171` |

#### Accent usage
- Active nav link: accent background, white text
- Primary buttons: accent background, white text
- GPA number display: accent color
- Forecast table achievable rows: accent tint background (`bg-accent/10`)
- Not-achievable rows: muted italic text, no accent

---

## Behavior Edge Cases

- **All four MP scores must be integers between 0 and 100 (inclusive)** for the forecast to compute. Show validation feedback inline if a value is out of range, and do not allow floating point numbers.
- **Incomplete GPA courses** (missing level, grade, or duration) are excluded from the calculation silently, but the row is visually flagged: amber background tint, amber borders on the missing dropdowns, and an amber warning icon at the start of the row. A green checkmark replaces the warning once all three required fields are filled.
- **Rounding:** Final exam forecast uses `Math.round()` on the computed final score before mapping to a letter grade.
- **Credits for GPA:** If a course has a level and grade selected but no duration selected, exclude it from the GPA calculation.
- **Empty years:** Grade years with no courses added should collapse gracefully and show `—` for their per-year GPA.

---

## Tests

Tests live alongside the source files they test. Run with `pnpm test`.

### `src/utils/gpa.test.ts`

Test the credit-weighted GPA calculation function(s). Cover:

- **Single course:** one full-year CP course with grade A (4.00 × 5.0 credits) → GPA = 4.00
- **Credit weighting:** a full-year course and a semester course should weight by credits, not count equally
  - e.g. A in full-year CP (4.00 × 5.0) + A+ in semester H (5.08 × 2.5) → `(20.00 + 12.70) / 7.5 = 4.36`
- **Multi-level mixing:** courses across CP, H, and AP levels in the same calculation
- **All letter grades:** spot-check that A+/A-/B+/B-/etc. resolve to the correct GPA point values from `GRADE_WEIGHTS`
- **F grade:** F always contributes 0.0 GPA points but still counts toward total credits
- **Incomplete courses excluded:** courses missing level, grade, or duration are not included in the calculation
- **All incomplete:** if every course is incomplete, the function returns `null` (displayed as `—`)
- **Per-year isolation:** per-year GPA only counts courses in that year, not others
- **One Quarter / Three Quarters durations:** verify 1.25 and 3.75 credit values are applied correctly

### `src/utils/forecast.test.ts`

Test the forecast calculation function(s). Cover:

- **Basic formula:** given known MP scores, verify the `mpContribution` is computed correctly
  - e.g. MP1=90, MP2=88, MP3=92, MP4=86 → mpContribution = `(90+88+92+86) × 0.225 = 80.1`
- **Final score rounding:** confirm `Math.round()` is applied before the letter grade lookup
  - e.g. a final score of 89.5 rounds to 90 (A-), not stays at 89 (B+)
- **Correct grade ranges:** for a known set of MP scores, verify specific exam score thresholds produce the expected letter grade
  - e.g. with mpContribution = 80.1, an exam score of 100 → finalScore = `round(80.1 + 10.0)` = 90 → A-
- **"Not achievable" high end:** when even examScore=100 produces a final score below the A+ threshold (97), A+ should be marked not achievable
- **"Not achievable" low end:** when even examScore=0 still produces a final score above F (≥65), F should be marked not achievable
- **All 12 grade rows always returned:** the output array always has exactly 12 entries (one per letter grade), regardless of what's achievable
- **Boundary values:** verify the exact exam score at each grade boundary lands in the correct bucket (e.g. the score that yields exactly 93 final → A, not A-)
- **Perfect MPs:** MP1=MP2=MP3=MP4=100 → mpContribution=90; verify only high grades are achievable
- **Low MPs:** MP1=MP2=MP3=MP4=65 → mpContribution=58.5; verify only low grades are achievable

---

## What This App Does NOT Do

- No user accounts or cloud sync
- No teacher-facing features
- No grade input from a PDF/image — all manual entry
- No course catalog or autocomplete for course names
- No GPA target/what-if simulation (possible future feature)
