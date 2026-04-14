import { StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useUserStore } from '@/store/user';
import { ParticipantUpdateForm } from '@/features/participant/ParticipantUpdateForm';

export default function ProfileTab() {
  const participant = useUserStore((state) => state.participant);

  return (
    <Screen header={
    <ScreenHeader
      title={ participant ? `${participant.firstName} ${participant.lastName}` : 'Profil' }
      showLogout
    />
    }>

      <Card>
        <ThemedText style={styles.section}>Daten bearbeiten</ThemedText>
        <ParticipantUpdateForm />
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
});
