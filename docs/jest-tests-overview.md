# How the test suite is organized

This document maps every test file to its source module, describes what each test covers, and shows where coverage gaps remain. Use it when adding new tests or diagnosing failing ones.

## Configuration

The project runs tests with the `jest-expo` preset, which includes TypeScript support. Coverage is collected automatically and written to `./coverage/` in text and lcov formats.

```js
preset: 'jest-expo',
testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
collectCoverage: true,
coverageReporters: ['text', 'lcov'],
```

Run the full suite with `npm test`. To regenerate coverage after changes, run `npx jest --coverage`.

## Test files and what they cover

There are 10 test files with 181 total tests. Most tests exercise pure functions without mocking. A few files mock Firebase, SQLite, or Expo modules to test async flows.

### Physics and sensor calculations

**File:** `utils/__tests__/physics.test.ts`

Tests all 28 exported functions in `utils/physics.ts`, including 18 that had no coverage before plus 9 backward-compatible alias checks. Each function receives boundary-value tests across its rating or threshold ranges.

Key areas:

- **Safety scoring:** `calculateSafetyScore` produces Excellent/Good/Fair/Poor ratings from velocity, g-force, and accuracy inputs. Tests cover percent thresholds and weighted component math.
- **Noise Pollution Index (NPI):** `calculateNPI` divides average decibels by 85. Tests verify zero/negative dB, the 85 dB boundary, and values above 1 for loud sounds. `getNPILevel` maps NPI to Safe/Warning/Unsafe at 0.5 and 1.0 thresholds.
- **Earthquake stability:** `calculateStabilityScore` clamps 0–100 and passes or fails at 70. `calculateDampingRatio` handles empty arrays, zero readings, amplification (above 1), and damping (below 1).
- **Movement formulas:** `calculateVelocity`, `calculateAcceleration`, `calculateWeight`, `calculateNetForce`, `calculateDragForce`, and `calculateGForce` all guard against zero inputs and return 0 when the denominator would be undefined.
- **Risk ratings:** `getGForceRisk`, `getParachuteRating`, `getDecibelRisk`, and `getStabilityRating` each map numeric ranges to labeled levels.
- **Formatting and conversion:** `degreesToRadians`, `formatPhysicsValue`, and `amplitudeToDb` round or convert values with expected precision.

### Leaderboard scoring

**File:** `utils/__tests__/scoring.test.ts`

Covers all 3 functions in `utils/scoring.ts`.

- **`calculateCompositeScore`** evaluates 7 activity branches (parachute, sound, hand fan, earthquake, breathing, reaction board, stretch) plus a default path. Tests exercise empty logs, zero-filtering, clamping via `Math.max(0, ...)`, the `??` fallback precedence, and multi-log averaging.
- **`calculateOverallScore`** handles empty submissions, single submissions, multi-submission averaging, multi-activity summation, and submissions without an `activityKey` (which get skipped).
- **`getScoreExplanation`** returns descriptive text for known activities and a fallback string for unknowns.

### Progress and ranking

**File:** `utils/__tests__/progressCalculation.test.ts`

Tests 5 of 6 functions in `utils/progressCalculation.ts`. Mocks `@/constants/data` (TOTAL_ACTIVITIES=7), `@/firebase`, and `firebase/firestore` so the module loads without real Firebase initialization.

- **`calculateProgressPercentage`** computes completion ratios for 0, 1, 3.5, and 7 completed activities out of 7, and checks rounding behavior.
- **`getProgressColor`** returns green (at or above 80%), yellow (50–79%), or red (below 50%).
- **`calculateTotalPointsFromProgress`** sums points across entries and handles empty arrays.
- **`getCompletedActivityCount`** filters entries by `isCompleted` and handles empty arrays.
- **`rankTeams`** sorts by points descending, breaks ties by earliest timestamp using mock `Timestamp` objects with `toMillis`, and applies `?? 0` fallback for missing timestamps.

Not tested: `getProgressionBoardData`, which requires Firestore access and belongs in an integration test suite.

### Location services

**File:** `utils/__tests__/location.test.ts`

Tests all 3 functions in `utils/location.ts` with a mocked `expo-location` module.

- **`formatCoordinates`** converts latitude and longitude to degrees-minutes-seconds format. Tests cover positive and negative values, equator and prime meridian edge cases, and the presence of the degree symbol and direction letter.
- **`requestLocationPermission`** exercises three flows: already granted (no request call), undetermined then granted, and denied.
- **`captureLocation`** returns `{latitude, longitude, formatted}` on success, or null when permission is denied or an error is thrown.

### Human performance lab

**File:** `utils/__tests__/humanPerformance.test.ts`

Tests 3 functions for Activity 5 (Human Performance Lab).

- `calcAvgVibration` handles absolute values, negative sensor readings, and empty arrays.
- `calcSmoothnessScore` computes standard deviation and returns 0 when fewer than 2 readings exist.
- `rateCoordination` maps smoothness scores to Excellence or Practice labels.

### Breathing pace trainer

**File:** `utils/__tests__/breathing.test.ts`

Tests 5 functions for Activity 7 (Breathing Pace Trainer).

