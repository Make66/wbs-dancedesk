import { Platform, PermissionsAndroid } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'ios') {
    await messaging().requestPermission();
  }

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  await messaging().registerDeviceForRemoteMessages();
  const fcmToken = await messaging().getToken();
  return { fcmToken };
}

export function subscribeForegroundMessages() {
  return messaging().onMessage(async (remoteMessage) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title ?? 'New message',
        body: remoteMessage.notification?.body ?? 'You have a new notification.',
        data: remoteMessage.data,
      },
      trigger: null,
    });
  });
}
