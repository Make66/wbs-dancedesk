import type { CustomerItem } from "../types/customer-types";

type CustomerInput = {
  name?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  quaternary?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  tenantId?: string;
  isActive?: boolean;
};

const BASE = `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers`;

export const getCustomers = async (): Promise<CustomerItem[]> => {
  const response = await fetch(BASE, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Kunden konnten nicht geladen werden.");
  return response.json();
};

export const getCustomerById = async (id: string): Promise<CustomerItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Kunde konnte nicht geladen werden.");
  return response.json();
};

export const createCustomerDB = async (data: CustomerInput): Promise<CustomerItem> => {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Kunde konnte nicht erstellt werden.");
  return response.json();
};

export const updateCustomerDB = async (id: string, data: CustomerInput): Promise<CustomerItem> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Kunde konnte nicht aktualisiert werden.");
  return response.json();
};

export const deleteCustomerDB = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Kunde konnte nicht gelöscht werden.");
};
