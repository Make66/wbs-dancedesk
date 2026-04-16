import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { MdMeetingRoom } from "react-icons/md";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import AddButton from "../ui/AddButton";
import { getAllRooms } from "../../data/rooms";
import type { Room } from "../../types/room-types";

const RoomsSettingsSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllRooms().then(setRooms).catch(console.error);
  }, []);

  return (
    <div className="p-4 bg-orange-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4 ml-2">
          <MdMeetingRoom className="text-2xl" />
          <h3 className="text-2xl font-semibold">Räume</h3>
        </div>
        <div className="flex items-center gap-6">
          {isOpen && (
            <div onClick={(e) => e.stopPropagation()}>
              <AddButton onClick={() => {}} tooltipContent="Raum hinzufügen" size="medium" />
            </div>
          )}
          {isOpen ? (
            <RiArrowUpSLine className="text-2xl mr-2" />
          ) : (
            <RiArrowDownSLine className="text-2xl mr-2" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-2">
              Keine Räume vorhanden. Klicke auf „+" um einen Raum hinzuzufügen.
            </p>
          ) : (
            rooms.map((room) => (
              <Link key={room.id} to={`/room/${room.id}`} state={{ room }}>
                <div className="rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-5 py-3 gap-4 hover:bg-orange-500 transition-colors">
                  <img
                    src={room.imageUrl || "/assets/images/no-profile-picture.svg"}
                    alt={room.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium truncate">{room.name}</p>
                    {(room.street || room.city) && (
                      <p className="text-sm text-muted-foreground truncate">
                        {[room.street, room.zipCode, room.city].filter(Boolean).join(" ")}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {room.capacity} Personen
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RoomsSettingsSection;