- `calcBreathsPerMinute` converts millisecond intervals to breaths per minute and guards against empty arrays.
- `calcBreathingDepth` averages absolute chest movement values.
- `classifyBreathingRate` labels rates as Slow/Normal/Rapid at 12, 20, and 30 BPM boundaries.
- `calcRecoveryRate` subtracts the initial rate from the final rate.
- `rateRecovery` returns a string containing "Fast" or "Slow", verified with `toContain`.

### Reaction time

**File:** `utils/__tests__/reactionBoard.test.ts`

Tests reaction-time helpers that live in `utils/physics.ts`.

- `calcMeanReactionTime` averages an array of times and returns 0 for empty input.
- `calcReactionImprovement` computes percentage change with a zero-initial guard.
- `rateReactionTime` labels times as Excellent (at or below 200 ms) or Needs Practice (above 600 ms).

### Activity persistence

**File:** `utils/__tests__/activityPersistence.test.ts`

Tests pure builder functions in `utils/activityPersistence.ts` without mocking.

- A contract test verifies that `REQUIRED_ACTIVITY_KEYS` matches the 4 assessment activities.
- `buildActivityResultRecord` extracts latitude, longitude, and accuracy from location objects, serializes logs, and formats timestamps.
- `buildFirestoreSubmissionPayload` builds the submission shape with computed `logCount`, preserved location, and nullable rating.

Functions that touch SQLite or Firestore (`saveActivityResultLocally`, `saveActivityResultToFirestore`, `getPendingSyncResults`, `retryPendingSyncs`) are not covered here and need integration-level tests.

### Card component

**File:** `components/__tests__/card.test.tsx`

The only React component test. It uses `@testing-library/react-native` to render the card and check that metric and value text appears on screen.

A `jest.mock` stub replaces `@/hooks/useTheme` with a static theme object. The component is loaded with `require("../card").default` inside a function to avoid hoisting issues with the mock. Tests also verify that `maximumWidth` controls layout, switching between full width and 47% width.

## Testing patterns

The suite relies on a small set of repeatable patterns:

- **Pure function testing:** Most files test pure functions with no side effects, passing inputs and asserting outputs.
- **Boundary value testing:** Functions with numeric thresholds receive inputs at and around each boundary (e.g., 70 for stability pass/fail, 85 dB for NPI).
- **Module mocking:** `jest.mock` replaces Firebase, SQLite, Expo Location, and the theme hook. Mocks are set up before the module under test is required.
- **Async function testing:** `location.test.ts` and `progressCalculation.test.ts` exercise async flows using mock `Timestamp` objects and permission callbacks.
- **Edge cases:** Empty arrays, zero and negative inputs, and missing fields are tested across most functions.
- **Floating-point comparison:** `toBeCloseTo` is used for `calculateNPI`, `calculateDampingRatio`, `calcReactionImprovement`, `calculateGForce`, `calculateWeight`, `calculateFanForce`, and `degreesToRadians`.
- **String matching:** `toContain` checks for substrings in risk labels and score explanations. `toMatch` validates DMS coordinate format.
- **Object shape matching:** `toEqual` and `toHaveProperty` verify the structure of persistence records and Firestore payloads.

## Coverage

Coverage is collected in text and lcov formats on every test run. Here are the latest figures.

| File | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `card.tsx` | 100% | 100% | 100% | 100% |
| `location.ts` | 100% | 100% | 100% | 100% |
| `scoring.ts` | 100% | 96.5% | 100% | 100% |
| `physics.ts` | 97.7% | 96.8% | 100% | 100% |
| `breathing.ts` | 87.5% | 81.3% | 100% | 100% |
| `humanPerformance.ts` | 88.2% | 80% | 100% | 100% |
| `progressCalculation.ts` | 84.4% | 88.2% | 81.8% | 85.2% |
| `activityPersistence.ts` | 15.2% | 39.3% | 22.2% | 15.6% |

The low coverage in `activityPersistence.ts` and partial coverage in `progressCalculation.ts` stem from Firestore- and SQLite-dependent functions. These require integration tests that mock the full persistence layer.

## Source map

This table shows which test file covers which source module and how many functions each test exercises.

| Test file | Source module | Coverage scope |
|---|---|---|
| `utils/__tests__/physics.test.ts` | `utils/physics.ts` | 28 functions (all) |
| `utils/__tests__/scoring.test.ts` | `utils/scoring.ts` | 3 functions (all) |
| `utils/__tests__/progressCalculation.test.ts` | `utils/progressCalculation.ts` | 5 of 6 functions |
| `utils/__tests__/location.test.ts` | `utils/location.ts` | 3 functions (all) |
| `utils/__tests__/humanPerformance.test.ts` | `utils/humanPerformance.ts` | 3 functions (all) |
| `utils/__tests__/breathing.test.ts` | `utils/breathing.ts` | 5 functions (all) |
| `utils/__tests__/reactionBoard.test.ts` | `utils/physics.ts` | Reaction-time helpers only |
| `utils/__tests__/activityPersistence.test.ts` | `utils/activityPersistence.ts` | Pure builders only |
| `components/__tests__/card.test.tsx` | `components/card.tsx` | Render and layout |
