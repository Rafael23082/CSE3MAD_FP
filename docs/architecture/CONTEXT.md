# STEMM Lab — Domain Glossary

## Core Entities

### Team
A group of up to 10 members (student limit set in Firestore rules). Each team has:
- `teamId` — Unique Firestore document ID.
- `teamName` — Display name (1–50 chars).
- `gradeLevel` — One of `Primary`, `Year 7`, `Year 8`, `Year 9`, `Year 10`.
- `members` — Array of `{ uid, role }` objects.
- `memberUids` — Flat array of UIDs for Firestore rule matching (`hasAny`).
- `inviteCode` — 6-character alphanumeric code used for joining.
- `createdAt` — Firestore timestamp.

A user can belong to at most one team at a time (enforced by client-side logic; not a Firestore constraint).

### Member
A user who belongs to a team. Represented as `{ uid: string, role: 'leader' | 'member' }`.

### Leader
The first member of a team (index `members[0]`). Has elevated permissions:
- Can delete the team.
- Can edit members (including removing others).
- Cannot be removed by other members.

The leader role is determined by position in the `members` array, not a separate flag.

### InviteCode
A 6-character string generated on team creation. Used by other users to find and join a team. Can be shared via QR code.

---

## Activity Domain

### Activity
A STEMM Lab experiment challenge. Defined in code as an object with:
- `key` — Unique identifier (e.g. `"parachute-drop-challenge"`).
- `name` — Localized display name from i18n.
- `description` — Localized blurb.
- `image` — Thumbnail require() reference.
- `instructions` — Array of `{ instruction, video }` objects (localized).
- `equipments` — Array of `{ toolName, description, image }` objects (localized).
- `phases?` — Optional array of phase labels (for multi-phase activities).

Activities are registered in `assets/activities.ts` and rendered from `constants/data.ts`.

### ExperimentLog
A single recorded trial or measurement. Stored both in-memory (`ActivityContext`) and persisted (`@stemm_experiment_logs` in AsyncStorage and/or `stemm_lab.db` SQLite). Shape:
```ts
{ timestamp: number; activityKey: string; data: Record<string, unknown> }
```

### Trial
A specific attempt within an activity. Activities with multiple trials per session include:
- **Parachute**: Each drop test (surface area, weight, time, g-force).
- **Breathing**: Each recording phase (rest, jogging, star jumps).
- **Reaction Board**: Each tap or tracing phase.
- **Human Performance**: Each guided movement.

---

## Scoring & Leaderboard

### Submission
A Firestore document created when a team submits completed activity results. Contains:
- `userId`, `teamId`, `activityKey`, `logs[]`, `reflection`, `submittedAt`.
- Optional: `rating`, `media` (video/image URL), `location` (GPS).

### Leaderboard
A client-computed ranking table. Scored by **submission count per team** (not physics-based score). Supports global and per-activity filtering.

### Score
Currently mapped to `submission count` for that team (optionally filtered by activity). Displayed as the numeric value in the ranking rows.

---

## Sync & Persistence

### Sync
The process of uploading locally-stored experiment data to Firebase Firestore. The SQLite `experiment_logs` table uses a `synced` flag (0/1) to track which records have been uploaded.

### OfflineQueue
The `experiment_logs` table in SQLite acts as an offline write queue. Records with `synced = 0` are pending upload. The app reads these via `getPendingSyncLogs()` and marks them synced after successful Firestore writes via `markLogSynced(id)`.

---

## Physics Metrics

### Parachute Drop Challenge

| Metric | Formula / Definition | Units |
|---|---|---|
| **Velocity** | `v = d / t` (distance over time) | m/s |
| **Acceleration** | `a = v / t` | m/s² |
| **Weight** | `W = m × 9.8` | N |
| **Net Force** | `F = m × a` | N |
| **Drag Force** | `F_drag = W - F_net` | N |
| **G-Force (no bounce)** | `(v / contactTime) / 9.8` | dimensionless |
| **G-Force (bounce)** | `((v + v_rebound) / contactTime) / 9.8` | dimensionless |
| **Rebound Velocity** | `v_rebound = 9.8 × timeToMaxHeight` | m/s |
| **Contact Time** | Measured duration of impact from slow-motion video | s |
| **Surface Area** | Canopy area of the parachute | cm² |
| **Safety Score** | `0.4×velocityNorm + 0.4×gNorm + 0.2×accuracyNorm` | % (0-100) |

G-Force Risk Scale:
- **1–5 g**: Safe (elevators, standing)
- **5–10 g**: Moderate (possible bruising)
- **10–30 g**: Serious (sports collisions)
- **30–50 g**: Severe (car crashes)
- **50+ g**: Critical (life-threatening)

### Sound Pollution Hunter

