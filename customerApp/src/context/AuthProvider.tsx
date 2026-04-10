import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from ".";
import { login, me, logout, register, keepSessionAlive } from "../data/auth";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkSession, setCheckSession] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await me();

        setUser(data);
        setSignedIn(true);
      } catch (error) {
        if (!(error instanceof Error && error.message.startsWith("401"))) {
          console.error(error);
        }
      } finally {
        setCheckSession(false);
      }
    };

    if (checkSession) getUser();
  }, [checkSession]);

  const handleSignIn = async ({ email, password }: LoginData) => {
    await login({ email, password });
    setSignedIn(true);
    setCheckSession(true);
  };

  const handleRegister = async (formState: RegisterFormState) => {
    await register(formState);
    setSignedIn(true);
    setCheckSession(true);
  };

  useEffect(() => {
    if (!signedIn) return;
    return keepSessionAlive();
  }, [signedIn]);

  const handleSignOut = async () => {
    await logout();
    setSignedIn(false);
    setUser(null);
  };

  const value: AuthContextType = {
    signedIn,
    user,
    handleSignIn,
    handleSignOut,
    handleRegister,
  };
  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
