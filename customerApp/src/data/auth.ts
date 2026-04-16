import { authServiceURL } from "../lib/fetchInterceptor";

type LoginInput = { email: string; password: string };

type SuccessRes = { message: string };

const login = async (formData: LoginInput): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

  const data = (await res.json()) as SuccessRes;
  return data;
};

const me = async (): Promise<User> => {
  const res = await fetch(`${authServiceURL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
  const raw = await res.json();
  const { user } = raw as { user: User };

  return user;
};

const logout = async (): Promise<void> => {
  const res = await fetch(`${authServiceURL}/api/auth/logout`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
};

const register = async (formData: RegisterFormState): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

  const data = (await res.json()) as SuccessRes;

  return data;
};

const keepSessionAlive = (): (() => void) => {
  const tokenTTL = parseInt(import.meta.env.VITE_ACCESS_TOKEN_TTL, 10) || 900;
  const intervalMs = tokenTTL * 0.8 * 1000;

  const id = setInterval(async () => {
    try {
      const res = await fetch(`${authServiceURL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) clearInterval(id);
    } catch {
      clearInterval(id);
    }
  }, intervalMs);

  return () => clearInterval(id);
};

export { login, me, logout, register, keepSessionAlive };
