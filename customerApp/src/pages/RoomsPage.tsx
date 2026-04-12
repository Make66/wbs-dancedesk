import { useEffect, useState } from "react";
import AddButton from "../components/ui/AddButton";
import { getAllRooms } from "../data/rooms";
import type { Room } from "../types/room-types";
import RoomItem from "../components/room/RoomItem";

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getAllRooms().then(setRooms).catch(console.error);
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-muted-foreground pl-6 z-20">
        <h1 className="text-3xl font-semibold">Räume</h1>
        <AddButton onClick={() => {}} tooltipContent="Raum hinzufügen" />
      </div>
      <div className="p-6 grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomItem key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
