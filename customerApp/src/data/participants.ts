import type { Participant } from "../types/participants-type";

export const getParticipantsByCourseId = async (courseId: string): Promise<Participant[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${courseId}/participants`,
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
