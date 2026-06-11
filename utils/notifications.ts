import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Configure notification behavior
 */
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

/**
 * Show notification when activity attempt is saved
 */
export async function showActivitySaved(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Activity Saved',
      body: 'Your experiment data has been recorded.',
      sound: true,
    },
    trigger: null,
  });
}

/**
 * Show notification when activity is submitted to leaderboard
 */
export async function showActivitySubmitted(points: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Activity Submitted',
      body: `You earned ${points} points!`,
      sound: true,
    },
    trigger: null,
  });
}

/**
 * Show background sync completed notification
 */
export async function showSyncCompleted(count: number): Promise<void> {
  if (count === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sync Completed',
      body: `${count} experiment(s) synced to cloud.`,
      sound: true,
    },
    trigger: null,
  });
}
