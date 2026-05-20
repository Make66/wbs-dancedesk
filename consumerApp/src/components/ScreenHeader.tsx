import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useTenantStore } from '@/store/tenant';
import { logout } from '@/features/auth/authApi';
import { resourceUrl } from '@/config/env';

type Props = {
  title: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  showLogout?: boolean;
};

export function ScreenHeader({ title, action, showLogout = false }: Props) {
  const { colors } = useAppTheme();
  const logoUrl = useTenantStore((s) => s.customer?.logoUrl);
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      {logoUrl ? (
        <Image source={{ uri: resourceUrl(logoUrl) }} style={styles.logo} resizeMode="contain" />
      ) : null}
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          style={[styles.actionBtn, { backgroundColor: colors.primaryMuted }]}
        >
          <Text style={[styles.actionLabel, { color: colors.primary }]}>{action.label}</Text>
        </Pressable>
      )}
      {showLogout && (
        <Pressable onPress={logout} style={[styles.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.logoutIcon, { color: colors.danger }]}>⏻</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: { width: 120, height: 48, borderRadius: 8, marginRight: 8 },
  title: { fontSize: 17, fontWeight: '700', flex: 1 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 12 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
  logoutBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  logoutIcon: { fontSize: 16, lineHeight: 20 },
});
