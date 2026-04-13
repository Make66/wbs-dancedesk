import { useMemo } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Switch, View } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  interpolate,
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { FormField } from '@/components/FormField';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useOnboardingStore } from '@/store/onboarding';
import { OnboardingIllustration } from '@/components/OnboardingIllustration';
import { useSubmitOnboardingProfile } from '@/features/onboarding/api';

const stepOneSchema = z.object({
  firstName: z.string().min(2, 'Enter your first name.'),
  lastName: z.string().min(2, 'Enter your last name.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
});

const stepTwoSchema = z.object({
  interests: z.string().min(10, 'Add a few interests so the feed can be tailored.'),
});

const stepThreeSchema = z.object({
  allowLocation: z.boolean(),
  enableNotifications: z.boolean(),
});

type StepOneValues = z.infer<typeof stepOneSchema>;
type StepTwoValues = z.infer<typeof stepTwoSchema>;
type StepThreeValues = z.infer<typeof stepThreeSchema>;

const TOTAL_STEPS = 3;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SWIPE_DISTANCE = Dimensions.get('window').width * 0.18;

function AnimatedProgress({ currentStep }: { currentStep: number }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <Animated.View
          key={index}
          layout={Layout.springify()}
          style={[
            styles.progressDot,
            {
              backgroundColor: index <= currentStep ? colors.primary : colors.surfaceAlt,
              borderColor: colors.border,
              flex: index === currentStep ? 1.4 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

function StepButton({ label, onPress, primary = false, disabled = false }: { label: string; onPress: () => void; primary?: boolean; disabled?: boolean }) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: disabled ? 0.55 : 1 }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => { if (!disabled) scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      style={[
        animatedStyle,
        primary ? [styles.primaryButton, { backgroundColor: colors.primary }] : [styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }],
      ]}
    >
      <ThemedText style={primary ? styles.primaryText : undefined}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { currentStep, setCurrentStep, data, patchData, complete } = useOnboardingStore();
  const submitProfile = useSubmitOnboardingProfile();
  const translateX = useSharedValue(0);

  const stepOneDefaults = useMemo<StepOneValues>(() => ({ firstName: data.firstName, lastName: data.lastName, username: data.username }), [data.firstName, data.lastName, data.username]);
  const stepTwoDefaults = useMemo<StepTwoValues>(() => ({ interests: data.interests }), [data.interests]);
  const stepThreeDefaults = useMemo<StepThreeValues>(() => ({ allowLocation: data.allowLocation, enableNotifications: data.enableNotifications }), [data.allowLocation, data.enableNotifications]);

  const stepOneForm = useForm<StepOneValues>({ resolver: zodResolver(stepOneSchema), defaultValues: stepOneDefaults });
  const stepTwoForm = useForm<StepTwoValues>({ resolver: zodResolver(stepTwoSchema), defaultValues: stepTwoDefaults });
  const stepThreeForm = useForm<StepThreeValues>({ resolver: zodResolver(stepThreeSchema), defaultValues: stepThreeDefaults });

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const nextFromStepOne = stepOneForm.handleSubmit((values) => { patchData(values); goNext(); });
  const nextFromStepTwo = stepTwoForm.handleSubmit((values) => { patchData(values); goNext(); });
  const finish = stepThreeForm.handleSubmit(async (values) => {
    const finalPayload = {
      ...data,
      ...values,
      onboardingCompletedAt: new Date().toISOString(),
    };

    try {
      await submitProfile.mutateAsync(finalPayload);
      patchData(values);
      complete();
      Alert.alert('Onboarding complete', 'Your onboarding profile was saved with authenticated user metadata.');
      router.replace('/(app)/(tabs)');
    } catch (error) {
      Alert.alert('Could not save profile', error instanceof Error ? error.message : 'Please try again.');
    }
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldGoNext = event.translationX < -SWIPE_DISTANCE && currentStep < TOTAL_STEPS - 1;
      const shouldGoBack = event.translationX > SWIPE_DISTANCE && currentStep > 0;
      translateX.value = withSpring(0);
      if (shouldGoNext) runOnJS(goNext)();
      if (shouldGoBack) runOnJS(goBack)();
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(Math.abs(translateX.value), [0, 140], [1, 0.86]),
  }));

  const meta = [
    { title: 'Create your profile', text: 'Set up identity details so the app can personalize your experience.', variant: 'profile' as const },
    { title: 'Choose your interests', text: 'Tell us what matters to you so the feed feels relevant from day one.', variant: 'interests' as const },
    { title: 'Turn on helpful features', text: 'Location and notifications make recommendations and reminders more useful.', variant: 'permissions' as const },
  ][currentStep];

  const onSkip = () => {
    setCurrentStep(TOTAL_STEPS - 1);
    translateX.value = withTiming(0);
  };

  return (
    <Screen>
      <Animated.View entering={FadeInUp.duration(500)}>
        <Card>
          <View style={styles.heroHeader}>
            <View style={{ flex: 1, gap: 6 }}>
              <ThemedText style={styles.eyebrow}>Getting started</ThemedText>
              <ThemedText style={styles.title}>{meta.title}</ThemedText>
              <ThemedText style={{ color: colors.textMuted }}>{meta.text}</ThemedText>
            </View>
            {currentStep < TOTAL_STEPS - 1 ? (
              <Pressable onPress={onSkip}>
                <ThemedText style={{ color: colors.primary, fontWeight: '700' }}>Skip</ThemedText>
              </Pressable>
            ) : null}
          </View>
          <AnimatedProgress currentStep={currentStep} />
          <OnboardingIllustration variant={meta.variant} />
        </Card>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={cardAnimatedStyle}>
          {currentStep === 0 ? (
            <Animated.View entering={FadeInUp.duration(320)}>
              <Card>
                <ThemedText style={styles.stepTitle}>Step 1 · Profile</ThemedText>
                <ThemedText style={[styles.swipeHint, { color: colors.textMuted }]}>Swipe left to move ahead after saving, or use the button below.</ThemedText>
                <FormField control={stepOneForm.control} name="firstName" label="First name" placeholder="Jane" />
                <FormField control={stepOneForm.control} name="lastName" label="Last name" placeholder="Doe" />
                <FormField control={stepOneForm.control} name="username" label="Username" placeholder="janedoe" />
                <View style={styles.actions}>
                  <StepButton label="Continue" onPress={nextFromStepOne} primary />
                </View>
              </Card>
            </Animated.View>
          ) : null}

          {currentStep === 1 ? (
            <Animated.View entering={FadeInUp.duration(320)}>
              <Card>
                <ThemedText style={styles.stepTitle}>Step 2 · Personalize</ThemedText>
                <ThemedText style={[styles.swipeHint, { color: colors.textMuted }]}>Swipe right to review the last step, or left to continue.</ThemedText>
                <FormField control={stepTwoForm.control} name="interests" label="Interests" placeholder="Fitness, travel, food, music" multiline />
                <View style={styles.actions}>
                  <StepButton label="Back" onPress={goBack} />
                  <StepButton label="Continue" onPress={nextFromStepTwo} primary />
                </View>
              </Card>
            </Animated.View>
          ) : null}

          {currentStep === 2 ? (
            <Animated.View entering={FadeInUp.duration(320)}>
              <Card>
                <ThemedText style={styles.stepTitle}>Step 3 · Permissions</ThemedText>
                <ThemedText style={[styles.swipeHint, { color: colors.textMuted }]}>Swipe right to revisit the previous step, then finish when ready.</ThemedText>
                <Controller
                  control={stepThreeForm.control}
                  name="allowLocation"
                  render={({ field: { value, onChange } }) => (
                    <Animated.View layout={Layout.springify()} style={[styles.switchRow, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <ThemedText style={styles.switchTitle}>Allow location</ThemedText>
                        <ThemedText style={{ color: colors.textMuted }}>Used for nearby and local recommendations.</ThemedText>
                      </View>
                      <Switch value={value} onValueChange={onChange} />
                    </Animated.View>
                  )}
                />
                <Controller
                  control={stepThreeForm.control}
                  name="enableNotifications"
                  render={({ field: { value, onChange } }) => (
                    <Animated.View layout={Layout.springify()} style={[styles.switchRow, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <ThemedText style={styles.switchTitle}>Enable notifications</ThemedText>
                        <ThemedText style={{ color: colors.textMuted }}>Used for updates, reminders, and new content alerts.</ThemedText>
                      </View>
                      <Switch value={value} onValueChange={onChange} />
                    </Animated.View>
                  )}
                />
                {submitProfile.isError ? <ThemedText style={{ color: colors.danger }}>Saving failed. Check auth, headers, endpoint, and try again.</ThemedText> : null}
                <View style={styles.actions}>
                  <StepButton label="Back" onPress={goBack} disabled={submitProfile.isPending} />
                  <StepButton label={submitProfile.isPending ? 'Saving...' : 'Finish'} onPress={finish} primary disabled={submitProfile.isPending} />
                </View>
              </Card>
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  eyebrow: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800' },
  stepTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  swipeHint: { fontSize: 13, marginBottom: 4 },
  progressRow: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 4 },
  progressDot: { height: 8, borderRadius: 999, borderWidth: 1 },
  switchRow: { flexDirection: 'row', gap: 16, alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 8 },
  switchTitle: { fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 10 },
  primaryButton: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14 },
  secondaryButton: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  primaryText: { color: '#fff', fontWeight: '700' },
});
