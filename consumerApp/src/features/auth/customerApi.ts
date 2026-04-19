import { api } from '@/lib/api';
import type { TenantCustomer } from '@/store/tenant';

export async function fetchCustomerByTenant(signInKey: string): Promise<TenantCustomer> {
  const baseUrl = api.defaults.baseURL || 'unknown base URL';
  console.log(`Fetching customer for tenant: ${baseUrl}/api/customers/by-signinkey/${signInKey}`);
  const response = await api.get(`/api/customers/by-signinkey/${encodeURIComponent(signInKey)}`);
  console.log(`Fetched customer for tenant: ${signInKey}`, response.data);
  return { signInKey, ...response.data } as TenantCustomer;
}
