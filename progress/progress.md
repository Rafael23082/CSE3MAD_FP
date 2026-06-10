# STEMM Lab - Progress Log

## Session: Team Progression Board Implementation

**Date:** June 10, 2026
**Goal:** Implement team-based progression board with points, replace legacy score-based leaderboard

---

## Phase 1: Auth (2-Step Signup Flow)

| File | Change |
|------|--------|
| `constants/data.ts` | Added `TOTAL_ACTIVITIES = 7`, `POINTS_PER_ACTIVITY = 100`, `MAX_POINTS = 700` |
| `constants/types.ts` | Added `TeamMember`, `ActivityLogEntry`, `ActivityAttempt`, `ActivityProgress` interfaces |
| `app/signup.tsx` | Rewritten for 2-step flow (Team Name + Email + Password → Team Member Names) |
| `i18n.js` | Added `signup.*` keys (EN + JA) |

---

## Phase 2: Attempts Service

| File | Change |
|------|--------|
| `utils/activityAttempts.ts` | **New** — Full CRUD service for attempts and progress (Firestore + SQLite) |

**Key Functions:**
- `saveAttempt()` — Create/update attempt during experiment
- `submitToLeaderboard()` — Mark attempt as official submission
- `replaceSubmission()` — Replace official submission (no point increase)
- `unsubmitAttempt()` — Remove official submission status
- `deleteAttempt()` — Delete draft attempts (block submitted attempts)
- `getActivityProgress()` — Get team's progress for all activities
- `getAllTeamsProgress()` — Get all teams' progress for leaderboard

---

## Phase 3: Journal (Activity Attempt Management)

| File | Change |
|------|--------|
| `app/activityAttempt/journal.tsx` | Rewritten to show all attempts with submit/replace/delete actions |

**Features:**
- Lists all saved attempts for the activity
- Shows submitted vs draft status
- Submit to leaderboard from Journal only
- Replace existing submission
- Delete draft attempts (block submitted attempts with warning)

---

## Phase 4: Experiment (Save Attempt)

| File | Change |
|------|--------|
| `app/activityAttempt/index.tsx` | Added "Save Attempt" button |

**Workflow:**
- Saves attempt to Firestore + SQLite during experiment
- Creates activityProgress record if first attempt
- Shows notification on success/error

---

## Phase 5: Activity Results (Remove Submission)

| File | Change |
|------|--------|
| `app/activityResults/parachuteResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/soundResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/fanResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/earthquakeResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/breathingResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/reactionResults.tsx` | Removed "Submit to Leaderboard" functionality |
| `app/activityResults/humanPerformanceResults.tsx` | Removed "Submit to Leaderboard" functionality |

**Changes:** Analytics, charts, and ratings remain. Submission moved to Journal only.

---

## Phase 6: Progression Board (Leaderboard)

| File | Change |
|------|--------|
| `app/(tabs)/leaderboard.tsx` | Rewritten for points-based ranking |

**Features:**
- Fetches from `activityProgress` collection
- Teams ranked by total points (DESC), then first-to-reach score (ASC)
- Progress bars with color coding (red → yellow → green)
- Shows completed activity count (e.g., "3/7 activities")
- Points display (e.g., "300 / 700")

---

## Phase 7: Home Screen

| File | Change |
|------|--------|
| `app/(tabs)/index.tsx` | Updated to show activities only |

**Changes:**
- Activities display: "3/7 Activities Completed" with color-coded progress bar
- Link to Progression Board
- Recent activity from progress data
- Removed points badge (points shown on leaderboard only)

---

## Phase 8: Progression Calculation

| File | Change |
|------|--------|
| `utils/progressCalculation.ts` | **New** — Points-based ranking and progress calculation |

**Key Functions:**
- `calculateProgressPercentage()` — Calculate completion percentage
- `getProgressColor()` — Color-coded progress bar (red → yellow → green)
- `rankTeams()` — Rank teams by points, then first-to-reach score
- `getProgressionBoardData()` — Fetch all teams' progress from Firestore

---

## Phase 9: Internationalization

| File | Change |
|------|--------|
| `i18n.js` | Added keys for EN + JA |

**New Keys:**
- `journal.*` — Attempt management (save, submit, replace, delete)
- `leaderboard.*` — Progression board (points, team, activitiesCompleted)
- `home.*` — Activities display, progression board link

---

## Phase 10: Ranking Logic Fix

| File | Change |
|------|--------|
| `constants/types.ts` | Added `currentScoreReachedAt` to `ActivityProgress` interface |
| `utils/activityAttempts.ts` | Update `currentScoreReachedAt = now` when points increase |
| `utils/progressCalculation.ts` | Sort by `currentScoreReachedAt` ASC (first to reach score wins) |

**Logic:**
- First submission: `currentScoreReachedAt = now`
- Replacement submission: `currentScoreReachedAt` unchanged (points stay same)
- Ranking: Points DESC, then `currentScoreReachedAt` ASC

---

## Phase 11: Firestore Indexes

| File | Change |
|------|--------|
| `firestore.indexes.json` | Added indexes for activityProgress and activityAttempts |

**Indexes:**
- `activityProgress`: `userId` ASC + `isCompleted` ASC
- `activityAttempts`: `userId` ASC + `activityKey` ASC

---

## Phase 12: Merge & Push

| Action | Result |
|--------|--------|
| Stashed local changes | ✅ Success |
| Pulled remote changes | ✅ Fast-forward |
| Resolved conflicts | ✅ 1 conflict in `app/(tabs)/index.tsx` (imports) |
| Committed | ✅ `544ff4e` |
| Pushed to main | ✅ Success |

---

## Verification Results

| Check | Result |
|-------|--------|
| TypeScript | ✅ 0 new errors (only pre-existing expo-battery) |
| ESLint | ✅ 0 new errors |
| Git merge | ✅ Clean (1 conflict resolved) |
| Push to main | ✅ Success |

---

## Architecture Changes

### Before (Legacy Leaderboard)
```
1 account → submissions collection → quality scoring
Ranking: subjective scores, no completion tracking
```

### After (Team Progression Board)
```
1 account = 1 team → activityAttempts + activityProgress collections
Ranking: 100 points per activity, max 700
```

### Data Model
```
users/{uid}: { displayName, email, teamMembers[], createdAt }
activityAttempts/{id}: { userId, activityKey, data, isLeaderboardSubmission, ... }
activityProgress/{id}: { userId, activityKey, points, isCompleted, currentScoreReachedAt, ... }
```
