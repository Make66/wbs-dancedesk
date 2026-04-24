export type UserItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  imageUrl: string;
  tenantId: string;
  isActive: boolean;
  modules?: { id: string }[];
  lastLogin?: string | null;
};
