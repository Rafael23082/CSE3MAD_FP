# STEMM Lab Team Progression Board — Implementation Summary

## Project Overview

**STEMM Lab** is a collaborative STEM learning mobile application built with Expo SDK 54, React Native 0.81.5, and TypeScript. The app supports team-based experiments with real-time data collection, activity management, and progress tracking.

**Goal:** Implement a team-based progression board with points, replacing the legacy score-based leaderboard system with a completion-based points system.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Two separate Firestore collections (`activityAttempts` + `activityProgress`) | Avoids searching for `isLeaderboardSubmission === true` across all attempts |
| `isLeaderboardSubmission` flag instead of overloading `isCompleted` | Clear intent, no ambiguity |
| `officialSubmissionAttemptId` on activityProgress docs | Cleaner than querying attempts for official submissions |
| Points-based (100 per activity, max 700) instead of quality scoring | Simpler, gamified, no subjective grading |
| Attempt lifecycle: Save during experiment → View-only after | Prevents editing submitted data |
| Submission only from Journal tab | Single entry point, cleaner UX |
| `currentScoreReachedAt` for ranking tiebreaker | First to reach score wins (deterministic) |

---

## Phases Implemented

### Phase 1: Auth (2-Step Signup Flow)

**Files Modified:**
- `constants/data.ts` — Added `TOTAL_ACTIVITIES = 7`, `POINTS_PER_ACTIVITY = 100`, `MAX_POINTS = 700`
- `constants/types.ts` — Added `TeamMember`, `ActivityLogEntry`, `ActivityAttempt`, `ActivityProgress` interfaces; updated `TeamProfile`
- `app/signup.tsx` — Rewritten for 2-step flow (Team Name + Email + Password → Team Member Names)
- `i18n.js` — Added `signup.*` keys (EN + JA)

### Phase 2: Attempts Service

**Files Created:**
- `utils/activityAttempts.ts` — Full CRUD service for attempts and progress (Firestore + SQLite)

**Key Functions:**
- `saveAttempt()` — Create/update attempt during experiment
- `submitToLeaderboard()` — Mark attempt as official submission
- `replaceSubmission()` — Replace official submission (no point increase)
- `unsubmitAttempt()` — Remove official submission status
- `deleteAttempt()` — Delete draft attempts (block submitted attempts)
- `getActivityProgress()` — Get team's progress for all activities
- `getAllTeamsProgress()` — Get all teams' progress for leaderboard

### Phase 3: Journal (Activity Attempt Management)

**Files Modified:**
- `app/activityAttempt/journal.tsx` — Rewritten to show all attempts with submit/replace/delete actions

**Features:**
- Lists all saved attempts for the activity
- Shows submitted vs draft status
- Submit to leaderboard from Journal only
- Replace existing submission
- Delete draft attempts (block submitted attempts with warning)

### Phase 4: Experiment (Save Attempt)

**Files Modified:**
- `app/activityAttempt/index.tsx` — Added "Save Attempt" button

**Workflow:**
- Saves attempt to Firestore + SQLite during experiment
- Creates activityProgress record if first attempt
- Shows notification on success/error

### Phase 5: Activity Results (Remove Submission)

**Files Modified (7 files):**
- `app/activityResults/parachuteResults.tsx`
- `app/activityResults/soundResults.tsx`
- `app/activityResults/fanResults.tsx`
- `app/activityResults/earthquakeResults.tsx`
- `app/activityResults/breathingResults.tsx`
- `app/activityResults/reactionResults.tsx`
- `app/activityResults/humanPerformanceResults.tsx`

**Changes:** Removed "Submit to Leaderboard" functionality from all activity results screens. Analytics, charts, and ratings remain.

### Phase 6: Progression Board (Leaderboard)

**Files Modified:**
- `app/(tabs)/leaderboard.tsx` — Rewritten for points-based ranking

**Features:**
- Fetches from `activityProgress` collection
- Teams ranked by total points (DESC), then first-to-reach score (ASC)
- Progress bars with color coding (red → yellow → green)
- Shows completed activity count (e.g., "3/7 activities")
- Points display (e.g., "300 / 700")

