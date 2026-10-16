# Cedrus

Cedrus is a scalable React application for learning Lebanese Arabic written only in phonetic Latin script. The first version establishes the app shell, routing, styling system, and installable PWA configuration without adding learning content or fake data.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- ESLint
- Prettier
- Web App Manifest and service worker

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run code quality checks:

```bash
npm run lint
npm run format:check
```

Format the project:

```bash
npm run format
```

## Content

All learning content lives in four CSV files in `database/`. The app reads them directly when it builds, so there is no import step. See `database/DATABASE.md` for the columns.

To add or change words:

1. Open `database/Cedrus database.numbers` and edit it. Each sheet is one CSV.
2. Choose File → Export To → CSV… and export.
3. Copy the exported CSV files into `database/`, replacing the old ones. Names like `vocabulary-Table 1.csv` are fine, but keep only one file per sheet.
4. `npm run dev` shows the change; commit and push to update the live site.

## Project Structure

```text
database/       The content: vocabulary.csv, forms.csv, rules.csv, examples.csv
                (+ Cedrus database.numbers for editing, archive/ for old versions)
src/
  app/          Application shell and router setup
  components/   Reusable UI and layout components
  data/         CSV loading (database.ts) and the verb helpers (verbs.ts)
  pages/        Route-level screens
  styles/       Global Tailwind styles
```

## Practice

- **Review** (`/review`): flashcards per topic, or "Everything due" across all topics. You reveal the answer and say whether you knew it. Possessive forms get their own cards ("door · beib → anaa" = beibei); in Possessive pronouns only the forms are asked, not the base word.
- **Conjugation drill** (`/verbs/drill`): type the right form of a verb for a person and tense. Alternatives written with "/" count, and a capitals-only mistake is flagged as "almost". "Drill this verb" on a verb page drills just that verb.
- Both use spaced repetition (`src/lib/progress.ts`): a known card moves up a box and comes back after 1, 3, 7, 14, 30 and 60 days; a missed card goes back to box 1 and returns later in the same round. A round is up to 20 cards, due ones first.
- Progress is saved in the browser's storage on each device (no account). Settings shows it and can reset it. Card ids are based on the topic and English text, so renaming a word in the CSV starts its progress over.

## PWA and offline use

Cedrus can be added to the iPhone home screen (Safari → Share → Add to Home Screen) and works offline.

- `pwa/service-worker.js` is a template. At build time the small plugin in `vite.config.ts` fills in the list of files to save and a version number, and writes `dist/service-worker.js`.
- The first visit with a connection saves the whole app, including all words (they are bundled into the app).
- Page loads try the network first (4 s timeout) and fall back to the saved copy, so a new deploy shows up the next time the app is opened online.
- The service worker only runs on the published site; `npm run dev` removes it so you always see your latest changes.
- `vercel.json` sends every route to `index.html` (so refreshing /topics/food works) and stops `service-worker.js` from being cached.
