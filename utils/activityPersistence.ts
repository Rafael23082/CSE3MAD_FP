export const REQUIRED_ACTIVITY_KEYS = [
  "parachute-drop-challenge",
  "sound-pollution-hunter",
  "hand-fan-challenge",
  "earthquake-resistant-structure",
] as const;

export type RequiredActivityKey = (typeof REQUIRED_ACTIVITY_KEYS)[number];

export interface ActivityLocation {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

export interface ActivityLogEntry {
  activityKey: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface ActivityResultInput {
  userId: string;
  teamId: string;
  activityKey: string;
  logs: ActivityLogEntry[];
  reflection?: string;
  rating?: number;
  location?: ActivityLocation | null;
  submittedAt?: Date;
}

export interface ActivityResultRecord {
  userId: string;
  teamId: string;
  activityKey: string;
  logsJson: string;
  reflection: string;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  submittedAt: string;
}

export interface FirestoreSubmissionPayload {
  userId: string;
  teamId: string;
  activityKey: string;
  logs: ActivityLogEntry[];
  reflection: string;
  rating: number | null;
  location: ActivityLocation | null;
  logCount: number;
  submittedAt: string;
}

export function buildActivityResultRecord(
  input: ActivityResultInput,
): ActivityResultRecord {
  const submittedAt = input.submittedAt ?? new Date();

  return {
    userId: input.userId,
    teamId: input.teamId,
    activityKey: input.activityKey,
    logsJson: JSON.stringify(input.logs),
    reflection: input.reflection ?? "",
    rating: input.rating ?? null,
    latitude: input.location?.latitude ?? null,
    longitude: input.location?.longitude ?? null,
    accuracy: input.location?.accuracy ?? null,
    submittedAt: submittedAt.toISOString(),
  };
}

export function buildFirestoreSubmissionPayload(
  input: ActivityResultInput,
): FirestoreSubmissionPayload {
  const submittedAt = input.submittedAt ?? new Date();

  return {
    userId: input.userId,
    teamId: input.teamId,
    activityKey: input.activityKey,
    logs: input.logs,
    reflection: input.reflection ?? "",
    rating: input.rating ?? null,
    location: input.location ?? null,
    logCount: input.logs.length,
    submittedAt: submittedAt.toISOString(),
  };
}

async function getDatabase() {
  const { openDatabaseAsync } = await import("expo-sqlite");
  const database = await openDatabaseAsync("stemm-results.db");

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      key TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      team_id TEXT NOT NULL,
      activity_key TEXT NOT NULL,
      logs_json TEXT NOT NULL,
      reflection TEXT NOT NULL,
      rating INTEGER,
      latitude REAL,
      longitude REAL,
      accuracy REAL,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY(activity_key) REFERENCES activities(key)
    );
  `);

  try {
    await database.execAsync(`ALTER TABLE results ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'pending'`);
  } catch {
    // Column already exists
  }

  for (const activityKey of REQUIRED_ACTIVITY_KEYS) {
    await database.runAsync(
      "INSERT OR IGNORE INTO activities (key, name) VALUES (?, ?)",
      activityKey,
      activityKey,
    );
  }

  return database;
}

export async function saveActivityResultLocally(
  input: ActivityResultInput,
): Promise<number> {
  const database = await getDatabase();
  const record = buildActivityResultRecord(input);
  const result = await database.runAsync(
    `INSERT INTO results (
      user_id,
      team_id,
      activity_key,
      logs_json,
      reflection,
      rating,
      latitude,
      longitude,
      accuracy,
      submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    record.userId,
    record.teamId,
    record.activityKey,
    record.logsJson,
    record.reflection,
    record.rating,
    record.latitude,
    record.longitude,
    record.accuracy,
    record.submittedAt,
  );

  return Number(result.lastInsertRowId);
}

export async function saveActivityResultToFirestore(
  input: ActivityResultInput,
): Promise<string> {
  const [{ addDoc, collection, Timestamp }, firebase] = await Promise.all([
    import("firebase/firestore"),
    import("@/firebase"),
  ]);
  const payload = buildFirestoreSubmissionPayload(input);
  const docRef = await addDoc(collection(firebase.db, "submissions"), {
    ...payload,
    submittedAt: Timestamp.fromDate(new Date(payload.submittedAt)),
  });

  return docRef.id;
}

export async function updateSyncStatus(id: number, status: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE results SET sync_status = ? WHERE id = ?`,
    [status, id],
  );
}

export async function getPendingSyncResults(): Promise<{ id: number; payload: ActivityResultInput }[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: number;
    user_id: string;
    team_id: string;
    activity_key: string;
    logs_json: string;
    reflection: string;
    rating: number | null;
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    submitted_at: string;
  }>(
    `SELECT * FROM results WHERE sync_status = 'pending'`,
  );
  return rows.map((r) => ({
    id: r.id,
    payload: {
      userId: r.user_id,
      teamId: r.team_id,
      activityKey: r.activity_key,
      logs: JSON.parse(r.logs_json),
      reflection: r.reflection || undefined,
      rating: r.rating ?? undefined,
      location: (r.latitude != null && r.longitude != null) ? { latitude: r.latitude, longitude: r.longitude, accuracy: r.accuracy } : undefined,
      submittedAt: new Date(r.submitted_at),
    },
  }));
}

export async function retryPendingSyncs(): Promise<void> {
  const pending = await getPendingSyncResults();
  for (const item of pending) {
    try {
      await saveActivityResultToFirestore(item.payload);
      await updateSyncStatus(item.id, 'synced');
    } catch (e) {
      console.warn(`Retry sync failed for result ${item.id}:`, e);
    }
  }
}
