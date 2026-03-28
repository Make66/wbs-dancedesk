type UpdateCourseTargetInput = {
  name?: string;
  color?: string[];
  seq?: number;
  active?: boolean;
  isDeleted?: boolean;
};

export const updateCourseTargetDB = async (id: string, data: UpdateCourseTargetInput) => {
  console.log("updateCourseTargetDB payload:", data);
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
