import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type OnboardingData = {
  firstName: string;
  lastName: string;
  username: string;
  interests: string;
  allowLocation: boolean;
  enableNotifications: boolean;
};

type OnboardingState = {
  currentStep: number;
  completed: boolean;
  hydrated: boolean;
  data: OnboardingData;
  setHydrated: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  patchData: (values: Partial<OnboardingData>) => void;
  complete: () => void;
  reset: () => void;
};

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  username: '',
  interests: '',
  allowLocation: true,
  enableNotifications: true,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      completed: false,
      hydrated: false,
      data: initialData,
      setHydrated: (value) => set({ hydrated: value }),
      setCurrentStep: (step) => set({ currentStep: step }),
      patchData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
      complete: () => set({ completed: true }),
      reset: () => set({ currentStep: 0, completed: false, data: initialData }),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        currentStep: state.currentStep,
        completed: state.completed,
        data: state.data,
      }),
    }
  )
);
