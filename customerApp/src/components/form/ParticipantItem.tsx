import type { Participant } from "../../types/participants-type";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { calculateAge } from "../../lib/participants";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="w-full px-3 py-2 rounded-2xl bg-background/40 border border-muted-foreground flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <img
            src={participant.imageUrl}
            alt={`${participant.firstName} ${participant.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">
          {participant.firstName} {participant.lastName}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
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
