import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  hydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  hydrate: () => Promise<void>;
};

const KEY = 'app-theme-mode';

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  hydrated: false,
  setMode: async (mode) => {
    await AsyncStorage.setItem(KEY, mode);
    set({ mode });
  },
  hydrate: async () => {
    const saved = await AsyncStorage.getItem(KEY);
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
      set({ mode: saved, hydrated: true });
      return;
    }
    set({ hydrated: true });
  },
}));
