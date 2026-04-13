import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

type Props = {
  title: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export function ScreenHeader({ title, action }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
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
  title: { fontSize: 17, fontWeight: '700', flex: 1 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 12 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
});
