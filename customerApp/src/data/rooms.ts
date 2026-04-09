import type { Room } from "../types/room-types";

export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    console.log("Fetch rooms response:", response);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Räume");
    }
    const rooms = await response.json();
    console.log("ROOMS DB", rooms);

    return rooms || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Fehler beim Laden der Räume");
  }
};
