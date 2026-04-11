import { useEffect, useState } from "react";
import ParticipantItem from "../components/ParticipantItem";
import type { Participant } from "../types/participants-type";
import { Input } from "../components/ui/input";
import { IoIosSearch } from "react-icons/io";

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/participants`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Teilnehmer.");
        }
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, []);
  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 bg-background border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Teilnehmer</h1>
      </div>
      <div className="p-6 w-full">
        <div className="w-full flex justify-end">
          <div className="w-full relative mb-4">
            <Input className="h-15 w-[35%] pl-14" placeholder="Teilnehmer suchen..." />
            <IoIosSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-2xl" />
          </div>
        </div>
        {participants.length === 0 ? (
          <p className="text-gray-500">Keine Teilnehmer gefunden.</p>
        ) : (
          <div className="space-y-1">
            {participants.map((participant) => (
              <ParticipantItem key={participant.id} participant={participant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPage;
