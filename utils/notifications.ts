import { Alert, Platform, ToastAndroid } from 'react-native';

function showToast(title: string, body: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(`${title}: ${body}`, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, body);
  }
}

export function configureNotifications() {}

export async function requestNotificationPermissions(): Promise<boolean> {
  return true;
}

export function showActivitySaved(): void {
  showToast('Activity Saved', 'Your experiment data has been recorded.');
}

export function showActivitySubmitted(points: number): void {
  showToast('Activity Submitted', `You earned ${points} points!`);
}

export function showActivityCompleted(activityName: string): void {
  showToast('Activity Completed', `Your team completed ${activityName}!`);
}

export function showLowBatteryWarning(level: number): void {
  showToast('Low Battery', `Your battery is at ${level}%.`);
}

export async function showSyncCompleted(count: number): Promise<void> {
  if (count === 0) return;
  showToast('Sync Completed', `${count} experiment(s) synced to cloud.`);
}
