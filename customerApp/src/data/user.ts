import type { UserItem } from "../types/user-types";

type UserInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  imageUrl?: string;
  tenantId?: string;
  isActive?: boolean;
};

const BASE = `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/users`;

export const getUsers = async (): Promise<UserItem[]> => {
  const response = await fetch(BASE, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Benutzer konnten nicht geladen werden.");
  return response.json();
};

export const getUserById = async (id: string): Promise<UserItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Benutzer konnte nicht geladen werden.");
  return response.json();
};

export const createUserDB = async (data: UserInput): Promise<UserItem> => {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Benutzer konnte nicht erstellt werden.");
  return response.json();
};

export const updateUserDB = async (id: string, data: UserInput): Promise<UserItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Benutzer konnte nicht aktualisiert werden.");
  return response.json();
};

export const deleteUserDB = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Benutzer konnte nicht gelöscht werden.");
};
