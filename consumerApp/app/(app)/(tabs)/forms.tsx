import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { FormField } from '@/components/FormField';
import { FormSection } from '@/components/FormSection';
import { useAppTheme } from '@/theme/ThemeProvider';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(8, 'Phone number is too short.'),
  bio: z.string().min(10, 'Bio should be at least 10 characters.'),
  marketingOptIn: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function FormsTab() {
  const { colors } = useAppTheme();
  const [submitted, setSubmitted] = useState<ProfileFormValues | null>(null);

  const defaultValues = useMemo<ProfileFormValues>(() => ({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    marketingOptIn: true,
  }), []);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitted(values);
    Alert.alert('Profile saved', 'The example form validated successfully.');
  };

  return (
    <Screen>
      <Card>
        <ThemedText style={styles.title}>Forms</ThemedText>
        <ThemedText style={{ color: colors.textMuted }}>
          This sample screen uses React Hook Form with Zod validation and reusable field components.
        </ThemedText>
      </Card>

      <Card>
        <FormSection title="Profile details">
          <FormField control={control} name="fullName" label="Full name" placeholder="Jane Doe" />
          <FormField control={control} name="email" label="Email" placeholder="jane@company.com" keyboardType="email-address" />
          <FormField control={control} name="phone" label="Phone" placeholder="+49 151 123456" keyboardType="phone-pad" />
          <FormField control={control} name="bio" label="Bio" placeholder="Tell people a bit about yourself" multiline />

          <Controller
            control={control}
            name="marketingOptIn"
            render={({ field: { value, onChange } }) => (
              <View style={[styles.switchRow, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                <View style={{ flex: 1, gap: 4 }}>
                  <ThemedText style={styles.switchTitle}>Marketing opt-in</ThemedText>
                  <ThemedText style={{ color: colors.textMuted }}>Receive product updates and campaigns.</ThemedText>
                </View>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />
        </FormSection>

        <View style={styles.actions}>
          <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Save profile</ThemedText>
          </Pressable>
          <Pressable onPress={() => reset(defaultValues)} style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
            <ThemedText>Reset</ThemedText>
          </Pressable>
        </View>
      </Card>

      {submitted ? (
        <Card>
          <ThemedText style={styles.sectionTitle}>Submitted values</ThemedText>
          <ThemedText>Full name: {submitted.fullName}</ThemedText>
          <ThemedText>Email: {submitted.email}</ThemedText>
          <ThemedText>Phone: {submitted.phone}</ThemedText>
          <ThemedText>Bio: {submitted.bio}</ThemedText>
          <ThemedText>Marketing opt-in: {submitted.marketingOptIn ? 'Yes' : 'No'}</ThemedText>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  switchRow: { flexDirection: 'row', gap: 16, alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 14 },
  switchTitle: { fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  primaryButton: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14 },
  secondaryButton: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
});
