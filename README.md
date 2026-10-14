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
design/         Source artwork (not shipped with the app)
database/       The content: vocabulary.csv, forms.csv, rules.csv, examples.csv
                (+ Cedrus database.numbers for editing)
src/
  app/          Application shell and router setup
  components/   Reusable UI and layout components
  data/         CSV loading (database.ts) and the verb helpers (verbs.ts)
  pages/        Route-level screens
  styles/       Global Tailwind styles
```

## PWA

Cedrus includes a web app manifest, cedar-themed install icons, and a small service worker registration that runs in production. The service worker caches the app shell so production builds can be installed and reopened quickly.
