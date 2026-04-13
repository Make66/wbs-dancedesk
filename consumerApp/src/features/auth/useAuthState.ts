import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import { validateSession } from './authApi';

export function useAuthState() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const participant = useUserStore((state) => state.participant);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!hydrated || validated) return;
    if (!user) { setValidated(true); return; }
    setValidating(true);
    validateSession().finally(() => {
      setValidating(false);
      setValidated(true);
    });
  }, [hydrated]);

  return {
    user,
    participant,
    initializing: !hydrated || validating,
  };
}

export { logout as signOut } from './authApi';
