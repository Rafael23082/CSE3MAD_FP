import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

let NotificationsModule: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (isExpoGo) return null;
  if (!NotificationsModule) {
    NotificationsModule = await import('expo-notifications');
  }
  return NotificationsModule;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGo) {
    console.warn('[notifications] Push notifications not available in Expo Go. Use a development build.');
    return null;
  }

  const Notifications = await getNotifications();
  if (!Notifications) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission required', 'Push notifications permission was not granted.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  return tokenData.data;
}

export async function scheduleLocalNotification(title: string, body: string, seconds: number = 1) {
  const Notifications = await getNotifications();
  if (!Notifications) {
    console.warn('[notifications] Local notifications not available in Expo Go.');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false },
  });
}

export async function showActivityCompleted(activityName: string): Promise<void> {
  await scheduleLocalNotification('Congratulations!', `You have finished ${activityName}`);
}

export async function addNotificationResponseListener(
  handler: (response: any) => void
) {
  const Notifications = await getNotifications();
  if (!Notifications) return { remove: () => {} };
  return Notifications.addNotificationResponseReceivedListener(handler);
}

export async function addNotificationReceivedListener(
  handler: (notification: any) => void
) {
  const Notifications = await getNotifications();
  if (!Notifications) return { remove: () => {} };
  return Notifications.addNotificationReceivedListener(handler);
}
