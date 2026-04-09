import { useEffect, useState } from "react";
import { getRooms } from "../../data/rooms";
import { MdMeetingRoom } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Room } from "../../types/room-types";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

const RoomsPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedRoom = rooms.find((r) => r.id === watch("roomId"));

  return (
    <div className="min-h-22 py-4 w-full bg-background/40 rounded-2xl border border-muted-foreground flex items-center text-foreground cursor-pointer hover:bg-blue-400">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="w-full h-full pl-2 flex items-center gap-6 cursor-pointer">
            <MdMeetingRoom className="text-3xl ml-4" />
            {loading ? (
              <span className="text-lg">Lade Räume...</span>
            ) : selectedRoom ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span>{selectedRoom.name}</span>
                  <span className="text-sm text-muted-foreground">{selectedRoom.street}</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedRoom.zipCode} {selectedRoom.city}
                  </span>
                  <span>{selectedRoom.description}</span>
                </div>
                <div className="flex flex-col items-center justify-center mr-7">
                  <ImUsers className="text-2xl text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    max. {selectedRoom.capacity}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Raum auswählen</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
          <div className="grid gap-1 p-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className="rounded-md px-3 py-2 text-lg  hover:bg-blue-400 text-left cursor-pointer"
                onClick={() => {
                  setValue("roomId", room.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{room.name}</span>
                    <span className="text-sm text-muted-foreground">{room.street}</span>
                    <span className="text-sm text-muted-foreground">
                      {room.zipCode} {room.city}
                    </span>
                    <span>{room.description}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center mr-3">
                    <ImUsers className="text-2xl text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">max. {room.capacity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RoomsPicker;
