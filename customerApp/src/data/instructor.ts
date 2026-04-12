import { toast } from "react-toastify";
import type { Instructor } from "../types/instructor-types";

type CreateInstructorInput = {
  name: string;
  description: string;
  skills: string[];
  notes?: string;
  imageFile?: File | null;
  imageUrl?: string;
};

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

export const getInstructorById = async (instructorId: string): Promise<Instructor> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/instructors/${instructorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Instruktor konnte nicht geladen werden.");
    }
    const data = await response.json();

    return data || undefined;
  } catch (error) {
    console.error("Error fetching instructor:", error);
    throw new Error("Fehler beim Laden des Instruktors.");
  }
};

export const updateInstructor = async (
  instructorId: string,
  instructorData: CreateInstructorInput,
): Promise<Instructor> => {
  try {
    const formData = new FormData();

    formData.append("name", instructorData.name);
    formData.append("description", instructorData.description);

    instructorData.skills.forEach((skill) => {
      formData.append("skills", skill);
    });

    if (instructorData.imageUrl) {
      formData.append("imageUrl", instructorData.imageUrl);
    }

    if (instructorData.imageFile) {
      formData.append("image", instructorData.imageFile);
    }

    console.log("Submitting instructor data:", {
      name: instructorData.name,
      description: instructorData.description,
      skills: instructorData.skills,
      imageUrl: instructorData.imageUrl,
      hasImageFile: !!instructorData.imageFile,
      imageFile: instructorData.imageFile ? instructorData.imageFile : "No file",
    });

    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/instructors/${instructorId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Instruktor konnte nicht aktualisiert werden.");
    }

    const data = await response.json();
    toast.success("Instruktor erfolgreich aktualisiert!");
    return data;
  } catch (error) {
    console.error("Error updating instructor:", error);
    toast.error("Fehler beim Aktualisieren des Instruktors.");
    throw error;
  }
};
