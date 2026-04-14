import { useEffect, useState } from "react";
import AddButton from "../components/ui/AddButton";
import { getAllRooms } from "../data/rooms";
import type { Room } from "../types/room-types";
import RoomItem from "../components/room/RoomItem";
import { MdMeetingRoom } from "react-icons/md";

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getAllRooms().then(setRooms).catch(console.error);
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-muted-foreground bg-background pl-6 z-20">
        <h1 className="text-3xl font-semibold">Räume</h1>
        <AddButton onClick={() => {}} tooltipContent="Raum hinzufügen" />
      </div>
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-5rem)] gap-3 text-muted-foreground">
          <MdMeetingRoom className="text-6xl opacity-30" />
          <p className="text-sm">Noch keine Räume vorhanden.</p>
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-6">
          {rooms.map((room) => (
            <RoomItem key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
