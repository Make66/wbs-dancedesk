import { api } from '@/lib/api';
import type { TenantCustomer } from '@/store/tenant';

export async function fetchCustomerByTenant(tenantId: string): Promise<TenantCustomer> {
  const response = await api.get(`/customers/by-tenant/${encodeURIComponent(tenantId)}`);
  return { tenantId, ...response.data } as TenantCustomer;
}
