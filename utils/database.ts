import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    db = await SQLite.openDatabaseAsync('stemm_lab.db');
    await initSchema(db);
    return db;
  })();
  return dbPromise;
}

async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_key TEXT NOT NULL,
      team_id TEXT,
      user_id TEXT,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS experiment_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER,
      activity_key TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      data_json TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (activity_id) REFERENCES activities(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      activity_key TEXT PRIMARY KEY,
      rating INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function saveActivityStart(
  activityKey: string,
  teamId?: string,
  userId?: string,
): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO activities (activity_key, team_id, user_id, started_at) VALUES (?, ?, ?, ?)`,
    [activityKey, teamId ?? null, userId ?? null, new Date().toISOString()],
  );
  return result.lastInsertRowId;
}

export async function saveActivityComplete(activityId: number): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `UPDATE activities SET completed_at = ? WHERE id = ?`,
    [new Date().toISOString(), activityId],
  );
}

export async function saveExperimentLog(
  activityKey: string,
  data: Record<string, unknown>,
  timestamp: number,
  activityId?: number,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO experiment_logs (activity_id, activity_key, timestamp, data_json) VALUES (?, ?, ?, ?)`,
    [activityId ?? null, activityKey, timestamp, JSON.stringify(data)],
  );
}

export async function saveRating(
  activityKey: string,
  rating: number,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO ratings (activity_key, rating, updated_at) VALUES (?, ?, ?)`,
    [activityKey, rating, new Date().toISOString()],
  );
}

export async function getExperimentLogs(
  activityKey: string,
): Promise<{ timestamp: number; data: Record<string, unknown> }[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    timestamp: number;
    data_json: string;
  }>(
    `SELECT timestamp, data_json FROM experiment_logs WHERE activity_key = ? ORDER BY timestamp DESC`,
    [activityKey],
  );
  return rows.map((r) => {
    let data: Record<string, unknown>;
    try { data = JSON.parse(r.data_json); } catch { data = { parseFailed: true }; }
    return { timestamp: r.timestamp, data };
  });
}

export async function getRating(activityKey: string): Promise<number | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ rating: number }>(
    `SELECT rating FROM ratings WHERE activity_key = ?`,
    [activityKey],
  );
  return row?.rating ?? null;
}

export async function getPendingSyncLogs(): Promise<{
  id: number;
  activityKey: string;
  data: Record<string, unknown>;
  timestamp: number;
}[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: number;
    activity_key: string;
    data_json: string;
    timestamp: number;
  }>(
    `SELECT id, activity_key, data_json, timestamp FROM experiment_logs WHERE synced = 0`,
  );
  return rows.map((r) => {
    let data: Record<string, unknown>;
    try { data = JSON.parse(r.data_json); } catch { data = { parseFailed: true }; }
    return {
      id: r.id,
      activityKey: r.activity_key,
      data,
      timestamp: r.timestamp,
    };
  });
}

export async function getPendingSyncData(): Promise<{
  activityKey: string;
  userId: string;
  teamId: string;
  logIds: number[];
  logs: { timestamp: number; data: Record<string, unknown> }[];
}[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: number;
    activity_key: string;
    user_id: string;
    team_id: string;
    timestamp: number;
    data_json: string;
  }>(
    `SELECT el.id, el.activity_key, a.user_id, a.team_id, el.timestamp, el.data_json
     FROM experiment_logs el
     JOIN activities a ON el.activity_id = a.id
     WHERE el.synced = 0
     ORDER BY el.timestamp ASC`,
  );

  const groups = new Map<string, {
    activityKey: string;
    userId: string;
    teamId: string;
    logIds: number[];
    logs: { timestamp: number; data: Record<string, unknown> }[];
  }>();

  for (const row of rows) {
    const key = `${row.activity_key}|${row.user_id ?? ''}|${row.team_id ?? ''}`;
    if (!groups.has(key)) {
      groups.set(key, {
        activityKey: row.activity_key,
        userId: row.user_id ?? '',
        teamId: row.team_id ?? '',
        logIds: [],
        logs: [],
      });
    }
    const group = groups.get(key)!;
    group.logIds.push(row.id);
    let data: Record<string, unknown>;
    try { data = JSON.parse(row.data_json); } catch { data = { parseFailed: true }; }
    group.logs.push({ timestamp: row.timestamp, data });
  }

  return Array.from(groups.values());
}

export async function markLogSynced(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync(`UPDATE experiment_logs SET synced = 1 WHERE id = ?`, [id]);
}
