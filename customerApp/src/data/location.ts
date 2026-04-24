import type { LocationItem } from "../types/location-types";

type LocationInput = {
  name?: string;
  description?: string;
  imageUrl?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  customerId?: string;
  tenantId?: string;
  isActive?: boolean;
  color?: string[];
  icon?: string;
  setSeqTarget?: string[];
};

const BASE = `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/locations`;

export const getLocations = async (): Promise<LocationItem[]> => {
  const response = await fetch(BASE, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Standorte konnten nicht geladen werden.");
  return response.json();
};

export const getLocationById = async (id: string): Promise<LocationItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Standort konnte nicht geladen werden.");
  return response.json();
};

export const createLocationDB = async (data: LocationInput): Promise<LocationItem> => {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Standort konnte nicht erstellt werden.");
  return response.json();
};

export const updateLocationDB = async (id: string, data: LocationInput): Promise<LocationItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Standort konnte nicht aktualisiert werden.");
  return response.json();
};

export const deleteLocationDB = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Standort konnte nicht gelöscht werden.");
};
