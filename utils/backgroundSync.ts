import { AppState } from 'react-native';
import { getPendingSyncData, markLogSynced } from './database';
import { saveSubmission } from './activitySubmissions';

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
          teamId: group.teamId,
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
