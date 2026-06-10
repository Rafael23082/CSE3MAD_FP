import { db } from "@/firebase";
import { POINTS_PER_ACTIVITY } from "@/constants/data";
import { ActivityAttempt, ActivityProgress, ActivityLogEntry } from "@/constants/types";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

// ==========================================
// SQLite Helper (lazy import)
// ==========================================

async function getDatabase() {
  const { openDatabaseAsync } = await import("expo-sqlite");
  const database = await openDatabaseAsync("stemm-attempts.db");

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS activity_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firestore_id TEXT,
      user_id TEXT NOT NULL,
      activity_key TEXT NOT NULL,
      logs_json TEXT NOT NULL,
      reflection TEXT DEFAULT '',
      rating INTEGER,
      is_leaderboard_submission INTEGER DEFAULT 0,
      submitted_to_leaderboard_at TEXT,
      created_at TEXT NOT NULL,
      sync_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS activity_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      activity_key TEXT NOT NULL,
      official_submission_attempt_id TEXT,
      is_completed INTEGER DEFAULT 0,
      completed_at TEXT,
      points INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    );
  `);

  return database;
}

// ==========================================
// Create Attempt
// ==========================================

export async function createAttempt(
  userId: string,
  activityKey: string,
  logs: ActivityLogEntry[],
  reflection: string = "",
  rating: number | null = null
): Promise<string> {
  const now = new Date();

  // Save to Firestore
  const docRef = await addDoc(collection(db, "activityAttempts"), {
    userId,
    activityKey,
    logs,
    reflection,
    rating,
    isLeaderboardSubmission: false,
    submittedToLeaderboardAt: null,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });

  const firestoreId = docRef.id;

  // Save to SQLite
  try {
    const database = await getDatabase();
    await database.runAsync(
      `INSERT INTO activity_attempts (
        firestore_id, user_id, activity_key, logs_json, reflection, rating,
        is_leaderboard_submission, submitted_to_leaderboard_at, created_at, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      firestoreId,
      userId,
      activityKey,
      JSON.stringify(logs),
      reflection,
      rating,
      0,
      null,
      now.toISOString(),
      "synced"
    );
  } catch (e) {
    console.warn("SQLite save failed:", e);
  }

  return firestoreId;
}

// ==========================================
// Get Attempts for Activity
// ==========================================

