import type { Participant } from "../../types/participants-type";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { calculateAge } from "../../lib/participants";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="h-22 w-full p-3 rounded-2xl bg-background/40 border border-muted-foreground flex items-center cursor-pointer hover:bg-blue-400">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={participant.imageUrl}
              alt={`${participant.firstName} ${participant.lastName}`}
            />
          </div>
          <div className="flex flex-col text-md">
            <span>{participant.firstName}</span>
            <span>{participant.lastName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {participant.gender === "male" ? (
            <IoMdMale className="text-2xl text-blue-500" />
          ) : participant.gender === "female" ? (
            <IoMdFemale className="text-2xl text-pink-500" />
          ) : (
            participant.gender === "other" && (
              <IoMaleFemaleOutline className="text-2xl text-green-500" />
            )
          )}
          <span className="text-md text-muted-foreground mr-4">
            {calculateAge(participant.birthDate)} Jahre
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantItem;
