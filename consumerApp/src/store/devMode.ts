import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DevModeState = {
  isDev: boolean;
  setIsDev: (v: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  dismissToast: () => void;
};

export const useDevModeStore = create<DevModeState>()(
  persist(
    (set) => ({
      isDev: false,
      setIsDev: (isDev) => set({ isDev }),
      toastMessage: null,
      showToast: (msg) => set({ toastMessage: msg }),
      dismissToast: () => set({ toastMessage: null }),
    }),
    {
      name: 'dev-mode',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDev: state.isDev }),
    }
  )
);

export function showDevToast(msg: string) {
  const { isDev, showToast } = useDevModeStore.getState();
  if (isDev) showToast(msg);
}
