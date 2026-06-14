# STEMM Lab — Implementation Overview

## 1. Project Structure

```
CSE3MAD_FP/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout: providers, query client, fonts
│   ├── index.tsx                 # Auth gate — redirects to login or home
│   ├── home.tsx                  # Post-auth landing (team status, recent activity)
│   ├── login.tsx / signup.tsx    # Email/password auth screens
│   ├── teamInitialization.tsx    # Create or join a team
│   ├── activityDetails.tsx       # Activity detail page
│   ├── (tabs)/                   # Bottom-tab navigator
│   │   ├── _layout.tsx           # Tab config (Home, Activities, Leaderboard, Settings)
│   │   ├── index.tsx / activities.tsx / leaderboard.tsx
│   │   └── settings/             # Account, Team, Appearance, Language, About
│   ├── activityAttempt/          # Per-activity experiment screens
│   ├── activityResults/          # Per-activity result & submit screens
│   ├── sensor-debug.tsx          # Sensor validation screen
│   ├── soundMap.tsx              # GPS-tagged sound pollution map
│   └── modal.tsx                 # Generic modal
├── assets/
│   ├── activities.ts             # Activity definitions (names, instructions, i18n keys)
│   └── images/                   # Activity thumbnails & splash assets
├── components/                   # Reusable UI + per-activity attempt components
│   ├── breathingAttempt.tsx / fanAttempt.tsx / earthquakeAttempt.tsx
│   ├── parachuteAttempt.tsx / soundAttempt.tsx
│   ├── humanPerformanceLabAttempt.tsx / reactionBoardAttempt.tsx
│   ├── lineChart.tsx / barChart.tsx
│   └── ui/                       # Collapsible, IconSymbol, etc.
├── constants/
│   ├── data.ts                   # Activity metadata, mock data, decibel scale
│   └── types.ts                  # Domain types (Team, Submission, ParachuteTrial, etc.)
├── context/
│   ├── AuthContext.tsx            # Firebase auth + Firestore real-time team subscription
│   ├── ActivityContext.tsx        # Selected activity + local experiment log persistence
│   └── ThemeContext.tsx           # Dark/light theme persisted to AsyncStorage
├── hooks/
│   ├── useAuth.ts                # Convenience hook for AuthContext
│   ├── useTheme.tsx              # Convenience hook for ThemeContext
│   ├── useSubmissions.ts         # React Query hooks for Firestore submissions
│   ├── use-color-scheme.ts       # System color scheme hook
│   └── use-theme-color.ts        # Derived theme color hook
├── theme/
│   └── colors.ts                 # Light and dark theme color palettes
├── utils/
│   ├── physics.ts                # All physics calculations (g-force, drag, fan force, etc.)
│   ├── database.ts               # expo-sqlite offline database (activities, logs, ratings)
│   ├── activityPersistence.ts    # Persistence helpers related to activity state
│   ├── activitySubmissions.ts    # Firestore + Storage upload helpers
│   └── __tests__/                # Unit tests
├── i18n.js                       # i18next config with en, ja, id, zh translations
├── firebase.js                   # Firebase app init (Auth, Firestore, Storage)
├── firestore.rules               # Firestore security rules (team-based isolation)
├── firestore.indexes.json        # Firestore composite indexes
├── storage.rules                 # Firebase Storage security rules
└── eas.json                      # EAS Build profiles (dev, preview, production)
```

## 2. Firebase Setup

- **Authentication**: Firebase Auth with email/password, persistent via `@react-native-async-storage/async-storage` (`getReactNativePersistence`).
- **Firestore**: Primary online database for users, teams, and submissions.
- **Storage**: File uploads for activity videos and images (50 MB max per file).

Firebase configuration is in `/firebase.js` (project ID: `cse3mad-fp`).

### Firestore Collections

| Collection | Document ID | Key Fields |
|---|---|---|
| `users` | `{uid}` | `firstName`, `email`, `createdAt`, `teamId?` |
| `teams` | `{teamId}` | `teamName`, `gradeLevel`, `members[]`, `memberUids[]`, `inviteCode` |
| `submissions` | `{auto}` | `userId`, `teamId`, `activityKey`, `logs[]`, `reflection`, `submittedAt`, `rating?`, `media?` |

## 3. Team Authentication & Authorization

### Auth Flow
1. User signs up with email/password → Firebase Auth creates account.
2. On auth state change (`onAuthStateChanged`), `AuthContext` listens to the user's Firestore doc.
3. If the user doc contains a `teamId`, the context subscribes to the team document via `onSnapshot`.

### Firestore Rules (team-based isolation)
- Users can read/write only their own `users` document.
- Team creation requires the creator to be the first member with role `leader`.
- Team members are tracked via a flat `memberUids` array for rule matching (`hasAny`).
- Only team members can update a team document.
- Submissions enforce `userId == uid()` on create; they can be read only by members of the owning team.
- See `firestore.rules` for the full rule set.

### Invite Codes
- Each team has a 6-character `inviteCode` used for joining.
- QR codes can be shared for scanning to join a team.

## 4. Seven Activities

| Activity Key | Name | Core Sensor | Key Metrics |
|---|---|---|---|
| `parachute-drop-challenge` | Parachute Drop Challenge | Camera (slow-mo video) | Velocity, G-force, Contact Time, Surface Area, Drag Force |
| `sound-pollution-hunter` | Sound Pollution Hunter | Microphone | Decibel (dB) level, Hearing Risk Scale, GPS location |
| `hand-fan-challenge` | Hand Fan Challenge | Manual angle input | Deflection Angle, Estimated Force (F ≈ k × θ) |
| `earthquake-resistant-structure` | Earthquake-Resistant Structure | Accelerometer | Sway (cm), Peak Accel, Fold/Pillar Count |
| `stretch-speed-and-gracefulness` | Stretch Speed & Gracefulness | Accelerometer | Vibrations Detected, Smoothness Score (0-100%) |
| `reaction-board-challenge` | Reaction Board Challenge | Touch screen | Reaction Time (ms), Tracing Accuracy (%) |
| `breathing-pace-trainer` | Breathing Pace Trainer | Accelerometer (chest) | Breaths Per Minute (BPM) |

