declare global {
  type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    modules: { id: string; name: string; color: string; seq: number; active: boolean }[];
  };

  type LoginData = { email: string; password: string };

  type RegisterFormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  type AuthContextType = {
    signedIn: boolean;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: (formState: RegisterFormState) => Promise<void>;
  };
}
