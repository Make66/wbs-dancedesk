import { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export function FormSection({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
});
