import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { darkColors, lightColors } from '@/theme/colors';
import { useThemeStore } from '@/store/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  colors: typeof lightColors;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() ?? 'light';
  const { mode, setMode, hydrate, hydrated } = useThemeStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const resolvedMode = mode === 'system' ? system : mode;
  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
  }, [colors.background]);

  const value = useMemo(() => ({ mode, resolvedMode, colors, setMode }), [mode, resolvedMode, colors, setMode]);

  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be used within ThemeProvider');
  return value;
}
