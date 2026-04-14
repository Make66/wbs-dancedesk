import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { OnboardingData } from '@/store/onboarding';

export type OnboardingProfilePayload = OnboardingData & {
  onboardingCompletedAt: string;
  email: string | null;
  displayName: string | null;
};

export async function submitOnboardingProfile(payload: OnboardingProfilePayload) {
  const { data } = await api.post('/profiles/onboarding', payload);
  return data;
}

export function useSubmitOnboardingProfile() {
  return useMutation({
    mutationKey: ['submit-onboarding-profile'],
    mutationFn: submitOnboardingProfile,
  });
}
