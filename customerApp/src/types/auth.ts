declare global {
  type User = {
    id: string;
    email: string;
    name: string;
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
