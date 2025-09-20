# Considerate Outreach Studio

A mobile-first, offline-friendly coaching app for crafting considerate Messenger drafts when reconnecting with
an INFJ friend. The experience is designed for a 36-year-old ENTP (Enneagram 4 with 8 energy) who wants
thoughtful, honest outreach without automation, scraping, or pressure. Drafts are saved locally and in your
Firebase project, while the ethics checker and coaching helpers keep every message grounded and consensual.

![screenshot placeholder](docs/screenshot.png)

## Key Features

- **1-minute onboarding** to capture tone defaults, values, boundaries, intent, and context.
- **INFJ-friendly starter studio** with 12 adjustable templates (formality, playfulness, vulnerability, length).
- **Draft composer** featuring tone presets, vulnerability governor, “Seductive, Not Sleazy” mode, ethics checker
  (Green/Yellow/Red), anti-spam coaching, clarity prompts, and a respectful Messenger handoff checklist.
- **Reflection log & insights** to track outcomes, self-assessment tags, tone mix, and timing patterns.
- **Schedule dashboard** summarising planned drafts, cadence stats, and tone distribution.
- **Offline-first PWA** with install support and localStorage syncing; Firebase Anonymous Auth ensures only your
  data is stored.

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) (SPA, mobile-first layout)
- Firebase Anonymous Authentication + Cloud Firestore for persistence
- LocalStorage for offline-first drafts and reflections
- Vanilla CSS tailored for Pixel 8 portrait with keyboard-safe spacing
- Service worker + web manifest for installable PWA

## Data Model

| Collection Path                    | Fields (summary)                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `users/{uid}`                     | `uid`, `createdAt`, `mbti`, `enneagramPrimary`, `enneagramSecondary`            |
| `intake/{uid}`                    | `contextNote`, `valuesList[]`, `boundaries[]`, `intentions[]`, `toneDefaults[]` |
| `drafts/{uid}/items/{draftId}`    | `text`, `tone[]`, `openerType`, `targetChannel`, `sendWindow`, `status`, `ethics` |
| `reflections/{uid}/items/{id}`    | `sentCopy`, `dateSent`, `responseOutcome`, `selfAssessment[]`, `nextStep`       |
| `prompts/{uid}/starters/{id}`     | Seeded starter templates with slider settings and previews                      |

Each document includes a `uid` field so Firestore rules can ensure ownership.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase project**

   - Visit [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - In **Build → Authentication → Sign-in method**, enable **Anonymous** auth.
   - In **Build → Firestore Database**, create a database in production mode.

3. **Apply Firestore security rules**

   Copy the contents of [`firestore.rules`](./firestore.rules) into the Firestore rules editor and publish. The
   rules restrict every document to `request.auth.uid == resource.data.uid` and explicitly deny any `contacts`
   collection.

4. **Configure environment variables**

   Create a `.env` file in the project root with your Firebase credentials:

   ```bash
   cat <<'ENV' > .env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ENV
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app opens at [http://localhost:5173](http://localhost:5173). Demo mode activates automatically if Firebase
   config is missing.

6. **Build & install as a PWA (optional)**

   - The service worker and `manifest.webmanifest` are already configured.
   - In Chrome on Android: open the app → browser menu → “Add to Home screen”.
   - The layout leaves bottom padding to account for half-screen keyboards on mobile.

## Tests

Run Vitest unit tests for tone helpers and the ethics checker:

```bash
npm run test
```

## Demo Mode

Without Firebase credentials the app falls back to local demo data. You can also toggle **Demo mode** in the
Settings tab to explore seeded starters, drafts, and reflections. Turn it off to sync with your Firebase
project.

## Messenger Handoff Guardrails

- No automation—messages are copied to clipboard and you manually open Messenger.
- Checklist confirmation ensures respect, zero pressure, and comfort with no reply.
- Ethics checker blocks “Red” drafts until you record an override reflection.

## Accessibility & Offline Notes

- Large tap targets, character/line counters, and scrollable content ensure readability on small screens.
- Service worker caches the shell so you can compose drafts offline. Sync resumes when back online.
- All personal data stays yours; third-party data (her info) is never stored.

## Project Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start local development server          |
| `npm run build` | Build for production                    |
| `npm run preview` | Preview production build locally      |
| `npm run test`  | Run unit tests with Vitest              |

## Screenshot

Add a screenshot of the running app to `docs/screenshot.png` if you take one while developing.
