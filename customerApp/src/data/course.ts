import { toast } from "react-toastify";
import type { Course, CreateCourseInput } from "../types/course-types";

export const getCoursesDB = async (): Promise<Course[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export interface UpdateCourseInput {
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: unknown;
}

export const updateCourseDB = async (id: string, data: UpdateCourseInput) => {
  console.log("updateCourseDB id, payload", id, data);
  console.log("updateCourseDB payload", JSON.stringify(data));
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses/${id}`, {
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
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses`, {
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

export const getCourseByIdDB = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.status}`);
  }

  return response.json();
};

export const getCoursesByWeekDB = async (
  year: number,
  week: number,
  filters?: { locationId?: string; targetId?: string },
) => {
  const params = new URLSearchParams();
  if (filters?.locationId) params.set("locationId", filters.locationId);
  if (filters?.targetId) params.set("targetId", filters.targetId);

  const query = params.size > 0 ? `?${params.toString()}` : "";

  const response = await fetch(
    `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses/week/${year}/${week}${query}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  return response.json();
};

export const getCourseDatesDB = async (courseId: string): Promise<string[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses/${courseId}/dates`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch course dates: ${response.status}`);
  }

  return response.json();
};

export const getCoursesByInstructorIdDB = async (instructorId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/instructors/${instructorId}/courses`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to fetch courses by instructor: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching courses by instructor:", error);
    throw error;
  }
};