### Phase 7: Home Screen

**Files Modified:**
- `app/(tabs)/index.tsx` — Updated to show activities only

**Changes:**
- Activities display: "3/7 Activities Completed" with color-coded progress bar
- Link to Progression Board
- Recent activity from progress data
- Removed points badge (points shown on leaderboard only)

### Phase 8: Progression Calculation

**Files Created:**
- `utils/progressCalculation.ts` — Points-based ranking and progress calculation

**Key Functions:**
- `calculateProgressPercentage()` — Calculate completion percentage
- `getProgressColor()` — Color-coded progress bar (red → yellow → green)
- `rankTeams()` — Rank teams by points, then first-to-reach score
- `getProgressionBoardData()` — Fetch all teams' progress from Firestore

### Phase 9: Internationalization

**Files Modified:**
- `i18n.js` — Added keys for EN + JA

**New Keys:**
- `journal.*` — Attempt management (save, submit, replace, delete)
- `leaderboard.*` — Progression board (points, team, activitiesCompleted)
- `home.*` — Activities display, progression board link

### Phase 10: Ranking Logic Fix

**Files Modified:**
- `constants/types.ts` — Added `currentScoreReachedAt` to `ActivityProgress` interface
- `utils/activityAttempts.ts` — Update `currentScoreReachedAt = now` when points increase
- `utils/progressCalculation.ts` — Sort by `currentScoreReachedAt` ASC (first to reach score wins)

### Phase 11: Firestore Indexes

**Files Modified:**
- `firestore.indexes.json` — Added indexes for activityProgress and activityAttempts

---

## Files Summary

### New Files (2)
| File | Purpose |
|------|---------|
| `utils/activityAttempts.ts` | CRUD service for attempts and progress |
| `utils/progressCalculation.ts` | Points-based ranking and progress calculation |

### Modified Files (14)
| File | Change |
|------|--------|
| `constants/data.ts` | Added activity constants |
| `constants/types.ts` | Added interfaces |
| `app/signup.tsx` | 2-step signup flow |
| `app/(tabs)/leaderboard.tsx` | Points-based progression board |
| `app/(tabs)/index.tsx` | Activities display on home |
| `app/activityAttempt/index.tsx` | Save attempt button |
| `app/activityAttempt/journal.tsx` | Attempt management |
| `app/activityResults/*.tsx` (7) | Removed submission buttons |
| `firestore.indexes.json` | Added indexes |
| `i18n.js` | EN + JA translations |

---

## Data Model

### activityAttempts Collection
```typescript
{
  id: string;                    // auto-generated
  userId: string;                // team owner UID
  activityKey: string;           // e.g., "parachute-drop-challenge"
  attemptNumber: number;         // 1, 2, 3, ...
  logIndex: number;              // index in experimentLogs
  data: any;                     // experiment data (experimentLogs[index].data)
  timestamp: Timestamp;          // when attempt was saved
  reflection?: string;           // optional reflection text
  isLeaderboardSubmission: boolean; // true = official submission
  submittedToLeaderboardAt?: Timestamp; // when submitted
  attemptDocId?: string;         // Firestore document ID
  localId?: number;              // SQLite local ID
}
```

### activityProgress Collection
```typescript
{
  id: string;                    // auto-generated
  userId: string;                // team owner UID
  activityKey: string;           // e.g., "parachute-drop-challenge"
  points: number;                // 100 per completed activity
  isCompleted: boolean;          // true = officially submitted
  completedAt?: Timestamp;       // when first submitted
  currentScoreReachedAt?: Timestamp; // when team last gained points
  officialSubmissionAttemptId?: string; // ID of official attempt
}
```

---

## Verification Status

| Check | Status |
|-------|--------|
| TypeScript compilation | ✅ Pass (only pre-existing expo-battery error) |
| ESLint | ✅ Pass (only pre-existing warnings) |
| All files created/modified | ✅ Verified |
| Data model consistency | ✅ Consistent across Firestore + SQLite |
| i18n completeness | ✅ EN + JA for all new keys |
| Git merge | ✅ Clean (1 conflict resolved) |
| Push to main | ✅ Success (`544ff4e`) |
