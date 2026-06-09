# STEMM Lab - Progress Log

## Session: Team Removal & Code Cleanup

**Date:** June 9, 2026
**Goal:** Simplify auth & team workflow (1 account = 1 team), remove team creation/management code, fix CodeRabbit findings

---

## Phase 1: Delete Team Files

| File | Action |
|------|--------|
| `app/teamInitialization.tsx` | Deleted |
| `app/(tabs)/settings/team/index.tsx` | Deleted |
| `app/(tabs)/settings/team/members.tsx` | Deleted |
| `app/(tabs)/settings/team/teamInformation.tsx` | Deleted |
| `app/(tabs)/settings/team/teamRoles.tsx` | Deleted |
| `components/memberCard.tsx` | Deleted |

---

## Phase 2: Auth Context & Types

| File | Change |
|------|--------|
| `context/AuthContext.tsx` | Removed `team`, `teamId` from context. `UserProfile` now has `displayName` instead of `firstName` |
| `constants/types.ts` | Removed `Team`, `TeamMember` interfaces. Removed `teamId` from `Submission` |

---

## Phase 3: Signup Flow

| File | Change |
|------|--------|
| `app/signup.tsx` | `firstName` → `displayName`. Navigates to `/(tabs)` instead of `/teamInitialization` |
| `app/(tabs)/settings/account/index.tsx` | `firstName` → `displayName` |
| `app/(tabs)/settings/index.tsx` | Removed team settings link |

---

## Phase 4: Submissions Layer

| File | Change |
|------|--------|
| `hooks/useSubmissions.ts` | `useTeamSubmissions` → `useUserSubmissions`. Queries by `userId` instead of `teamId` |
| `utils/activitySubmissions.ts` | Removed `teamId` from submission payload |
| `utils/activityPersistence.ts` | Removed `teamId` from all interfaces, SQLite functions, and Firestore writes |
| `utils/backgroundSync.ts` | Removed `teamId` from sync logic |
| `utils/database.ts` | Removed `team_id` from SQLite schema |
| `utils/__tests__/activityPersistence.test.ts` | Updated tests to remove `teamId` |

---

## Phase 5: Home Screen

| File | Change |
|------|--------|
| `app/(tabs)/index.tsx` | Removed team refs. Shows completion status. Fixed listener leak (`onSnapshot` → `getDocs` for refresh) |

---

## Phase 6: Results Screens (7 files)

| File | Change |
|------|--------|
| `app/activityResults/parachuteResults.tsx` | Removed `teamId` from mutation. Fixed i18n strings |
| `app/activityResults/soundResults.tsx` | Removed `teamId` from mutation. Fixed i18n strings |
| `app/activityResults/fanResults.tsx` | Removed `teamId` from mutation |
| `app/activityResults/earthquakeResults.tsx` | Removed `teamId` from mutation |
| `app/activityResults/humanPerformanceResults.tsx` | Removed `teamId` from mutation |
| `app/activityResults/reactionResults.tsx` | Removed `teamId` from mutation. Fixed i18n strings |
| `app/activityResults/breathingResults.tsx` | Removed `teamId` from mutation |

---

## Phase 7: Progress & Leaderboard

| File | Change |
|------|--------|
| `app/progress.tsx` | `useTeamSubmissions` → `useUserSubmissions` with `userId` |
| `app/(tabs)/leaderboard.tsx` | Groups by `userId` instead of `teamId`. Fetches `users` collection for `displayName` |

---

## Phase 8: Journal

| File | Change |
|------|--------|
| `app/activityAttempt/journal.tsx` | Removed `teamId` from submission payload. Removed team confirmation dialog |

---

## Phase 9: Rules & Config

| File | Change |
|------|--------|
| `firestore.rules` | Removed teams collection rules. User-based submission reads |
| `storage.rules` | User-based access for submissions |
| `app.json` | Removed deprecated Android permissions (`READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`) |

---

## Phase 10: Media & Ads

| File | Change |
|------|--------|
| `components/parachuteAttempt.tsx` | Added recording timer. Gallery save via `expo-media-library` |
| `components/AdBanner.tsx` | Fixed Expo Go detection (removed `undefined` check) |
| `app.json` | Added `expo-media-library` plugin and permissions |

---

## Phase 11: i18n Updates

| File | Change |
|------|--------|
| `i18n.js` | Removed all team-related keys. Updated `firstName` → `displayName` in EN/JA/ID/ZH. Added `leaderboard.user`, `signinToTrackProgress` |

---

## Phase 12: CodeRabbit Fixes

| Issue | Severity | File | Fix |
|-------|----------|------|-----|
| Listener leak in `onRefresh` | MAJOR | `app/(tabs)/index.tsx` | `Promise.resolve(onSnapshot(...))` → `getDocs` |
| Expo Go detection | MAJOR | `components/AdBanner.tsx` | Removed `|| executionEnv === undefined` |
| Hardcoded i18n strings | MINOR | 3 result screens | Replaced with `t()` calls |
| Deprecated permissions | MINOR | `app.json` | Removed `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` |

---

## Phase 13: Hook Violation Fix

| File | Change |
|------|--------|
| `components/earthquakeAttempt.tsx` | Moved all hooks before early return to fix `react-hooks/rules-of-hooks` violation |

---

## Verification Results

| Check | Result |
|-------|--------|
| TypeScript | ✅ 0 errors |
| ESLint | ✅ 0 errors, 71 warnings |
| CodeRabbit | ✅ All findings addressed |

---

## Remaining Warnings (Low Priority)

- Unused variables (~30)
- `==` vs `===` (16)
- Missing hook dependencies (10)
- Import duplicates (2)

---

## Architecture Changes

### Before
```
1 account → team creation/join → shared team submissions
Collections: users, teams, submissions, teamMembers, teamInvitations, pendingTeams
```

### After
```
1 account = 1 team (implicit)
Collections: users, submissions only
```

### Data Model
```
users/{uid}: { uid, displayName, email, createdAt }
submissions/{id}: { userId, activityKey, logs, reflection, submittedAt, rating, media }
```
