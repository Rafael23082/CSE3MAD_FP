# Jest Test Source Code Overview

## Configuration

`jest.config.js` uses the `jest-expo` preset with TypeScript support, coverage collection, and `__tests__` convention matching.

```js
preset: 'jest-expo',
testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
collectCoverage: true,
coverageReporters: ['text', 'lcov'],
```

Run with: `npm test` (maps to `jest`).

## Test Files (10 total, 181 tests)

### 1. `utils/__tests__/physics.test.ts`

Tests all 28 exported functions in `utils/physics.ts`. Combines the original 7 suites with new suites covering the 18 previously-untested functions plus 9 backward-compatible alias checks.

| Suite | What it tests | Key boundaries |
|---|---|---|
| `calculateSafetyScore` | Parachute safety score from velocity, g-force, accuracy | Percent thresholds for Excellent/Good/Fair/Poor ratings; weighted component calculation |
| `calculateNPI` | Noise Pollution Index = avgDb / 85 | Zero/negative dB, 85 dB boundary, >1 for loud sounds |
| `getNPILevel` | Categorises NPI into Safe/Warning/Unsafe | 0.5 and 1.0 thresholds |
| `getFlexibilityLabel` | Hand fan k-value ranges | 0.2 and 1.0 boundaries for High/Medium/Low |
| `calculateStabilityScore` | Earthquake stability from peak acceleration | Score clamping, pass/fail at 70 boundary, 100 to 0 range |
| `calculateDampingRatio` | Ratio of final/initial peak readings | Empty arrays, zero readings, amplification (>1), damping (<1) |
| `getDampingLabel` | Categorises damping ratio | Five-tier scale: Excellent/Good/Moderate/Poor/None |
| `calculateVelocity` | Distance / time | Zero distance or time returns 0 |
| `calculateAcceleration` | Velocity / time | Zero velocity or time returns 0 |
| `calculateWeight` | Mass x gravity | Zero mass returns 0 |
| `calculateNetForce` | Mass x acceleration | Zero mass or acceleration returns 0 |
| `calculateDragForce` | Weight minus net force | Net-force clamping, zero weight guard |
| `calculateGForce` | Delta-V / contact-time / gravity | Zero delta-V or contact-time returns 0 |
| `calculateReboundVelocity` | Gravity x time | Zero time returns 0 |
| `GRAVITY_MPS2` | Constant value | Equals 9.8 |
| `getGForceRisk` | All 5 risk levels | <=5/<=10/<=30/<=50 boundaries |
| `getParachuteRating` | All 4 rating levels | <20/<40/<60 boundaries |
| `calculateFanForce` | kValue x angle in radians | Zero kValue or angle returns 0 |
| `getDecibelRisk` | All 4 risk levels | <=60/<=85/<=100 boundaries |
| `amplitudeToDb` | Amplitude to decibel conversion | Zero/negative amplitude returns -Infinity |
| `calcAverageDb` | Average of absolute levels | Empty array returns -Infinity |
| `degreesToRadians` | Degree to radian conversion | 0 degrees returns 0 |
| `formatPhysicsValue` | Fixed decimal formatting | Custom decimal places |
| `getStabilityRating` | All 4 rating levels | >=90/>=70/>=50 boundaries |
| backward-compatible aliases | 9 alias functions point to correct implementation | Delegation equality checks |

### 2. `utils/__tests__/scoring.test.ts`

Tests all 3 functions in `utils/scoring.ts` — the leaderboard scoring engine.

- **`calculateCompositeScore`** — all 7 activity branches plus default: parachute (inverted safety), sound (inverse NPI), hand fan (inverse force), earthquake (stability), breathing (proximity to 15 BPM), reaction board (inverse time), stretch (inverse vibration). Tests empty logs, zero-filtering, clamping, `??` fallback precedence, and multi-log averaging.
- **`calculateOverallScore`** — empty submissions, single submission, multi-submission averaging, multi-activity summation, submissions without `activityKey` skipped.
- **`getScoreExplanation`** — known activities return descriptive text, unknown returns fallback.

