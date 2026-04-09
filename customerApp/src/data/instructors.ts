import type { Instructor } from "../types/instructor-types";

export const getInstructors = async (): Promise<Instructor[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/instructors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Zielgruppe konnte nicht geladen werden.");
    }
    const data = await response.json();

    return data || [];
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw new Error("Fehler beim Laden der Tanzlehrer.");
  }
};
