# Considerate Outreach Studio

A mobile-first, offline-first coaching app for thoughtfully reconnecting with an INFJ friend. The experience is
shaped for a 36-year-old ENTP (Enneagram 4 with 8 energy) who wants considerate, honest outreach without any
automation, scraping, or pressure. Everything runs client-side: drafts, starters, and reflections live in
`localStorage`, and a lightweight service worker keeps the shell available offline.

## Key features

- **1-minute grounding** intake captures tone defaults, values, boundaries, intentions, and context so every
  draft stays anchored.
- **INFJ-friendly starter studio** delivers 12 adjustable templates (formality, playfulness, vulnerability,
  length) with live previews.
- **Draft composer** with tone presets, vulnerability governor, “Seductive, Not Sleazy” mode, ethics checker
  (Green/Yellow/Red), anti-spam pacing helper, clarity prompts, and respectful Messenger handoff checklist.
- **Schedule snapshot** summarizes planned send windows and tone cadence.
- **Reflection log & insights** track sent messages, outcomes, feelings, and timing patterns for gentle
  learning loops.
- **Offline PWA** installable on Android with generous keyboard-safe spacing for half-screen mobile typing.

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) (single-page app)
- Vanilla CSS tuned for touch targets and half-screen keyboards
- LocalStorage + service worker cache for persistence (no Firebase required)
- Manifest + service worker for installable PWA behaviour
- Vitest for focused utility tests

## Workspace structure

The app stores the following JSON blobs locally (mirroring the original Firestore model):

| Key / Collection analogue        | Summary fields                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `gtg-intake` (`intake/{uid}`)    | Tone defaults, values, boundaries, intentions, context note, intent statement     |
| `gtg-starters` (`prompts/...`)   | 12 starter templates with slider settings and previews                            |
| `gtg-drafts` (`drafts/...`)      | Draft text, tones, opener type, target channel, send window, ethics grade, status |
| `gtg-reflections` (`reflections`) | Sent copy, outcome, self-assessment tags, next step                               |
| `gtg-current-draft`              | The draft currently open in the composer                                           |
| `gtg-settings`                   | Stores whether “Seductive, Not Sleazy” mode is enabled                            |

Everything stays on-device unless you explicitly clear storage.

## Getting started locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open the printed URL (default `http://localhost:5173`). Use the Settings tab to load the sample workspace or
   to reseed INFJ starters at any time.

3. **Run tests**

   ```bash
   npm run test
   ```

   Tests cover the ethics checker and tone transformation helpers.

## Deploying to GitHub Pages

The project is ready to host from a repository via GitHub Pages with no backend:

1. Build the static site (paths are emitted relative to the repo for Pages hosting):

   ```bash
   npm run build
   ```

2. Copy the build output into the `docs` folder (the default GitHub Pages target for the `main` branch):

   ```bash
   rm -rf docs/*
   cp -R dist/* docs/
   ```

3. Commit and push the updated `docs` folder, then enable **Settings → Pages → Build and deployment → Source →
   Deploy from a branch**, selecting `main` and the `/docs` folder. GitHub will serve the coaching app directly
   from there.

To update Pages later, repeat the build and copy steps before committing.

## Messenger handoff guardrails

- Manual only—drafts are copied to your clipboard and you open Messenger yourself.
- Checklist confirmation reinforces respect, zero pressure, and comfort with no reply.
- Ethics checker blocks “Red” drafts unless you provide a reflective override rationale.

## Accessibility & offline notes

- Large tap targets, character/line counters, and generous scroll areas keep composing comfortable on small
  screens—even with a half-screen keyboard displayed.
- Service worker caches the shell so you can compose drafts offline and sync your reflections later.
- Third-party personal data is never stored; everything is written from your perspective only.

## Project commands

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the local dev server       |
| `npm run build`   | Build the production bundle      |
| `npm run preview` | Preview the production build     |
| `npm run test`    | Run Vitest utility tests         |

## Sample assets

If you capture screenshots while iterating, drop them under `docs/` so they can be referenced in the README or
GitHub Pages deployment.
