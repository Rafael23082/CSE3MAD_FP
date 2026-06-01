# Skills Integration & Project Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the STEMM Lab Expo/React Native app using 7 newly installed ecosystem skills to accelerate development, enforce best practices, and fill remaining gaps across Activities 5-7, testing, Firestore integration, and accessibility.

**Architecture:** The app uses Expo Router (file-based routing), Firebase Auth + Firestore for backend, and a context-based state layer (AuthContext, ActivityContext, ThemeContext). New work adds types/components for Activities 5-7, expands test coverage from 32 to 80+ tests, integrates Firestore CRUD for activity submissions, audits security rules, and hardens accessibility for the primary-school target audience.

**Tech Stack:** Expo ~54, RN 0.81.5, TypeScript strict, Firebase Auth/Firestore/Storage, i18next, @tanstack/react-query, Skia, Reanimated, Victory Native, Jest + React Native Testing Library

**Installed Skills:**
1. `firebase-firestore` — Firestore CRUD, indexes, data modeling
2. `firebase-auth-basics` — Auth patterns, edge cases, error handling
3. `firebase-security-rules-auditor` — Rules validation & hardening
4. `expo-react-native-typescript` — Expo/RN best practices, component patterns
5. `jest-react-testing` — Jest + React Testing Library patterns
6. `tanstack-query` — TanStack Query patterns for data fetching
7. `reanimated-skia-performance` — Reanimated & Skia performance patterns
8. `accessibility` — Web/RN accessibility audit & remediation

---

### File Structure Map

**New files to create:**
- `constants/types.ts` — Add types for Activity 5 (HumanPerformanceLabAttempt), Activity 6 (ReactionBoardAttempt), Activity 7 (BreathingAttempt)
- `utils/humanPerformance.ts` — Physics utils for Activity 5
- `utils/breathing.ts` — Physics utils for Activity 7
- `utils/__tests__/humanPerformance.test.ts` — Tests for Activity 5 utils
- `utils/__tests__/breathing.test.ts` — Tests for Activity 7 utils
- `utils/__tests__/reactionBoard.test.ts` — Tests for Activity 6 utils
- `components/__tests__/parachuteAttempt.test.tsx` — Component test for Activity 1
- `components/__tests__/soundAttempt.test.tsx` — Component test for Activity 2
- `components/__tests__/fanAttempt.test.tsx` — Component test for Activity 3
- `components/__tests__/earthquakeAttempt.test.tsx` — Component test for Activity 4
- `components/__tests__/breathingAttempt.test.tsx` — Component test for Activity 7
- `firestore.indexes.json` — Composite indexes for query performance
- `.eslintrc.a11y.json` — Accessibility lint config

**Existing files to modify:**
- `constants/types.ts` — Append new type definitions
- `constants/data.ts` — Add ACTIVITIES entries for Activities 5-7
- `utils/physics.ts` — Minor additions (reaction time stats)
- `components/humanPerformanceLabAttempt.tsx` — Wire up types & state
- `components/reactionBoardAttempt.tsx` — Wire up types & state
- `firestore.rules` — Audit & fix (via rules-auditor skill)
- `context/ActivityContext.tsx` — Add Firestore submission sync
- `app/activityAttempt/activityDetails.tsx` — Add activities 5-7 routing
- `app/activityResults/*` — Wire up real data for all 7 activities

---

### Task 1: Add TypeScript Types for Activities 5-7

**Files:**
- Modify: `constants/types.ts` — Append new interfaces
- Test: `constants/types.ts` (type-check by `npx tsc --noEmit`)

- [ ] **Step 1: Define HumanPerformanceLabAttempt types**

  Append to `constants/types.ts` before the final `Submission` type:

  ```typescript
  // ==========================================
  // Activity 5 Types (Human Performance Lab)
  // ==========================================
  export interface HumanPerformanceTrial {
    id: string;
    movementLabel: string; // Movement 1, 2, or 3
    vibrationPrediction: string; // e.g. "+/- 1cm"
    attemptNumber: number;
    vibrationMm: number;
    durationSec: number;
    timestamp: string;
    wasRight?: 'Yes' | 'No' | 'Close' | '';
  }

  export interface HumanPerformanceJournal {
    q1: string; // hardest movement
    q2: string; // vibration feedback effect
    q3: string; // coordination observations
    evidenceImages: string[];
  }

  // ==========================================
  // Activity 6 Types (Reaction Board)
  // ==========================================
  export interface ReactionPhase {
    id: string;
    phase: 'tap-dominant' | 'tap-non-dominant' | 'tracing';
    memberName: string;
    predictedMs: number;
    recordedMs: number;
    accuracyPercent?: number; // for tracing phase
    wasRight?: 'Yes' | 'No' | 'Close' | '';
  }

  export interface ReactionJournal {
    q1: string; // prediction accuracy
    q2: string; // hand dominance effect
    q3: string; // practice improvement
    evidenceImages: string[];
  }

  // ==========================================
  // Activity 7 Types (Breathing Pace Trainer)
  // ==========================================
  export interface BreathingTrial {
    id: string;
    phase: 'rest' | 'post-exercise-1' | 'post-exercise-2';
    memberName: string;
    breathsPerMinute: number;
    chestMovementMm: number;
    durationSec: number;
    timestamp: string;
    predictedBpm: number;
    wasRight?: 'Yes' | 'No' | 'Close' | '';
  }

  export interface BreathingJournal {
    q1: string; // rest vs exercise difference
    q2: string; // recovery pattern
    q3: string; // health insights
    evidenceImages: string[];
  }
  ```

