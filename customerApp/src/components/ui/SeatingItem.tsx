import { FaUsers } from "react-icons/fa6";
import { SEATING_COLORS } from "../../lib/constants/color-constants";

type SeatingProps = {
  seatsCurrent: number;
  seatsMax: number;
};

const SeatingItem = ({ seatsCurrent, seatsMax }: SeatingProps) => {
  const pro = seatsCurrent / seatsMax;
  let color = [];
  if (pro === 1) {
    color = SEATING_COLORS.full;
  } else if (pro >= 0.8) {
    color = SEATING_COLORS.high;
  } else if (pro >= 0.5) {
    color = SEATING_COLORS.low;
  } else {
    color = SEATING_COLORS.empty;
  }
  return (
    <div
      className="flex items-center px-2 py-1 w-fit rounded-3xl border border-zinc-600"
      style={{ backgroundColor: color[0] }}
    >
      <FaUsers className={`text-[10px] mr-2 text-zinc-900`} style={{ color: color[1] }} />
      <span className="text-[10px] text-zinc-900" style={{ color: color[1] }}>
        {seatsCurrent} / {seatsMax}
      </span>
    </div>
  );
};

export default SeatingItem;
