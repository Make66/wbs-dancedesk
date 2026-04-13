import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/features/auth/authApi';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';

const schema = z.object({
  tenantId: z.string().min(1, 'Studio ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { tenantId: '', email: '', password: '' } });

  const onSubmit = async (data: FormData) => {
    setError(null);
    console.log('[1] LOGIN SCREEN: form submitted, calling login()');
    try {
      await login(data.email, data.password, data.tenantId);
      console.log('[5] LOGIN SCREEN: login() resolved — all stores hydrated, router will redirect');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>Sign in</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
        Enter your email and password to continue.
      </ThemedText>

      <Controller
        control={control}
        name="tenantId"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: errors.tenantId ? colors.danger : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Studio ID"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.tenantId && (
        <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
          {errors.tenantId.message}
        </ThemedText>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: errors.email ? colors.danger : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && (
        <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
          {errors.email.message}
        </ThemedText>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: errors.password ? colors.danger : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoComplete="password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && (
        <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
          {errors.password.message}
        </ThemedText>
      )}

      {error && (
        <ThemedText style={[styles.error, { color: colors.danger }]}>{error}</ThemedText>
      )}

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Sign in</ThemedText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 30, fontWeight: '700' },
  subtitle: { fontSize: 16, marginBottom: 12 },
  input: { padding: 16, borderRadius: 14, borderWidth: 1, fontSize: 16 },
  fieldError: { fontSize: 13, marginTop: -6 },
  error: { fontSize: 14, textAlign: 'center' },
  button: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
