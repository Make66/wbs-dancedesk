import { useEffect, useState } from "react";
import { getRooms } from "../../data/rooms";
import { MdMeetingRoom } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Room } from "../../types/room-types";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

const RoomsPicker = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { watch, setValue } = useFormContext<CourseFormValues>();
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getRooms();
      setRooms(response);
      setLoading(false);
    };
    fetchRooms();
  }, []);
  console.log("RoomsPicker render", rooms);
  return (
    <div className="h-22 w-full bg-background/40 rounded-2xl border border-muted-foreground flex items-center text-foreground cursor-pointer hover:bg-blue-400">
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-full pl-2 flex items-center gap-4 cursor-pointer">
            <MdMeetingRoom className="text-3xl ml-4" />
            <span className="text-lg">
              {loading
                ? "Lade Räume..."
                : rooms.find((r) => r.id === watch("roomId"))?.name || "Raum auswählen"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
          <div className="grid gap-1 p-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className="rounded-md px-3 py-2 text-lg  hover:bg-blue-400 text-left cursor-pointer"
                onClick={() => setValue("roomId", room.id)}
              >
                {room.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RoomsPicker;
