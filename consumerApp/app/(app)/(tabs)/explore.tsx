import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';

export default function ExploreTab() {
  return (
    <Screen>
      <Card>
        <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>Explore</ThemedText>
        <ThemedText>Use this tab for maps, recommendations, nearby content, or camera-driven flows.</ThemedText>
      </Card>
    </Screen>
  );
}
