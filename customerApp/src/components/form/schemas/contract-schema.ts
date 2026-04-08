import { z } from "zod";
import type { PaymentType } from "../../../types/course-types";

const numberFromString = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => {
      const normalized = value.replace(",", ".");
      return !Number.isNaN(Number(normalized));
    }, `${label} muss eine Zahl sein`);

export const contractDraftSchema = z.object({
  title: z.string().trim().min(1, "Titel ist erforderlich"),
  amount: numberFromString("Betrag"),
  installments: z
    .string()
    .trim()
    .min(1, "Anzahl Raten ist erforderlich")
    .max(100, "Anzahl Raten darf nicht mehr als 100 sein")
    .refine((value) => {
      const num = Number(value);
      return Number.isInteger(num) && num > 0;
    }, "Anzahl Raten muss > 0 sein"),
  autoEnd: z.boolean(),
  isActive: z.boolean(),
  paymentTypes: z.array(z.custom<PaymentType>()).min(1, "Wähle mindestens eine Zahlungsart aus"),
});
