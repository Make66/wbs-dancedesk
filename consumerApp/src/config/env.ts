export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
  chatProxyUrl: process.env.EXPO_PUBLIC_CHAT_PROXY_URL ?? 'http://localhost:8000/chats',
  // TODO: replace with tenant selection flow
  tmpTenantId: process.env.EXPO_PUBLIC_TMP_TENANT_ID ?? '',
};
