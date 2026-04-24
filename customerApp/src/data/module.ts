export type ModuleItem = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isActive: boolean;
};

export const getModules = async (): Promise<ModuleItem[]> => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/modules`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Module konnten nicht geladen werden.");
  return response.json();
};
