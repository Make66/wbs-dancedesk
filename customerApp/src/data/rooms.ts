import type { Room } from "../types/room-types";

type RoomInput = {
  name: string;
  description: string;
  capacity: number;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  imageFile?: File | null;
  imageUrl?: string;
};

export const getRooms = async (locationId: string): Promise<Room[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/locations/${locationId}/rooms`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Räume");
    }
    const rooms = await response.json();
    return rooms || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Fehler beim Laden der Räume");
  }
};

export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Räume konnten nicht geladen werden.");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Fehler beim Laden der Räume.");
  }
};

export const getRoomById = async (roomId: string): Promise<Room> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Raum konnte nicht geladen werden.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw new Error("Fehler beim Laden des Raums.");
  }
};

const buildRoomFormData = (roomData: RoomInput): FormData => {
  const formData = new FormData();
  formData.append("name", roomData.name);
  formData.append("description", roomData.description);
  formData.append("capacity", roomData.capacity.toString());
  formData.append("street", roomData.street);
  formData.append("city", roomData.city);
  formData.append("zipCode", roomData.zipCode);
  formData.append("longitude", roomData.longitude.toString());
  formData.append("latitude", roomData.latitude.toString());
  if (roomData.imageUrl) {
    formData.append("imageUrl", roomData.imageUrl);
  }
  if (roomData.imageFile) {
    formData.append("image", roomData.imageFile);
  }
  return formData;
};

export const updateRoom = async (roomId: string, roomData: RoomInput): Promise<Room> => {
  try {
    const formData = buildRoomFormData(roomData);
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms/${roomId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Raum konnte nicht aktualisiert werden.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const createRoom = async (roomData: RoomInput): Promise<Room> => {
  try {
    const formData = buildRoomFormData(roomData);
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Raum konnte nicht erstellt werden.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/rooms/${roomId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Raum konnte nicht gelöscht werden.");
    }
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};
