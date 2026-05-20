import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, useCodeScanner, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
import { login } from '@/features/auth/authApi';
import { fetchCustomerByTenant } from '@/features/auth/customerApi';
import { useTenantStore } from '@/store/tenant';
import { resourceUrl } from '@/config/env';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';

// ─── Schemas ────────────────────────────────────────────────────────────────

const tenantSchema = z.object({
  tenantId: z.string().min(1, 'Studio ID is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type TenantFormData = z.infer<typeof tenantSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

// ─── Web form wrapper ────────────────────────────────────────────────────────

function FormWrapper({ onSubmit, children }: { onSubmit: () => void; children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); onSubmit(); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
    >
      {children}
      <button type="submit" style={{ display: 'none' }} />
    </form>
  );
}

// ─── QR Scanner overlay ──────────────────────────────────────────────────────

function QrScannerModal({
  visible,
  onScanned,
  onClose,
}: {
  visible: boolean;
  onScanned: (tenantId: string) => void;
  onClose: () => void;
}) {
  const { colors } = useAppTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const scannedRef = useRef(false);

  // Reset guard each time the modal opens
  useEffect(() => {
    if (visible) scannedRef.current = false;
  }, [visible]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (scannedRef.current) return;
      const value = codes[0]?.value;
      if (value) {
        scannedRef.current = true;
        onScanned(value);
      }
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.scannerContainer}>
        {!hasPermission ? (
          <View style={[styles.permissionBox, { backgroundColor: colors.surface }]}>
            <ThemedText style={styles.permissionText}>
              Kamerazugriff wird für den QR-Scan benötigt.
            </ThemedText>
            <Pressable
              style={[styles.permissionButton, { backgroundColor: colors.primary }]}
              onPress={requestPermission}
            >
              <ThemedText style={styles.permissionButtonText}>Kamera freigeben</ThemedText>
            </Pressable>
          </View>
        ) : device ? (
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={visible}
            codeScanner={codeScanner}
          />
        ) : null}

        {/* Close button */}
        <Pressable
          style={[styles.scannerClose, { backgroundColor: colors.surface }]}
          onPress={onClose}
        >
          <ThemedText style={{ color: colors.text }}>Abbrechen</ThemedText>
        </Pressable>

        {/* Viewfinder hint */}
        {hasPermission && (
          <View style={styles.viewfinderWrapper} pointerEvents="none">
            <View style={[styles.viewfinder, { borderColor: colors.primary }]} />
            <ThemedText style={[styles.scanHint, { color: '#fff' }]}>
              QR-Code in den Rahmen halten
            </ThemedText>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const { customer, hydrated, setCustomer, clearCustomer } = useTenantStore();

  const [tenantError, setTenantError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(false);

  // Tenant-setup form (step 1)
  const {
    control: tenantControl,
    handleSubmit: handleTenantSubmit,
    setValue: setTenantValue,
    formState: { errors: tenantErrors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { tenantId: '' },
  });

  // Login form (step 2)
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Resolve a tenantId string → fetch TenantCustomer and persist it
  const resolveTenant = async (tenantId: string) => {
    setTenantError(null);
    setTenantLoading(true);
    try {
      const tenantCustomer = await fetchCustomerByTenant(tenantId);
      setCustomer(tenantCustomer);
    } catch {
      setTenantError('Studio nicht gefunden. Bitte Studio-ID prüfen.');
    } finally {
      setTenantLoading(false);
    }
  };

  const onTenantSubmit = async (data: TenantFormData) => {
    await resolveTenant(data.tenantId);
  };

  const onQrScanned = async (value: string) => {
    setScannerOpen(false);
    let tenantId = value;
    try {
      const url = new URL(value);
      tenantId = url.searchParams.get('tenantId') ?? value;
    } catch {
      // not a URL — use raw value as tenantId
    }
    setTenantValue('tenantId', tenantId);
    await resolveTenant(tenantId);
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    if (!customer) return;
    setLoginError(null);
    try {
      await login(data.email, data.password, customer.tenantId);
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Login fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

  const handleClearTenant = () => {
    clearCustomer();
  };

  // ── Loading (hydration) ────────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <View style={styles.bg}>
        <Image source={require('../../assets/login-bg.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="contain" />
        <View style={styles.container}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  // ── Step 1: Tenant setup ───────────────────────────────────────────────────
  if (!customer) {
    return (
      <View style={styles.bg}>
        <Image source={require('../../assets/login-bg.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="contain" />
        <View style={styles.container}>
          <ThemedText style={styles.title}>Studio finden</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
            Gib deine Studio-ID ein oder scanne den QR-Code deines Studios.
          </ThemedText>

          <FormWrapper onSubmit={handleTenantSubmit(onTenantSubmit)}>
            <Controller
              control={tenantControl}
              name="tenantId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: tenantErrors.tenantId ? colors.danger : colors.border,
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
            {tenantErrors.tenantId && (
              <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
                {tenantErrors.tenantId.message}
              </ThemedText>
            )}

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <ThemedText style={[styles.dividerLabel, { color: colors.textMuted }]}>oder</ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Pressable
              style={[styles.qrButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => setScannerOpen(true)}
            >
              <ThemedText style={[styles.qrButtonText, { color: colors.text }]}>
                QR-Code scannen
              </ThemedText>
            </Pressable>

            {tenantError && (
              <ThemedText style={[styles.error, { color: colors.danger }]}>
                {tenantError}
              </ThemedText>
            )}

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }, tenantLoading && styles.buttonDisabled]}
              onPress={handleTenantSubmit(onTenantSubmit)}
              disabled={tenantLoading}
            >
              {tenantLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Weiter</ThemedText>
              )}
            </Pressable>
          </FormWrapper>
        </View>

        <QrScannerModal
          visible={scannerOpen}
          onScanned={onQrScanned}
          onClose={() => setScannerOpen(false)}
        />
      </View>
    );
  }

  // ── Step 2: Login (customer already stored) ────────────────────────────────
  return (
    <View style={styles.bg}>
      <Image
        source={require("../../assets/login-bg.jpg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <ThemedText style={styles.title}>Anmelden</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
          Geben Sie Ihre E-Mail und Ihr Passwort ein, um fortzufahren.
        </ThemedText>
        <Pressable onPress={handleClearTenant} style={styles.changeButton}>
          <ThemedText
            style={[styles.changeButtonText, { color: colors.textMuted }]}
          >
            Nicht Deins?
          </ThemedText>
        </Pressable>

        <FormWrapper onSubmit={handleLoginSubmit(onLoginSubmit)}>
          {/* Tenant card */}
          <View
            style={[
              styles.tenantCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {customer.logoUrl ? (
              <Image
                source={{ uri: resourceUrl(customer.logoUrl) }}
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
             
            </View>
          </View>

          {/* Email */}
          <Controller
            control={loginControl}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: loginErrors.email
                      ? colors.danger
                      : colors.border,
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
          {loginErrors.email && (
            <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
              {loginErrors.email.message}
            </ThemedText>
          )}

          {/* Password */}
          <Controller
            control={loginControl}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: loginErrors.password
                      ? colors.danger
                      : colors.border,
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
          {loginErrors.password && (
            <ThemedText style={[styles.fieldError, { color: colors.danger }]}>
              {loginErrors.password.message}
            </ThemedText>
          )}

          {loginError && (
            <ThemedText style={[styles.error, { color: colors.danger }]}>
              {loginError}
            </ThemedText>
          )}

          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              isLoginSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleLoginSubmit(onLoginSubmit)}
            disabled={isLoginSubmitting}
          >
            {isLoginSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign in</ThemedText>
            )}
          </Pressable>
        </FormWrapper>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: 'rgba(0,0,0,0.45)' },
  title: { fontSize: 30, fontWeight: '700', color: '#CCC' },
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
  // Tenant-setup specific
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerLabel: { fontSize: 13 },
  qrButton: { padding: 16, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  qrButtonText: { fontSize: 16, fontWeight: '600' },
  // Scanner
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  scannerClose: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  viewfinderWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  viewfinder: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderRadius: 16,
  },
  scanHint: { fontSize: 14 },
  // Permission
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  permissionText: { fontSize: 16, textAlign: 'center' },
  permissionButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permissionButtonText: { color: '#fff', fontWeight: '600' },
});
