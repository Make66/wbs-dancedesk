import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { runOnJS } from 'react-native-worklets';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { usePost } from '@/hooks/usePosts';
import { useAppTheme } from '@/theme/ThemeProvider';
import { resourceUrl } from '@/config/env';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = usePost(id);
  const { colors } = useAppTheme();
  const router = useRouter();

  const [dismissing, setDismissing] = useState(false);
  const translateX = useSharedValue(0);

  // Called after our exit animation finishes — flips animation:'none' then
  // the effect below fires router.back() in the same commit cycle.
  const startDismiss = () => setDismissing(true);

  useEffect(() => {
    if (dismissing) router.back();
  }, [dismissing]);

  const animStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateX: translateX.value }],
  }));

  const swipe = Gesture.Pan()
    .activeOffsetX([10, 9999])
    .failOffsetY([-25, 25])
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX > SCREEN_WIDTH * 0.35 || e.velocityX > 800) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 220 }, () => {
          runOnJS(startDismiss)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  if (!data) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ animation: dismissing ? 'none' : undefined }} />
      <GestureDetector gesture={swipe}>
        <Animated.View style={animStyle}>
          <Screen>
            <Pressable onPress={() => router.back()} style={styles.back}>
              <Ionicons name="chevron-back" size={18} color={colors.primary} />
              <ThemedText style={[styles.backText, { color: colors.primary }]}>Zurück</ThemedText>
            </Pressable>
            <Card>
              {data.imageUrl ? (
                <Image source={{ uri: resourceUrl(data.imageUrl!) }} style={styles.image} />
              ) : null}
              <View style={{ gap: 10 }}>
                <ThemedText style={styles.title}>{data.title}</ThemedText>
                <ThemedText style={[styles.meta, { color: colors.textMuted }]}>
                  {data.author} · {new Date(data.date).toLocaleDateString('de-DE')}
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted }}>{data.teaser}</ThemedText>
                <ThemedText>{data.text}</ThemedText>
              </View>
            </Card>
          </Screen>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText: { fontSize: 15 },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { fontSize: 12 },
  image: {
    height: 220,
    marginTop: -16,
    marginHorizontal: -16,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
});
