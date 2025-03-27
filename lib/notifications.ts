import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'web') {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    // For web, we'll use the browser's notification API
    token = 'web-notification';
  } else {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
  }

  return token;
}

export async function sendTestNotification() {
  if (Platform.OS === 'web') {
    // Use browser's notification API for web
    new Notification('Test Notification', {
      body: 'This is a test notification to verify the system is working.',
      icon: '/favicon.png',
    });
  } else {
    // Use Expo notifications for mobile
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification to verify the system is working.',
        data: { type: 'test' },
      },
      trigger: null, // Send immediately
    });
  }
}

export function setupNotificationHandler() {
  if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
}