Each activity has:
- A dedicated **attempt component** in `components/` that handles its unique experiment UI.
- A **results screen** in `app/activityResults/` showing data, theory explanations, and leaderboard submission.
- **i18n translations** for all labels, instructions, equipment, and theory content in all 4 languages.

## 5. Leaderboard Scoring

The leaderboard is computed client-side by:
1. Querying all `submissions` documents from Firestore.
2. Grouping by `teamId` and counting submissions per team (optionally filtered by `activityKey`).
3. Sorting teams by submission count descending (top 20).
4. Displaying with medal emojis for top 3.

Note: The current implementation scores by **submission count**, not by a physics-based composite metric. This is visible in `app/(tabs)/leaderboard.tsx`.

The leaderboard is refreshed via pull-to-refresh and supports two modes:
- **Global** — all activities combined.
- **By Activity** — filtered by a specific activity chip.

## 6. Offline SQLite (expo-sqlite)

An offline SQLite database (`stemm_lab.db`) stores experiment data locally:

### Tables
- `activities` — Tracks start/completion per activity session (with optional `teamId`, `userId`).
- `experiment_logs` — Records individual experiment trials with JSON data payload.
- `ratings` — User ratings per activity.

### Sync Mechanism
- Each log row has a `synced` flag (0 = pending, 1 = synced).
- `getPendingSyncLogs()` retrieves unsynced entries.
- `markLogSynced(id)` marks an entry as synced after successful Firestore upload.
- The helper functions in `utils/database.ts` provide the full CRUD interface.

### AsyncStorage also stores:
- **Experiment logs** (via `ActivityContext`) as a JSON array in `@stemm_experiment_logs`.
- **Theme preference** in `APP_THEME`.

## 7. Internationalization (i18n)

Using **i18next** + **react-i18next** + **expo-localization**:

- **Languages**: English (en), Japanese (ja), Indonesian (id), Chinese (zh).
- **Auto-detection**: Uses `expo-localization` `getLocales()` on init.
- **Fallback**: English.
- **Scope**: All UI text — tab labels, buttons, form fields, error messages, activity instructions, theory explanations, leaderboard, journal, settings, privacy policy, and terms of service.
- **Activity content**: Instructions, equipment descriptions, and theory are loaded from i18n keys, allowing full multilingual activity content.
- **Initialization**: `initI18n()` is called in `app/_layout.tsx` on mount.

See `i18n.js` for the full resource structure with `en`, `ja`, `id`, and `zh` namespaces.

## 8. Charting

Using **victory-native** (from `@shopify/react-native-skia` + `victory-native`) for data visualization:

- `components/lineChart.tsx` — Reusable line chart component (used for earthquake sway data, breathing patterns, etc.).
- `components/barChart.tsx` — Reusable bar chart component (used for reaction times, dB levels, etc.).

Chart data is sourced from experiment logs stored either in the ActivityContext (in-memory + AsyncStorage) or from the SQLite database.

## 9. React Query (@tanstack/react-query)

- **QueryClient** is created in `app/_layout.tsx` and provided via `QueryClientProvider`.
- `hooks/useSubmissions.ts` exposes:
  - `useTeamSubmissions(teamId)` — Fetch all submissions for a team.
  - `useActivitySubmissions(activityKey, teamId)` — Fetch submissions filtered by activity.
  - `useSubmitActivity()` — Mutation to submit activity data to Firestore, with automatic query invalidation on success.
- React Query handles loading/error states and cache management for Firestore reads.

## 10. Theme (Dark/Light)

- **Default**: Dark mode (`backgroundColor: #020617`, cyan primary `#22d3ee`).
- **Light mode**: White background, blue primary `#2F80ED`.
- **Persistence**: Theme choice saved to AsyncStorage under `APP_THEME`.
- **Context**: `ThemeContext` loads saved theme on mount, falls back to system color scheme via `useColorScheme()`.
- **Colors**: Defined in `theme/colors.ts` as `darkTheme` and `lightTheme` objects.
- **Usage**: Components call `useTheme()` to get `{ theme, isDark, changeTheme }`.

## 11. EAS Builds

Defined in `eas.json`:

| Profile | Type | Distribution | Notes |
|---|---|---|---|
| `development` | dev client | internal | For development builds |
| `preview` | APK | internal | Android-only APK for testing |
| `production` | App Bundle | store | Android AAB for Play Store |

iOS builds can be added by extending the profiles.

## 12. Key Dependencies

| Package | Purpose |
|---|---|
| `firebase` | Auth, Firestore, Storage |
| `expo-sqlite` | Local offline database |
| `@tanstack/react-query` | Server-state management for Firestore |
| `victory-native` | Charting (line/bar charts) |
| `i18next` + `react-i18next` | Internationalization |
| `expo-router` | File-based navigation |
| `expo-sensors` | Accelerometer access |
| `expo-camera` | Video recording for experiments |
| `expo-location` | GPS for sound map |
| `react-native-reanimated` | Animations |
| `expo-haptics` | Haptic feedback (reaction board) |
| `expo-av` | Audio recording (sound pollution) |
