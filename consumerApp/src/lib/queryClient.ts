import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showDevToast } from '@/store/devMode';

function formatError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const method = error.config?.method?.toUpperCase() ?? '?';
    const url = error.config?.url ?? '?';
    const status = error.response?.status ?? 'network error';
    const data = error.response?.data;
    const detail = data ? JSON.stringify(data, null, 2) : error.message;
    return `${method} ${url}\n${status}: ${detail}`;
  }
  return error instanceof Error ? error.message : String(error);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnReconnect: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => showDevToast(formatError(error)),
  }),
  mutationCache: new MutationCache({
    onError: (error) => showDevToast(formatError(error)),
  }),
});

export const invalidateQueryCache = () => {
  void queryClient.invalidateQueries();
};

export const clearQueryCache = () => {
  queryClient.clear();
};
