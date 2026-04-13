import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { signOut } from '@/features/auth/useAuthState';
import { useOnboardingStore } from '@/store/onboarding';

export default function SettingsTab() {
  const { mode, resolvedMode, setMode, colors } = useAppTheme();
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  return (
    <Screen>
      <Card>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <ThemedText style={{ color: colors.textMuted }}>Resolved theme: {resolvedMode}</ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.section}>Theme</ThemedText>
        <View style={styles.row}>
          {(['system', 'light', 'dark'] as const).map((item) => {
            const active = item === mode;
            return (
              <Pressable key={item} onPress={() => setMode(item)} style={[styles.pill, { backgroundColor: active ? colors.primaryMuted : colors.surfaceAlt, borderColor: colors.border }]}> 
                <ThemedText style={{ color: active ? colors.primary : colors.text }}>{item}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <ThemedText style={styles.section}>Onboarding</ThemedText>
        <Pressable
          onPress={() => {
            resetOnboarding();
            Alert.alert('Onboarding reset', 'Restart the app flow or sign in again to see onboarding from step one.');
          }}
          style={[styles.logout, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
        >
          <ThemedText>Reset onboarding</ThemedText>
        </Pressable>
      </Card>

      <Card>
        <ThemedText style={styles.section}>Account</ThemedText>
        <Pressable onPress={signOut} style={[styles.logout, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <ThemedText>Sign out</ThemedText>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  logout: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
});
