import { PropsWithChildren, ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeProvider';

type Props = PropsWithChildren<{
  header?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}>;

export function Screen({ children, header, refreshing, onRefresh }: Props) {
  const { colors } = useAppTheme();
  const refreshControl =
    onRefresh !== undefined ? (
      <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
    ) : undefined;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {header}
      <ScrollView contentContainerStyle={styles.content} refreshControl={refreshControl}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 16 },
});
