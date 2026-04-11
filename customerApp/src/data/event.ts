import { toast } from "react-toastify";

type EventPayload = {
  title?: string;
  description?: string;
  imageUrl?: string;
  color?: string[];
  type?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
  startsAt: string;
  endsAt: string;
  roomId?: string;
};

export const createEventDB = async (data: EventPayload) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to create event: ${response.status} - ${errorText}`);
    }
    toast.success("Event erfolgreich erstellt.");
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error(`Fehler beim Erstellen des Events. Bitte versuche es erneut.`);
    throw error;
  }
};

export const updateEventDB = async (eventId: string, data: EventPayload) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to update event: ${response.status} - ${errorText}`);
    }

    toast.success("Event erfolgreich aktualisiert.");
    return response;
  } catch (error) {
    console.error("Error updating event:", error);
    toast.error("Fehler beim Aktualisieren des Events. Bitte versuche es erneut.");
    throw error;
  }
};

export const deleteEventDB = async (eventId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/events/${eventId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to delete event: ${response.status} - ${errorText}`);
    }

    toast.success("Event erfolgreich gelöscht.");
    return response;
  } catch (error) {
    console.error("Error deleting event:", error);
    toast.error("Fehler beim Löschen des Events. Bitte versuche es erneut.");
    throw error;
  }
};
