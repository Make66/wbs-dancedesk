import type { CreateTargetInput, UpdateTargetInput } from "../types/course-types";

export const createTargetDB = async (data: CreateTargetInput) => {
  console.log("createTargetDB payload", data);
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/targets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Zielgruppe konnte nicht erstellt werden.");
  }

  return response.json();
};

export const updateTargetDB = async (id: string, data: UpdateTargetInput) => {
  console.log("updateTargetDB payload", id, data);
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/targets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update target: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
};
