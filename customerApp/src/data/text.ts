import type { TextItem } from "../types/text-types";

type TextInput = {
  name?: string;
  description?: string;
  type?: number;
  text?: string;
};

export const getTexts = async (): Promise<TextItem[]> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/texts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Texte konnten nicht geladen werden.");
  return response.json();
};

export const getTextById = async (id: string): Promise<TextItem> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/texts/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Text konnte nicht geladen werden.");
  return response.json();
};

export const createTextDB = async (data: TextInput): Promise<TextItem> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/texts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Text konnte nicht erstellt werden.");
  return response.json();
};

export const updateTextDB = async (id: string, data: TextInput): Promise<TextItem> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/texts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Text konnte nicht aktualisiert werden.");
  return response.json();
};

export const deleteTextDB = async (id: string): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/texts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Text konnte nicht gelöscht werden.");
};