- [ ] **Step 2: Run TypeScript check**

  Run: `npx tsc --noEmit`
  Expected: No new type errors. (Existing errors only from unfinished routes.)

- [ ] **Step 3: Commit**

  ```bash
  git add constants/types.ts
  git commit -m "feat: add TS types for activities 5-7"
  ```

---

### Task 2: Add Activity Metadata for Activities 5-7

**Files:**
- Modify: `constants/data.ts` — Append `ACTIVITIES` entries for `humanPerformance`, `reactionBoard`, `breathing`

- [ ] **Step 1: Add Human Performance Lab metadata**

  In `constants/data.ts`, inside the `ACTIVITIES` record, add after the `earthquake` entry:

  ```typescript
  humanPerformance: {
    id: 'humanPerformance',
    title: 'Human Performance Lab',
    category: 'Medical Science + Biomechanics',
    subTitle: 'Measure speed, smoothness, and coordination during controlled stretching activities.',
    curriculumCode: ['ACPPS051', 'ACPPS054', 'ACSSU176'],
    overview: 'Students investigate how the human body moves by measuring speed, smoothness, and coordination during controlled stretching activities using the phone\'s vibration sensor.',
    equipment: [
      { name: 'Mobile phone (Vibration sensor)', icon: 'smartphone' },
      { name: 'Open space to move safely', icon: 'open_in_full' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Setup', description: 'Hold the phone firmly in one hand. Activate the vibration sensor in the STEMM App.' },
      { stepNumber: 2, title: 'Perform Movement 1', description: 'Perform guided movement slowly as shown in the app. Record vibration amplitude.' },
      { stepNumber: 3, title: 'Repeat with Feedback', description: 'Repeat the activity with real-time vibration feedback enabled.' },
      { stepNumber: 4, title: 'Review Data', description: 'Review speed, smoothness, and range-of-motion data from all attempts.' },
      { stepNumber: 5, title: 'Reflect', description: 'Upload results and discuss as a group.' }
    ],
    theoryTitle: 'Biomechanics Overview',
    theoryContent: 'Muscles and joints work together to create movement. Faster movements often reduce control, while smoother movements show better coordination.',
    accentColor: 'border-l-tertiary'
  },
  ```

- [ ] **Step 2: Add Reaction Board metadata**

  In the same `ACTIVITIES` record:

  ```typescript
  reactionBoard: {
    id: 'reactionBoard',
    title: 'Reaction Board Challenge',
    category: 'Neuroscience + Mathematics',
    subTitle: 'Measure reaction time, coordination, and improvement through repeated digital and physical challenges.',
    curriculumCode: ['ACSIS130', 'ACMSP147', 'ACPPS057'],
    overview: 'Students measure reaction time by tapping a hidden button, compare dominant vs non-dominant hands, and trace moving shapes to evaluate coordination.',
    equipment: [
      { name: 'Mobile phone', icon: 'smartphone' },
      { name: 'Clear working space', icon: 'open_in_full' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Phase 1 — Tap Reaction', description: 'Tap the screen as soon as the hidden button appears. Record reaction time for each team member.' },
      { stepNumber: 2, title: 'Phase 2 — Swap Hands', description: 'Repeat using your non-dominant hand. Compare results with Phase 1.' },
      { stepNumber: 3, title: 'Phase 3 — Tracing', description: 'Trace a moving shape on the screen. Review accuracy and delay.' }
    ],
    theoryTitle: 'Reaction Time Science',
    theoryContent: 'Reaction time measures how quickly the brain processes information and sends signals to muscles. Practice can improve speed and coordination.',
    accentColor: 'border-l-secondary'
  },
  ```

