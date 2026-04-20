// See Documentation/5_avatar_upload.md for design decisions and upload flow.
import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';

type Props = {
  imageUrl: string;
  initials?: string;
  onChange: (localUri: string) => void;
};

export function AvatarPicker({ imageUrl, initials = '?', onChange }: Props) {
  const { colors } = useAppTheme();

  const isValidUrl = imageUrl.startsWith('http') || imageUrl.startsWith('file');

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Pressable onPress={pick} style={styles.wrapper}>
      {isValidUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder, { backgroundColor: colors.primaryMuted }]}>
          <ThemedText style={[styles.initials, { color: colors.primary }]}>{initials}</ThemedText>
        </View>
      )}
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.badgeIcon}>📷</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'center', marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 32, fontWeight: '700' },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: 14 },
});
