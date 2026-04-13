import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { usePost } from '@/hooks/usePosts';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = usePost(id);
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
      <Card>
        <ThemedText style={styles.title}>{data?.title}</ThemedText>
        <ThemedText style={{ color: colors.textMuted }}>Post #{id}</ThemedText>
        <ThemedText>{data?.body}</ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700' },
});
