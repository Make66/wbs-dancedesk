import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

export function CameraPreview() {
  const [permission, requestPermission] = useCameraPermissions();
  const { colors } = useAppTheme();

  if (!permission?.granted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={{ color: colors.text }}>Camera access is required.</Text>
        <Pressable onPress={requestPermission} style={[styles.button, { backgroundColor: colors.primaryMuted }]}>
          <Text style={{ color: colors.primary }}>Grant camera permission</Text>
        </Pressable>
      </View>
    );
  }

  return <CameraView style={styles.camera} facing="back" />;
}

const styles = StyleSheet.create({
  camera: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden' },
  center: { gap: 12, padding: 16, borderWidth: 1, borderRadius: 16 },
  button: { padding: 12, borderRadius: 12 },
});