export async function getAttemptsForActivity(
  userId: string,
  activityKey: string
): Promise<ActivityAttempt[]> {
  const q = query(
    collection(db, "activityAttempts"),
    where("userId", "==", userId),
    where("activityKey", "==", activityKey),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ActivityAttempt[];
}

// ==========================================
// Delete Attempt (draft only)
// ==========================================

export async function deleteAttempt(attemptId: string): Promise<void> {
  // Check if this is a leaderboard submission
  const attemptDoc = await getDoc(doc(db, "activityAttempts", attemptId));
  if (!attemptDoc.exists()) {
    throw new Error("Attempt not found");
  }

  const attemptData = attemptDoc.data();
  if (attemptData.isLeaderboardSubmission) {
    throw new Error("Cannot delete a submitted attempt");
  }

  // Delete from Firestore
  await deleteDoc(doc(db, "activityAttempts", attemptId));

  // Delete from SQLite
  try {
    const database = await getDatabase();
    await database.runAsync(
      "DELETE FROM activity_attempts WHERE firestore_id = ?",
      attemptId
    );
  } catch (e) {
    console.warn("SQLite delete failed:", e);
  }
}

// ==========================================
// Submit to Leaderboard
// ==========================================

export async function submitToLeaderboard(attemptId: string): Promise<void> {
  const attemptDoc = await getDoc(doc(db, "activityAttempts", attemptId));
  if (!attemptDoc.exists()) {
    throw new Error("Attempt not found");
  }

  const attemptData = attemptDoc.data();
  const { userId, activityKey } = attemptData;
  const now = new Date();

  // Check if activity already has an official submission
  const progressId = `${userId}_${activityKey}`;
  const progressDoc = await getDoc(doc(db, "activityProgress", progressId));

  const batch = writeBatch(db);

  if (progressDoc.exists()) {
    // Activity already has a submission - need to unsubmit the old one
    const progressData = progressDoc.data();
    const oldAttemptId = progressData.officialSubmissionAttemptId;

    if (oldAttemptId && oldAttemptId !== attemptId) {
      // Unsubmit the old attempt
      const oldAttemptRef = doc(db, "activityAttempts", oldAttemptId);
      batch.update(oldAttemptRef, {
        isLeaderboardSubmission: false,
        submittedToLeaderboardAt: null,
        updatedAt: Timestamp.fromDate(now),
      });
    }

    // Update progress with new official submission (points unchanged, no currentScoreReachedAt update)
    const progressRef = doc(db, "activityProgress", progressId);
    batch.update(progressRef, {
      officialSubmissionAttemptId: attemptId,
      updatedAt: Timestamp.fromDate(now),
    });
  } else {
    // First submission for this activity - create progress document
    const progressRef = doc(db, "activityProgress", progressId);
    batch.set(progressRef, {
      id: progressId,
      userId,
      activityKey,
      officialSubmissionAttemptId: attemptId,
      isCompleted: true,
      completedAt: Timestamp.fromDate(now),
      currentScoreReachedAt: Timestamp.fromDate(now),
      points: POINTS_PER_ACTIVITY,
      updatedAt: Timestamp.fromDate(now),
    });
  }

  // Mark the new attempt as official
  const attemptRef = doc(db, "activityAttempts", attemptId);
  batch.update(attemptRef, {
    isLeaderboardSubmission: true,
    submittedToLeaderboardAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });

  await batch.commit();

  // Update SQLite
  try {
    const database = await getDatabase();

    // Unsubmit old attempt in SQLite
    if (progressDoc.exists()) {
      const oldAttemptId = progressDoc.data().officialSubmissionAttemptId;
      if (oldAttemptId && oldAttemptId !== attemptId) {
        await database.runAsync(
          `UPDATE activity_attempts SET is_leaderboard_submission = 0, submitted_to_leaderboard_at = NULL, sync_status = 'pending' WHERE firestore_id = ?`,
          oldAttemptId
        );
      }
    }

    // Mark new attempt as official in SQLite
    await database.runAsync(
      `UPDATE activity_attempts SET is_leaderboard_submission = 1, submitted_to_leaderboard_at = ?, sync_status = 'pending' WHERE firestore_id = ?`,
      now.toISOString(),
      attemptId
    );

    // Update or insert progress in SQLite
    const progressId = `${userId}_${activityKey}`;
    await database.runAsync(
      `INSERT OR REPLACE INTO activity_progress (id, user_id, activity_key, official_submission_attempt_id, is_completed, completed_at, current_score_reached_at, points, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      progressId,
      userId,
      activityKey,
      attemptId,
      1,
      now.toISOString(),
      now.toISOString(),
      POINTS_PER_ACTIVITY,
      now.toISOString()
    );
  } catch (e) {
    console.warn("SQLite update failed:", e);
  }
}

// ==========================================
// Replace Submission
// ==========================================

export async function replaceSubmission(newAttemptId: string): Promise<void> {
  // This is the same as submitToLeaderboard - it handles the replacement logic
  return submitToLeaderboard(newAttemptId);
}

// ==========================================
// Get Official Submission for Activity
// ==========================================

export async function getOfficialSubmission(
  userId: string,
  activityKey: string
): Promise<ActivityAttempt | null> {
  const q = query(
    collection(db, "activityAttempts"),
    where("userId", "==", userId),
    where("activityKey", "==", activityKey),
    where("isLeaderboardSubmission", "==", true)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as ActivityAttempt;
}

// ==========================================
// Get Activity Progress
// ==========================================

export async function getActivityProgress(
  userId: string
): Promise<ActivityProgress[]> {
  const q = query(
    collection(db, "activityProgress"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ActivityProgress[];
}

// ==========================================
// Calculate Total Points
// ==========================================

export async function calculateTotalPoints(userId: string): Promise<number> {
  const progress = await getActivityProgress(userId);
  return progress.reduce((sum, p) => sum + p.points, 0);
}

// ==========================================
// Get All Teams Progress (for leaderboard)
// ==========================================

export async function getAllTeamsProgress(): Promise<ActivityProgress[]> {
  const q = query(
    collection(db, "activityProgress"),
    where("isCompleted", "==", true)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ActivityProgress[];
}
