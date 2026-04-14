import type { Participant } from "../types/participants-type";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { calculateAge } from "../lib/participants";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="w-full px-4 py-3 rounded-2xl bg-background/40 border border-muted-foreground flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <img
            src={participant.imageUrl}
            alt={`${participant.firstName} ${participant.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">
            {participant.firstName} {participant.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{participant.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {participant.gender === "male" ? (
          <IoMdMale className="text-xl text-blue-500" />
        ) : participant.gender === "female" ? (
          <IoMdFemale className="text-xl text-pink-500" />
        ) : (
          <IoMaleFemaleOutline className="text-xl text-green-500" />
        )}
        <span>{calculateAge(participant.birthDate)} Jahre</span>
      </div>
    </div>
  );
};

export default ParticipantItem;
