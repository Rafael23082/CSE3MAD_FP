import Constants from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

const BACKGROUND_TASK_NAME = 'BACKGROUND_SYNC_TASK';

let BackgroundTask: typeof import('expo-background-task') | null = null;
let TaskManager: typeof import('expo-task-manager') | null = null;

async function loadModules() {
  if (isExpoGo) return false;
  if (!BackgroundTask) {
    BackgroundTask = await import('expo-background-task');
  }
  if (!TaskManager) {
    TaskManager = await import('expo-task-manager');
  }
  return true;
}

export async function defineBackgroundTask(callback: () => Promise<void>) {
  const loaded = await loadModules();
  if (!loaded || !TaskManager) {
    console.warn('[backgroundSync] Background tasks not available in Expo Go.');
    return;
  }

  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    try {
      await callback();
      return BackgroundTask
        ? BackgroundTask.BackgroundTaskResult.Success
        : undefined;
    } catch (error) {
      console.error('[backgroundSync] Task failed:', error);
      return BackgroundTask
        ? BackgroundTask.BackgroundTaskResult.Failed
        : undefined;
    }
  });
}

export async function registerBackgroundSync(intervalMinutes: number = 15) {
  const loaded = await loadModules();
  if (!loaded || !BackgroundTask) {
    console.warn('[backgroundSync] Cannot register background task in Expo Go.');
    return;
  }

  const isRegistered = await TaskManager!.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  if (isRegistered) return;

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: intervalMinutes,
  });
}

export async function unregisterBackgroundSync() {
  const loaded = await loadModules();
  if (!loaded || !BackgroundTask) return;

  const isRegistered = await TaskManager!.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_NAME);
  }
}
