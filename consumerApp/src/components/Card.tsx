import { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

export function Card({ children }: PropsWithChildren) {
  const { colors } = useAppTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
});
