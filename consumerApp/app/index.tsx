import { Redirect } from 'expo-router';
import { useAuthState } from '@/features/auth/useAuthState';

export default function Index() {
  const { user, initializing } = useAuthState();

  if (initializing) return null;
  if (!user) return <Redirect href='/(auth)/login' />;
  return <Redirect href='/(app)/(tabs)' />;
}
