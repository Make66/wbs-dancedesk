import { motion } from "framer-motion";
import ParticipantItem from "./ParticipantItem";
import { containerVariants, itemVariants } from "../../lib/animations";
import type { Participant } from "../../types/participants-type";
import { ImUsers } from "react-icons/im";

type ParticipantsSectionProps = {
  participants: Participant[];
  isLoading: boolean;
};

const ParticipantsSection = ({ participants, isLoading }: ParticipantsSectionProps) => {
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
