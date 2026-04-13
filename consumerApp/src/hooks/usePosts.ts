import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await api.get<Post[]>('/posts');
      return data.slice(0, 20);
    },
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/posts/${postId}`);
      return data;
    },
    enabled: !!postId,
  });
}
