import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { useTenantStore } from '@/store/tenant';

export type Post = {
  id: string;
  title: string;
  teaser: string;
  text: string;
  imageUrl: string | null;
  author: string;
  date: string;
  isTopPost: boolean;
};

export function usePosts() {
  const apiKey = useTenantStore((state) => state.customer?.apiKey ?? '');
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(env.feedUrl, { headers: { 'x-api-key': apiKey } });
      if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
      const json = await res.json() as { posts: Post[] };
      return json.posts;
    },
    enabled: !!apiKey,
  });
}

export function usePost(postId: string) {
  const { data: posts } = usePosts();
  return { data: posts?.find((p) => p.id === postId) };
}
