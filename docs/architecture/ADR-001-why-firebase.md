# ADR-001: Why Firebase (Auth + Firestore + Storage) with SQLite for Offline

**Status**: Accepted  
**Date**: 2026-06-06  
**Deciders**: STEMM Lab Development Team  

## Context

The STEMM Lab app is an educational platform where students:
- Create accounts and form teams.
- Perform 7 hands-on STEM experiments using phone sensors.
- Record trial data (physics measurements, reaction times, audio levels, etc.).
- Submit completed activities to a shared leaderboard.
- Work in classrooms with **unreliable or absent internet connectivity**.

We needed a backend that provides:
1. Authentication (email/password — suitable for school environments).
2. Real-time team data synchronization across team members.
3. Multiplayer leaderboard aggregation.
4. File storage for videos and images (experiment evidence).
5. Offline-first operation for classrooms without reliable internet.

## Decision

We chose **Firebase** (Auth, Firestore, Storage) as the primary backend, combined with a local **SQLite** database (via `expo-sqlite`) for offline persistence.

### Firebase Components

| Component | Usage |
|---|---|
| **Firebase Auth** | Email/password authentication. Persistent sessions via `AsyncStorage` (`getReactNativePersistence`). |
| **Firestore** | Primary online data store for users, teams, and submissions. Real-time listeners for team member updates. |
| **Firebase Storage** | Uploads for experiment videos and photos (50 MB limit per file). |

### SQLite (expo-sqlite)

| Table | Purpose |
|---|---|
| `activities` | Track activity start/completion per session |
| `experiment_logs` | Store individual trial data with a `synced` flag (0 = pending, 1 = synced) |
| `ratings` | Persist user activity ratings locally |

## Why Firebase over Alternatives

| Requirement | Firebase | Custom Node.js API | Supabase |
|---|---|---|---|
| Serverless, zero ops | ✅ Built-in | ❌ Requires server management | ✅ |
| Real-time subscriptions | ✅ Firestore real-time | ❌ Requires WebSocket setup | ⚠️ (via Realtime, GA) |
| Email/password auth | ✅ Built-in | ❌ Must implement | ✅ |
| File storage | ✅ Storage | ❌ Must integrate | ✅ (S3-compatible) |
| Security rules engine | ✅ Declarative rules | ❌ Must build | ✅ (RLS) |
| Workable offline | ✅ Firestore offline + SQLite | ❌ | ✅ (limited) |
| Classroom-friendly pricing | ✅ Spark Plan (free) | ⚠️ Server costs | ✅ Free tier |

**Key deciding factors:**
- **Zero infrastructure management** — No server to deploy or maintain.
- **Firestore Security Rules** — Team-based data isolation is expressible declaratively without backend code.
- **Storage integrated with Auth** — Upload rules reference `request.auth.uid` directly.
- **School environment constraints** — Many schools block unknown backends; Firebase is widely recognized.

## Team-Based Isolation with Firestore Rules

The core security requirement: **students can only access their own team's data**.

Firestore rules (`firestore.rules`) achieve this through:

```
function isTeamMember(teamId) {
  return isAuth() && exists(/databases/$(database)/documents/teams/$(teamId))
    && get(/databases/$(database)/documents/teams/$(teamId)).data.memberUids.hasAny([uid()]);
}
```

Key rule patterns:
1. **Users collection**: `allow read, write: if request.auth.uid == userId`
2. **Teams collection**: `allow read: if isAuth()` (anyone can search); `allow create` enforces leader role; `allow update: if isTeamMember(teamId)`
3. **Submissions collection**: `allow read: if isTeamMember(resource.data.teamId)` — only team members see their team's submissions. `allow create` enforces `userId == uid()`.
4. **Storage**: Upload paths scoped under `/users/{userId}/` or `/submissions/{teamId}/`.

The `memberUids` flat array allows efficient rule matching via `hasAny()` without sub-collection queries.

## Offline Architecture

Firestore provides client-side offline persistence, but we chose a **dedicated SQLite database** for experiment data for several reasons:

1. **Large blobs**: Experiment logs contain JSON payloads with sensor arrays; Firestore document limits (1 MiB) could be hit with lengthy trial sessions.
2. **Explicit sync control**: The `synced` flag gives us fine-grained control over which records have been uploaded, enabling retry logic.
3. **No vendor lock-in for historical data**: SQLite data can be exported, migrated, or analyzed outside Firebase.
4. **Structured relational model**: Experiment logs reference activities via foreign key, which is more natural in SQL than Firestore sub-collections.

The offline queue pattern:
```
Record trial → INSERT into experiment_logs (synced=0)
On connectivity → getPendingSyncLogs() → write to Firestore → markLogSynced(id)
```

## Trade-offs

### Pros
- **Rapid development**: Firebase SDKs provide auth, database, and storage out of the box.
- **Real-time collaboration**: Team members see leaderboard updates and membership changes immediately via Firestore listeners.
- **Declarative security**: Rules are reviewed in one file (`firestore.rules`) without deploying server code.
- **Free tier viable**: Small classroom deployments fit within the Spark Plan quotas (50K reads/day, 20K writes/day, 5 GB storage).
- **expo-sqlite integration**: Works seamlessly in Expo managed workflow.

### Cons
- **Firestore query limitations**: No aggregation queries; the leaderboard is computed client-side by fetching all submissions.
- **Write costs**: Each submission write counts toward Firestore quotas; high-frequency logging could exceed free tier.
- **No native geoqueries**: Sound map spatial queries would require a third-party service.
- **Vendor dependency**: Migrating away from Firebase would require significant work.
- **Security rule complexity**: Team isolation requires careful rule maintenance, especially if team membership structures change.
- **Sync complexity**: The dual-storage (SQLite + Firestore) requires explicit sync orchestration.

### Mitigations
- Leaderboard computation is lightweight (fetches all submissions, groups in memory) — acceptable for typical classroom sizes (≤200 submissions).
- SQLite acts as a buffer: if Firestore write fails, data is preserved and retried.
- Firestore indexes (`firestore.indexes.json`) optimize the two main query patterns (by `teamId`, by `activityKey + teamId`).

## Alternatives Considered

### Backendless with Firebase only
Rejected because experiment data could exceed Firestore document size limits for complex multi-trial sessions.

### Supabase
Strong alternative with PostgreSQL, RLS, and Storage. Rejected because:
- Real-time subscriptions were in beta at the time of decision.
- More complex deployment (self-hosted option adds ops overhead).
- Smaller ecosystem for Expo integration at the time.

### Custom Node.js / Express API + PostgreSQL
Rejected due to:
- Server deployment and maintenance overhead.
- Need to implement auth from scratch or integrate a third-party auth service.
- No built-in real-time push (requires WebSocket or polling).
- Less suitable for a small classroom project with limited ops resources.

## Consequences

1. **Firestore rules must be kept in sync with app changes** — any change to team structure or submission schema requires rule review.
2. **Client-side leaderboard** is acceptable for current scale but would need a server-side aggregation function for larger deployments.
3. **SQLite schema changes** require migration logic — the `CREATE TABLE IF NOT EXISTS` pattern in `database.ts` only handles initial creation, not schema evolution.
4. **Storage rules** are more permissive than ideal (any authenticated user can write to `/submissions/{teamId}/`). This is acceptable because team membership is enforced at the app level.
5. **EAS Build profiles** (dev → APK → app-bundle) enable testing across development, preview, and production without exposing API keys or rules changes.
