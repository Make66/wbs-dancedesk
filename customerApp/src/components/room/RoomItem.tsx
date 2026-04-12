import { Link } from "react-router";
import type { Room } from "../../types/room-types";

type RoomItemProps = {
  room: Room;
};

const RoomItem = ({ room }: RoomItemProps) => {
  return (
    <div className="p-4 bg-muted-foreground rounded-2xl cursor-pointer">
      <Link to={`/room/${room.id}`} state={{ room }}>
        <div className="flex">
          <img
            src={room.imageUrl || "/assets/images/no-profile-picture.svg"}
            alt={room.name}
            className="rounded-xl w-20 h-20 object-cover"
          />
          <div className="ml-6 flex-1">
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p className="text-gray-600 line-clamp-2">{room.description}</p>
          </div>
          <div className="ml-8 flex flex-col gap-2">
            <span className="px-3 py-2 bg-background text-xs font-bold text-foreground rounded-3xl">
              {room.capacity} Personen
            </span>
            {room.city && (
              <span className="px-3 py-2 bg-background text-xs font-bold text-foreground rounded-3xl">
                {room.city}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RoomItem;