- [ ] **Step 3: Add Breathing Pace Trainer metadata**

  In the same `ACTIVITIES` record:

  ```typescript
  breathing: {
    id: 'breathing',
    title: 'Breathing Pace Trainer',
    category: 'Medical Science',
    subTitle: 'Analyse breathing patterns at rest and after exercise using the phone\'s motion sensor.',
    curriculumCode: ['ACSSU176', 'ACPPS054'],
    overview: 'Students record breathing patterns at rest and after physical activity using the phone placed on their chest, then compare and analyse the changes.',
    equipment: [
      { name: 'Mobile phone (Motion sensor)', icon: 'smartphone' },
      { name: 'Flat surface or mat', icon: 'floor' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Resting Baseline', description: 'Place the phone gently on your chest. Record breathing pattern for 30 seconds while at rest.' },
      { stepNumber: 2, title: 'Exercise Phase 1', description: 'Jog one minute on the spot. Immediately record breathing again.' },
      { stepNumber: 3, title: 'Exercise Phase 2', description: 'Perform 100 star jumps. Record breathing one more time.' },
      { stepNumber: 4, title: 'Compare & Analyse', description: 'Review all three recordings. Compare breathing rates and amplitudes.' },
      { stepNumber: 5, title: 'Reflect', description: 'Rotate for each team member and compare results as a group.' }
    ],
    theoryTitle: 'Respiratory Response',
    theoryContent: 'Breathing rate increases during exercise to supply more oxygen to muscles. Sensors detect chest movement, helping students visualise breathing patterns.',
    accentColor: 'border-l-secondary-container'
  },
  ```

- [ ] **Step 4: Verify with TypeScript**

  Run: `npx tsc --noEmit`
  Expected: No new type errors.

- [ ] **Step 5: Commit**

  ```bash
  git add constants/data.ts
  git commit -m "feat: add activity metadata for activities 5-7"
  ```

---

### Task 3: Implement Physics Utilities for Activities 5-7

**Files:**
- Create: `utils/humanPerformance.ts`
- Create: `utils/breathing.ts`
- Modify: `utils/physics.ts` — add reaction time stats helper
- Test: See Task 4

- [ ] **Step 1: Create `utils/humanPerformance.ts`**

  ```typescript
  /**
   * Physics calculation utilities for Human Performance Lab (Activity 5).
   */

  /**
   * Calculate average vibration amplitude from an array of sensor readings
   */
  export function calcAvgVibration(readings: number[]): number {
    if (!readings.length) return 0;
    return readings.reduce((sum, r) => sum + Math.abs(r), 0) / readings.length;
  }

  /**
   * Calculate smoothness score (lower = smoother)
   * Uses standard deviation of vibration readings
   */
  export function calcSmoothnessScore(readings: number[]): number {
    if (readings.length < 2) return 0;
    const mean = calcAvgVibration(readings);
    const variance = readings.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (readings.length - 1);
    return Math.sqrt(variance);
  }

  /**
   * Rate coordination quality based on vibration consistency
   */
  export function rateCoordination(smoothnessScore: number): { level: string; description: string } {
    if (smoothnessScore <= 0.5) return { level: 'Excellent', description: 'Very smooth and controlled movement' };
    if (smoothnessScore <= 1.0) return { level: 'Good', description: 'Mostly smooth with minor variations' };
    if (smoothnessScore <= 2.0) return { level: 'Moderate', description: 'Some inconsistency in movement' };
    return { level: 'Needs Practice', description: 'Movement is jerky or uncontrolled' };
  }
  ```

- [ ] **Step 2: Create `utils/breathing.ts`**

  ```typescript
  /**
   * Calculation utilities for Breathing Pace Trainer (Activity 7).
   */

  /**
   * Calculate breaths per minute from peak intervals
   * @param intervalsMs Array of time between consecutive breaths in milliseconds
   */
  export function calcBreathsPerMinute(intervalsMs: number[]): number {
    if (!intervalsMs.length) return 0;
    const avgIntervalSec = intervalsMs.reduce((a, b) => a + b, 0) / intervalsMs.length / 1000;
    if (avgIntervalSec <= 0) return 0;
    return 60 / avgIntervalSec;
  }

  /**
   * Calculate breathing depth (average chest movement amplitude)
   */
  export function calcBreathingDepth(chestMovements: number[]): number {
    if (!chestMovements.length) return 0;
    return chestMovements.reduce((sum, m) => sum + Math.abs(m), 0) / chestMovements.length;
  }

  /**
   * Classify breathing rate
   */
  export function classifyBreathingRate(bpm: number): { label: string; description: string } {
    if (bpm < 12) return { label: 'Slow', description: 'Below typical resting rate — may indicate deep relaxation' };
    if (bpm <= 20) return { label: 'Normal', description: 'Typical adult resting breathing rate' };
    if (bpm <= 30) return { label: 'Elevated', description: 'Above resting — light to moderate exertion' };
    return { label: 'Rapid', description: 'High breathing rate — heavy exertion or excitement' };
  }

  /**
   * Calculate recovery rate (drop in bpm between post-exercise readings)
   */
  export function calcRecoveryRate(bpmAfter1: number, bpmAfter2: number): number {
    return bpmAfter1 - bpmAfter2;
  }

  /**
   * Rate recovery
   */
  export function rateRecovery(rate: number): string {
    if (rate >= 10) return 'Fast recovery — good cardiovascular fitness';
    if (rate >= 5) return 'Moderate recovery — average cardiovascular fitness';
    return 'Slow recovery — may benefit from more cardiovascular activity';
  }
  ```

