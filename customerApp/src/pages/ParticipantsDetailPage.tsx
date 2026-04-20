import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getParticipantById } from "../data/participants";
import type { Participant } from "../types/participants-type";
import ParticipantForm from "../components/participant/ParticipantForm";

const ParticipantsDetailPage = () => {
  const id = useParams<{ id: string }>().id;
  const [participant, setParticipant] = useState<Participant | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const fetchParticipant = async () => {
      try {
        const response = await getParticipantById(id);
        setParticipant(response ?? undefined);
      } catch (error) {
        console.error("Error fetching participant:", error);
        setParticipant(undefined);
      }
    };

    fetchParticipant();
  }, [id]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">
          {participant
            ? `${participant.firstName} ${participant.lastName}`
            : "Teilnehmerdetails"}
        </h1>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <ParticipantForm participant={participant} />
      </div>
    </div>
  );
};

export default ParticipantsDetailPage;
