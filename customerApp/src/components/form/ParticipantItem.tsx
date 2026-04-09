import { calculateAge } from "../../lib/calendar/date-utils";
import type { Participant } from "../../types/participants-type";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="h-22 w-full p-3 rounded-2xl bg-background/40 border border-muted-foreground flex items-center cursor-pointer hover:bg-blue-400">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img
              src={participant.imageUrl}
              alt={`${participant.firstName} ${participant.lastName}`}
            />
          </div>
          <span>
            {participant.firstName} {participant.lastName}
          </span>
        </div>
        <div>
          <span className="text-md text-muted-foreground mr-4">
            {calculateAge(participant.birthDate)} Jahre
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantItem;
