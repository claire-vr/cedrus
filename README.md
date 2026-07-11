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

## Project Structure

```text
src/
  app/          Application shell and router setup
  components/   Reusable UI and layout components
  pages/        Route-level screens
  styles/       Global Tailwind styles
```

## PWA

Cedrus includes a web app manifest, cedar-themed install icons, and a small service worker registration that runs in production. The service worker caches the app shell so production builds can be installed and reopened quickly.
