const devBase = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.178.52:8000',
  chatProxyUrl: process.env.EXPO_PUBLIC_CHAT_PROXY_URL ?? 'http://192.168.178.52:8000/api/chats',
  feedUrl: process.env.EXPO_PUBLIC_FEED_URL ?? 'http://192.168.178.52:8000/api/public/posts',
  // TODO: replace with tenant selection flow
  tmpTenantId: process.env.EXPO_PUBLIC_TMP_TENANT_ID ?? '',
};

const resourceBase = process.env.EXPO_PUBLIC_API_BASE_URL ?? devBase;

export function resourceUrl(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${resourceBase}${path}`;
}