| Metric | Definition | Units |
|---|---|---|
| **Decibel (dB)** | Sound intensity level (`20 × log10(amplitude)`) | dB |
| **Average dB** | Mean amplitude converted to dB | dB |
| **NPI (Noise Pollution Index)** | `averageDb / 85` | dimensionless |
| **Hearing Risk** | Categorical: Safe, Warning, Unsafe | — |
| **GPS Location** | Lat/lng of reading | degrees |

Hearing damage risk:
| Range | Category |
|---|---|
| 0–60 dB | Safe — no risk |
| 60–85 dB | Moderate — safe for brief exposure |
| 85–90 dB | Warning — damage possible >8 hrs |
| 90–100 dB | High risk — damage >15 mins |
| 100–120 dB | Dangerous — minutes count |
| 120dB+ | Critical — immediate damage risk |

### Hand Fan Challenge

| Metric | Formula / Definition | Units |
|---|---|---|
| **Stiffness Coefficient (k)** | Material-specific constant (paper 0.05 to corrugated 2.50) | N/rad |
| **Deflection Angle (θ)** | Measured bend of target material | degrees |
| **Estimated Force** | `F ≈ k × θ` (θ in radians) | N |
| **Flexibility** | `High` (k < 0.2), `Medium` (k < 1.0), `Low` (k >= 1.0) | — |

Materials and their k-values:
- Thin printer paper: k = 0.05
- Standard card stock: k = 0.20
- Thin cardboard: k = 0.50
- Corrugated cardboard: k = 2.50

### Earthquake-Resistant Structure

| Metric | Definition | Units |
|---|---|---|
| **Fold Count** | Number of folds in the structural base | count |
| **Pillar Count** | Number of supporting pillars | count |
| **Observed Sway** | Measured lateral movement | cm |
| **Peak Acceleration** | Maximum accelerometer reading | m/s² |
| **Stability Score** | `max(0, 100 - peakAccel × 20)` | % (0-100) |
| **Damping Ratio** | `finalPeakAccel / initialPeakAccel` | dimensionless |
| **Damping Label** | Excellent (<0.1), Good (<0.3), Moderate (<0.5), Poor (<0.8), None (>=0.8) | — |

Stability Rating: Excellent (≥90), Good (≥70), Fair (≥50), Poor (<50). Pass threshold: score ≥ 70.

### Stretch Speed & Gracefulness (Human Performance Lab)

| Metric | Definition | Units |
|---|---|---|
| **Vibrations Detected** | Count of acceleration change events during movement | count |
| **Smoothness Score** | Percentage of time without excessive vibration (starts at 100%, decreases per jolt) | % (0-100) |
| **Movement Duration** | Time elapsed for guided movement | s |
| **Vibration Amplitude** | Peak-to-peak displacement during movement | mm |

Three movements: Clockwise, Vertical, Horizontal.

### Reaction Board Challenge

| Metric | Formula / Definition | Units |
|---|---|---|
| **Reaction Time** | Interval from stimulus to tap | ms |
| **Mean Reaction Time** | Average across multiple trials | ms |
| **Improvement** | `((initial - final) / initial) × 100` | % |
| **Tracing Accuracy** | How closely the traced path matches the target | % |

Reaction time rating:
- <200 ms: Excellent 🏆
- <300 ms: Good 👍
- <400 ms: Average 👌
- <600 ms: Below Average 💪
- ≥600 ms: Needs Practice 🎯

### Breathing Pace Trainer

| Metric | Definition | Units |
|---|---|---|
| **Breaths Per Minute (BPM)** | Respiratory rate measured via chest accelerometer | breaths/min |
| **Chest Movement** | Amplitude of chest rise detected by accelerometer | mm |
| **Phase** | Rest, Post-Exercise 1 (jogging), Post-Exercise 2 (star jumps) | — |

Typical BPM ranges:
- Rest: 12–20
- Light exercise: 20–40
- Vigorous exercise: 40–60

---

## Data Flow Summary

```
User Action → Activity Attempt Component
    → records Trial data in ActivityContext (in-memory + AsyncStorage)
    → persists to SQLite stemm_lab.db (experiment_logs table)
    → on completion, results page allows Submit to Firestore
    → useSubmitActivity() mutation writes to submissions collection
    → pending SQLite rows get marked synced = 1
    → Leaderboard re-queries submissions to reflect new score
```

## File Naming Convention

Activity keys in kebab-case are used throughout:
- Asset registration key: `"parachute-drop-challenge"` (in `assets/activities.ts`)
- Attempt component: `ParachuteAttemptScreen` (in `components/parachuteAttempt.tsx`)
- Results screen: `app/activityResults/parachuteResults.tsx`
- i18n key: `activities.parachuteDropChallenge.*`
- Database `activity_key` column: `"parachute-drop-challenge"`
- Firestore `activityKey` field: `"parachute-drop-challenge"`