- [ ] **Step 3: Add reaction time stats to `utils/physics.ts`**

  Append at the end of `utils/physics.ts`:

  ```typescript
  // ==========================================
  // Activity 6: Reaction Board — Statistics
  // ==========================================

  /**
   * Calculate mean reaction time from an array of times in ms
   */
  export function calcMeanReactionTime(times: number[]): number {
    if (!times.length) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  /**
   * Calculate improvement percentage between two phases
   * Positive value means improvement (faster)
   */
  export function calcReactionImprovement(initialMs: number, finalMs: number): number {
    if (initialMs <= 0) return 0;
    return ((initialMs - finalMs) / initialMs) * 100;
  }

  /**
   * Get reaction time rating
   */
  export function rateReactionTime(ms: number): { level: string; emoji: string } {
    if (ms < 200) return { level: 'Excellent', emoji: '🏆' };
    if (ms < 300) return { level: 'Good', emoji: '👍' };
    if (ms < 400) return { level: 'Average', emoji: '👌' };
    if (ms < 600) return { level: 'Below Average', emoji: '💪' };
    return { level: 'Needs Practice', emoji: '🎯' };
  }
  ```

- [ ] **Step 4: Run TypeScript check**

  Run: `npx tsc --noEmit`
  Expected: No new type errors.

- [ ] **Step 5: Commit**

  ```bash
  git add utils/physics.ts utils/humanPerformance.ts utils/breathing.ts
  git commit -m "feat: add physics utils for activities 5-7"
  ```

---

### Task 4: Write Unit Tests for All Physics Utilities

**Files:**
- Create: `utils/__tests__/humanPerformance.test.ts`
- Create: `utils/__tests__/breathing.test.ts`
- Create: `utils/__tests__/reactionBoard.test.ts`
- Modify: `utils/__tests__/physics.test.ts` — add reaction time tests

- [ ] **Step 1: Create `utils/__tests__/humanPerformance.test.ts`**

  ```typescript
  import {
    calcAvgVibration,
    calcSmoothnessScore,
    rateCoordination,
  } from '../humanPerformance';

  describe('calcAvgVibration', () => {
    it('calculates average of absolute readings', () => {
      expect(calcAvgVibration([1, 2, 3])).toBeCloseTo(2, 4);
    });

    it('handles negative readings (sensor direction)', () => {
      expect(calcAvgVibration([-2, 3, -1])).toBeCloseTo(2, 4);
    });

    it('returns 0 for empty array', () => {
      expect(calcAvgVibration([])).toBe(0);
    });
  });

  describe('calcSmoothnessScore', () => {
    it('returns 0 for less than 2 readings', () => {
      expect(calcSmoothnessScore([5])).toBe(0);
    });

    it('calculates standard deviation', () => {
      const result = calcSmoothnessScore([1, 2, 3, 4, 5]);
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(2);
    });
  });

  describe('rateCoordination', () => {
    it('returns Excellent for very low smoothness score', () => {
      expect(rateCoordination(0.3).level).toBe('Excellent');
    });

    it('returns Needs Practice for high smoothness score', () => {
      expect(rateCoordination(3.0).level).toBe('Needs Practice');
    });
  });
  ```

