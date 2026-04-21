import { toast } from "react-toastify";

export type Event = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  isDeleted: boolean;
};

export const getEventsDB = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/events`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

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
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/events`, {
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
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/events/${eventId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

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
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/events/${eventId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

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
