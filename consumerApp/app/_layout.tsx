import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AppProviders } from '@/providers/AppProviders';
import { DevToast } from '@/components/DevToast';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
      <DevToast />
    </AppProviders>
  );
}
