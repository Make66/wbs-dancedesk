import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImUsers } from "react-icons/im";
import { getParticipantsByCourseId } from "../../data/participants";
import type { Participant } from "../../types/participants-type";
import ParticipantItem from "./ParticipantItem";
import { containerVariants, itemVariants } from "../../lib/animations";

type ParticipantsSectionProps = {
  courseId: string;
};

const ParticipantsSection = ({ courseId }: ParticipantsSectionProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      const response = await getParticipantsByCourseId(courseId);
      setParticipants(response);
      setIsLoading(false);
    };
    fetchParticipants();
  }, [courseId]);
  return (
    <div className="p-2 w-full rounded-2xl bg-pink-600/40 shadow-xl">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <ImUsers className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Teilnehmer</span>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p>Lade Teilnehmer...</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {participants.map((participant) => (
              <motion.div key={participant.id} variants={itemVariants}>
                <ParticipantItem key={participant.id} participant={participant} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsSection;
