import { useEffect, useState } from "react";
import RoomItem from "../components/room/RoomItem";
import AddButton from "../components/ui/AddButton";
import { getRooms } from "../data/rooms";
import { userStore } from "../stores/userStore";
import type { Room } from "../types/room-types";

const RoomsPage = () => {
  const locationId = userStore((state) => state.selectedLocationId);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        const data = await getRooms(locationId);
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, [locationId]);

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
