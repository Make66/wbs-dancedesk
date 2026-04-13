import { Stack, Redirect } from 'expo-router';
import { useAuthState } from '@/features/auth/useAuthState';

export default function AuthLayout() {
  const { user, initializing } = useAuthState();
  if (initializing) return null;
  if (user) return <Redirect href='/(app)/(tabs)' />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
