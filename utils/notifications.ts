import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

function scheduleNotification(title: string, body: string) {
  if (isExpoGo) {
    Alert.alert(title, body);
    return;
  }
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  }).catch(() => {});
}

export function configureNotifications() {
  if (isExpoGo) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('activity-complete', {
      name: 'Activity Complete',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (isExpoGo) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function showActivitySaved(): void {
  scheduleNotification('Activity Saved', 'Your experiment data has been recorded.');
}

export function showActivitySubmitted(points: number): void {
  scheduleNotification('Activity Submitted', `You earned ${points} points!`);
}

export async function showActivityCompleted(activityName: string): Promise<void> {
  scheduleNotification('Congratulations!', `You have finished ${activityName}`);
}

export async function showSyncCompleted(count: number): Promise<void> {
  if (count === 0) return;
  scheduleNotification('Sync Completed', `${count} experiment(s) synced to cloud.`);
}
