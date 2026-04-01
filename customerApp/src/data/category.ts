import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/course-types";

export const createCategoryDB = async (data: CreateCategoryInput): Promise<Category> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kategorie konnte nicht erstellt werden.");
  }

  return response.json();
};

export const updateCategoryDB = async (
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kategorie konnte nicht aktualisiert werden.");
  }

  return await response.json();
};
