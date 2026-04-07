import { toast } from "react-toastify";

export interface UpdateCourseInput {
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: unknown;
}

export const updateCourseDB = async (id: string, data: UpdateCourseInput) => {
  console.log("updateCourseDB id, payload", id, data);
  console.log("updateCourseDB payload", JSON.stringify(data));
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update course: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }
    toast.success("Kurs erfolgreich aktualisiert.");
  } catch (error) {
    console.error("Error updating course:", error);
    toast.error(`Fehler beim Aktualisieren des Kurses. Bitte versuche es erneut.`);
  }
  return null;
};

export const getCourseById = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.status}`);
  }

  return response.json();
};
