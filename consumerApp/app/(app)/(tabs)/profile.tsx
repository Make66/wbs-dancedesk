import { Pressable, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { logout } from '@/features/auth/authApi';
import { useUserStore } from '@/store/user';
import { ParticipantUpdateForm } from '@/features/participant/ParticipantUpdateForm';

export default function ProfileTab() {
  const { colors } = useAppTheme();
  const participant = useUserStore((state) => state.participant);

  return (
    <Screen header={
    <ScreenHeader title=
    { participant ? 'Dein Profil: ' + `${participant.firstName} ${participant.lastName} (${participant.email})` : 'Profil' } />
    }>

      <Card>
        <ThemedText style={styles.section}>Daten bearbeiten</ThemedText>
        <ParticipantUpdateForm />
      </Card>

      <Pressable
        style={[styles.signOut, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={logout}
      >
        <ThemedText style={{ color: colors.danger, fontWeight: '600' }}>Abmelden</ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  signOut: { padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'center', marginTop: 8 },
});