### 3. `utils/__tests__/progressCalculation.test.ts`

Tests 5 of 6 functions in `utils/progressCalculation.ts`. Mocks `@/constants/data` (TOTAL_ACTIVITIES=7), `@/firebase`, and `firebase/firestore` so the module loads without real Firebase init.

- **`calculateProgressPercentage`** — 0/1/3.5/7 completed out of 7, rounding behaviour.
- **`getProgressColor`** — green (>=80%), yellow (50-79%), red (<50%).
- **`calculateTotalPointsFromProgress`** — sums points across entries; empty array.
- **`getCompletedActivityCount`** — filters by `isCompleted`; empty array.
- **`rankTeams`** — single team, duplicate userId aggregation, points-descending sort, tie-breaking by earliest timestamp, `?? 0` fallback for missing timestamps.
- Not tested: `getProgressionBoardData` (Firestore-dependent, integration-level).

### 4. `utils/__tests__/location.test.ts`

Tests all 3 functions in `utils/location.ts`. Mocks `expo-location` for async permission and GPS flows.

- **`formatCoordinates`** — positive/negative lat/lng, equator/prime-meridian edge case, DMS format structure (degree symbol, minutes, seconds, direction letter).
- **`requestLocationPermission`** — already-granted (no request call), undetermined then granted, denied.
- **`captureLocation`** — returns `{latitude, longitude, formatted}` on success, null on permission denied, null on error throw.

### 5. `utils/__tests__/humanPerformance.test.ts` (41 lines)

Tests Activity 5 (Human Performance Lab) functions.

- `calcAvgVibration` handles absolute values, negative sensor readings, empty arrays
- `calcSmoothnessScore` standard deviation; returns 0 for <2 readings
- `rateCoordination` maps smoothness score to Excellence/Practice level labels

### 6. `utils/__tests__/breathing.test.ts` (58 lines)

Tests Activity 7 (Breathing Pace Trainer) functions.

- `calcBreathsPerMinute` converts ms intervals to BPM; empty array guard
- `calcBreathingDepth` average absolute chest movement
- `classifyBreathingRate` Slow/Normal/Rapid labels at 12/20/30 BPM boundaries
- `calcRecoveryRate` simple subtraction
- `rateRecovery` string contains "Fast"/"Slow" (uses `toContain` matcher)

### 7. `utils/__tests__/reactionBoard.test.ts` (31 lines)

Tests reaction time helpers (co-located in `physics.ts`).

- `calcMeanReactionTime` average of times; empty array returns 0
- `calcReactionImprovement` percentage change; zero-initial guard
- `rateReactionTime` Excellent/Needs Practice at 200ms/600ms thresholds

### 8. `utils/__tests__/activityPersistence.test.ts` (71 lines)

Tests data layer contracts (Activity 1-4 assessment activities). No mocking tests pure transformations.

- **Contract test:** `REQUIRED_ACTIVITY_KEYS` matches the 4 assessment activities
- **`buildActivityResultRecord`:** SQLite record shape latitude/longitude/accuracy extracted, logs serialised, timestamp formatted
- **`buildFirestoreSubmissionPayload`:** Firestore payload shape logCount computed, location preserved, rating nullable

### 9. `components/__tests__/card.test.tsx` (43 lines)

The only React component test. Uses `@testing-library/react-native`.

- Mocks `@/hooks/useTheme` with a static theme object
- Uses `jest.mock` for the theme hook
- Lazy-requires the component (`require("../card").default`) to avoid hoisting issues
- Verifies metric/value text renders via `getByText`
- Tests `maximumWidth` prop (full-width vs 47% width)

## Testing Patterns Summary

