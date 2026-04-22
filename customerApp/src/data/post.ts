import type { Post } from "../types/post-types";

type PostInput = {
  title?: string;
  teaser?: string;
  text?: string;
  author?: string;
  date?: string;
  startsAt?: string;
  endsAt?: string;
  courseId?: string | null;
  eventId?: string | null;
  isActive?: boolean;
  isArchived?: boolean;
  isTopPost?: boolean;
  imageUrl?: string;
  imageFile?: File | null;
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Beiträge konnten nicht geladen werden.");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Fehler beim Laden der Beiträge.");
  }
};

export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/posts/${postId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Beitrag konnte nicht geladen werden.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Fehler beim Laden des Beitrags.");
  }
};

const buildFormData = (data: PostInput): FormData => {
  const formData = new FormData();

  if (data.title !== undefined) formData.append("title", data.title);
  if (data.teaser !== undefined) formData.append("teaser", data.teaser);
  if (data.text !== undefined) formData.append("text", data.text);
  if (data.author !== undefined) formData.append("author", data.author);
  if (data.date) formData.append("date", data.date);
  if (data.startsAt) formData.append("startsAt", data.startsAt);
  if (data.endsAt) formData.append("endsAt", data.endsAt);
  if (data.courseId) formData.append("courseId", data.courseId);
  if (data.eventId) formData.append("eventId", data.eventId);
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
  if (data.isArchived !== undefined) formData.append("isArchived", String(data.isArchived));
  if (data.isTopPost !== undefined) formData.append("isTopPost", String(data.isTopPost));
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.imageFile) formData.append("image", data.imageFile);

  return formData;
};

export const createPostDB = async (data: PostInput): Promise<Post> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/posts`, {
      method: "POST",
      credentials: "include",
      body: buildFormData(data),
    });

    if (!response.ok) {
      throw new Error("Beitrag konnte nicht erstellt werden.");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePostDB = async (postId: string, data: PostInput): Promise<Post> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/posts/${postId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: buildFormData(data),
      },
    );

    if (!response.ok) {
      throw new Error("Beitrag konnte nicht aktualisiert werden.");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePostDB = async (postId: string): Promise<void> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/posts/${postId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Beitrag konnte nicht gelöscht werden.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
