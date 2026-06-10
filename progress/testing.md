# STEMM Lab Team Progression Board — Testing & Verification

## Pre-Existing Issues (Unrelated to Implementation)

These issues existed before the implementation and are NOT caused by our changes:

| Issue | File | Status |
|-------|------|--------|
| `expo-battery` module not found | `app/activityAttempt/index.tsx:14` | Pre-existing |
| Conditional `useEffect` hook | `app/activityAttempt/index.tsx:33` | Pre-existing |
| Missing `t` dependency in `useEffect` | `app/activityAttempt/index.tsx:47` | Pre-existing |
| Missing `logs` dependency in `useEffect` | Multiple activityResults files | Pre-existing |
| Unused `router` in settings | contactSupport, privacyPolicy, termsOfService | Pre-existing |
| Unused `error` in changePassword | `changePassword.tsx:58` | Pre-existing |

---

## Static Verification

### TypeScript Check

**Command:**
```bash
npx tsc --noEmit
```

**Result:**
```
app/activityAttempt/index.tsx(14,26): error TS2307: Cannot find module 'expo-battery'
```

**Analysis:**
- **1 error** — pre-existing `expo-battery` import issue
- **0 new errors** introduced by implementation
- All new files compile successfully
- All modified files compile successfully

### ESLint Check

**Command:**
```bash
npx eslint . --max-warnings=10
```

**Result:**
- **0 errors** in our modified files
- All warnings are pre-existing in other files
- New files pass lint cleanly

**Specific File Check:**
```bash
npx eslint "./app/(tabs)/leaderboard.tsx" "./app/(tabs)/index.tsx" "./utils/progressCalculation.ts" "./utils/activityAttempts.ts" --max-warnings=0
# Result: ✅ Clean
```

### Git Verification

**Command:**
```bash
git status
git log --oneline -3
```

**Result:**
- All changes committed (`544ff4e`)
- Pushed to main successfully
- Working tree clean

---

## Manual Testing Checklist

### Critical Test 1: Signup Flow

- [ ] Open app → Sign up with new team
- [ ] Enter team name (Step 1)
- [ ] Add 2–4 team members (Step 2)
- [ ] Complete registration
- **Expected:** Redirected to home screen

### Critical Test 2: Save Attempt During Experiment

- [ ] Start any activity (e.g., Parachute Drop)
- [ ] Complete the experiment
- [ ] Tap "Save Attempt"
- **Expected:** Notification "Attempt saved successfully"

### Critical Test 3: View Attempts in Journal

- [ ] Go to Journal tab
- [ ] Select the same activity
- **Expected:** See saved attempt with "Draft" status

### Critical Test 4: Submit to Leaderboard

- [ ] In Journal, tap "Submit to Leaderboard"
- **Expected:** Status changes to "Submitted"

### Critical Test 5: Replacement Submission

- [ ] Save another attempt during experiment
- [ ] Go to Journal → Submit the new attempt
- **Expected:** Old attempt unsubmitted, new attempt submitted, points stay 100

### Critical Test 6: Delete Blocked

- [ ] Try to delete a submitted attempt
- **Expected:** Warning "You cannot delete a submitted attempt. Please unsubmit first."

### Critical Test 7: Progression Board

- [ ] Go to Leaderboard tab
- **Expected:** See your team with 100 points, 1/7 activities, progress bar colored

### Critical Test 8: Home Screen

- [ ] Go to Home tab
- **Expected:** Shows "1/7 Activities Completed" with progress bar (no points)

### Critical Test 9: Multiple Teams

- [ ] Create second team (different account)
- [ ] Submit 2 activities
- **Expected:** Second team ranked #1 (200 pts), first team ranked #2 (100 pts)

### Critical Test 10: Offline Mode

- [ ] Disable WiFi/data
- [ ] Save an attempt
- [ ] Re-enable WiFi
- **Expected:** Attempt syncs to Firestore

---

## Edge Cases to Test

### Edge Case 1: Empty State

- [ ] New user with no submissions
- **Expected:** Empty states show appropriate messages

### Edge Case 2: Loading States

- [ ] Slow network connection
- **Expected:** Loading spinners display correctly

### Edge Case 3: Error Handling

- [ ] Disconnect during save
- **Expected:** Error message displayed, data saved locally

### Edge Case 4: Maximum Activities

- [ ] Complete all 7 activities
- **Expected:** 700 points, 7/7, 100% progress

### Edge Case 5: Same Points, Different Times

- [ ] Two teams with same points
- **Expected:** Team that reached score first ranks higher

---

## Verification Commands

```bash
# TypeScript check
npx tsc --noEmit

# Lint check
npx eslint . --max-warnings=10

# Check specific files
npx eslint "./app/(tabs)/leaderboard.tsx" "./app/(tabs)/index.tsx" --max-warnings=0

# Git status
git status

# Git log
git log --oneline -3
```

---

## Known Limitations

1. **Team detail page** — Not implemented (not needed per design decision)
2. **Expo battery** — Pre-existing TS error; unrelated to implementation
3. **Hook ordering** — Pre-existing conditional hook issue in `activityAttempt/index.tsx`

---

## Verification Results

| Check | Status |
|-------|--------|
| TypeScript | ✅ 0 new errors |
| ESLint | ✅ 0 new errors |
| All files created/modified | ✅ Verified |
| Data model consistency | ✅ Consistent across Firestore + SQLite |
| i18n completeness | ✅ EN + JA for all new keys |
| Git merge | ✅ Clean (1 conflict resolved) |
| Push to main | ✅ Success (`544ff4e`) |
| Manual testing | ⏳ Pending |

---

## Before Demo/Submission

Run through the **10 Critical Tests** above. All must pass before:

1. Taking screenshots for documentation
2. Writing final report
3. Submitting for assessment

**Estimated time:** 30-45 minutes for full manual testing