| Pattern | Where used |
|---|---|
| Pure function testing (no mocking) | `physics.test.ts`, `humanPerformance.test.ts`, `breathing.test.ts`, `reactionBoard.test.ts`, `scoring.test.ts`, `activityPersistence.test.ts` |
| Boundary value testing | `physics.test.ts` (all suites), `scoring.test.ts` (all branches) |
| Module mocking (`jest.mock`) | `progressCalculation.test.ts` (constants/firebase), `location.test.ts` (expo-location) |
| Async function testing | `location.test.ts` (permission flows, GPS), `progressCalculation.test.ts` (rankTeams with Timestamp mocks) |
| Edge case: empty arrays | `calcAvgVibration`, `calcBreathsPerMinute`, `calcMeanReactionTime`, `calculateDampingRatio`, `calcAverageDb`, `calculateCompositeScore` |
| Edge case: zero/negative inputs | `calculateNPI`, `calcReactionImprovement`, `calculateDampingRatio`, `calculateCompositeScore` (zero-filtering) |
| Floating point comparison (`toBeCloseTo`) | `calculateNPI`, `calculateDampingRatio`, `calcReactionImprovement`, `calculateGForce`, `calculateWeight`, `calculateFanForce`, `degreesToRadians` |
| Range matchers (`toBeGreaterThan`, `toBeLessThan`) | `calcSmoothnessScore`, `calculateStabilityScore` |
| String content matcher (`toContain`) | `rateRecovery`, `getGForceRisk`, `getScoreExplanation` |
| Regex matcher (`toMatch`) | `formatCoordinates` DMS output |
| Object shape matchers (`toEqual`, `toHaveProperty`) | `activityPersistence.test.ts` |
| React component rendering | `card.test.tsx` render, `getByText` |
| Theme hook mocking | `card.test.tsx` `jest.mock("@/hooks/useTheme")` |
| Lazy `require` to avoid hoisting | `card.test.tsx` wraps in `loadCard()` function |
| Timestamp mock objects (`toMillis`) | `rankTeams` tie-breaking in `progressCalculation.test.ts` |
| Max/min clamping tests | `calculateCompositeScore` `Math.max(0, ...)` in all 7 branches |

## Coverage

Latest run (June 2026):

| File | Stmts | Branch | Funcs | Lines |
|---|---|---|---|---|
| `card.tsx` | 100% | 100% | 100% | 100% |
| `location.ts` | 100% | 100% | 100% | 100% |
| `scoring.ts` | 100% | 96.5% | 100% | 100% |
| `physics.ts` | 97.7% | 96.8% | 100% | 100% |
| `breathing.ts` | 87.5% | 81.3% | 100% | 100% |
| `humanPerformance.ts` | 88.2% | 80% | 100% | 100% |
| `progressCalculation.ts` | 84.4% | 88.2% | 81.8% | 85.2% |
| `activityPersistence.ts` | 15.2% | 39.3% | 22.2% | 15.6% |

Low coverage in `activityPersistence.ts` and partial coverage in `progressCalculation.ts` is from Firestore/SQLite-dependent functions (`saveActivityResultLocally`, `saveActivityResultToFirestore`, `getPendingSyncResults`, `retryPendingSyncs`, `getProgressionBoardData`) — these are integration-level and require mocking the Firebase/SQLite layer.

Collects to `./coverage/` in text and lcov formats. Run `npx jest --coverage` to regenerate.

## Source Map

| Test file | Source under test |
|---|---|
| `utils/__tests__/physics.test.ts` | `utils/physics.ts` (28 functions, all coverage) |
| `utils/__tests__/scoring.test.ts` | `utils/scoring.ts` (all 3 functions) |
| `utils/__tests__/progressCalculation.test.ts` | `utils/progressCalculation.ts` (5 of 6 functions; async excluded) |
| `utils/__tests__/location.test.ts` | `utils/location.ts` (all 3 functions) |
| `utils/__tests__/humanPerformance.test.ts` | `utils/humanPerformance.ts` (all 3 functions) |
| `utils/__tests__/breathing.test.ts` | `utils/breathing.ts` (all 5 functions) |
| `utils/__tests__/reactionBoard.test.ts` | `utils/physics.ts` (reaction-time helpers only) |
| `utils/__tests__/activityPersistence.test.ts` | `utils/activityPersistence.ts` (pure builders only) |
| `components/__tests__/card.test.tsx` | `components/card.tsx` |
