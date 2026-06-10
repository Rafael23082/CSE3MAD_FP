import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getPendingSyncData, markLogSynced } from './database';
import { saveSubmission } from './activitySubmissions';
import { showSyncCompleted } from './notifications';

export const BACKGROUND_SYNC_TASK = 'background-sync-task';

export interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

let lastSyncTime: Date | null = null;

export async function syncPendingLogs(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, failed: 0, errors: [] };

  try {
    const pendingGroups = await getPendingSyncData();

    for (const group of pendingGroups) {
      try {
        await saveSubmission({
          userId: group.userId,
          activityKey: group.activityKey,
          logs: group.logs.map((l) => ({
            activityKey: group.activityKey,
            data: l.data,
            timestamp: l.timestamp,
          })),
          reflection: '',
          submittedAt: new Date(),
        });

        for (const logId of group.logIds) {
          await markLogSynced(logId);
        }
        result.synced += group.logs.length;
      } catch (err) {
        result.failed += group.logs.length;
        result.errors.push(err instanceof Error ? err.message : String(err));
      }
    }

    lastSyncTime = new Date();
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : String(err));
  }

  return result;
}

/**
 * Background task definition
 */
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const result = await syncPendingLogs();
    if (result.synced > 0) {
      await showSyncCompleted(result.synced);
    }
    return result.synced > 0 ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register background sync task (15-minute interval)
 */
export async function registerBackgroundTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (isRegistered) return;

    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch {
    // Background task registration may fail on some devices
  }
}

/**
 * Unregister background sync task
 */
export async function unregisterBackgroundTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    }
  } catch {
    // Ignore errors
  }
}

export function registerSyncOnForeground(): () => void {
  const subscription = AppState.addEventListener('change', (nextState: string) => {
    if (nextState === 'active') {
      syncPendingLogs().catch(() => {});
    }
  });

  return () => {
    subscription.remove();
  };
}

export async function getSyncStatus(): Promise<{ pending: number; lastSync: Date | null }> {
  const data = await getPendingSyncData();
  const pending = data.reduce((acc, g) => acc + g.logIds.length, 0);
  return { pending, lastSync: lastSyncTime };
}
