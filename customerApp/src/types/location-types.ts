export type LocationItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  street: string;
  city: string;
  zipCode: string;
  state: string;
  customerId?: string;
  tenantId: string;
  isActive: boolean;
};
