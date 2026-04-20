import type { Participant } from "../types/participants-type";
import type { Course } from "../types/course-types";

export const getParticipantById = async (participantId: string): Promise<Participant> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/participants/${participantId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Teilnehmer konnte nicht geladen werden.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching participant:", error);
    throw new Error("Fehler beim Laden des Teilnehmers.");
  }
};

export const getCoursesByParticipantId = async (participantId: string): Promise<Course[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/participants/${participantId}/courses`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Kurse konnten nicht geladen werden.");
    return (await response.json()) || [];
  } catch (error) {
    console.error("Error fetching courses for participant:", error);
    throw new Error("Fehler beim Laden der Kurse.");
  }
};

export const updateParticipantDB = async (
  participantId: string,
  data: Partial<Participant> | FormData,
): Promise<Participant> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/participants/${participantId}`,
      {
        method: "PATCH",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        credentials: "include",
        body: isFormData ? data : JSON.stringify(data),
      },
    );
    if (!response.ok) throw new Error("Teilnehmer konnte nicht aktualisiert werden.");
    return await response.json();
  } catch (error) {
    console.error("Error updating participant:", error);
    throw error;
  }
};

export const getParticipantsByCourseId = async (courseId: string): Promise<Participant[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/courses/${courseId}/participants`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    console.log("Fetch participants response:", response);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Teilnehmer");
    }
    const participants = await response.json();
    console.log("PARTICIPANTS DB", participants);

    return participants || [];
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw new Error("Fehler beim Laden der Teilnehmer");
  }
};
