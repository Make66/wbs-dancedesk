import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/features/auth/authApi';
import { fetchCustomerByTenant } from '@/features/auth/customerApi';
import { useTenantStore } from '@/store/tenant';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';

const schema = z.object({
  tenantId: z.string().min(1, 'Studio ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

function FormWrapper({ onSubmit, children }: { onSubmit: () => void; children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); onSubmit(); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
    >
      {children}
      {/* hidden submit button enables Enter-key submission */}
      <button type="submit" style={{ display: 'none' }} />
    </form>
  );
}

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const { customer, hydrated, setCustomer, clearCustomer } = useTenantStore();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenantId: '', email: '', password: '' },
  });

  useEffect(() => {
    if (hydrated && customer) {
      setValue('tenantId', customer.tenantId);
    }
  }, [hydrated, customer]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    let tenantId: string;

    if (!customer) {
      try {
        const tenantCustomer = await fetchCustomerByTenant(data.tenantId);
        setCustomer(tenantCustomer);
        tenantId = tenantCustomer.tenantId;
      } catch {
        setError('Studio not found. Please check your Studio ID.');
        return;
      }
    } else {
      tenantId = customer.tenantId;
    }

    try {
      await login(data.email, data.password, tenantId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.');
    }
  };

  const handleClearTenant = () => {
    clearCustomer();
    setValue('tenantId', '');
  };

  if (!hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>Anmelden</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
        Geben Sie Ihre E-Mail und Ihr Passwort ein, um fortzufahren.
      </ThemedText>

      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        {customer ? (
          <View
            style={[
              styles.tenantCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {customer.logoUrl ? (
              <Image
                source={{ uri: customer.logoUrl }}
                style={styles.tenantLogo}
                resizeMode="contain"
              />
            ) : null}
            <View style={styles.tenantInfo}>
              <ThemedText style={styles.tenantName}>{customer.name}</ThemedText>
              {customer.email ? (
                <ThemedText
                  style={[styles.tenantMeta, { color: colors.textMuted }]}
                >
                  {customer.email}
                </ThemedText>
              ) : null}
              {customer.website ? (
                <ThemedText
                  style={[styles.tenantMeta, { color: colors.textMuted }]}
                >
                  {customer.website}
                </ThemedText>
              ) : null}
            </View>
            <Pressable onPress={handleClearTenant} style={styles.changeButton}>
              <ThemedText
                style={[styles.changeButtonText, { color: colors.textMuted }]}
              >
                Nicht Deins?
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <Controller
              control={control}
              name="tenantId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: errors.tenantId
                        ? colors.danger
                        : colors.border,
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
          </>
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
          <ThemedText style={[styles.error, { color: colors.danger }]}>
            {error}
          </ThemedText>
        )}

        <Pressable
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Sign in</ThemedText>
          )}
        </Pressable>
      </FormWrapper>
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
  tenantCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  tenantLogo: { width: 160, height: 64, borderRadius: 8 },
  tenantInfo: { flex: 1 },
  tenantName: { fontWeight: '700', fontSize: 15 },
  tenantMeta: { fontSize: 13 },
  changeButton: { padding: 4 },
  changeButtonText: { fontSize: 13 },
});
