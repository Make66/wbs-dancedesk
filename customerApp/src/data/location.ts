type Location = {
  id: string;
  tenantId: string;
  name: string;
  color: string[];
  icon: string;
  setSeqTarget: string[];
};

export const updateLocationDB = async (locationId: string, data: Partial<Location>) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/locations/${locationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to update location: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return null;
  } catch (error) {
    console.error("Error updating location:", error);
    throw new Error("Fehler beim Aktualisieren des Standorts.");
  }
};
