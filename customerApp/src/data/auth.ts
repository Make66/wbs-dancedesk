import { authServiceURL } from "../lib/fetchInterceptor";

type LoginInput = { email: string; password: string };

type SuccessRes = { message: string };

const login = async (formData: LoginInput): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

  const data = (await res.json()) as SuccessRes;
  console.log("LOGIN:", data, "Cookies:", document.cookie);

  return data;
};

const me = async (): Promise<User> => {
  const res = await fetch(`${authServiceURL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

  const user = (await res.json()) as User;
  // console.log("ME:", user);

  return user;
};

const logout = async (): Promise<void> => {
  const res = await fetch(`${authServiceURL}/auth/logout`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
  console.log("LOGOUT: Success, Cookies cleared");
};

const register = async (formData: RegisterFormState): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

  const data = (await res.json()) as SuccessRes;
  console.log("REGISTER:", data, "Cookies:", document.cookie);

  return data;
};

export { login, me, logout, register };
