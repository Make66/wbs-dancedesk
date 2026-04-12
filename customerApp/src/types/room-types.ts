export type Room = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  capacity: number;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  locationId?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
