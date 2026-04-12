import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getRoomById } from "../data/rooms";
import type { Room } from "../types/room-types";
import RoomForm from "../components/room/RoomForm";

const RoomDetailPage = () => {
  const roomId = useParams<{ roomId: string }>().roomId;
  const [room, setRoom] = useState<Room | undefined>(undefined);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const response = await getRoomById(roomId);
        setRoom(response ?? undefined);
      } catch (error) {
        console.error("Error fetching room:", error);
        setRoom(undefined);
      }
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">Raumdetails</h1>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <RoomForm room={room} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
