import { useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { api } from '@/lib/api';
import type { OnboardingData } from '@/store/onboarding';

export type OnboardingProfilePayload = OnboardingData & {
  onboardingCompletedAt: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
};

export async function submitOnboardingProfile(payload: Omit<OnboardingProfilePayload, 'firebaseUid' | 'email' | 'displayName'>) {
  const user = auth().currentUser;

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  const body: OnboardingProfilePayload = {
    ...payload,
    firebaseUid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };

  const { data } = await api.post('/profiles/onboarding', body);
  return data;
}

export function useSubmitOnboardingProfile() {
  return useMutation({
    mutationKey: ['submit-onboarding-profile'],
    mutationFn: submitOnboardingProfile,
  });
}
