import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/user';
import { api } from '@/lib/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';

function isoToGerman(iso: string): string {
  const [y, m, d] = iso.split('T')[0].split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

function germanToIso(value: string): string {
  const [d, m, y] = value.split('.');
  if (!y || !m || !d) return value;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

const schema = z.object({
  firstName: z.string().min(1, 'Pflichtfeld'),
  lastName: z.string().min(1, 'Pflichtfeld'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ParticipantUpdateForm() {
  const { colors } = useAppTheme();
  const participant = useUserStore((state) => state.participant);
  const setParticipant = useUserStore((state) => state.setParticipant);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: participant?.firstName ?? '',
      lastName: participant?.lastName ?? '',
      phone: participant?.phone ?? '',
      birthDate: participant?.birthDate ? isoToGerman(participant.birthDate) : '',
      street: participant?.street ?? '',
      city: participant?.city ?? '',
      zipCode: participant?.zipCode ?? '',
    },
  });

  if (!participant) return null;

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(false);
    const response = await api.patch(`/participants/${participant.id}`, {
      ...data,
      birthDate: data.birthDate ? germanToIso(data.birthDate) : undefined,
    });
    setParticipant({ ...participant, ...response.data });
    setSuccess(true);
  };

  const inputStyle = (hasError: boolean) => [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: hasError ? colors.danger : colors.border,
      color: colors.text,
    },
  ];

  return (
    <View style={styles.container}>
      <Field label="Vorname" error={errors.firstName?.message}>
        <Controller control={control} name="firstName" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.firstName)} placeholder="Vorname" placeholderTextColor={colors.textMuted} onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="Nachname" error={errors.lastName?.message}>
        <Controller control={control} name="lastName" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.lastName)} placeholder="Nachname" placeholderTextColor={colors.textMuted} onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="Telefon" error={errors.phone?.message}>
        <Controller control={control} name="phone" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.phone)} placeholder="Telefon" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="Geburtsdatum" error={errors.birthDate?.message}>
        <Controller control={control} name="birthDate" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.birthDate)} placeholder="TT.MM.JJJJ" placeholderTextColor={colors.textMuted} onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="Straße" error={errors.street?.message}>
        <Controller control={control} name="street" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.street)} placeholder="Straße" placeholderTextColor={colors.textMuted} onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="Stadt" error={errors.city?.message}>
        <Controller control={control} name="city" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.city)} placeholder="Stadt" placeholderTextColor={colors.textMuted} onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      <Field label="PLZ" error={errors.zipCode?.message}>
        <Controller control={control} name="zipCode" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={inputStyle(!!errors.zipCode)} placeholder="PLZ" placeholderTextColor={colors.textMuted} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
      </Field>

      {error && <ThemedText style={[styles.feedback, { color: colors.danger }]}>{error}</ThemedText>}
      {success && <ThemedText style={[styles.feedback, { color: colors.success }]}>Gespeichert.</ThemedText>}

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Speichern</ThemedText>}
      </Pressable>
    </View>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.field}>
      <ThemedText style={[styles.label, { color: colors.textMuted }]}>{label}</ThemedText>
      {children}
      {error && <ThemedText style={[styles.fieldError, { color: colors.danger }]}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  field: { gap: 4 },
  label: { fontSize: 13 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  fieldError: { fontSize: 13 },
  feedback: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  button: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
