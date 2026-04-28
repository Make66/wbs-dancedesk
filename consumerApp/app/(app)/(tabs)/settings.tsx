import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { signOut } from '@/features/auth/useAuthState';
import { useOnboardingStore } from '@/store/onboarding';
import { useTenantStore } from '@/store/tenant';
import { lightColors } from '@/theme/colors';
import { clearQueryCache, invalidateQueryCache } from '@/lib/queryClient';

function Row({ label, value, colors }: { label: string; value: string; colors: typeof lightColors }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

export default function SettingsTab() {
  const { mode, resolvedMode, setMode, colors } = useAppTheme();
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const customer = useTenantStore((state) => state.customer);

  return (
    <Screen>
      <Card>
        <ThemedText style={styles.title}>Einstellungen</ThemedText>
        <ThemedText style={{ color: colors.textMuted }}>
          Resolved theme: {resolvedMode}
        </ThemedText>
      </Card>

      {customer && (
        <Card>
          <ThemedText style={styles.section}>Tanzschule</ThemedText>
          <View style={styles.details}>
            <Row label="Name" value={customer.name} colors={colors} />
            <Row label="E-Mail" value={customer.email} colors={colors} />
            {customer.website ? (
              <Row label="Website" value={customer.website} colors={colors} />
            ) : null}
            <Row
              label="Adresse"
              value={`${customer.street}, ${customer.zipCode} ${customer.city}`}
              colors={colors}
            />
            <Row
              label="TenantID"
              value={`${customer.tenantId}`}
              colors={colors}
            />
            <Row label="API-Key" value={`${customer.apiKey}`} colors={colors} />
            <Row label="Sign-In-Key" value={`${customer.signInKey}`} colors={colors} />
            <Pressable
              onPress={() => { invalidateQueryCache(); Alert.alert('Cache invalidated', 'All queries will refetch on next view.'); }}
              style={[styles.logout, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            >
              <ThemedText>Invalidate Query Cache</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => { clearQueryCache(); Alert.alert('Cache cleared', 'All cached data has been removed.'); }}
              style={[styles.logout, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            >
              <ThemedText>Clear Query Cache</ThemedText>
            </Pressable>
          </View>
        </Card>
      )}

      <Card>
        <ThemedText style={styles.section}>Theme</ThemedText>
        <View style={styles.row}>
          {(["system", "light", "dark"] as const).map((item) => {
            const active = item === mode;
            return (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active
                      ? colors.primaryMuted
                      : colors.surfaceAlt,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemedText
                  style={{ color: active ? colors.primary : colors.text }}
                >
                  {item}
                </ThemedText>
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
            Alert.alert(
              "Onboarding reset",
              "Restart the app flow or sign in again to see onboarding from step one.",
            );
          }}
          style={[
            styles.logout,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          <ThemedText>Reset onboarding</ThemedText>
        </Pressable>
      </Card>

      <Card>
        <ThemedText style={styles.section}>Account</ThemedText>
        <Pressable
          onPress={signOut}
          style={[
            styles.logout,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          <ThemedText>Sign out</ThemedText>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  details: { gap: 10 },
  detailRow: { gap: 2 },
  detailLabel: { fontSize: 12 },
  detailValue: { fontSize: 15 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  logout: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
});
