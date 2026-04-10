import { toast } from "react-toastify";

type CreateEventInput = {
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

export const createEventDB = async (data: CreateEventInput) => {
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
