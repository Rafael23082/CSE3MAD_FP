# STEMM Lab — Feature Implementation Checklist

> Updated for Expo SDK 54 / React Native 0.81.5 / TypeScript

---

## I. Screens & Navigation

- [x] **Login / Register screen** — Email + password via Firebase Auth
- [x] **2-Step Signup flow** — Team name + team member names (2-4 students)
- [x] **Home Dashboard screen** — Activities progress (3/7), progress bar, link to Progression Board
- [x] **Experiment List screen** — 7 activities with categories
- [x] **Experiment Runner screen** — Core experiment screen with sensor readouts, instructions, data collection
- [x] **Journal screen** — Saved attempts with submit/replace/delete actions
- [x] **Activity Results screen** — Charts, analytics, ratings (no submission buttons)
- [x] **Progression Board screen** — Points-based ranking, progress bars
- [x] **Settings screen** — Profile, team info, appearance, about
- [x] **Navigation Component** — Bottom tab bar with expo-router

## II. Firebase Integration

- [x] **Firebase Authentication** — Email/Password auth
- [x] **Cloud Firestore data model** — users, activityAttempts, activityProgress, submissions
- [x] **Firestore offline persistence** — SQLite for offline data caching
- [x] **Firestore indexes** — activityProgress (userId + isCompleted), activityAttempts (userId + activityKey)

## III. Device Sensors

- [x] **Accelerometer integration** — For earthquake, breathing, reaction activities
- [x] **Microphone/sound level** — For sound pollution activity
- [x] **Vibration sensor** — For movement tracking
- [x] **Timer system** — For reaction time, breathing pace

## IV. Data Storage (SQLite)

- [x] **SQLite tables** — activity_attempts, activity_progress, experiment_logs
- [x] **Offline-first approach** — Save locally, sync to Firestore
- [x] **Dual storage** — Both SQLite and Firestore for data integrity

## V. Team Progression Board

- [x] **Activity attempts saved** — During experiment, view-only after saving
- [x] **Journal-based submission** — Submit to leaderboard from Journal only
- [x] **Official submission tracking** — isLeaderboardSubmission flag
- [x] **Replacement submission** — Replace official submission (no point increase)
- [x] **Points system** — 100 points per activity, max 700
- [x] **Ranking logic** — Points DESC, then currentScoreReachedAt ASC
- [x] **Progress visualization** — Color-coded progress bars (red → yellow → green)

## VI. Internationalization

- [x] **English translations** — All new keys for journal, leaderboard, home
- [x] **Japanese translations** — All new keys for journal, leaderboard, home

## VII. Activity Screens (7 Activities)

- [x] **Parachute Drop Challenge** — Physics analysis, G-force, velocity
- [x] **Sound Pollution Hunter** — Decibel measurement, GPS mapping
- [x] **Hand Fan Challenge** — Force estimation, bend angle
- [x] **Earthquake-Resistant Structure** — Accelerometer data, vibration
- [x] **Human Performance Lab** — Movement tracking, smoothness
- [x] **Reaction Board Challenge** — Reaction time, tracing accuracy
- [x] **Breathing Pace Trainer** — BPM measurement, chest movement

## VIII. Testing

- [ ] **Manual testing checklist** — 10 critical tests before demo
- [ ] **TypeScript verification** — 0 new errors
- [ ] **ESLint verification** — 0 new errors

## IX. Documentation

- [x] **Progress summary** — Implementation overview
- [x] **Testing guide** — Manual testing checklist
- [x] **Data model documentation** — Firestore + SQLite schemas

---

## Completed Features Summary

| Feature | Status |
|---------|--------|
| 2-step signup flow | ✅ Complete |
| Activity attempts (save/view) | ✅ Complete |
| Journal submission workflow | ✅ Complete |
| Progression board (points ranking) | ✅ Complete |
| Home screen (activities display) | ✅ Complete |
| Firestore indexes | ✅ Complete |
| EN + JA translations | ✅ Complete |
| Manual testing | ⏳ Pending |
