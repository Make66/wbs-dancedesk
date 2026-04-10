import { differenceInYears, isValid, parseISO } from "date-fns";
import type { Participant } from "../types/participants-type";

type AgeStats = {
  totalAverage: number;
  maleAverage: number;
  femaleAverage: number;
  otherAverage: number;
  total: number;
  male: number;
  female: number;
  other: number;
};

export const getAgeFromBirthdate = (birthdate?: string) => {
  if (!birthdate) return null;

  const date = parseISO(birthdate);
  if (!isValid(date)) return null;

  return differenceInYears(new Date(), date);
};

const getAverage = (values: number[]) => {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

export const getParticipantStats = (participants: Participant[]): AgeStats => {
  const total = participants.length;
  const male = participants.filter((p) => p.gender === "male").length;
  const female = participants.filter((p) => p.gender === "female").length;
  const other = participants.filter((p) => p.gender === "other").length;
  const allAges: number[] = [];
  const maleAges: number[] = [];
  const femaleAges: number[] = [];
  const otherAges: number[] = [];

  participants.forEach((participant) => {
    const age = getAgeFromBirthdate(participant.birthDate);
    if (age === null) return;

    allAges.push(age);

    const gender = participant.gender?.toLowerCase();

    if (gender === "male" || gender === "männlich") {
      maleAges.push(age);
    } else if (gender === "female" || gender === "weiblich") {
      femaleAges.push(age);
    } else {
      otherAges.push(age);
    }
  });

  return {
    totalAverage: getAverage(allAges),
    maleAverage: getAverage(maleAges),
    femaleAverage: getAverage(femaleAges),
    otherAverage: getAverage(otherAges),
    total,
    male,
    female,
    other,
  };
};

export function calculateAge(birthdate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthdate));
}
