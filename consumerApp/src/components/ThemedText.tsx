import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

export function ThemedText({ children, style, ...props }: PropsWithChildren<TextProps>) {
  const { colors } = useAppTheme();
  return <Text {...props} style={[{ color: colors.text }, style]}>{children}</Text>;
}
