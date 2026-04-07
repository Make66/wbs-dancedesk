type CalendarConfig = {
  startHour: number;
  endHour: number;
  slotHeight: number;
  minutesPerSlot: number;
};

export function generateTimeOptions(config: CalendarConfig): string[] {
  const { startHour, endHour, minutesPerSlot } = config;
  const times: string[] = [];

  const startInMinutes = startHour * 60;
  const endInMinutes = endHour * 60;

  for (
    let currentMinutes = startInMinutes;
    currentMinutes <= endInMinutes;
    currentMinutes += minutesPerSlot
  ) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;

    const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    times.push(formatted);
  }

  return times;
}
