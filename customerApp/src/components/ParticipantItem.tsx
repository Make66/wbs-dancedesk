import type { Participant } from "../types/participants-type";

type ParticipantItemProps = {
  participant: Participant;
};

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <img
          src={participant.imageUrl}
          alt={`${participant.firstName} ${participant.lastName}`}
          className="rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {participant.firstName} {participant.lastName}
          </h2>
          <p className="text-gray-500">{participant.email}</p>
        </div>
      </div>
      <div className="">{participant.id}</div>
    </div>
  );
};

export default ParticipantItem;
