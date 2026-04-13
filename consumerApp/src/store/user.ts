import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Participant = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  imageUrl: string;
  street: string;
  city: string;
  zipCode: string;
  tenantId?: string;
};

type UserState = {
  participant: Participant | null;
  setParticipant: (participant: Participant) => void;
  clearParticipant: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      participant: null,
      setParticipant: (participant) => set({ participant }),
      clearParticipant: () => set({ participant: null }),
    }),
    { name: 'userStore' }
  )
);
