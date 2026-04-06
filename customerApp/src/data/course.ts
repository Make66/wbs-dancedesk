export interface UpdateCourseInput {
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: unknown;
}

export const updateCourseDB = async (id: string, data: UpdateCourseInput) => {
  console.log("updateCourseDB payload", id, data);
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update course: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
};

export const getCourseById = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.status}`);
  }

  return response.json();
};
