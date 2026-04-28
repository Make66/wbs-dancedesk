import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthState } from '@/features/auth/useAuthState';
import { fetchCustomerByTenant } from '@/features/auth/customerApi';
import { useTenantStore } from '@/store/tenant';

export default function AppLayout() {
  const { user, initializing } = useAuthState();
  const { customer, hydrated, setCustomer } = useTenantStore();

  useEffect(() => {
    if (!hydrated || !customer?.signInKey) return;
    fetchCustomerByTenant(customer.signInKey)
      .then(setCustomer)
      .catch(() => undefined);
  }, [hydrated]);

  if (initializing) return null;
  if (!user) return <Redirect href='/(auth)/login' />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
