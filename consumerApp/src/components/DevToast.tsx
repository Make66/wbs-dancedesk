import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useDevModeStore } from '@/store/devMode';

export function DevToast() {
  const { toastMessage, dismissToast } = useDevModeStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return;
    setMessage(toastMessage);
    opacity.setValue(0);

    const anim = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(5000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => {
      if (finished) dismissToast();
    });
    return () => anim.stop();
  }, [toastMessage]);

  if (!message && !toastMessage) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.badge}>DEV</Text>
        <Text style={styles.message} numberOfLines={8}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  toast: {
    backgroundColor: '#1A1A2E',
    borderLeftWidth: 4,
    borderLeftColor: '#D92D20',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  badge: {
    color: '#D92D20',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  message: {
    color: '#F9FAFB',
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
