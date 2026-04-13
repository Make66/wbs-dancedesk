import { Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { usePosts } from '@/hooks/usePosts';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function FeedTab() {
  const { data, isLoading, isError } = usePosts();
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText style={styles.title}>Feed</ThemedText>
      {isError ? <ThemedText>Failed to load posts.</ThemedText> : null}
      {data?.map((post) => (
        <Link key={post.id} href={`/(app)/(tabs)/post/${post.id}`} asChild>
          <Card>
            <View style={{ gap: 8 }}>
              <ThemedText style={styles.cardTitle}>{post.title}</ThemedText>
              <ThemedText style={{ color: colors.textMuted }} numberOfLines={2}>{post.body}</ThemedText>
            </View>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  cardTitle: { fontSize: 17, fontWeight: '600' },
});
