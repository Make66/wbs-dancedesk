import { FaCoins } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { FaPaypal } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";

export const PAYMENT = [
  { id: "cash", name: "Bar", icon: <FaCoins className="text-2xl" /> },
  { id: "bank", name: "Überweisung", icon: <AiFillBank className="text-2xl" /> },
  { id: "direct", name: "Lastschrift", icon: <FaLocationArrow className="text-2xl" /> },
  { id: "paypal", name: "PayPal", icon: <FaPaypal className="text-2xl" /> },
] as const;