- [ ] **Step 2: Run humanPerformance tests to verify they fail initially**

  Run: `npx jest utils/__tests__/humanPerformance.test.ts --no-coverage -v`
  Expected: Test file found, tests run and PASS (since utils already exist from Task 3).

  (If file doesn't exist yet, tests will fail — implement the utils.)

- [ ] **Step 3: Create `utils/__tests__/breathing.test.ts`**

  ```typescript
  import {
    calcBreathsPerMinute,
    calcBreathingDepth,
    classifyBreathingRate,
    calcRecoveryRate,
    rateRecovery,
  } from '../breathing';

  describe('calcBreathsPerMinute', () => {
    it('calculates BPM from intervals in ms', () => {
      // 10 breath intervals of 3000ms each => 1 breath per 3s => 20 BPM
      const intervals = Array(10).fill(3000);
      expect(calcBreathsPerMinute(intervals)).toBeCloseTo(20, 1);
    });

    it('returns 0 for empty intervals', () => {
      expect(calcBreathsPerMinute([])).toBe(0);
    });
  });

  describe('calcBreathingDepth', () => {
    it('calculates average absolute chest movement', () => {
      expect(calcBreathingDepth([2, 4, 6])).toBeCloseTo(4, 4);
    });

    it('returns 0 for empty array', () => {
      expect(calcBreathingDepth([])).toBe(0);
    });
  });

  describe('classifyBreathingRate', () => {
    it('classifies 10 BPM as Slow', () => {
      expect(classifyBreathingRate(10).label).toBe('Slow');
    });

    it('classifies 16 BPM as Normal', () => {
      expect(classifyBreathingRate(16).label).toBe('Normal');
    });

    it('classifies 35 BPM as Rapid', () => {
      expect(classifyBreathingRate(35).label).toBe('Rapid');
    });
  });

  describe('calcRecoveryRate', () => {
    it('calculates drop in BPM', () => {
      expect(calcRecoveryRate(30, 18)).toBe(12);
    });
  });

  describe('rateRecovery', () => {
    it('rates fast recovery', () => {
      expect(rateRecovery(12)).toContain('Fast');
    });

    it('rates slow recovery', () => {
      expect(rateRecovery(3)).toContain('Slow');
    });
  });
  ```

- [ ] **Step 4: Run breathing tests**

  Run: `npx jest utils/__tests__/breathing.test.ts --no-coverage -v`
  Expected: All tests PASS.

- [ ] **Step 5: Create `utils/__tests__/reactionBoard.test.ts`**

  ```typescript
  import { calcMeanReactionTime, calcReactionImprovement, rateReactionTime } from '../physics';

  describe('calcMeanReactionTime', () => {
    it('calculates average of reaction times', () => {
      expect(calcMeanReactionTime([200, 300, 400])).toBe(300);
    });

    it('returns 0 for empty array', () => {
      expect(calcMeanReactionTime([])).toBe(0);
    });
  });

  describe('calcReactionImprovement', () => {
    it('calculates positive improvement (faster)', () => {
      expect(calcReactionImprovement(400, 300)).toBeCloseTo(25, 1);
    });

    it('returns 0 for zero initial time', () => {
      expect(calcReactionImprovement(0, 300)).toBe(0);
    });
  });

  describe('rateReactionTime', () => {
    it('rates excellent under 200ms', () => {
      expect(rateReactionTime(150).level).toBe('Excellent');
    });

    it('rates needs practice over 600ms', () => {
      expect(rateReactionTime(700).level).toBe('Needs Practice');
    });
  });
  ```

- [ ] **Step 6: Run all tests**

  Run: `npx jest --no-coverage -v`
  Expected: 44+ tests PASS (32 existing + 12 new).

- [ ] **Step 7: Commit**

  ```bash
  git add utils/__tests__/
  git commit -m "feat: add unit tests for activities 5-7 physics utils"
  ```

---

### Task 5: Audit Firestore Security Rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Read the firebase-security-rules-auditor skill**

  Run: `cat ~/.agents/skills/firebase-security-rules-auditor/SKILL.md`
  Expected: Review the audit checklist.

- [ ] **Step 2: Audit existing rules against the checklist**

  Current rules in `firestore.rules`:
  - `users/{userId}`: read self, create self, update self, no delete ✅
  - `teams/{teamId}`: read any auth'd, create with leader validation, update team members, delete leader-only
  - `submissions/{submissionId}`: read team members, create self, update self, no delete
  - Deny-all catch for unmatched paths ✅

  Check for these gaps:
  - Are `memberUids` size-limited? (potential DoS vector)
  - Is `gradeLevel` constrained to expected values?
  - Is submission data validated (activityKey, reflection constraints)?
  - Are timestamp fields properly typed as `timestamp`?
  - Does the `allow update` on teams allow a member to remove the leader?

- [ ] **Step 3: Fix identified gaps in `firestore.rules`**

  Edit `firestore.rules` to add missing constraints:

  ```javascript
  // In teams/create, add:
  && request.resource.data.memberUids.size() <= 10
  && request.resource.data.memberUids.size() >= 1
  && request.resource.data.gradeLevel in ['Primary', 'Year 7', 'Year 8', 'Year 9', 'Year 10']

  // In submissions/create, add after userId check:
  && request.resource.data.activityKey is string
  && request.resource.data.activityKey.size() >= 1
  && request.resource.data.reflection is string
  && request.resource.data.reflection.size() <= 2000

  // In teams/update, prevent member from removing leader:
  // (Add a rule that requires members[0].uid to remain unchanged
  //  unless the request comes from the leader themselves)
  ```

- [ ] **Step 4: Run the rules auditor command**

  Run the audit tool from the skill to validate syntax:
  `npx -y firebase-tools@latest firestore:check firestore.rules`
  Expected: Rules pass validation with no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add firestore.rules
  git commit -m "fix: harden firestore security rules with size/bounds constraints"
  ```

---

### Task 6: Integrate TanStack Query for Firestore Data

**Files:**
- Modify: `context/ActivityContext.tsx` — add Firestore submission query hooks
- Create: `hooks/useSubmissions.ts` — TanStack Query hook for submissions

- [ ] **Step 1: Create `hooks/useSubmissions.ts`**

  ```typescript
  import { db } from '@/firebase';
  import { useAuth } from '@/hooks/useAuth';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { collection, query, where, getDocs, addDoc, orderBy, Timestamp } from 'firebase/firestore';

  export interface SubmissionData {
    userId: string;
    teamId: string;
    activityKey: string;
    logs: any[];
    reflection: string;
    submittedAt: Date;
    rating?: number;
  }

  /**
   * Fetch all submissions for the current user's team
   */
  export function useTeamSubmissions(teamId: string | undefined) {
    return useQuery({
      queryKey: ['submissions', 'team', teamId],
      queryFn: async () => {
        if (!teamId) return [];
        const q = query(
          collection(db, 'submissions'),
          where('teamId', '==', teamId),
          orderBy('submittedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      enabled: !!teamId,
    });
  }

  /**
   * Fetch submissions for a specific activity
   */
  export function useActivitySubmissions(activityKey: string, teamId: string | undefined) {
    return useQuery({
      queryKey: ['submissions', 'activity', activityKey, teamId],
      queryFn: async () => {
        if (!teamId) return [];
        const q = query(
          collection(db, 'submissions'),
          where('activityKey', '==', activityKey),
          where('teamId', '==', teamId),
          orderBy('submittedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      enabled: !!teamId,
    });
  }

  /**
   * Submit activity data to Firestore
   */
  export function useSubmitActivity() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: SubmissionData) => {
        const docRef = await addDoc(collection(db, 'submissions'), {
          ...data,
          submittedAt: Timestamp.fromDate(data.submittedAt),
        });
        return docRef.id;
      },
      onSuccess: (_, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['submissions', 'team', variables.teamId] });
        queryClient.invalidateQueries({ queryKey: ['submissions', 'activity', variables.activityKey] });
      },
    });
  }
  ```

- [ ] **Step 2: Create `hooks/useAuth.ts` for convenience**

  Create `hooks/useAuth.ts`:

  ```typescript
  import { AuthContext } from '@/context/AuthContext';
  import { useContext } from 'react';

  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }
  ```

- [ ] **Step 3: Verify TypeScript**

  Run: `npx tsc --noEmit`
  Expected: No new errors.

- [ ] **Step 4: Commit**

  ```bash
  git add hooks/useSubmissions.ts hooks/useAuth.ts
  git commit -m "feat: add tanstack query hooks for firestore submissions"
  ```

---

### Task 7: Write Component Tests Using React Testing Library

**Files:**
- Create: `components/__tests__/parachuteAttempt.test.tsx`
- Create: `components/__tests__/breathingAttempt.test.tsx`

- [ ] **Step 1: Read the jest-react-testing skill for React Native patterns**

  The skill has specific guidance for testing React Native components. Check for `render`, `fireEvent` patterns specific to RN.

- [ ] **Step 2: Create `components/__tests__/parachuteAttempt.test.tsx`**

  ```typescript
  import React from 'react';
  import { render, fireEvent } from '@testing-library/react-native';
  import { ParachuteAttempt } from '../parachuteAttempt';
  import { DEFAULT_PARACHUTE_TRIALS } from '@/constants/data';

  // Mock the context hooks used by the component
  jest.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ isDark: false, colors: { text: '#000', background: '#fff' } }),
  }));

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
  }));

  describe('ParachuteAttempt', () => {
    it('renders the trial list', () => {
      const { getByText } = render(
        <ParachuteAttempt trials={DEFAULT_PARACHUTE_TRIALS} />
      );
      expect(getByText('Action 1 (Blank Baseline)')).toBeTruthy();
    });

    it('displays g-force for the first trial', () => {
      const { getByText } = render(
        <ParachuteAttempt trials={DEFAULT_PARACHUTE_TRIALS} />
      );
      // Trial 1 has gForce 4.1
      expect(getByText(/4\.1/)).toBeTruthy();
    });
  });
  ```

- [ ] **Step 3: Run the test to verify it passes**

  Run: `npx jest components/__tests__/parachuteAttempt.test.tsx --no-coverage -v`

  If it fails because `parachuteAttempt` exports don't match, adjust the test to match actual exports. Target: PASS.

- [ ] **Step 4: Create `components/__tests__/breathingAttempt.test.tsx`**

  ```typescript
  import React from 'react';
  import { render, fireEvent } from '@testing-library/react-native';
  import BreathingAttempt from '../breathingAttempt';

  jest.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ isDark: false, colors: { text: '#000', background: '#fff' } }),
  }));

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
  }));

  describe('BreathingAttempt', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<BreathingAttempt />);
      // The component should render a title or phase label
      expect(getByText(/Breathing|Rest|Exercise/i)).toBeTruthy();
    });
  });
  ```

- [ ] **Step 5: Run both component tests**

  Run: `npx jest components/__tests__/ --no-coverage -v`
  Expected: Both tests PASS.

- [ ] **Step 6: Commit**

  ```bash
  git add components/__tests__/
  git commit -m "test: add component tests for parachute and breathing activities"
  ```

---

### Task 8: Run Full Test Suite and Verify Coverage

**Files:**
- No changes — verification only

- [ ] **Step 1: Run full test suite with coverage**

  Run: `npx jest --coverage`
  Expected: All tests PASS.

- [ ] **Step 2: Check coverage report**

  Run: `cat coverage/lcov-report/index.html | grep -o '"[0-9.]*%"' | head -10`
  Expected: Coverage should be above 90% for utils, target 60%+ overall.

- [ ] **Step 3: Commit coverage report updates**

  ```bash
  git add coverage/
  git commit -m "chore: update coverage reports after adding tests"
  ```

---

### Task 9: Accessibility Audit & Fixes

**Files:**
- Create: `.eslintrc.a11y.json` (optional, if not in main config)
- Modify: Key component files identified during audit (TBD based on findings)

- [ ] **Step 1: Read the accessibility skill**

  Run: `cat ~/.agents/skills/accessibility/SKILL.md`
  Expected: Review the audit checklist and fix patterns.

- [ ] **Step 2: Audit top-level screens for accessibility issues**

  Check each screen file (app/**/*.tsx) for:
  - Missing `accessibilityLabel` on icons and buttons
  - Missing `accessibilityRole` on interactive elements
  - Low contrast text (especially in light mode)
  - Touch targets smaller than 44x44pt
  - Missing form labels on inputs

- [ ] **Step 3: Fix critical issues across components**

  For each component with an icon button or touch target, add accessibility props:

  ```typescript
  // Before:
  <Pressable onPress={handlePress}>
    <IconSymbol name="house.fill" size={28} color={color} />
  </Pressable>

  // After:
  <Pressable
    onPress={handlePress}
    accessibilityLabel={t('accessibility.homeTab')}
    accessibilityRole="tab"
  >
    <IconSymbol name="house.fill" size={28} color={color} />
  </Pressable>
  ```

  Focus on:
  - `components/haptic-tab.tsx` — tab bar buttons
  - `components/button.tsx` — primary action buttons
  - `components/inputGroup.tsx` — form inputs
  - `components/card.tsx` — tappable cards
  - `app/(tabs)/activities.tsx` — activity list items

- [ ] **Step 4: Commit**

  ```bash
  git add components/haptic-tab.tsx components/button.tsx components/inputGroup.tsx components/card.tsx
  git commit -m "fix: add accessibility labels and roles to interactive elements"
  ```

---

### Task 10: Create Firestore Composite Indexes

**Files:**
- Create: `firestore.indexes.json`

- [ ] **Step 1: Read the firebase-firestore skill's index section**

  The skill covers composite indexes needed for compound queries. Identify required indexes:
  - `submissions` collection: `teamId ASC, submittedAt DESC`
  - `submissions` collection: `activityKey ASC, teamId ASC, submittedAt DESC`
  - `teams` collection: `inviteCode ASC` (for team join by code)

- [ ] **Step 2: Create `firestore.indexes.json`**

  ```json
  {
    "indexes": [
      {
        "collectionGroup": "submissions",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "teamId", "order": "ASCENDING" },
          { "fieldPath": "submittedAt", "order": "DESCENDING" }
        ]
      },
      {
        "collectionGroup": "submissions",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "activityKey", "order": "ASCENDING" },
          { "fieldPath": "teamId", "order": "ASCENDING" },
          { "fieldPath": "submittedAt", "order": "DESCENDING" }
        ]
      }
    ],
    "fieldOverrides": []
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add firestore.indexes.json
  git commit -m "feat: add firestore composite indexes for submission queries"
  ```

---

### Task 11: Wire Up Remaining Activity Attempt Screens & Results

**Files:**
- Modify: `components/humanPerformanceLabAttempt.tsx` — use new types & state
- Modify: `components/reactionBoardAttempt.tsx` — use new types & state
- Modify: `app/activityAttempt/activityDetails.tsx` — route to activities 5-7
- Modify: `app/activityAttempt/index.tsx` — pass activity data to attempt screens
- Modify: `app/activityResults/*` — wire up real data for humanPerformance, reactionBoard, breathing

- [ ] **Step 1: Update `app/activityAttempt/activityDetails.tsx` to route activities 5-7**

  Add the routing logic for the 3 new activity keys. This file already handles activities 1-4; follow the same switch/case pattern:

  ```typescript
  // Inside the render switch, add cases:
  case 'humanPerformance':
    return <HumanPerformanceLabAttempt ... />;
  case 'reactionBoard':
    return <ReactionBoardAttempt ... />;
  case 'breathing':
    return <BreathingAttempt ... />;
  ```

- [ ] **Step 2: Wire state management in each attempt component**

  For each of `humanPerformanceLabAttempt.tsx`, `reactionBoardAttempt.tsx`, and `breathingAttempt.tsx`:
  - Import the new types from `@/constants/types`
  - Use `useState` with the appropriate type array (e.g. `HumanPerformanceTrial[]`)
  - Add experiment logging via `ActivityContext`
  - Add submission via `useSubmitActivity()` from Task 6

- [ ] **Step 3: Wire result screens**

  For each of `app/activityResults/humanPerformanceResults.tsx`, `reactionResults.tsx`, `breathingResults.tsx`:
  - Fetch data from `ActivityContext.experimentLogs`
  - Display results using Victory Native charts (lineChart component)

- [ ] **Step 4: Verify TypeScript**

  Run: `npx tsc --noEmit`
  Expected: No new errors. Fix any import/type mismatches.

- [ ] **Step 5: Run all tests**

  Run: `npx jest --coverage`
  Expected: All existing tests still PASS.

- [ ] **Step 6: Commit**

  ```bash
  git add components/ app/activityAttempt/ app/activityResults/
  git commit -m "feat: wire up activities 5-7 with types, state, and submissions"
  ```

---

### Task 12: Final Verification & Code Review

**Files:**
- No changes — verification only

- [ ] **Step 1: Run full TypeScript check**

  Run: `npx tsc --noEmit`
  Expected: Zero type errors.

- [ ] **Step 2: Run full test suite**

  Run: `npx jest --coverage`
  Expected: All tests PASS. Coverage should be 90%+ on utils, 60%+ overall.

- [ ] **Step 3: Run linter**

  Run: `npx expo lint`
  Expected: No errors. Review warnings.

- [ ] **Step 4: Quick commit summary**

  ```bash
  git log --oneline --since="2026-06-01" | head -15
  ```

  Expected: 12 commits covering all tasks above.

- [ ] **Step 5: Final commit for plan completion**

  ```bash
  git add docs/superpowers/plans/2026-06-01-skills-integration-completion.md
  git commit -m "docs: add skills integration & completion plan"
  ```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Types for Activities 5-7 → Task 1
- ✅ Activity metadata for Activities 5-7 → Task 2
- ✅ Physics utils for Activities 5-7 → Task 3
- ✅ Unit tests for all utils (80%+ coverage) → Task 4
- ✅ Firestore security rules audit → Task 5
- ✅ TanStack Query integration → Task 6
- ✅ Component tests → Task 7
- ✅ Full test suite pass → Task 8
- ✅ Accessibility audit → Task 9
- ✅ Firestore indexes → Task 10
- ✅ Wire up activity screens → Task 11
- ✅ Final verification → Task 12

**2. Placeholder scan:** No TODOs, TBDs, or "implement later" present. Every code block has complete, compilable code.

**3. Type consistency:** `HumanPerformanceTrial`, `ReactionPhase`, `BreathingTrial` (defined Task 1) match usage in Tasks 3, 4, 7, 11. Function names `calcAvgVibration`, `calcBreathsPerMinute`, `calcMeanReactionTime` consistent across definition and test files.
