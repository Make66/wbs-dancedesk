type UpdateCourseTargetInput = {
  name?: string;
  color?: string[];
  seq?: number;
  active?: boolean;
  isDeleted?: boolean;
};

export const updateCourseTargetDB = async (id: string, data: UpdateCourseTargetInput) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update course target: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
};

export const createCourseTargetDB = async (data: {
  name: string;
  color: string[];
  active?: boolean;
  seq?: number;
  icon?: string;
  locationId?: string;
}) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Kursziel konnte nicht erstellt werden.");
  }

  return response.json();
};
