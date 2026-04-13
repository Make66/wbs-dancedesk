import { Redirect, Stack } from 'expo-router';
import { useAuthState } from '@/features/auth/useAuthState';

export default function AppLayout() {
  const { user, initializing } = useAuthState();

  if (initializing) return null;
  if (!user) return <Redirect href='/(auth)/login' />;

  console.log('[6] APP LAYOUT: user authenticated, rendering protected layout for', user.id);

  return <Stack screenOptions={{ headerShown: false }} />;
}
