import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnReconnect: true,
    },
  },
});

export const invalidateQueryCache = () => {
  void queryClient.invalidateQueries();
};

export const clearQueryCache = () => {
  queryClient.clear();
};