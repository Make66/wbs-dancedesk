export type Participant = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  imageUrl: string;
  active: boolean;
  street: string;
  city: string;
  zipCode: string;
};
