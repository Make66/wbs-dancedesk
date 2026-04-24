import { FaEnvelope } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileNav from "./MobileNav";
import { useState } from "react";

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <nav className="bg-background h-15 flex items-center px-6 absolute top-2 right-6 z-50">
      <button
        className="md:hidden cursor-pointer"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      >
        <RxHamburgerMenu className="text-2xl" />
      </button>
      <div className="hidden md:flex items-center gap-7">
        <div className="relative">
          <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[8px] text-white font-bold bg-red-500 rounded-full">
            1
          </span>
          <FaEnvelope className="text-2xl cursor-pointer" />
        </div>
      </div>
      {isMobileNavOpen && <MobileNav onClose={() => setIsMobileNavOpen(false)} />}
    </nav>
  );
};

export default Navbar;
