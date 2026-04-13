import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { TextInput, View, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
}: Props<T>) {
  const { colors } = useAppTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <TextInput
            value={value ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: error ? colors.danger : colors.border,
                minHeight: multiline ? 110 : 52,
                textAlignVertical: multiline ? 'top' : 'center',
              },
            ]}
          />
          {error?.message ? <Text style={[styles.error, { color: colors.danger }]}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  error: { fontSize: 13 },
});
