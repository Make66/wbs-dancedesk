import type { Room } from "../../types/room-types";

type RoomItemProps = {
  room: Room;
};

const RoomItem = ({ room }: RoomItemProps) => {
  return (
    <div className="p-5 bg-foreground/40 rounded-2xl">
      <h3 className="text-2xl mb-3">{room.name}</h3>
      <p className="mb-4">{room.description}</p>
      <span className="text-lg font-bold">Kapazität: {room.capacity} Personen</span>
    </div>
  );
};

export default RoomItem;
