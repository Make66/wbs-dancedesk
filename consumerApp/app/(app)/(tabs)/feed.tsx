import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { usePosts, type Post } from '@/hooks/usePosts';
import { useAppTheme } from '@/theme/ThemeProvider';

function FeedItem({ post, onPress }: { post: Post; onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <Card>
        {post.imageUrl ? (
          <Image source={{ uri: post.imageUrl }} style={styles.image} />
        ) : null}
        <View style={{ gap: 6 }}>
          <ThemedText style={styles.cardTitle}>{post.title}</ThemedText>
          <ThemedText style={{ color: colors.textMuted }} numberOfLines={2}>
            {post.teaser}
          </ThemedText>
          <ThemedText style={[styles.meta, { color: colors.textMuted }]}>
            {post.author} · {new Date(post.date).toLocaleDateString('de-DE')}
          </ThemedText>
        </View>
      </Card>
    </Pressable>
  );
}

export default function FeedTab() {
  const { data, isLoading, isError, refetch } = usePosts();
  const { colors } = useAppTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <ThemedText style={styles.title}>Feed</ThemedText>
      {isError ? <ThemedText>Beiträge konnten nicht geladen werden.</ThemedText> : null}
      {data?.map((post) => (
        <FeedItem
          key={post.id}
          post={post}
          onPress={() => router.push(`/(app)/post/${post.id}`)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  meta: { fontSize: 12 },
  image: {
    height: 180,
    marginTop: -16,
    marginHorizontal: -16,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
});
