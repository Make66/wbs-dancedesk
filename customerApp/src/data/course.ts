import { toast } from "react-toastify";
import type { CreateCourseInput } from "../types/course-types";

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
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to update course: ${response.status} - ${errorText}`);
    }
    toast.success("Kurs erfolgreich aktualisiert.");
    return response;
  } catch (error) {
    console.error("Error updating course:", error);
    toast.error(`Fehler beim Aktualisieren des Kurses. Bitte versuche es erneut.`);
    throw error;
  }
};

export const createCourseDB = async (data: CreateCourseInput) => {
  console.log("createCourseDB payload", data);
  console.log("createCourseDB payload", JSON.stringify(data));
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to create course: ${response.status} - ${errorText}`);
    }
    toast.success("Kurs erfolgreich erstellt.");
    return response;
  } catch (error) {
    console.error("Error creating course:", error);
    toast.error(`Fehler beim Erstellen des Kurses. Bitte versuche es erneut.`);
    throw error;
  }
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
