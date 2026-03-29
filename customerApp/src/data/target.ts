type UpdateCourseTargetInput = {
  name?: string;
  color?: string[];
  seq?: number;
  active?: boolean;
  isDeleted?: boolean;
};

type CreateCourseTargetPayload = {
  name: string;
  color: string[];
  active?: boolean;
  seq?: number;
  locationId: string;
  icon?: string;
};

export const createTargetDB = async (data: CreateCourseTargetPayload) => {
  console.log("createTargetDB payload", data.locationId);

  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Zielgruppe konnte nicht erstellt werden.");
  }

  return response.json();
};

export const updateTargetDB = async (id: string, data: UpdateCourseTargetInput) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update target: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
};
