import { format } from "date-fns";
import type { Participant } from "../types/participants-type";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="p-4 grid grid-cols-3 bg-red-400/20 rounded-lg shadow">
      <div className="col-span-1 flex items-center gap-5">
        <img
          src={participant.imageUrl}
          alt={`${participant.firstName} ${participant.lastName}`}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {participant.firstName} {participant.lastName}
          </h2>
          <p className="text-gray-500">{participant.email}</p>
        </div>
      </div>
      <div className="col-span-1 flex flex-col items-start gap-1">
        <div>
          <p className="text-gray-500">
            Geburtsdatum: {format(participant.birthDate, "dd.MM.yyyy")}
          </p>
        </div>
        <div>
          <p className="text-gray-500">
            Geschlecht: {participant.gender === "male" ? "Männlich" : "Weiblich"}
          </p>
        </div>
      </div>
      <div className="col-span-1 flex items-center gap-5"></div>
    </div>
  );
};

export default ParticipantItem;
